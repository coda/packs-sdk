"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeCredentialsFile = exports.readCredentialsFile = exports.storeCodaApiKey = exports.storeCredential = exports.setupAuth = exports.setupAuthFromModule = exports.DEFAULT_OAUTH_SERVER_PORT = exports.DEFAULT_CREDENTIALS_FILE = void 0;
const types_1 = require("../types");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const ensure_3 = require("../helpers/ensure");
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const oauth_server_1 = require("./oauth_server");
const oauth_server_2 = require("./oauth_server");
const path_1 = __importDefault(require("path"));
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
exports.DEFAULT_CREDENTIALS_FILE = '.coda/credentials.json';
exports.DEFAULT_OAUTH_SERVER_PORT = 3000;
function setupAuthFromModule(module, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return setupAuth(yield helpers_1.getManifestFromModule(module), opts);
    });
}
exports.setupAuthFromModule = setupAuthFromModule;
function setupAuth(packDef, opts = {}) {
    const { name, defaultAuthentication } = packDef;
    if (!defaultAuthentication) {
        return helpers_3.printAndExit(`The pack ${name} has no declared authentication. Provide a value for defaultAuthentication in the pack definition.`);
    }
    const handler = new CredentialHandler(name, defaultAuthentication, opts);
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
    constructor(packName, authDef, { credentialsFile, oauthServerPort } = {}) {
        this._packName = packName;
        this._authDef = authDef;
        this._credentialsFile = credentialsFile || exports.DEFAULT_CREDENTIALS_FILE;
        this._oauthServerPort = oauthServerPort || exports.DEFAULT_OAUTH_SERVER_PORT;
    }
    checkForExistingCredential() {
        const existingCredentials = readCredentialsFile(this._credentialsFile);
        if (existingCredentials && existingCredentials[this._packName]) {
            const input = helpers_4.promptForInput(`Credentials already exist for ${this._packName}, press "y" to overwrite or "n" to cancel: `);
            if (input.toLocaleLowerCase() !== 'y') {
                return process.exit(1);
            }
            return existingCredentials[this._packName];
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
        storeCredential(this._credentialsFile, this._packName, credentials);
    }
}
function storeCredential(credentialsFile, packName, credentials) {
    const allCredentials = readCredentialsFile(credentialsFile) || {};
    allCredentials[packName] = credentials;
    writeCredentialsFile(credentialsFile, allCredentials);
}
exports.storeCredential = storeCredential;
function storeCodaApiKey(apiKey, credentialsFile = exports.DEFAULT_CREDENTIALS_FILE) {
    const allCredentials = readCredentialsFile(credentialsFile) || {};
    allCredentials.coda = { apiKey };
    writeCredentialsFile(credentialsFile, allCredentials);
}
exports.storeCodaApiKey = storeCodaApiKey;
function readCredentialsFile(credentialsFile = exports.DEFAULT_CREDENTIALS_FILE) {
    ensure_2.ensureNonEmptyString(credentialsFile);
    let file;
    try {
        file = fs_1.default.readFileSync(credentialsFile);
    }
    catch (err) {
        if (err.message && err.message.includes('no such file or directory')) {
            return;
        }
        throw err;
    }
    return JSON.parse(file.toString());
}
exports.readCredentialsFile = readCredentialsFile;
function writeCredentialsFile(credentialsFile, allCredentials) {
    ensure_2.ensureNonEmptyString(credentialsFile);
    const dirname = path_1.default.dirname(credentialsFile);
    if (!fs_1.default.existsSync(dirname)) {
        fs_1.default.mkdirSync(dirname);
    }
    const fileExisted = fs_1.default.existsSync(credentialsFile);
    fs_1.default.writeFileSync(credentialsFile, JSON.stringify(allCredentials, undefined, 2));
    if (!fileExisted) {
        // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
        fs_1.default.chmodSync(credentialsFile, 0o600);
    }
}
exports.writeCredentialsFile = writeCredentialsFile;
