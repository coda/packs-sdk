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
exports.readCredentialsFile = exports.storeCodaApiKey = exports.getApiKey = exports.storeCredential = exports.setupAuth = exports.setupAuthFromModule = exports.DEFAULT_OAUTH_SERVER_PORT = void 0;
const types_1 = require("../types");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const ensure_3 = require("../helpers/ensure");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const oauth_server_1 = require("./oauth_server");
const oauth_server_2 = require("./oauth_server");
const path = __importStar(require("path"));
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const helpers_5 = require("./helpers");
const url_parse_1 = __importDefault(require("url-parse"));
const helpers_6 = require("./helpers");
const CREDENTIALS_FILE_NAME = '.coda-credentials.json';
const API_KEY_FILE_NAME = '.coda.json';
exports.DEFAULT_OAUTH_SERVER_PORT = 3000;
async function setupAuthFromModule(manifestPath, module, opts = {}) {
    const manifestDir = path.dirname(manifestPath);
    return setupAuth(manifestDir, helpers_1.getManifestFromModule(module), opts);
}
exports.setupAuthFromModule = setupAuthFromModule;
function setupAuth(manifestDir, packDef, opts = {}) {
    const { name, defaultAuthentication } = packDef;
    if (!defaultAuthentication) {
        return helpers_3.printAndExit(`The pack ${name} has no declared authentication. Provide a value for defaultAuthentication in the pack definition.`);
    }
    const handler = new CredentialHandler(manifestDir, name, defaultAuthentication, opts);
    switch (defaultAuthentication.type) {
        case types_1.AuthenticationType.None:
            return helpers_3.printAndExit(`The pack ${name} declares AuthenticationType.None and so does not require authentication. ` +
                `Please declare another AuthenticationType to use authentication with this pack.`);
        case types_1.AuthenticationType.CodaApiHeaderBearerToken:
        case types_1.AuthenticationType.CustomHeaderToken:
        case types_1.AuthenticationType.HeaderBearerToken:
            return handler.handleToken();
        case types_1.AuthenticationType.MultiQueryParamToken:
            return handler.handleMultiQueryParams(defaultAuthentication.params);
        case types_1.AuthenticationType.QueryParamToken:
            return handler.handleQueryParam(defaultAuthentication.paramName);
        case types_1.AuthenticationType.WebBasic:
            return handler.handleWebBasic();
        case types_1.AuthenticationType.AWSSignature4:
            throw new Error('Not yet implemented');
        case types_1.AuthenticationType.OAuth2:
            return handler.handleOAuth2();
        default:
            return ensure_3.ensureUnreachable(defaultAuthentication);
    }
}
exports.setupAuth = setupAuth;
class CredentialHandler {
    constructor(manifestDir, packName, authDef, { oauthServerPort } = {}) {
        this._packName = packName;
        this._authDef = authDef;
        this._manifestDir = manifestDir;
        this._oauthServerPort = oauthServerPort || exports.DEFAULT_OAUTH_SERVER_PORT;
    }
    checkForExistingCredential() {
        const existingCredentials = readCredentialsFile(this._manifestDir);
        if (existingCredentials) {
            const input = helpers_4.promptForInput(`Credentials already exist for ${this._packName}, press "y" to overwrite or "n" to cancel: `);
            if (input.toLocaleLowerCase() !== 'y') {
                return process.exit(1);
            }
            return existingCredentials;
        }
    }
    handleToken() {
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = helpers_4.promptForInput(`Paste the token or API key to use for ${this._packName}:\n`, { mask: true });
        this.storeCredential({ endpointUrl, token: input });
        helpers_2.print('Credentials updated!');
    }
    handleWebBasic() {
        var _a, _b, _c;
        ensure_1.assertCondition(this._authDef.type === types_1.AuthenticationType.WebBasic);
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const usernamePlaceholder = ((_a = this._authDef.uxConfig) === null || _a === void 0 ? void 0 : _a.placeholderUsername) || 'username';
        const passwordPlaceholder = ((_b = this._authDef.uxConfig) === null || _b === void 0 ? void 0 : _b.placeholderPassword) || 'password';
        const usernameOnly = (_c = this._authDef.uxConfig) === null || _c === void 0 ? void 0 : _c.usernameOnly;
        const username = helpers_4.promptForInput(`Enter the ${usernamePlaceholder} for ${this._packName}:\n`);
        let password;
        if (!usernameOnly) {
            password = helpers_4.promptForInput(`Enter the ${passwordPlaceholder} for ${this._packName}:\n`, { mask: true });
        }
        this.storeCredential({ endpointUrl, username, password });
        helpers_2.print('Credentials updated!');
    }
    handleQueryParam(paramName) {
        if (!paramName) {
            helpers_3.printAndExit(`Please provide a paramName attribute in the defaultAuthentication section of the ${this._packName} pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = helpers_4.promptForInput(`Enter the token to use for the "${paramName}" url param for ${this._packName}:\n`, {
            mask: true,
        });
        this.storeCredential({ endpointUrl, paramValue: input });
        helpers_2.print('Credentials updated!');
    }
    handleMultiQueryParams(paramDefs) {
        if (paramDefs.length === 0) {
            helpers_3.printAndExit(`Please define one or more entries for "params" in the defaultAuthentication section of the ${this._packName} pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const credentials = { endpointUrl, params: {} };
        for (const paramDef of paramDefs) {
            const paramValue = helpers_4.promptForInput(`Enter the token to use for the "${paramDef.name}" url param for ${this._packName}:\n`, { mask: true });
            credentials.params[paramDef.name] = paramValue;
        }
        this.storeCredential(credentials);
        helpers_2.print('Credentials updated!');
    }
    handleOAuth2() {
        ensure_1.assertCondition(this._authDef.type === types_1.AuthenticationType.OAuth2);
        const existingCredentials = this.checkForExistingCredential();
        helpers_2.print(`*** Your application must have ${oauth_server_2.makeRedirectUrl(this._oauthServerPort)} whitelisted as an OAuth redirect url ` +
            'in order for this tool to work. ***');
        const clientIdPrompt = existingCredentials
            ? `Enter the OAuth client id for ${this._packName} (or Enter to skip and use existing):\n`
            : `Enter the OAuth client id for ${this._packName}:\n`;
        const newClientId = helpers_4.promptForInput(clientIdPrompt);
        const clientSecretPrompt = existingCredentials
            ? `Enter the OAuth client secret for ${this._packName} (or Enter to skip and use existing):\n`
            : `Enter the OAuth client secret for ${this._packName}:\n`;
        const newClientSecret = helpers_4.promptForInput(clientSecretPrompt, { mask: true });
        const clientId = ensure_2.ensureNonEmptyString(newClientId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientId));
        const clientSecret = ensure_2.ensureNonEmptyString(newClientSecret || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientSecret));
        const credentials = {
            clientId,
            clientSecret,
            accessToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessToken,
            refreshToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.refreshToken,
        };
        this.storeCredential(credentials);
        helpers_2.print('Credential secrets updated! Launching OAuth handshake in browser...\n');
        oauth_server_1.launchOAuthServerFlow({
            clientId,
            clientSecret,
            authDef: this._authDef,
            port: this._oauthServerPort,
            afterTokenExchange: ({ accessToken, refreshToken }) => {
                const credentials = {
                    clientId,
                    clientSecret,
                    accessToken,
                    refreshToken,
                };
                this.storeCredential(credentials);
                helpers_2.print('Access token saved! Shutting down OAuth server and exiting...');
            },
        });
    }
    maybePromptForEndpointUrl() {
        if (this._authDef.type === types_1.AuthenticationType.None) {
            return;
        }
        const { requiresEndpointUrl, endpointDomain } = this._authDef;
        if (!requiresEndpointUrl) {
            return;
        }
        const placeholder = endpointDomain
            ? `https://my-site.${endpointDomain}`
            : `https://${this._packName.toLowerCase()}.example.com`;
        return helpers_4.promptForInput(`Enter the endpoint url for ${this._packName} (for example, ${placeholder}):\n`);
    }
    storeCredential(credentials) {
        storeCredential(this._manifestDir, credentials);
    }
}
function storeCredential(manifestDir, credentials) {
    const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
    writeCredentialsFile(filename, credentials);
}
exports.storeCredential = storeCredential;
function getApiKey(codaApiEndpoint) {
    var _a;
    const baseFilename = path.join(process.env.PWD || '.', API_KEY_FILE_NAME);
    // Traverse up from the current directory for a while to see if we can find an API key file.
    // Usually it will be in the current directory, but if the user has cd'ed deeper into their
    // project it may be higher up.
    for (let i = 0; i < 10; i++) {
        const filename = path.join(`..${path.sep}`.repeat(i), baseFilename);
        const apiKeyFile = readApiKeyFile(filename);
        if (apiKeyFile) {
            if (codaApiEndpoint) {
                return (_a = apiKeyFile.environmentApiKeys) === null || _a === void 0 ? void 0 : _a[codaApiEndpoint];
            }
            return apiKeyFile.apiKey;
        }
    }
}
exports.getApiKey = getApiKey;
function storeCodaApiKey(apiKey, projectDir = '.', codaApiEndpoint) {
    const filename = path.join(projectDir, API_KEY_FILE_NAME);
    const apiKeyFile = readApiKeyFile(filename) || { apiKey: '' };
    if (codaApiEndpoint) {
        apiKeyFile.environmentApiKeys = apiKeyFile.environmentApiKeys || {};
        const { host } = url_parse_1.default(codaApiEndpoint);
        apiKeyFile.environmentApiKeys[host] = apiKey;
    }
    else {
        apiKeyFile.apiKey = apiKey;
    }
    writeApiKeyFile(filename, apiKeyFile);
}
exports.storeCodaApiKey = storeCodaApiKey;
function readCredentialsFile(manifestPath) {
    const filename = path.join(manifestPath, CREDENTIALS_FILE_NAME);
    const fileContents = helpers_5.readJSONFile(filename);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.credentials;
}
exports.readCredentialsFile = readCredentialsFile;
function writeCredentialsFile(credentialsFile, credentials) {
    const fileExisted = fs_1.default.existsSync(credentialsFile);
    const fileContents = { credentials };
    helpers_6.writeJSONFile(credentialsFile, fileContents);
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(credentialsFile, 0o600);
    }
}
function readApiKeyFile(filename) {
    return helpers_5.readJSONFile(filename);
}
function writeApiKeyFile(filename, fileContents) {
    const fileExisted = fs_1.default.existsSync(filename);
    helpers_6.writeJSONFile(filename, fileContents);
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(filename, 0o600);
    }
}
