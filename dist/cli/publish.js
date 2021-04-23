"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.handlePublish = void 0;
const logging_1 = require("../helpers/logging");
const build_1 = require("./build");
const cli_1 = require("../helpers/cli");
const crypto_1 = require("../helpers/crypto");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const errors_2 = require("./errors");
const helpers_3 = require("./helpers");
const path = __importStar(require("path"));
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const validate_1 = require("./validate");
async function handlePublish({ manifestFile, codaApiEndpoint }) {
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    const logger = new logging_1.ConsoleLogger();
    logger.info('Building Pack bundle...');
    const bundleFilename = await build_1.build(manifestFile);
    const { manifest } = await Promise.resolve().then(() => __importStar(require(bundleFilename)));
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await Promise.resolve().then(() => __importStar(require(helpers_3.isTestCommand() ? '../package.json' : '../../package.json')));
    const codaPacksSDKVersion = packageJson.version;
    codaPacksSDKVersion;
    const apiKey = config_storage_1.getApiKey(codaApiEndpoint);
    if (!apiKey) {
        helpers_4.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const client = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    const packId = config_storage_2.getPackId(manifestDir, codaApiEndpoint);
    if (!packId) {
        helpers_4.printAndExit(`Could not find a Pack id registered to Pack "${manifest.name}"`);
    }
    const packVersion = manifest.version;
    if (!packVersion) {
        helpers_4.printAndExit(`No Pack version found for your Pack "${manifest.name}"`);
    }
    try {
        logger.info('Registering new Pack version...');
        const bundle = helpers_5.readFile(bundleFilename);
        if (!bundle) {
            helpers_4.printAndExit(`Could not find bundle file at path ${bundleFilename}`);
        }
        const metadata = cli_1.compilePackMetadata(manifest);
        const upload = {
            metadata,
            bundle: bundle.toString(),
        };
        const uploadPayload = JSON.stringify(upload);
        const bundleHash = crypto_1.computeSha256(uploadPayload);
        const response = await client.registerPackVersion(packId, packVersion, {}, { bundleHash });
        if (errors_2.isCodaError(response)) {
            return helpers_4.printAndExit(`Error while registering pack version: ${errors_1.formatError(response)}`);
        }
        const { uploadUrl, headers } = response;
        logger.info('Validating Pack metadata...');
        await validate_1.validateMetadata(metadata);
        logger.info('Uploading Pack...');
        await uploadPack(uploadUrl, uploadPayload, headers);
        logger.info('Validating upload...');
        const uploadCompleteResponse = await client.packVersionUploadComplete(packId, packVersion);
        if (errors_2.isCodaError(uploadCompleteResponse)) {
            helpers_4.printAndExit(`Error while finalizing pack version: ${errors_1.formatError(response)}`);
        }
    }
    catch (err) {
        helpers_4.printAndExit(`Unepected error during pack upload: ${errors_1.formatError(err)}`);
    }
    logger.info('Done!');
}
exports.handlePublish = handlePublish;
async function uploadPack(uploadUrl, uploadPayload, headers) {
    try {
        await request_promise_native_1.default.put(uploadUrl, {
            headers,
            body: uploadPayload,
        });
    }
    catch (err) {
        helpers_4.printAndExit(`Error in uploading Pack to signed url: ${errors_1.formatError(err)}`);
    }
}
