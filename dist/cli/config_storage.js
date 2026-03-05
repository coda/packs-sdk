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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeprecatedPackOptionKey = exports.PackOptionKey = exports.PACK_ID_FILE_NAME = exports.DEFAULT_GIT_TAG = exports.DEFAULT_TIMER_STRATEGY = exports.DEFAULT_API_ENDPOINT = void 0;
exports.getApiKey = getApiKey;
exports.storeCodaApiKey = storeCodaApiKey;
exports.storePackId = storePackId;
exports.getPackId = getPackId;
exports.storePackOptions = storePackOptions;
exports.getPackOptions = getPackOptions;
const compile_1 = require("../testing/compile");
const path = __importStar(require("path"));
const helpers_1 = require("../testing/helpers");
const url_parse_1 = __importDefault(require("url-parse"));
const helpers_2 = require("../testing/helpers");
exports.DEFAULT_API_ENDPOINT = 'https://coda.io';
exports.DEFAULT_TIMER_STRATEGY = compile_1.TimerShimStrategy.None;
exports.DEFAULT_GIT_TAG = false;
const API_KEY_FILE_NAME = '.coda.json';
exports.PACK_ID_FILE_NAME = '.coda-pack.json';
var PackOptionKey;
(function (PackOptionKey) {
    PackOptionKey["timerStrategy"] = "timerStrategy";
    PackOptionKey["gitTag"] = "gitTag";
    PackOptionKey["apiEndpoint"] = "apiEndpoint";
})(PackOptionKey || (exports.PackOptionKey = PackOptionKey = {}));
/** @deprecated Keys kept only for reading legacy config files. */
var DeprecatedPackOptionKey;
(function (DeprecatedPackOptionKey) {
    /** @deprecated Use {@link PackOptionKey.gitTag} instead. */
    DeprecatedPackOptionKey["enableGitTags"] = "enableGitTags";
})(DeprecatedPackOptionKey || (exports.DeprecatedPackOptionKey = DeprecatedPackOptionKey = {}));
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
// Merges new options with existing ones, if any.
function storePackOptions(manifestDir, options) {
    const fileContents = readPackIdFile(manifestDir) || { packId: -1 };
    fileContents.options = { ...fileContents.options, ...options };
    writePacksFile(manifestDir, fileContents);
}
function getPackOptions(manifestDir) {
    const fileContents = readPackIdFile(manifestDir);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.options;
}
function readPackIdFile(manifestDir) {
    const filename = path.join(manifestDir, exports.PACK_ID_FILE_NAME);
    return (0, helpers_1.readJSONFile)(filename);
}
function writePacksFile(manifestDir, fileContents) {
    const filename = path.join(manifestDir, exports.PACK_ID_FILE_NAME);
    (0, helpers_2.writeJSONFile)(filename, fileContents);
}
