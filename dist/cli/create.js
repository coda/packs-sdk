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
exports.createPack = exports.handleCreate = void 0;
const config_storage_1 = require("./config_storage");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const errors_1 = require("./errors");
const errors_2 = require("./errors");
const fs_1 = __importDefault(require("fs"));
const config_storage_2 = require("./config_storage");
const coda_1 = require("../helpers/external-api/coda");
const path = __importStar(require("path"));
const helpers_4 = require("../testing/helpers");
const config_storage_3 = require("./config_storage");
const errors_3 = require("./errors");
async function handleCreate({ manifestFile, codaApiEndpoint, name, description, workspace, apiToken, }) {
    await createPack(manifestFile, codaApiEndpoint, { name, description, workspace }, apiToken);
}
exports.handleCreate = handleCreate;
async function createPack(manifestFile, codaApiEndpoint, { name, description, workspace }, apiToken) {
    const manifestDir = path.dirname(manifestFile);
    const formattedEndpoint = (0, helpers_3.formatEndpoint)(codaApiEndpoint);
    apiToken = (0, helpers_1.assertApiToken)(codaApiEndpoint, apiToken);
    if (!fs_1.default.existsSync(manifestFile)) {
        return (0, helpers_4.printAndExit)(`${manifestFile} is not a valid pack definition file. Check the filename and try again.`);
    }
    const existingPackId = (0, config_storage_2.getPackId)(manifestDir, codaApiEndpoint);
    if (existingPackId) {
        return (0, helpers_4.printAndExit)(`This directory has already been registered on ${codaApiEndpoint} with pack id ${existingPackId}.\n` +
            `If you're trying to create a new pack from a different manifest, you should put the new manifest in a different directory.\n` +
            `If you're intentionally trying to create a new pack, you can delete ${config_storage_1.PACK_ID_FILE_NAME} in this directory and try again.`);
    }
    const codaClient = (0, helpers_2.createCodaClient)(apiToken, formattedEndpoint);
    try {
        const response = await codaClient.createPack({}, { name, description, workspaceId: parseWorkspace(workspace) });
        const packId = response.packId;
        (0, config_storage_3.storePackId)(manifestDir, packId, codaApiEndpoint);
        return (0, helpers_4.printAndExit)(`Pack created successfully! You can manage pack settings at ${codaApiEndpoint}/p/${packId}`, 0);
    }
    catch (err) {
        if ((0, coda_1.isResponseError)(err)) {
            return (0, helpers_4.printAndExit)(`Unable to create your pack, received error: ${await (0, errors_2.formatResponseError)(err)}`);
        }
        const errors = [`Unable to create your pack, received error: ${(0, errors_1.formatError)(err)}`, (0, errors_3.tryParseSystemError)(err)];
        return (0, helpers_4.printAndExit)(errors.join('\n'));
    }
}
exports.createPack = createPack;
function parseWorkspace(workspace) {
    if (workspace) {
        const match = /.*\/workspaces\/(ws-[A-Za-z0-9=_-]{10})/.exec(workspace);
        if (match) {
            return match[1];
        }
    }
    return workspace;
}
