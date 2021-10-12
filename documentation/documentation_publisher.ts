import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import {promisify} from 'util';
import {print, printAndExit} from '../testing/helpers';
import {version} from '../package.json';
import yargs, {Arguments} from 'yargs';
import {exec as childExec} from 'child_process';
const exec = promisify(childExec);

const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';
const EnvironmentKeyRoot = `${PacksSdkBucketRootPath}/current`;
const Environments = ['adhoc', 'head', 'staging', 'prod'];

function handleError(e: Error) {
  console.error(e);
  printAndExit(e.message);
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

function getS3ConfigKey(): string {
  return `${PacksSdkBucketRootPath}/${version}`;
}

function getS3EnvironmentKey(environment: string): string {
  return `${EnvironmentKeyRoot}/${environment}`;
}

async function pushDocsToEnv(env: string) {
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const key = getS3ConfigKey();

  async function pushDocsDirectory(): Promise<any> {
    await exec(`aws s3 sync --profile ${env} --region ${AwsRegion} ${BaseGeneratedDocsPath} s3://${bucket}/${key}`);
  }

  try {
    // If folder already exists, warn since we are uploading all the documentation wholesale instead of "syncing."
    const obj = await s3.listObjectsV2({Bucket: bucket, MaxKeys: 1, Prefix: key}).promise();
    if (!obj.Contents?.length) {
      console.warn(`Folder already exists for ${version}.`);
    }
    print(`Pushing the current packs-sdk documentation ${key} to ${env}...`);
    await pushDocsDirectory();
    print(`The current packs-sdk documentation was pushed to ${env}:${key} successfully.`);
  } catch (err: any) {
    handleError(err);
  }
}

async function pushDocumentation() {
  await Promise.all(Environments.map(env => pushDocsToEnv(env)));
}

async function activateDocumentationVersion({env}: Arguments<{env: string}>) {
  const body = {version};
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const key = getS3EnvironmentKey(env);

  try {
    print(`Activating packs-sdk documentation at ${version} in ${env}...`);
    await s3
      .putObject({Bucket: bucket, Key: key, Body: JSON.stringify(body), ContentType: 'application/json'})
      .promise();
    print(`The packs-sdk documentation at ${version} was activated in ${env}.`);
  } catch (err: any) {
    handleError(err);
  }
}

// User Command Handling
if (require.main === module) {
  void yargs
    .usage('ts-node tools/config_tool.ts <command> <arguments...>')
    .command({
      command: 'push',
      describe: 'Push the current config under the given version for the package.json.',
      handler: pushDocumentation,
    })
    .command({
      command: 'activate',
      describe: 'Activate the config under the given version in the given environment.',
      handler: activateDocumentationVersion,
      builder: {
        environment: {
          string: true,
          desc: `Should be one of 'adhoc', 'staging', 'head', or 'prod'`,
        },
      },
    })
    .demandCommand()
    .strict()
    .help().argv;
}
