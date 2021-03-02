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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublish = void 0;
const logging_1 = require("../helpers/logging");
const build_1 = require("./build");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("../testing/helpers");
const helpers_4 = require("../testing/helpers");
const create_1 = require("./create");
const request_promise_native_1 = __importDefault(require("request-promise-native"));
function handlePublish({ manifestFile, codaApiEndpoint }) {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = new logging_1.ConsoleLogger();
        const { manifest } = yield Promise.resolve().then(() => __importStar(require(manifestFile)));
        logger.info('Building pack bundle...');
        const bundleFilename = yield build_1.build(manifestFile);
        const packageJson = yield Promise.resolve().then(() => __importStar(require('../package.json')));
        const codaPacksSDKVersion = packageJson.version;
        codaPacksSDKVersion;
        const apiKey = helpers_2.getApiKey();
        if (!apiKey) {
            helpers_3.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
        }
        const client = helpers_1.createCodaClient(apiKey, codaApiEndpoint);
        const packs = create_1.readPacksFile();
        const packId = packs && packs[manifest.name];
        if (!packId) {
            helpers_3.printAndExit(`Could not find a pack id registered to pack "${manifest.name}"`);
        }
        const packVersion = manifest.version;
        if (!packVersion) {
            helpers_3.printAndExit(`No pack version found for your pack "${manifest.name}"`);
        }
        //  TODO(alan): error testing
        try {
            logger.info('Registering new pack version...');
            const { uploadUrl } = yield client.registerPackVersion(packId, packVersion);
            logger.info('Uploading pack...');
            yield uploadPackToSignedUrl(bundleFilename, manifest, uploadUrl);
            logger.info('Validating upload...');
            yield client.packVersionUploadComplete(packId, packVersion);
        }
        catch (err) {
            helpers_3.printAndExit(`Error: ${err}`);
        }
        logger.info('Done!');
    });
}
exports.handlePublish = handlePublish;
function uploadPackToSignedUrl(bundleFilename, metadata, uploadUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const bundle = helpers_4.readFile(bundleFilename);
        if (!bundle) {
            helpers_3.printAndExit(`Could not find bundle file at path ${bundleFilename}`);
        }
        try {
            yield request_promise_native_1.default.put(uploadUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
                json: {
                    metadata,
                    bundle: bundle.toString(),
                },
            });
        }
        catch (err) {
            helpers_3.printAndExit(`Error in uploading pack to signed url: ${err}`);
        }
    });
}
