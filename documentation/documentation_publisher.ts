import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import * as fs from 'fs';
import {Command} from 'commander';

const AwsRegion = 'us-west-2';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';
const EnvironmentKeyRoot = `${PacksSdkBucketRootPath}/current`;
const Environments = ['adhoc', 'head', 'staging', 'prod'];
const program = new Command();

// only works after `program` has been parsed
function isVerbose() {
  return program.opts().verbose;
}

function handleError(e: Error) {
  console.error(e);
  process.exit(1);
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

function getS3ConfigKey(hash: string): string {
  return `${PacksSdkBucketRootPath}/${hash}`;
}

function getS3EnvironmentKey(environment: string): string {
  return `${EnvironmentKeyRoot}/${environment}`;
}

async function pushConfigToEnv(env: string, version: string) {
  const body = JSON.parse(fs.readFileSync('config/runtime_config.json', {encoding: 'utf8'}));
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const key = getS3ConfigKey(version);

  try {
    console.log(`Pushing the current config ${key} to ${env}...`);
    await s3
      .putObject({Bucket: bucket, Key: key, Body: JSON.stringify(body), ContentType: 'application/json'})
      .promise();
    console.log(`The current config was pushed to ${env}:${key} successfully.`);
  } catch (err: any) {
    handleError(err);
  }
}

async function pushDocumentation(version: string) {
  await Promise.all(Environments.map(env => pushConfigToEnv(env, version)));
}

function activateDocumentationVersion(version: string, environment: string) {}

// User Command Handling
program
  .usage('ts-node tools/config_tool.ts <command> <arguments...>')
  .option('-v, --verbose', 'Print out debugging statements', false);

program
  .command('push <version>')
  .description('Push the current config under the given version.')
  .action(version => pushDocumentation(version));

program
  .command('activate <version> <environment>', {})
  .description('Activate the config under the given version in the given environment.')
  .action(activateDocumentationVersion);

program.parse();
