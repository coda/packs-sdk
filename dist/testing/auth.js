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
const oauth_helpers_1 = require("./oauth_helpers");
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
async function setupAuth(manifestDir, packDef, opts = {}) {
    const auth = (0, helpers_1.getPackAuth)(packDef);
    if (!auth) {
        return (0, helpers_3.printAndExit)(`This Pack has no declared authentication. ` +
            `Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.`);
    }
    const handler = new CredentialHandler(manifestDir, auth, opts);
    switch (auth.type) {
        case types_1.AuthenticationType.None:
            return (0, helpers_3.printAndExit)(`This Pack declares AuthenticationType.None and so does not require authentication. ` +
                `Please declare another AuthenticationType to use authentication with this Pack.`);
        case types_1.AuthenticationType.CodaApiHeaderBearerToken:
            (0, ensure_2.ensureExists)(packDef.defaultAuthentication, 'CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.');
        case types_1.AuthenticationType.CustomHeaderToken:
        case types_1.AuthenticationType.HeaderBearerToken:
            return handler.handleToken();
        case types_1.AuthenticationType.MultiHeaderToken:
            return handler.handleMultiToken(auth.headers);
        case types_1.AuthenticationType.MultiQueryParamToken:
            return handler.handleMultiQueryParams(auth.params);
        case types_1.AuthenticationType.QueryParamToken:
            return handler.handleQueryParam(auth.paramName);
        case types_1.AuthenticationType.WebBasic:
            return handler.handleWebBasic();
        case types_1.AuthenticationType.Custom:
            return handler.handleCustom(auth.params);
        case types_1.AuthenticationType.OAuth2:
            (0, ensure_2.ensureExists)(packDef.defaultAuthentication, 'OAuth2 only works with defaultAuthentication, not system auth.');
            return handler.handleOAuth2();
        case types_1.AuthenticationType.OAuth2ClientCredentials:
            return handler.handleOAuth2ClientCredentials();
        case types_1.AuthenticationType.AWSAccessKey:
            return handler.handleAWSAccessKey();
        case types_1.AuthenticationType.AWSAssumeRole:
            return handler.handleAWSAssumeRole();
        case types_1.AuthenticationType.Various:
            return (0, helpers_3.printAndExit)('This authentication type is not yet implemented');
        default:
            return (0, ensure_4.ensureUnreachable)(auth);
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
            const input = (0, helpers_4.promptForInput)(`Credentials already exist for this Pack, overwrite? (y/N): `, { yesOrNo: true });
            if (input.toLocaleLowerCase() !== 'yes') {
                throw new Error(`Input: ${input}`);
                return process.exit(1);
            }
            return existingCredentials;
        }
    }
    handleToken() {
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = (0, helpers_4.promptForInput)(`Paste the token or API key to use for this Pack:\n`, { mask: true });
        this.storeCredential({ endpointUrl, token: input });
        (0, helpers_2.print)('Credentials updated!');
    }
    handleMultiToken(headers) {
        if (headers.length === 0) {
            (0, helpers_3.printAndExit)(`Please define one or more entries for "headers" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const credentials = { endpointUrl, headers: {} };
        for (const { name } of headers) {
            const value = (0, helpers_4.promptForInput)(`Enter the token to use for the "${name}" header for this Pack:\n`, { mask: true });
            credentials.headers[name] = value;
        }
        this.storeCredential(credentials);
        (0, helpers_2.print)('Credentials updated!');
    }
    handleWebBasic() {
        var _a, _b, _c;
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.WebBasic);
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const usernamePlaceholder = ((_a = this._authDef.uxConfig) === null || _a === void 0 ? void 0 : _a.placeholderUsername) || 'username';
        const passwordPlaceholder = ((_b = this._authDef.uxConfig) === null || _b === void 0 ? void 0 : _b.placeholderPassword) || 'password';
        const usernameOnly = (_c = this._authDef.uxConfig) === null || _c === void 0 ? void 0 : _c.usernameOnly;
        const username = (0, helpers_4.promptForInput)(`Enter the ${usernamePlaceholder} for this Pack:\n`);
        let password;
        if (!usernameOnly) {
            password = (0, helpers_4.promptForInput)(`Enter the ${passwordPlaceholder} for this Pack:\n`, { mask: true });
        }
        this.storeCredential({ endpointUrl, username, password });
        (0, helpers_2.print)('Credentials updated!');
    }
    handleCustom(paramDefs) {
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.Custom);
        if (paramDefs.length === 0) {
            (0, helpers_3.printAndExit)(`Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const { params: parameters } = this._authDef;
        const credentials = { endpointUrl, params: {} };
        for (const param of parameters) {
            const { description, name } = param;
            const descriptionText = description ? ` (${description})` : '';
            credentials.params[name] = (0, helpers_4.promptForInput)(`Enter the value to use for the '${name}'${descriptionText} parameter for this Pack:\n`, {
                mask: true,
            });
        }
        this.storeCredential(credentials);
        (0, helpers_2.print)('Credentials updated!');
    }
    handleQueryParam(paramName) {
        if (!paramName) {
            (0, helpers_3.printAndExit)(`Please provide a paramName attribute in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = (0, helpers_4.promptForInput)(`Enter the token to use for the "${paramName}" url param for this Pack:\n`, {
            mask: true,
        });
        this.storeCredential({ endpointUrl, paramValue: input });
        (0, helpers_2.print)('Credentials updated!');
    }
    handleMultiQueryParams(paramDefs) {
        if (paramDefs.length === 0) {
            (0, helpers_3.printAndExit)(`Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const credentials = { endpointUrl, params: {} };
        for (const paramDef of paramDefs) {
            const paramValue = (0, helpers_4.promptForInput)(`Enter the token to use for the "${paramDef.name}" url param for this Pack:\n`, { mask: true });
            credentials.params[paramDef.name] = paramValue;
        }
        this.storeCredential(credentials);
        (0, helpers_2.print)('Credentials updated!');
    }
    _promptOAuth2ClientIdAndSecret(existingCredentials) {
        const clientIdPrompt = existingCredentials
            ? `Enter the OAuth client id for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client id for this Pack:\n`;
        const newClientId = (0, helpers_4.promptForInput)(clientIdPrompt);
        const clientSecretPrompt = existingCredentials
            ? `Enter the OAuth client secret for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client secret for this Pack:\n`;
        const newClientSecret = (0, helpers_4.promptForInput)(clientSecretPrompt, { mask: true });
        const clientId = (0, ensure_3.ensureNonEmptyString)(newClientId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientId));
        const clientSecret = (0, ensure_3.ensureNonEmptyString)(newClientSecret || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientSecret));
        return { clientId, clientSecret };
    }
    handleOAuth2() {
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.OAuth2);
        const existingCredentials = this.checkForExistingCredential();
        (0, helpers_2.print)(`*** Your application must have ${(0, oauth_server_2.makeRedirectUrl)(this._oauthServerPort)} allowlisted as an OAuth redirect url ` +
            'in order for this tool to work. ***');
        const { clientId, clientSecret } = this._promptOAuth2ClientIdAndSecret(existingCredentials);
        const credentials = {
            clientId,
            clientSecret,
            accessToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessToken,
            refreshToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.refreshToken,
            expires: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.expires,
            scopes: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.scopes,
        };
        this.storeCredential(credentials);
        (0, helpers_2.print)('Credential secrets updated! Launching OAuth handshake in browser...\n');
        const manifestScopes = this._authDef.scopes || [];
        const requestedScopes = this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;
        (0, oauth_server_1.launchOAuthServerFlow)({
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
                (0, helpers_2.print)('Access token saved! Shutting down OAuth server and exiting...');
            },
            scopes: requestedScopes,
        });
    }
    async handleOAuth2ClientCredentials() {
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.OAuth2ClientCredentials);
        const existingCredentials = this.checkForExistingCredential();
        const { clientId, clientSecret } = this._promptOAuth2ClientIdAndSecret(existingCredentials);
        const credentials = {
            clientId,
            clientSecret,
            accessToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessToken,
            expires: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.expires,
            scopes: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.scopes,
        };
        this.storeCredential(credentials);
        const manifestScopes = this._authDef.scopes || [];
        const requestedScopes = this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;
        const { accessToken, expires } = await (0, oauth_helpers_1.performOAuthClientCredentialsServerFlow)({
            clientId,
            clientSecret,
            scopes: requestedScopes,
            authDef: this._authDef
        });
        this.storeCredential({
            clientId,
            clientSecret,
            accessToken,
            expires,
            scopes: requestedScopes,
        });
        (0, helpers_2.print)('Access token saved!');
    }
    handleAWSAccessKey() {
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.AWSAccessKey);
        const existingCredentials = this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const newAccessKeyId = (0, helpers_4.promptForInput)(`Enter the AWS Access Key Id for this Pack:\n`);
        const newSecretAccessKey = (0, helpers_4.promptForInput)(`Enter the AWS Secret Access Key for this Pack:\n`, { mask: true });
        const accessKeyId = (0, ensure_3.ensureNonEmptyString)(newAccessKeyId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessKeyId));
        const secretAccessKey = (0, ensure_3.ensureNonEmptyString)(newSecretAccessKey || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.secretAccessKey));
        this.storeCredential({ accessKeyId, secretAccessKey, endpointUrl });
        (0, helpers_2.print)('Credentials updated!');
    }
    handleAWSAssumeRole() {
        (0, ensure_1.assertCondition)(this._authDef.type === types_1.AuthenticationType.AWSAssumeRole);
        const existingCredentials = this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const newRoleArn = (0, helpers_4.promptForInput)(`Enter the AWS Role ARN for this Pack:\n`);
        const externalId = (0, helpers_4.promptForInput)(`[Optional] Enter the External ID for this Pack:\n`, { mask: true });
        const roleArn = (0, ensure_3.ensureNonEmptyString)(newRoleArn || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.roleArn));
        this.storeCredential({ roleArn, externalId, endpointUrl });
        (0, helpers_2.print)('Credentials updated!');
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
        return (0, helpers_4.promptForInput)(`Enter the endpoint url for this Pack (for example, ${placeholder}):\n`);
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
    const fileContents = (0, helpers_5.readJSONFile)(filename);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.credentials;
}
exports.readCredentialsFile = readCredentialsFile;
function writeCredentialsFile(credentialsFile, credentials) {
    const fileContents = { credentials };
    (0, helpers_6.writeJSONFile)(credentialsFile, fileContents, 0o600);
}
