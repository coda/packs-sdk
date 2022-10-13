import * as path from 'path';
import { readJSONFile } from '../testing/helpers';
import urlParse from 'url-parse';
import { writeJSONFile } from '../testing/helpers';
export const DEFAULT_API_ENDPOINT = 'https://coda.io';
const API_KEY_FILE_NAME = '.coda.json';
export const PACK_ID_FILE_NAME = '.coda-pack.json';
export var PackOptionKey;
(function (PackOptionKey) {
    PackOptionKey["timerStrategy"] = "timerStrategy";
})(PackOptionKey || (PackOptionKey = {}));
function isDefaultApiEndpoint(apiEndpoint) {
    return apiEndpoint === DEFAULT_API_ENDPOINT;
}
export function getApiKey(codaApiEndpoint) {
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
                const { host } = urlParse(codaApiEndpoint);
                return (_a = apiKeyFile.environmentApiKeys) === null || _a === void 0 ? void 0 : _a[host];
            }
        }
    }
}
export function storeCodaApiKey(apiKey, projectDir = '.', codaApiEndpoint) {
    const filename = path.join(projectDir, API_KEY_FILE_NAME);
    const apiKeyFile = readApiKeyFile(filename) || { apiKey: '' };
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        apiKeyFile.apiKey = apiKey;
    }
    else {
        apiKeyFile.environmentApiKeys = apiKeyFile.environmentApiKeys || {};
        const { host } = urlParse(codaApiEndpoint);
        apiKeyFile.environmentApiKeys[host] = apiKey;
    }
    writeApiKeyFile(filename, apiKeyFile);
}
function readApiKeyFile(filename) {
    return readJSONFile(filename);
}
function writeApiKeyFile(filename, fileContents) {
    writeJSONFile(filename, fileContents, 0o600);
}
export function storePackId(manifestDir, packId, codaApiEndpoint) {
    const fileContents = readPackIdFile(manifestDir) || { packId: -1 };
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        fileContents.packId = packId;
    }
    else {
        const { host } = urlParse(codaApiEndpoint);
        fileContents.environmentPackIds = fileContents.environmentPackIds || {};
        fileContents.environmentPackIds[host] = packId;
    }
    writePacksFile(manifestDir, fileContents);
}
export function getPackId(manifestDir, codaApiEndpoint) {
    var _a;
    const fileContents = readPackIdFile(manifestDir);
    if (!fileContents) {
        return;
    }
    if (isDefaultApiEndpoint(codaApiEndpoint)) {
        return fileContents.packId;
    }
    else {
        const { host } = urlParse(codaApiEndpoint);
        return (_a = fileContents.environmentPackIds) === null || _a === void 0 ? void 0 : _a[host];
    }
}
// Merges new options with existing ones, if any.
export function storePackOptions(manifestDir, options) {
    const fileContents = readPackIdFile(manifestDir) || { packId: -1 };
    fileContents.options = { ...fileContents.options, ...options };
    writePacksFile(manifestDir, fileContents);
}
export function getPackOptions(manifestDir) {
    const fileContents = readPackIdFile(manifestDir);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.options;
}
function readPackIdFile(manifestDir) {
    const filename = path.join(manifestDir, PACK_ID_FILE_NAME);
    return readJSONFile(filename);
}
function writePacksFile(manifestDir, fileContents) {
    const filename = path.join(manifestDir, PACK_ID_FILE_NAME);
    writeJSONFile(filename, fileContents);
}
