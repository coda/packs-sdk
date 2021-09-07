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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRelease = void 0;
const build_1 = require("./build");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const helpers_3 = require("./helpers");
const errors_2 = require("./errors");
const path = __importStar(require("path"));
const helpers_4 = require("../testing/helpers");
const errors_3 = require("./errors");
async function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, }) {
    const manifestDir = path.dirname(manifestFile);
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    if (!apiKey) {
        return (0, helpers_4.printAndExit)('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const packId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (!packId) {
        return (0, helpers_4.printAndExit)(`Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`);
    }
    let packVersion = explicitPackVersion;
    if (!packVersion) {
        try {
            const bundleFilename = await (0, build_1.build)(manifestFile);
            const manifest = await (0, helpers_3.importManifest)(bundleFilename);
            packVersion = manifest.version;
        }
        catch (err) {
            return (0, helpers_4.printAndExit)(`Got an error while building your pack to get the current pack version: ${(0, errors_1.formatError)(err)}`);
        }
    }
    const codaClient = (0, helpers_1.createCodaClient)(apiKey, formattedEndpoint);
    await handleResponse(codaClient.createPackRelease(packId, {}, { packVersion, releaseNotes: notes }));
    return (0, helpers_4.printAndExit)('Success!', 0);
}
exports.handleRelease = handleRelease;
async function handleResponse(p) {
    try {
        const response = await p;
        if ((0, errors_2.isCodaError)(response)) {
            return (0, helpers_4.printAndExit)(`Error while creating pack release: ${(0, errors_1.formatError)(response)}`);
        }
        return p;
    }
    catch (err) {
        const errors = [`Unexpected error while creating release: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        return (0, helpers_4.printAndExit)(errors.join('\n'));
    }
}
