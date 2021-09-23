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
exports.handleUpload = void 0;
const compile_1 = require("../testing/compile");
const metadata_1 = require("../helpers/metadata");
const crypto_1 = require("../helpers/crypto");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const fs_1 = __importDefault(require("fs"));
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const helpers_3 = require("./helpers");
const errors_2 = require("./errors");
const helpers_4 = require("./helpers");
const os_1 = __importDefault(require("os"));
const path = __importStar(require("path"));
const helpers_5 = require("../testing/helpers");
const helpers_6 = require("../testing/helpers");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const errors_3 = require("./errors");
const uuid_1 = require("uuid");
const validate_1 = require("./validate");
function cleanup(intermediateOutputDirectory, logger) {
    logger.info('\n\nCleaning up...');
    if (fs_1.default.existsSync(intermediateOutputDirectory)) {
        const tempDirectory = fs_1.default.mkdtempSync(path.join(os_1.default.tmpdir(), `coda-packs-${(0, uuid_1.v4)()}`));
        fs_1.default.renameSync(intermediateOutputDirectory, tempDirectory);
        logger.info(`Intermediate files are moved to ${tempDirectory}`);
    }
}
async function handleUpload({ intermediateOutputDirectory, manifestFile, codaApiEndpoint, notes, timerStrategy, }) {
    const logger = console;
    function printAndExit(message) {
        cleanup(intermediateOutputDirectory, logger);
        (0, helpers_5.printAndExit)(message);
    }
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    logger.info('Building Pack bundle...');
    if (fs_1.default.existsSync(intermediateOutputDirectory)) {
        logger.info(`Existing directory ${intermediateOutputDirectory} detected. Probably left over from previous build. Removing it...`);
        fs_1.default.rmdirSync(intermediateOutputDirectory, { recursive: true });
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
    const manifest = await (0, helpers_3.importManifest)(bundlePath);
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await Promise.resolve().then(() => __importStar(require((0, helpers_4.isTestCommand)() ? '../package.json' : '../../package.json')));
    const codaPacksSDKVersion = packageJson.version;
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    if (!apiKey) {
        printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const client = (0, helpers_1.createCodaClient)(apiKey, formattedEndpoint);
    const packId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (!packId) {
        printAndExit(`Could not find a Pack id registered in directory "${manifestDir}"`);
    }
    const packVersion = manifest.version;
    if (!packVersion) {
        printAndExit(`No Pack version declared for this Pack`);
    }
    try {
        const bundle = (0, helpers_6.readFile)(bundlePath);
        if (!bundle) {
            printAndExit(`Could not find bundle file at path ${bundlePath}`);
        }
        const metadata = (0, metadata_1.compilePackMetadata)(manifest);
        const sourceMap = (0, helpers_6.readFile)(bundleSourceMapPath);
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
        logger.info('Validating Pack metadata...');
        await (0, validate_1.validateMetadata)(metadata);
        logger.info('Registering new Pack version...');
        const registerResponse = await client.registerPackVersion(packId, packVersion, {}, { bundleHash });
        if ((0, errors_2.isCodaError)(registerResponse)) {
            return printAndExit(`Error while registering pack version: ${(0, errors_1.formatError)(registerResponse)}`);
        }
        const { uploadUrl, headers } = registerResponse;
        logger.info('Uploading Pack...');
        await uploadPack(uploadUrl, uploadPayload, headers);
        logger.info('Validating upload...');
        const uploadCompleteResponse = await client.packVersionUploadComplete(packId, packVersion, {}, { notes });
        if ((0, errors_2.isCodaError)(uploadCompleteResponse)) {
            printAndExit(`Error while finalizing pack version: ${(0, errors_1.formatError)(uploadCompleteResponse)}`);
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
        await request_promise_native_1.default.put(uploadUrl, {
            headers,
            body: uploadPayload,
        });
    }
    catch (err) {
        (0, helpers_5.printAndExit)(`Error in uploading Pack to signed url: ${(0, errors_1.formatError)(err)}`);
    }
}
