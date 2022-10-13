import { AuthenticationType } from '../types';
import { assertCondition } from '../helpers/ensure';
import { ensureExists } from '../helpers/ensure';
import { ensureNonEmptyString } from '../helpers/ensure';
import { ensureUnreachable } from '../helpers/ensure';
import { getPackAuth } from '../cli/helpers';
import { launchOAuthServerFlow } from './oauth_server';
import { makeRedirectUrl } from './oauth_server';
import * as path from 'path';
import { print } from './helpers';
import { printAndExit } from './helpers';
import { promptForInput } from './helpers';
import { readJSONFile } from './helpers';
import { writeJSONFile } from './helpers';
const CREDENTIALS_FILE_NAME = '.coda-credentials.json';
export const DEFAULT_OAUTH_SERVER_PORT = 3000;
export async function setupAuthFromModule(manifestPath, manifest, opts = {}) {
    const manifestDir = path.dirname(manifestPath);
    return setupAuth(manifestDir, manifest, opts);
}
export function setupAuth(manifestDir, packDef, opts = {}) {
    const auth = getPackAuth(packDef);
    if (!auth) {
        return printAndExit(`This Pack has no declared authentication. ` +
            `Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.`);
    }
    const handler = new CredentialHandler(manifestDir, auth, opts);
    switch (auth.type) {
        case AuthenticationType.None:
            return printAndExit(`This Pack declares AuthenticationType.None and so does not require authentication. ` +
                `Please declare another AuthenticationType to use authentication with this Pack.`);
        case AuthenticationType.CodaApiHeaderBearerToken:
            ensureExists(packDef.defaultAuthentication, 'CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.');
        case AuthenticationType.CustomHeaderToken:
        case AuthenticationType.HeaderBearerToken:
            return handler.handleToken();
        case AuthenticationType.MultiQueryParamToken:
            return handler.handleMultiQueryParams(auth.params);
        case AuthenticationType.QueryParamToken:
            return handler.handleQueryParam(auth.paramName);
        case AuthenticationType.WebBasic:
            return handler.handleWebBasic();
        case AuthenticationType.Custom:
            return handler.handleCustom(auth.params);
        case AuthenticationType.OAuth2:
            ensureExists(packDef.defaultAuthentication, 'OAuth2 only works with defaultAuthentication, not system auth.');
            return handler.handleOAuth2();
        case AuthenticationType.AWSAccessKey:
            return handler.handleAWSAccessKey();
        case AuthenticationType.AWSAssumeRole:
            return handler.handleAWSAssumeRole();
        case AuthenticationType.Various:
            return printAndExit('This authentication type is not yet implemented');
        default:
            return ensureUnreachable(auth);
    }
}
class CredentialHandler {
    constructor(manifestDir, authDef, { oauthServerPort, extraOAuthScopes } = {}) {
        this._authDef = authDef;
        this._manifestDir = manifestDir;
        this._oauthServerPort = oauthServerPort || DEFAULT_OAUTH_SERVER_PORT;
        this._extraOAuthScopes = (extraOAuthScopes === null || extraOAuthScopes === void 0 ? void 0 : extraOAuthScopes.split(' ')) || [];
    }
    checkForExistingCredential() {
        const existingCredentials = readCredentialsFile(this._manifestDir);
        if (existingCredentials) {
            const input = promptForInput(`Credentials already exist for this Pack, overwrite? (y/N): `, { yesOrNo: true });
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
        const input = promptForInput(`Paste the token or API key to use for this Pack:\n`, { mask: true });
        this.storeCredential({ endpointUrl, token: input });
        print('Credentials updated!');
    }
    handleWebBasic() {
        var _a, _b, _c;
        assertCondition(this._authDef.type === AuthenticationType.WebBasic);
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const usernamePlaceholder = ((_a = this._authDef.uxConfig) === null || _a === void 0 ? void 0 : _a.placeholderUsername) || 'username';
        const passwordPlaceholder = ((_b = this._authDef.uxConfig) === null || _b === void 0 ? void 0 : _b.placeholderPassword) || 'password';
        const usernameOnly = (_c = this._authDef.uxConfig) === null || _c === void 0 ? void 0 : _c.usernameOnly;
        const username = promptForInput(`Enter the ${usernamePlaceholder} for this Pack:\n`);
        let password;
        if (!usernameOnly) {
            password = promptForInput(`Enter the ${passwordPlaceholder} for this Pack:\n`, { mask: true });
        }
        this.storeCredential({ endpointUrl, username, password });
        print('Credentials updated!');
    }
    handleCustom(paramDefs) {
        assertCondition(this._authDef.type === AuthenticationType.Custom);
        if (paramDefs.length === 0) {
            printAndExit(`Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const { params: parameters } = this._authDef;
        const credentials = { endpointUrl, params: {} };
        for (const param of parameters) {
            const { description, name } = param;
            const descriptionText = description ? ` (${description})` : '';
            credentials.params[name] = promptForInput(`Enter the value to use for the '${name}'${descriptionText} parameter for this Pack:\n`, {
                mask: true,
            });
        }
        this.storeCredential(credentials);
        print('Credentials updated!');
    }
    handleQueryParam(paramName) {
        if (!paramName) {
            printAndExit(`Please provide a paramName attribute in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const input = promptForInput(`Enter the token to use for the "${paramName}" url param for this Pack:\n`, {
            mask: true,
        });
        this.storeCredential({ endpointUrl, paramValue: input });
        print('Credentials updated!');
    }
    handleMultiQueryParams(paramDefs) {
        if (paramDefs.length === 0) {
            printAndExit(`Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`);
        }
        this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const credentials = { endpointUrl, params: {} };
        for (const paramDef of paramDefs) {
            const paramValue = promptForInput(`Enter the token to use for the "${paramDef.name}" url param for this Pack:\n`, { mask: true });
            credentials.params[paramDef.name] = paramValue;
        }
        this.storeCredential(credentials);
        print('Credentials updated!');
    }
    handleOAuth2() {
        assertCondition(this._authDef.type === AuthenticationType.OAuth2);
        const existingCredentials = this.checkForExistingCredential();
        print(`*** Your application must have ${makeRedirectUrl(this._oauthServerPort)} whitelisted as an OAuth redirect url ` +
            'in order for this tool to work. ***');
        const clientIdPrompt = existingCredentials
            ? `Enter the OAuth client id for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client id for this Pack:\n`;
        const newClientId = promptForInput(clientIdPrompt);
        const clientSecretPrompt = existingCredentials
            ? `Enter the OAuth client secret for this Pack (or Enter to skip and use existing):\n`
            : `Enter the OAuth client secret for this Pack:\n`;
        const newClientSecret = promptForInput(clientSecretPrompt, { mask: true });
        const clientId = ensureNonEmptyString(newClientId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientId));
        const clientSecret = ensureNonEmptyString(newClientSecret || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.clientSecret));
        const credentials = {
            clientId,
            clientSecret,
            accessToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessToken,
            refreshToken: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.refreshToken,
            expires: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.expires,
            scopes: existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.scopes,
        };
        this.storeCredential(credentials);
        print('Credential secrets updated! Launching OAuth handshake in browser...\n');
        const manifestScopes = this._authDef.scopes || [];
        const requestedScopes = this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;
        launchOAuthServerFlow({
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
                print('Access token saved! Shutting down OAuth server and exiting...');
            },
            scopes: requestedScopes,
        });
    }
    handleAWSAccessKey() {
        assertCondition(this._authDef.type === AuthenticationType.AWSAccessKey);
        const existingCredentials = this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const newAccessKeyId = promptForInput(`Enter the AWS Access Key Id for this Pack:\n`);
        const newSecretAccessKey = promptForInput(`Enter the AWS Secret Access Key for this Pack:\n`, { mask: true });
        const accessKeyId = ensureNonEmptyString(newAccessKeyId || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.accessKeyId));
        const secretAccessKey = ensureNonEmptyString(newSecretAccessKey || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.secretAccessKey));
        this.storeCredential({ accessKeyId, secretAccessKey, endpointUrl });
        print('Credentials updated!');
    }
    handleAWSAssumeRole() {
        assertCondition(this._authDef.type === AuthenticationType.AWSAssumeRole);
        const existingCredentials = this.checkForExistingCredential();
        const endpointUrl = this.maybePromptForEndpointUrl();
        const newRoleArn = promptForInput(`Enter the AWS Role ARN for this Pack:\n`);
        const externalId = promptForInput(`[Optional] Enter the External ID for this Pack:\n`, { mask: true });
        const roleArn = ensureNonEmptyString(newRoleArn || (existingCredentials === null || existingCredentials === void 0 ? void 0 : existingCredentials.roleArn));
        this.storeCredential({ roleArn, externalId, endpointUrl });
        print('Credentials updated!');
    }
    maybePromptForEndpointUrl() {
        if (this._authDef.type === AuthenticationType.None || this._authDef.type === AuthenticationType.Various) {
            return;
        }
        const { requiresEndpointUrl, endpointDomain } = this._authDef;
        if (!requiresEndpointUrl) {
            return;
        }
        const placeholder = endpointDomain ? `https://my-site.${endpointDomain}` : 'https://foo.example.com';
        return promptForInput(`Enter the endpoint url for this Pack (for example, ${placeholder}):\n`);
    }
    storeCredential(credentials) {
        storeCredential(this._manifestDir, credentials);
    }
}
export function storeCredential(manifestDir, credentials) {
    const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
    writeCredentialsFile(filename, credentials);
}
export function readCredentialsFile(manifestDir) {
    const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
    const fileContents = readJSONFile(filename);
    return fileContents === null || fileContents === void 0 ? void 0 : fileContents.credentials;
}
function writeCredentialsFile(credentialsFile, credentials) {
    const fileContents = { credentials };
    writeJSONFile(credentialsFile, fileContents, 0o600);
}
