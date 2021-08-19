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
exports.createPack = exports.handleCreate = void 0;
const config_storage_1 = require("./config_storage");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const errors_1 = require("./errors");
const fs_1 = __importDefault(require("fs"));
const config_storage_2 = require("./config_storage");
const config_storage_3 = require("./config_storage");
const errors_2 = require("./errors");
const path = __importStar(require("path"));
const helpers_3 = require("../testing/helpers");
const config_storage_4 = require("./config_storage");
const errors_3 = require("./errors");
async function handleCreate({ manifestFile, codaApiEndpoint, name, description }) {
    await createPack(manifestFile, codaApiEndpoint, { name, description });
}
exports.handleCreate = handleCreate;
async function createPack(manifestFile, codaApiEndpoint, { name, description }) {
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = helpers_2.formatEndpoint(codaApiEndpoint);
    // TODO(alan): we probably want to redirect them to the `coda register`
    // flow if they don't have a Coda API token.
    const apiKey = config_storage_2.getApiKey(codaApiEndpoint);
    if (!apiKey) {
        helpers_3.printAndExit('Missing API key. Please run `coda register <apiKey>` to register one.');
    }
    if (!fs_1.default.existsSync(manifestFile)) {
        return helpers_3.printAndExit(`${manifestFile} is not a valid pack definition file. Check the filename and try again.`);
    }
    const existingPackId = config_storage_3.getPackId(manifestDir, codaApiEndpoint);
    if (existingPackId) {
        return helpers_3.printAndExit(`This directory has already been registered on ${codaApiEndpoint} with pack id ${existingPackId}.\n` +
            `If you're trying to create a new pack from a different manifest, you should put the new manifest in a different directory.\n` +
            `If you're intentionally trying to create a new pack, you can delete ${config_storage_1.PACK_ID_FILE_NAME} in this directory and try again.`);
    }
    const codaClient = helpers_1.createCodaClient(apiKey, formattedEndpoint);
    try {
        const response = await codaClient.createPack({}, { name, description });
        if (errors_2.isCodaError(response)) {
            return helpers_3.printAndExit(`Unable to create your pack, received error: ${errors_1.formatError(response)}`);
        }
        const packId = response.packId;
        config_storage_4.storePackId(manifestDir, packId, codaApiEndpoint);
        return helpers_3.printAndExit(`Pack created successfully! You can manage pack settings at ${codaApiEndpoint}/p/${packId}`, 0);
    }
    catch (err) {
        const errors = [`Unable to create your pack, received error: ${errors_1.formatError(err)}`, errors_3.tryParseSystemError(err)];
        return helpers_3.printAndExit(errors.join('\n'));
    }
}
exports.createPack = createPack;
