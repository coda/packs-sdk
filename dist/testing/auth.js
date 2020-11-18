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
exports.readCredentialsFile = exports.setupAuth = exports.setupAuthFromModule = void 0;
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
const readline_1 = __importDefault(require("readline"));
const DEFAULT_CREDENTIALS_FILE = '.coda/credentials.json';
function setupAuthFromModule(module, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        return setupAuth(yield helpers_1.getManifestFromModule(module), opts);
    });
}
exports.setupAuthFromModule = setupAuthFromModule;
function setupAuth(packDef, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.setupAuth = setupAuth;
class CredentialHandler {
    constructor(packName, authDef, { credentialsFile } = {}) {
        this._packName = packName;
        this._authDef = authDef;
        this._credentialsFile = credentialsFile || DEFAULT_CREDENTIALS_FILE;
    }
    checkForExistingCredential() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCredentials = readCredentialsFile(this._credentialsFile);
            if (existingCredentials && existingCredentials[this._packName]) {
                const input = yield this.promptForInput(`Credentials already exist for ${this._packName}, press "y" to overwrite or "n" to cancel: `);
                if (input.toLocaleLowerCase() !== 'y') {
                    return process.exit(1);
                }
                return existingCredentials[this._packName];
            }
        });
    }
    handleToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkForExistingCredential();
            const endpointUrl = yield this.maybePromptForEndpointUrl();
            const input = yield this.promptForInput(`Paste the token or API key to use for ${this._packName}:\n`);
            this.storeCredential({ endpointUrl, token: input });
            helpers_2.print('Credentials updated!');
        });
    }
    handleWebBasic() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            ensure_1.assertCondition(this._authDef.type === types_1.AuthenticationType.WebBasic);
            yield this.checkForExistingCredential();
            const endpointUrl = yield this.maybePromptForEndpointUrl();
            const usernamePlaceholder = ((_a = this._authDef.uxConfig) === null || _a === void 0 ? void 0 : _a.placeholderUsername) || 'username';
            const passwordPlaceholder = ((_b = this._authDef.uxConfig) === null || _b === void 0 ? void 0 : _b.placeholderPassword) || 'password';
            const usernameOnly = (_c = this._authDef.uxConfig) === null || _c === void 0 ? void 0 : _c.usernameOnly;
            const username = yield this.promptForInput(`Enter the ${usernamePlaceholder} for ${this._packName}:\n`);
            let password;
            if (!usernameOnly) {
                password = yield this.promptForInput(`Enter the ${passwordPlaceholder} for ${this._packName}:\n`);
            }
            this.storeCredential({ endpointUrl, username, password });
            helpers_2.print('Credentials updated!');
        });
    }
    handleQueryParam(paramName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!paramName) {
                helpers_3.printAndExit(`Please provide a paramName attribute in the defaultAuthentication section of the ${this._packName} pack definition.`);
            }
            yield this.checkForExistingCredential();
            const endpointUrl = yield this.maybePromptForEndpointUrl();
            const input = yield this.promptForInput(`Enter the token to use for the "${paramName}" url param for ${this._packName}:\n`);
            this.storeCredential({ endpointUrl, paramValue: input });
            helpers_2.print('Credentials updated!');
        });
    }
    handleMultiQueryParams(paramDefs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paramDefs.length === 0) {
                helpers_3.printAndExit(`Please define one or more entries for "params" in the defaultAuthentication section of the ${this._packName} pack definition.`);
            }
            yield this.checkForExistingCredential();
            const endpointUrl = yield this.maybePromptForEndpointUrl();
            const credentials = { endpointUrl, params: {} };
            for (const paramDef of paramDefs) {
                const paramValue = yield this.promptForInput(`Enter the token to use for the "${paramDef.name}" url param for ${this._packName}:\n`);
                credentials.params[paramDef.name] = paramValue;
            }
            this.storeCredential(credentials);
            helpers_2.print('Credentials updated!');
        });
    }
    handleOAuth2() {
        return __awaiter(this, void 0, void 0, function* () {
            ensure_1.assertCondition(this._authDef.type === types_1.AuthenticationType.OAuth2);
            const existingCredentials = (yield this.checkForExistingCredential());
            helpers_2.print(`*** Your application must have ${oauth_server_2.makeRedirectUrl()} whitelisted as an OAuth redirect url ` +
                'in order for this tool to work. ***');
            const clientIdPrompt = existingCredentials
                ? `Enter the OAuth client id for ${this._packName} (or Enter to skip and use existing):\n`
                : `Enter the OAuth client id for ${this._packName}:\n`;
            const newClientId = yield this.promptForInput(clientIdPrompt);
            const clientSecretPrompt = existingCredentials
                ? `Enter the OAuth client secret for ${this._packName} (or Enter to skip and use existing):\n`
                : `Enter the OAuth client secret for ${this._packName}:\n`;
            const newClientSecret = yield this.promptForInput(clientSecretPrompt);
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
        });
    }
    maybePromptForEndpointUrl() {
        return __awaiter(this, void 0, void 0, function* () {
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
            return this.promptForInput(`Enter the endpoint url for ${this._packName} (for example, ${placeholder}):\n`);
        });
    }
    storeCredential(credentials) {
        storeCredential(this._credentialsFile, this._packName, credentials);
    }
    promptForInput(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const rl = readlineInterface();
            return new Promise(resolve => rl.question(prompt, input => {
                rl.close();
                resolve(input);
            }));
        });
    }
}
function storeCredential(credentialsFile, packName, credentials) {
    const allCredentials = readCredentialsFile(credentialsFile) || {};
    allCredentials[packName] = credentials;
    writeCredentialsFile(credentialsFile, allCredentials);
}
function readCredentialsFile(credentialsFile = DEFAULT_CREDENTIALS_FILE) {
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
function readlineInterface() {
    return readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });
}
