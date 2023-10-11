"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpload = void 0;
const v1_1 = require("../helpers/external-api/v1");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const compile_1 = require("../testing/compile");
const metadata_1 = require("../helpers/metadata");
const crypto_1 = require("../helpers/crypto");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const fs_extra_1 = __importDefault(require("fs-extra"));
const helpers_5 = require("./helpers");
const coda_1 = require("../helpers/external-api/coda");
const helpers_6 = require("./helpers");
const os_1 = __importDefault(require("os"));
const path = __importStar(require("path"));
const helpers_7 = require("../testing/helpers");
const helpers_8 = require("../testing/helpers");
const helpers_9 = require("../testing/helpers");
const errors_3 = require("./errors");
const uuid_1 = require("uuid");
const validate_1 = require("./validate");
function cleanup(intermediateOutputDirectory, logger) {
    logger.info('\n\nCleaning up...');
    if (fs_extra_1.default.existsSync(intermediateOutputDirectory)) {
        const tempDirectory = fs_extra_1.default.mkdtempSync(path.join(os_1.default.tmpdir(), `coda-packs-${(0, uuid_1.v4)()}`));
        fs_extra_1.default.moveSync(intermediateOutputDirectory, path.join(tempDirectory, 'build'));
        logger.info(`Intermediate files are moved to ${tempDirectory}`);
    }
}
async function handleUpload({ intermediateOutputDirectory, manifestFile, codaApiEndpoint, notes, timerStrategy, apiToken, allowOlderSdkVersion, }) {
    const logger = console;
    function printAndExit(message) {
        cleanup(intermediateOutputDirectory, logger);
        (0, helpers_8.printAndExit)(message);
    }
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(codaApiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(codaApiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, codaApiEndpoint);
    logger.info('Building Pack bundle...');
    if (fs_extra_1.default.existsSync(intermediateOutputDirectory)) {
        logger.info(`Existing directory ${intermediateOutputDirectory} detected. Probably left over from previous build. Removing it...`);
        fs_extra_1.default.rmdirSync(intermediateOutputDirectory, { recursive: true });
    }
    // we need to generate the bundle file in the working directory instead of a temp directory in
    // order to set source map right. The source map tool chain isn't smart enough to resolve a
    // relative path in the end.
    const { bundlePath, bundleSourceMapPath } = await (0, compile_1.compilePackBundle)({
        manifestPath: manifestFile,
        outputDirectory: intermediateOutputDirectory,
        intermediateOutputDirectory,
        timerStrategy,
    });
    const manifest = await (0, helpers_5.importManifest)(bundlePath);
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await Promise.resolve(`${(0, helpers_6.isTestCommand)() ? '../package.json' : '../../package.json'}`).then(s => __importStar(require(s)));
    const codaPacksSDKVersion = packageJson.version;
    const client = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    const metadata = (0, metadata_1.compilePackMetadata)(manifest);
    let packVersion = manifest.version;
    try {
        // Do local validation even if we don't have a pack version. This is faster and saves resources
        // over having the server validate, but there is a downside: errors from the server will be
        // in a different format and the code will be exercised less often so we're less likely to
        // notice if there are issues with how it's returned.
        logger.info('Validating Pack metadata...');
        const metadataWithFakeVersion = !packVersion ? { ...metadata, version: '0.0.1' } : metadata;
        await (0, validate_1.validateMetadata)(metadataWithFakeVersion, { checkDeprecationWarnings: false });
        if (!packVersion) {
            try {
                const nextPackVersionInfo = await client.getNextPackVersion(packId, {}, { proposedMetadata: JSON.stringify(metadata), sdkVersion: codaPacksSDKVersion });
                packVersion = nextPackVersionInfo.nextVersion;
                (0, helpers_7.print)(`Pack version not provided. Generated one for you: version is ${packVersion}`);
            }
            catch (err) {
                if ((0, coda_1.isResponseError)(err)) {
                    printAndExit(`Error while finalizing pack version: ${await (0, errors_2.formatResponseError)(err)}`);
                }
                throw err;
            }
        }
        metadata.version = packVersion;
        const bundle = (0, helpers_9.readFile)(bundlePath);
        if (!bundle) {
            printAndExit(`Could not find bundle file at path ${bundlePath}`);
        }
        const sourceMap = (0, helpers_9.readFile)(bundleSourceMapPath);
        if (!sourceMap) {
            printAndExit(`Could not find bundle source map at path ${bundleSourceMapPath}`);
        }
        const upload = {
            metadata,
            sdkVersion: codaPacksSDKVersion,
            bundle: bundle.toString(),
            sourceMap: sourceMap.toString(),
        };
        const uploadPayload = JSON.stringify(upload);
        const bundleHash = (0, crypto_1.computeSha256)(uploadPayload);
        logger.info('Registering new Pack version...');
        let registerResponse;
        try {
            registerResponse = await client.registerPackVersion(packId, packVersion, {}, { bundleHash });
        }
        catch (err) {
            if ((0, coda_1.isResponseError)(err)) {
                return printAndExit(`Error while registering pack version: ${await (0, errors_2.formatResponseError)(err)}`);
            }
            throw err;
        }
        const { uploadUrl, headers } = registerResponse;
        logger.info('Uploading Pack...');
        await uploadPack(uploadUrl, uploadPayload, headers);
        logger.info('Validating upload...');
        let uploadCompleteResponse;
        try {
            uploadCompleteResponse = await client.packVersionUploadComplete(packId, packVersion, {}, { notes, source: v1_1.PublicApiPackSource.Cli, allowOlderSdkVersion: Boolean(allowOlderSdkVersion) });
        }
        catch (err) {
            if ((0, coda_1.isResponseError)(err)) {
                printAndExit(`Error while finalizing pack version: ${await (0, errors_2.formatResponseError)(err)}`);
            }
            throw err;
        }
        const { deprecationWarnings } = uploadCompleteResponse;
        if (deprecationWarnings === null || deprecationWarnings === void 0 ? void 0 : deprecationWarnings.length) {
            (0, helpers_7.print)('\nYour Pack version uploaded successfully. ' +
                'However, your Pack is using deprecated properties or features that will become errors in a future SDK version.\n');
            for (const { path, message } of deprecationWarnings) {
                (0, helpers_7.print)(`Warning in field at path "${path}": ${message}`);
            }
        }
    }
    catch (err) {
        const errors = [`Unexpected error during Pack upload: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        printAndExit(errors.join(`\n`));
    }
    cleanup(intermediateOutputDirectory, logger);
    logger.info('Done!');
}
exports.handleUpload = handleUpload;
async function uploadPack(uploadUrl, uploadPayload, headers) {
    try {
        await fetch(uploadUrl, {
            method: 'PUT',
            headers,
            body: uploadPayload,
        });
    }
    catch (err) {
        (0, helpers_8.printAndExit)(`Error in uploading Pack to signed url: ${(0, errors_1.formatError)(err)}`);
    }
}
