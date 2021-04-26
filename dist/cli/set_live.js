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
exports.handleSetLive = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const config_storage_1 = require("./config_storage");
const config_storage_2 = require("./config_storage");
const errors_2 = require("./errors");
const path = __importStar(require("path"));
const helpers_3 = require("../testing/helpers");
async function handleSetLive({ manifestFile, packVersion, codaApiEndpoint }) {
    const manifestDir = path.dirname(manifestFile);
    const apiKey = config_storage_1.getApiKey(codaApiEndpoint);
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    if (!apiKey) {
        helpers_3.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    const packId = config_storage_2.getPackId(manifestDir, codaApiEndpoint);
    if (!packId) {
        return helpers_3.printAndExit(`Could not find a Pack id in directory ${manifestDir}. You may need to run "coda create" first if this is a brand new pack.`);
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        const response = await codaClient.setPackLiveVersion(packId, {}, { packVersion });
        if (errors_2.isCodaError(response)) {
            helpers_3.printAndExit(`Error when setting pack live version: ${errors_1.formatError(response)}`);
        }
        else {
            helpers_3.printAndExit('Success!', 0);
        }
    }
    catch (err) {
        helpers_3.printAndExit(`Unexpected error while setting pack version: ${errors_1.formatError(err)}`);
    }
}
exports.handleSetLive = handleSetLive;
