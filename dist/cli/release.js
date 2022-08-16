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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRelease = void 0;
const build_1 = require("./build");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const helpers_3 = require("./helpers");
const coda_1 = require("../helpers/external-api/coda");
const path = __importStar(require("path"));
const helpers_4 = require("../testing/helpers");
const helpers_5 = require("../testing/helpers");
const errors_3 = require("./errors");
async function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, }) {
    const manifestDir = path.dirname(manifestFile);
    const apiKey = (0, config_storage_1.getApiKey)(codaApiEndpoint);
    const formattedEndpoint = (0, helpers_2.formatEndpoint)(codaApiEndpoint);
    if (!apiKey) {
        return (0, helpers_4.printAndExit)('Missing API token. Please run `coda register` to register one.');
    }
    const packId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (!packId) {
        return (0, helpers_4.printAndExit)(`Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`);
    }
    const codaClient = (0, helpers_1.createCodaClient)(apiKey, formattedEndpoint);
    let packVersion = explicitPackVersion;
    if (!packVersion) {
        try {
            const bundleFilename = await (0, build_1.build)(manifestFile);
            const manifest = await (0, helpers_3.importManifest)(bundleFilename);
            if ('version' in manifest) {
                packVersion = manifest.version;
            }
        }
        catch (err) {
            return (0, helpers_4.printAndExit)(`Got an error while building your pack to get the current pack version: ${(0, errors_1.formatError)(err)}`);
        }
    }
    if (!packVersion) {
        const { items: versions } = await codaClient.listPackVersions(packId, { limit: 1 });
        if (!versions.length) {
            (0, helpers_4.printAndExit)('No version was found to release for your Pack.');
        }
        const [latestPackVersionData] = versions;
        const { packVersion: latestPackVersion } = latestPackVersionData;
        const shouldReleaseLatestPackVersion = (0, helpers_5.promptForInput)(`No version specified in your manifest. Do you want to release the latest version of the Pack (${latestPackVersion})? (y/N)\n`, { yesOrNo: true });
        if (shouldReleaseLatestPackVersion !== 'yes') {
            return process.exit(1);
        }
        packVersion = latestPackVersion;
    }
    await handleResponse(codaClient.createPackRelease(packId, {}, { packVersion, releaseNotes: notes }));
    return (0, helpers_4.printAndExit)('Success!', 0);
}
exports.handleRelease = handleRelease;
async function handleResponse(p) {
    try {
        return await p;
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_4.printAndExit)(`Error while creating pack release: ${await (0, errors_2.formatResponseError)(err)}`);
        }
        const errors = [`Unexpected error while creating release: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        return (0, helpers_4.printAndExit)(errors.join('\n'));
    }
}
