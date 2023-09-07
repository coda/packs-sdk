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
exports.getPackOptions = exports.storePackOptions = exports.getPackId = exports.storePackId = exports.storeCodaApiKey = exports.getApiKey = exports.PackOptionKey = exports.PACK_ID_FILE_NAME = exports.DEFAULT_API_ENDPOINT = void 0;
const path = __importStar(require("path"));
const helpers_1 = require("../testing/helpers");
const url_parse_1 = __importDefault(require("url-parse"));
const helpers_2 = require("../testing/helpers");
exports.DEFAULT_API_ENDPOINT = 'https://coda.io';
const API_KEY_FILE_NAME = '.coda.json';
exports.PACK_ID_FILE_NAME = '.coda-pack.json';
var PackOptionKey;
(function (PackOptionKey) {
    PackOptionKey["timerStrategy"] = "timerStrategy";
})(PackOptionKey || (exports.PackOptionKey = PackOptionKey = {}));
function isDefaultApiEndpoint(apiEndpoint) {
    return apiEndpoint === exports.DEFAULT_API_ENDPOINT;
}
function getApiKey(codaApiEndpoint) {
    var _a;
    // Traverse up from the current directory for a while to see if we can find an API key file.
    // Usually it will be in the current directory, but if the user has cd'ed deeper into their
    // project it may be higher up.
    for (let i = 0; i < 10; i++) {
        const filename = path.join(process.env.PWD || '.', `..${path.sep}`.repeat(i), API_KEY_FILE_NAME);
        const apiKeyFile = readApiKeyFile(filename);
        if (apiKeyFile) {
            if (isDefaultApiEndpoint(codaApiEndpoint)) {
                return apiKeyFile.apiKey;
            }
            else {
                const { host } = (0, url_parse_1.default)(codaApiEndpoint);
                return (_a = apiKeyFile.environmentApiKeys) === null || _a === void 0 ? void 0 : _a[host];
            }
        }
    }
    return process.env.CODA_PACKS_API_KEY;
}
exports.getApiKey = getApiKey;
function storeCodaApiKey(apiKey, projectDir = '.', codaApiEndpoint) {
    const filename = path.join(projectDir, API_KEY_FILE_NAME);
    const apiKeyFile = readApiKeyFile(filename) || { apiKey: '' };
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        apiKeyFile.apiKey = apiKey;
    }
    else {
        apiKeyFile.environmentApiKeys = apiKeyFile.environmentApiKeys || {};
        const { host } = (0, url_parse_1.default)(codaApiEndpoint);
        apiKeyFile.environmentApiKeys[host] = apiKey;
    }
    writeApiKeyFile(filename, apiKeyFile);
}
exports.storeCodaApiKey = storeCodaApiKey;
function readApiKeyFile(filename) {
    return (0, helpers_1.readJSONFile)(filename);
}
function writeApiKeyFile(filename, fileContents) {
    (0, helpers_2.writeJSONFile)(filename, fileContents, 0o600);
}
function storePackId(manifestDir, packId, codaApiEndpoint) {
    const fileContents = readPackIdFile(manifestDir) || { packId: -1 };
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        fileContents.packId = packId;
    }
    else {
        const { host } = (0, url_parse_1.default)(codaApiEndpoint);
        fileContents.environmentPackIds = fileContents.environmentPackIds || {};
        fileContents.environmentPackIds[host] = packId;
    }
    writePacksFile(manifestDir, fileContents);
}
exports.storePackId = storePackId;
function getPackId(manifestDir, codaApiEndpoint) {
    var _a;
    const fileContents = readPackIdFile(manifestDir);
    if (!fileContents) {
        return;
    }
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        return fileContents.packId;
    }
    else {
        const { host } = (0, url_parse_1.default)(codaApiEndpoint);
        return (_a = fileContents.environmentPackIds) === null || _a === void 0 ? void 0 : _a[host];
    }
}
exports.getPackId = getPackId;
// Merges new options with existing ones, if any.
function storePackOptions(manifestDir, options) {
    const fileContents = readPackIdFile(manifestDir) || { packId: -1 };
    fileContents.options = { ...fileContents.options, ...options };
    writePacksFile(manifestDir, fileContents);
}
exports.storePackOptions = storePackOptions;
function getPackOptions(manifestDir) {
    const fileContents = readPackIdFile(manifestDir);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.options;
}
exports.getPackOptions = getPackOptions;
function readPackIdFile(manifestDir) {
    const filename = path.join(manifestDir, exports.PACK_ID_FILE_NAME);
    return (0, helpers_1.readJSONFile)(filename);
}
function writePacksFile(manifestDir, fileContents) {
    const filename = path.join(manifestDir, exports.PACK_ID_FILE_NAME);
    (0, helpers_2.writeJSONFile)(filename, fileContents);
}
