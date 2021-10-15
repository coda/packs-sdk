import AWS from 'aws-sdk';
import type {Arguments} from 'yargs';
import S3 from 'aws-sdk/clients/s3';
import {exec as childExec} from 'child_process';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {promisify} from 'util';
import {version} from '../package.json';
import yargs from 'yargs';
const exec = promisify(childExec);

const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';

function handleError(e: Error) {
  printAndExit(e.message + ` ${e.stack || ''}`);
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

async function pushDocsToEnv(env: string) {
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const versionedKey = getS3DocVersionedKey();
  const latestKey = getS3LatestDocsKey();

  print(`${env}: Pushing to bucket ${bucket}.`);

  async function pushDocsDirectory(key: string): Promise<any> {
    await exec(`aws s3 sync --profile ${env} --region ${AwsRegion} ${BaseGeneratedDocsPath} s3://${bucket}/${key}`);
  }

  try {
    // If folder already exists, warn since we are uploading all the documentation wholesale instead of "syncing."
    const obj = await s3.listObjectsV2({Bucket: bucket, MaxKeys: 1, Prefix: versionedKey}).promise();
    if (!obj.Contents?.length) {
      // eslint-disable-next-line no-console
      console.warn(`Folder already exists for ${version}.`);
    }
    print(`${env}:Pushing the current packs-sdk documentation ${versionedKey}...`);
    await pushDocsDirectory(versionedKey);
    print(`${env}:Pushing the current packs-sdk documentation for ${version} to the 'latest' folder...`);
    await pushDocsDirectory(latestKey);
    print(`${env}: The current packs-sdk documentation was pushed to ${versionedKey} successfully.`);
  } catch (err: any) {
    if (err?.code == 'CredentialsError') {
      console.error(`Credentials not found or invalid! Try running 'prodaccess'.`);
    }
    handleError(err);
  }
}

async function pushDocumentation({env}: Arguments<{env: string}>): Promise<void> {
  await pushDocsToEnv(env);
}

// User Command Handling
if (require.main === module) {
  void yargs
    .usage('ts-node tools/config_tool.ts <command> <arguments...>')
    .command({
      command: 'push <env>',
      describe: 'Push the current config under the given version for the package.json.',
      handler: pushDocumentation,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
