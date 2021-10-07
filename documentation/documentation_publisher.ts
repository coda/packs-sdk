import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime';
import {Command} from 'commander';

const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';
const EnvironmentKeyRoot = `${PacksSdkBucketRootPath}/current`;
// const Environments = ['adhoc', 'head', 'staging', 'prod'];
const Environments = ['adhoc'];
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

async function pushDocsToEnv(env: string, version: string) {
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const key = getS3ConfigKey(version);

  async function pushDocsDirectory(rootPath: string): Promise<any> {
    const fullFilePath = path.join(BaseGeneratedDocsPath, rootPath);
    const fileStats = fs.lstatSync(fullFilePath);
    if (fileStats.isFile()) {
      const contentType = mime.getType(fullFilePath) || undefined;
      const fileData = fs.createReadStream(fullFilePath);
      if (isVerbose()) {
        console.log(`Uploading ${rootPath} to S3 as a file`);
      }
      return s3
        .putObject({
          Bucket: bucket,
          Key: `${key}/${rootPath}`,
          Body: fileData,
          ContentType: contentType,
        })
        .promise();
    }

    if (fileStats.isDirectory()) {
      const files = fs.readdirSync(fullFilePath);
      return Promise.all(
        files.map(fileName => {
          // get the full path of the file
          const nestedFilePath = path.join(rootPath, fileName);
          return pushDocsDirectory(nestedFilePath);
        }),
      );
    }
  }

  try {
    console.log(`Pushing the current packs-sdk documentation ${key} to ${env}...`);
    await pushDocsDirectory('');
    console.log(`The current packs-sdk documentation was pushed to ${env}:${key} successfully.`);
  } catch (err: any) {
    handleError(err);
  }
}

async function pushDocumentation(version: string) {
  await Promise.all(Environments.map(env => pushDocsToEnv(env, version)));
}

async function activateDocumentationVersion(version: string, env: string) {
  const body = {version};
  const s3 = getS3Service(env);
  const bucket = getS3Bucket(env);
  const key = getS3EnvironmentKey(env);

  try {
    console.log(`Activating packs-sdk documentation at ${version} in ${env}...`);
    await s3
      .putObject({Bucket: bucket, Key: key, Body: JSON.stringify(body), ContentType: 'application/json'})
      .promise();
    console.log(`The packs-sdk documentation at ${version} was activated in ${env}.`);
  } catch (err: any) {
    handleError(err);
  }
}

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
