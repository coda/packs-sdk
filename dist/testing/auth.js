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
exports.readCredentialsFile = exports.storeCredential = exports.setupAuth = exports.setupAuthFromModule = exports.DEFAULT_OAUTH_SERVER_PORT = void 0;
const types_1 = require("../types");
const ensure_1 = require("../helpers/ensure");
const ensure_2 = require("../helpers/ensure");
const ensure_3 = require("../helpers/ensure");
const ensure_4 = require("../helpers/ensure");
const helpers_1 = require("../cli/helpers");
const oauth_server_1 = require("./oauth_server");
const oauth_server_2 = require("./oauth_server");
const path = __importStar(require("path"));
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const helpers_5 = require("./helpers");
const helpers_6 = require("./helpers");
const CREDENTIALS_FILE_NAME = '.coda-credentials.json';
exports.DEFAULT_OAUTH_SERVER_PORT = 3000;
async function setupAuthFromModule(manifestPath, manifest, opts = {}) {
    const manifestDir = path.dirname(manifestPath);
    return setupAuth(manifestDir, manifest, opts);
}
exports.setupAuthFromModule = setupAuthFromModule;
function setupAuth(manifestDir, packDef, opts = {}) {
    const auth = helpers_1.getPackAuth(packDef);
    if (!auth) {
        return helpers_3.printAndExit(`This Pack has no declared authentication. ` +
            `Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.`);
    }
    const handler = new CredentialHandler(manifestDir, auth, opts);
    switch (auth.type) {
        case types_1.AuthenticationType.None:
            return helpers_3.printAndExit(`This Pack declares AuthenticationType.None and so does not require authentication. ` +
                `Please declare another AuthenticationType to use authentication with this Pack.`);
        case types_1.AuthenticationType.CodaApiHeaderBearerToken:
            ensure_2.ensureExists(packDef.defaultAuthentication, 'CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.');
        case types_1.AuthenticationType.CustomHeaderToken:
        case types_1.AuthenticationType.HeaderBearerToken:
            return handler.handleToken();
        case types_1.AuthenticationType.MultiQueryParamToken:
            return handler.handleMultiQueryParams(auth.params);
        case types_1.AuthenticationType.QueryParamToken:
            return handler.handleQueryParam(auth.paramName);
        case types_1.AuthenticationType.WebBasic:
            return handler.handleWebBasic();
        case types_1.AuthenticationType.OAuth2:
            ensure_2.ensureExists(packDef.defaultAuthentication, 'OAuth2 only works with defaultAuthentication, not system auth.');
            return handler.handleOAuth2();
        case types_1.AuthenticationType.AWSSignature4:
        case types_1.AuthenticationType.Various:
            return helpers_3.printAndExit('This authentication type is not yet implemented');
        default:
            return ensure_4.ensureUnreachable(auth);
    }
}
exports.setupAuth = setupAuth;
class CredentialHandler {
    constructor(manifestDir, authDef, { oauthServerPort, extraOAuthScopes } = {}) {
        this._authDef = authDef;
        this._manifestDir = manifestDir;
        this._oauthServerPort = oauthServerPort || exports.DEFAULT_OAUTH_SERVER_PORT;
        this._extraOAuthScopes = (extraOAuthScopes === null || extraOAuthScopes === void 0 ? void 0 : extraOAuthScopes.split(' ')) || [];
    }
    checkForExistingCredential() {
        const existingCredentials = readCredentialsFile(this._manifestDir);
        if (existingCredentials) {
            const input = helpers_4.promptForInput(`Credentials already exist for this Pack, press "y" to overwrite or "n" to cancel: `);
            if (input.toLocaleLowerCase() !== 'y') {
                return process.exit(1);
            }
            return existingCredentials;
        }
    }
    handleToken() {
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = helpers_4.promptForInput(`Paste the token or API key to use for this Pack:\n`, { mask: true });
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
        const username = helpers_4.promptForInput(`Enter the ${usernamePlaceholder} for this Pack:\n`);
        let password;
        if (!usernameOnly) {
            password = helpers_4.promptForInput(`Enter the ${passwordPlaceholder} for this Pack:\n`, { mask: true });
        }
        this.storeCredential({ endpointUrl, username, password });
        helpers_2.print('Credentials updated!');
    }
    handleQueryParam(paramName) {
        if (!paramName) {
            helpers_3.printAndExit(`Please provide a paramName attribute in the defaultAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = helpers_4.promptForInput(`Enter the token to use for the "${paramName}" url param for this Pack:\n`, {
            mask: true,
        });
        this.storeCredential({ endpointUrl, paramValue: input });
        helpers_2.print('Credentials updated!');
    }
    handleMultiQueryParams(paramDefs) {
        if (paramDefs.length === 0) {
            helpers_3.printAndExit(`Please define one or more entries for "params" in the defaultAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const credentials = { endpointUrl, params: {} };
        for (const paramDef of paramDefs) {
            const paramValue = helpers_4.promptForInput(`Enter the token to use for the "${paramDef.name}" url param for this Pack:\n`, { mask: true });
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
            ? `Enter the OAuth client id for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client id for this Pack:\n`;
        const newClientId = helpers_4.promptForInput(clientIdPrompt);
        const clientSecretPrompt = existingCredentials
            ? `Enter the OAuth client secret for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client secret for this Pack:\n`;
        const newClientSecret = helpers_4.promptForInput(clientSecretPrompt, { mask: true });
        const clientId = ensure_3.ensureNonEmptyString(newClientId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientId));
        const clientSecret = ensure_3.ensureNonEmptyString(newClientSecret || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientSecret));
        const credentials = {
            clientId,
            clientSecret,
            accessToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessToken,
            refreshToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.refreshToken,
            expires: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.expires,
            scopes: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.scopes,
        };
        this.storeCredential(credentials);
        helpers_2.print('Credential secrets updated! Launching OAuth handshake in browser...\n');
        const manifestScopes = this._authDef.scopes || [];
        const requestedScopes = this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;
        oauth_server_1.launchOAuthServerFlow({
            clientId,
            clientSecret,
            authDef: this._authDef,
            port: this._oauthServerPort,
            afterTokenExchange: ({ accessToken, refreshToken, expires }) => {
                const credentials = {
                    clientId,
                    clientSecret,
                    accessToken,
                    refreshToken,
                    expires,
                    scopes: requestedScopes,
                };
                this.storeCredential(credentials);
                helpers_2.print('Access token saved! Shutting down OAuth server and exiting...');
            },
            scopes: requestedScopes,
        });
    }
    maybePromptForEndpointUrl() {
        if (this._authDef.type === types_1.AuthenticationType.None || this._authDef.type === types_1.AuthenticationType.Various) {
            return;
        }
        const { requiresEndpointUrl, endpointDomain } = this._authDef;
        if (!requiresEndpointUrl) {
            return;
        }
        const placeholder = endpointDomain ? `https://my-site.${endpointDomain}` : 'https://foo.example.com';
        return helpers_4.promptForInput(`Enter the endpoint url for this Pack (for example, ${placeholder}):\n`);
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
function readCredentialsFile(manifestDir) {
    const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
    const fileContents = helpers_5.readJSONFile(filename);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.credentials;
}
exports.readCredentialsFile = readCredentialsFile;
function writeCredentialsFile(credentialsFile, credentials) {
    const fileContents = { credentials };
    helpers_6.writeJSONFile(credentialsFile, fileContents, 0o600);
}
