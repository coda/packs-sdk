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
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const build_1 = require("./build");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const helpers_5 = require("./helpers");
const coda_1 = require("../helpers/external-api/coda");
const path = __importStar(require("path"));
const helpers_6 = require("../testing/helpers");
const helpers_7 = require("../testing/helpers");
const errors_3 = require("./errors");
async function handleRelease({ manifestFile, packVersion: explicitPackVersion, codaApiEndpoint, notes, apiToken, }) {
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = (0, helpers_4.formatEndpoint)(codaApiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(codaApiEndpoint, apiToken);
    const packId = (0, helpers_2.assertPackId)(manifestDir, codaApiEndpoint);
    const codaClient = (0, helpers_3.createCodaClient)(apiToken, formattedEndpoint);
    let packVersion = explicitPackVersion;
    if (!packVersion) {
        try {
            const bundleFilename = await (0, build_1.build)(manifestFile);
            const manifest = await (0, helpers_5.importManifest)(bundleFilename);
            if ('version' in manifest) {
                packVersion = manifest.version;
            }
        }
        catch (err) {
            return (0, helpers_6.printAndExit)(`Got an error while building your pack to get the current pack version: ${(0, errors_1.formatError)(err)}`);
        }
    }
    if (!packVersion) {
        const { items: versions } = await codaClient.listPackVersions(packId, { limit: 1 });
        if (!versions.length) {
            (0, helpers_6.printAndExit)('No version was found to release for your Pack.');
        }
        const [latestPackVersionData] = versions;
        const { packVersion: latestPackVersion } = latestPackVersionData;
        const shouldReleaseLatestPackVersion = (0, helpers_7.promptForInput)(`No version specified in your manifest. Do you want to release the latest version of the Pack (${latestPackVersion})? (y/N)\n`, { yesOrNo: true });
        if (shouldReleaseLatestPackVersion !== 'yes') {
            return process.exit(1);
        }
        packVersion = latestPackVersion;
    }
    await handleResponse(codaClient.createPackRelease(packId, {}, { packVersion, releaseNotes: notes }));
    return (0, helpers_6.printAndExit)('Success!', 0);
}
exports.handleRelease = handleRelease;
async function handleResponse(p) {
    try {
        return await p;
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_6.printAndExit)(`Error while creating pack release: ${await (0, errors_2.formatResponseError)(err)}`);
        }
        const errors = [`Unexpected error while creating release: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        return (0, helpers_6.printAndExit)(errors.join('\n'));
    }
}
