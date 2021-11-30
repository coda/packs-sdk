"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
const helpers_3 = require("../testing/helpers");
const util_1 = require("util");
const yargs_1 = __importDefault(require("yargs"));
const exec = (0, util_1.promisify)(child_process_1.exec);
const AwsRegion = 'us-west-2';
const BaseGeneratedDocsPath = 'site';
const DocumentationBucket = 'developer-documentation';
const PacksSdkBucketRootPath = 'packs';
function handleError(e) {
    (0, helpers_2.printAndExit)(`${e.message} ${e.stack || ''}`);
}
function getS3Service(env) {
    const config = {
        signatureVersion: 'v4',
        region: AwsRegion,
        credentials: new aws_sdk_1.default.SharedIniFileCredentials({ profile: env }),
        computeChecksums: true,
    };
    return new s3_1.default(config);
}
function getS3Bucket(env) {
    return `coda-us-west-2-${env}-${DocumentationBucket}`;
}
function getSDKVersion() {
    const packageFile = fs_1.default.readFileSync(path_1.default.join(__dirname, '../package.json'));
    return JSON.parse(packageFile.toString()).version;
}
function getS3DocVersionedKey() {
    return `${PacksSdkBucketRootPath}/${getSDKVersion()}`;
}
function getS3LatestDocsKey() {
    return `${PacksSdkBucketRootPath}/latest`;
}
async function pushDocumentation({ env, forceUpload }) {
    var _a;
    const s3 = getS3Service(env);
    const bucket = getS3Bucket(env);
    const versionedKey = getS3DocVersionedKey();
    const latestKey = getS3LatestDocsKey();
    const baseIndexFileKey = `${PacksSdkBucketRootPath}/index.html`;
    (0, helpers_1.print)(`${env}: Pushing to bucket ${bucket}.`);
    async function pushDocsDirectory(key) {
        await exec(`aws s3 sync --profile ${env} --region ${AwsRegion} ${BaseGeneratedDocsPath} s3://${bucket}/${key} --delete`);
    }
    try {
        (0, helpers_1.print)(`${env}: Pushing the base index.html redirect file to the base`);
        // This assumes that we are running this file from the root path.
        const redirectIndexHtmlStream = fs_1.default.createReadStream('./documentation/redirect-index.html');
        await s3
            .upload({ Bucket: bucket, Key: baseIndexFileKey, Body: redirectIndexHtmlStream, ContentType: 'text/html' })
            .promise();
        redirectIndexHtmlStream.destroy();
        if (!forceUpload) {
            const obj = await s3.listObjectsV2({ Bucket: bucket, MaxKeys: 1, Prefix: versionedKey }).promise();
            if ((_a = obj.Contents) === null || _a === void 0 ? void 0 : _a.length) {
                (0, helpers_2.printAndExit)(`${env}: Trying to upload ${getSDKVersion()} but folder already exists in S3.`);
            }
        }
        (0, helpers_1.print)(`${env}: Pushing the current packs-sdk documentation ${versionedKey}...`);
        await pushDocsDirectory(versionedKey);
        (0, helpers_1.print)(`${env}: Pushing the current packs-sdk documentation for ${getSDKVersion()} to the 'latest' folder...`);
        await pushDocsDirectory(latestKey);
        (0, helpers_1.print)(`${env}: The current packs-sdk documentation was pushed to ${versionedKey} successfully.`);
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'CredentialsError' || (err === null || err === void 0 ? void 0 : err.code) === 'ExpiredToken') {
            (0, helpers_3.printError)(`Credentials not found, invalid, or expired! Try running 'prodaccess'.`);
        }
        handleError(err);
    }
}
// User Command Handling
if (require.main === module) {
    void yargs_1.default
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
