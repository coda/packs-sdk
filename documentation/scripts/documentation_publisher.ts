import type {ArgumentsCamelCase} from 'yargs';
import {CloudFrontClient} from '@aws-sdk/client-cloudfront';
import {CreateInvalidationCommand} from '@aws-sdk/client-cloudfront';
import {ListDistributionsCommand} from '@aws-sdk/client-cloudfront';
import {ListObjectsV2Command} from '@aws-sdk/client-s3';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {S3Client} from '@aws-sdk/client-s3';
import {exec as childExec} from 'child_process';
import {fromIni} from '@aws-sdk/credential-provider-ini';
import fs from 'fs';
import path from 'path';
import {print} from '../../testing/helpers';
import {printAndExit} from '../../testing/helpers';
import {printError} from '../../testing/helpers';
import {promisify} from 'util';
import yargs from 'yargs';

const exec = promisify(childExec);

const DocumentationRoot = '/packs/build';
const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
// NOTE(spencer): we are getting rid of the redundant "packs"
// bucket, so there is no root path outside of the bucket above.
// const PacksSdkBucketRootPath = 'packs';

function handleError(e: Error) {
  printAndExit(`${e.message} ${e.stack || ''}`);
}

function getS3Service(env: string): S3Client {
  return new S3Client({
    region: AwsRegion,
    credentials: fromIni({profile: env}),
    computeChecksums: true,
  });
}

function getCloudfrontService(env: string): CloudFrontClient {
  return new CloudFrontClient({
    region: AwsRegion,
    credentials: fromIni({profile: env}),
  });
}

function getS3Bucket(env: string): string {
  return `coda-us-west-2-${env}-${DocumentationBucket}`;
}

function getOriginDomainName(env: string): string {
  const domainName = env !== 'prod' ? `${env}.coda.io` : 'coda.io';
  return `origin.${domainName}`;
}

function getSDKVersion(): string {
  const packageFile = fs.readFileSync(path.join(__dirname, '../../package.json'));
  return JSON.parse(packageFile.toString()).version;
}

function getS3DocVersionedKey(): string {
  return `${getSDKVersion()}`;
}

function getS3LatestDocsKey(): string {
  return `latest`;
}

interface PushDocumentationArgs {
  env: string;
  forceUpload: boolean;
}

async function pushDocumentation({env, forceUpload}: ArgumentsCamelCase<PushDocumentationArgs>): Promise<void> {
  const s3 = getS3Service(env);
  const cloudfront = getCloudfrontService(env);
  const bucket = getS3Bucket(env);
  const versionedKey = getS3DocVersionedKey();
  const latestKey = getS3LatestDocsKey();
  const baseIndexFileKey = `index.html`;
  const now = Date.now().toString();

  print(`${env}: Pushing to bucket ${bucket}.`);

  async function pushDocsDirectory(key: string): Promise<any> {
    await exec(
      `aws s3 sync --profile ${env} --region ${AwsRegion} ${BaseGeneratedDocsPath} s3://${bucket}/${key} --delete`,
    );
  }

  try {
    print(`${env}: Pushing the base index.html redirect file to the base`);
    // This assumes that we are running this file from the root path.
    const redirectIndexHtmlStream = fs.createReadStream('./documentation/redirect-index.html');
    const uploadCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: baseIndexFileKey,
      Body: redirectIndexHtmlStream,
      ContentType: 'text/html',
      ChecksumAlgorithm: 'CRC32',
    });
    await s3.send(uploadCommand);
    redirectIndexHtmlStream.destroy();

    if (!forceUpload) {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        MaxKeys: 1,
        Prefix: versionedKey,
      });
      const obj = await s3.send(listCommand);
      if (obj.Contents?.length) {
        printAndExit(`${env}: Trying to upload ${getSDKVersion()} but folder already exists in S3.`);
      }
    }
    print(`${env}: Pushing the current packs-sdk documentation ${versionedKey}...`);
    await pushDocsDirectory(versionedKey);
    print(`${env}: Pushing the current packs-sdk documentation for ${getSDKVersion()} to the 'latest' folder...`);
    await pushDocsDirectory(latestKey);
    print(`${env}: The current packs-sdk documentation was pushed to ${versionedKey} successfully.`);

    print(`${env}: Finding Cloudfront distribution for documentation...`);
    const listDistributionsCommand = new ListDistributionsCommand({});
    const distributions = await cloudfront.send(listDistributionsCommand);
    const docsDistribution = distributions.DistributionList?.Items?.find(distr =>
      distr.Origins?.Items?.some(origin => origin.DomainName === getOriginDomainName(env)),
    );
    if (!docsDistribution) {
      return printAndExit(`${env}: Could not find Cloudfront distribution for documentation.`);
    }
    print(`${env}: Creating Cloudfront invalidation for 'latest' folder...`);
    const docsLatestPath = `${DocumentationRoot}/latest*`;
    const createInvalidationCommand = new CreateInvalidationCommand({
      DistributionId: docsDistribution.Id,
      InvalidationBatch: {
        CallerReference: now,
        Paths: {
          Quantity: 1,
          Items: [docsLatestPath],
        },
      },
    });
    await cloudfront.send(createInvalidationCommand);
    print(`${env}: Successfully invalidated the '${docsLatestPath}' folder on ${getOriginDomainName(env)}...`);
  } catch (err: any) {
    if (err?.name === 'CredentialsError' || err?.name === 'ExpiredToken') {
      printError(`Credentials not found, invalid, or expired! Try running 'prodaccess'.`);
    }
    handleError(err);
  }
}

// User Command Handling
if (require.main === module) {
  void yargs
    .usage('ts-node tools/config_tool.ts <command> <arguments...>')
    .command({
      command: 'push <env>',
      describe: 'Push the current config under the given version for the package.json.',
      builder: {
        forceUpload: {
          boolean: true,
          describe: 'Force upload of new files even if directory already exists in S3',
        },
      },
      handler: pushDocumentation as any,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
