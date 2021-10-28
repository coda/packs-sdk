import AWS from 'aws-sdk';
import type {Arguments} from 'yargs';
import S3 from 'aws-sdk/clients/s3';
import {exec as childExec} from 'child_process';
import fs from 'fs';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {printError} from '../testing/helpers';
import {promisify} from 'util';
import {version} from '../package.json';
import yargs from 'yargs';

const exec = promisify(childExec);

const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';

function handleError(e: Error) {
  printAndExit(`${e.message} ${e.stack || ''}`);
}

function getS3Service(env: string): S3 {
  const config: S3.ClientConfiguration = {
    signatureVersion: 'v4',
    region: AwsRegion,
    credentials: new AWS.SharedIniFileCredentials({profile: env}),
    computeChecksums: true,
  };
  return new S3(config);
}

function getS3Bucket(env: string): string {
  return `coda-us-west-2-${env}-${DocumentationBucket}`;
}

function getS3DocVersionedKey(): string {
  return `${PacksSdkBucketRootPath}/${version}`;
}

function getS3LatestDocsKey(): string {
  return `${PacksSdkBucketRootPath}/latest`;
}

interface PushDocumentationArgs {
  env: string;
  forceUpload: boolean;
}

async function pushDocumentation({env, forceUpload}: Arguments<PushDocumentationArgs>): Promise<void> {
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const versionedKey = getS3DocVersionedKey();
  const latestKey = getS3LatestDocsKey();
  const baseIndexFileKey = `${PacksSdkBucketRootPath}/index.html`;

  print(`${env}: Pushing to bucket ${bucket}.`);

  async function pushDocsDirectory(key: string): Promise<any> {
    await exec(
      `aws s3 sync --profile ${env} --region ${AwsRegion} ${BaseGeneratedDocsPath} s3://${bucket}/${key} --delete`,
    );
  }

  try {
    print(`${env}: Pushing the base index.html redirect file to the base`);
    // This assumes that we are running this file from the root path.
    const redirectIndexHtmlStream = fs.createReadStream('./documentation/scripts/redirect-index.html');
    await s3
      .upload({Bucket: bucket, Key: baseIndexFileKey, Body: redirectIndexHtmlStream, ContentType: 'text/html'})
      .promise();
    redirectIndexHtmlStream.destroy();

    if (!forceUpload) {
      const obj = await s3.listObjectsV2({Bucket: bucket, MaxKeys: 1, Prefix: versionedKey}).promise();
      if (obj.Contents?.length) {
        printAndExit(`${env}: Trying to upload ${version} but folder already exists in S3.`);
      }
    }
    print(`${env}: Pushing the current packs-sdk documentation ${versionedKey}...`);
    await pushDocsDirectory(versionedKey);
    print(`${env}: Pushing the current packs-sdk documentation for ${version} to the 'latest' folder...`);
    await pushDocsDirectory(latestKey);
    print(`${env}: The current packs-sdk documentation was pushed to ${versionedKey} successfully.`);
  } catch (err: any) {
    if (err?.code === 'CredentialsError' || err?.code === 'ExpiredToken') {
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
      handler: pushDocumentation,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
