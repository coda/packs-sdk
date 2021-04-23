import type {ApiKeyFile} from './auth_types';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from './auth_types';
import type {CredentialsFile} from './auth_types';
import type {MultiQueryParamCredentials} from './auth_types';
import type {OAuth2Credentials} from './auth_types';
import type {PackDefinition} from '../types';
import {assertCondition} from '../helpers/ensure';
import {ensureNonEmptyString} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import fs from 'fs';
import {getManifestFromModule} from './helpers';
import {launchOAuthServerFlow} from './oauth_server';
import {makeRedirectUrl} from './oauth_server';
import * as path from 'path';
import {print} from './helpers';
import {printAndExit} from './helpers';
import {promptForInput} from './helpers';
import {readJSONFile} from './helpers';
import urlParse from 'url-parse';
import {writeJSONFile} from './helpers';

interface SetupAuthOptions {
  oauthServerPort?: number;
}

const CREDENTIALS_FILE_NAME = '.coda-credentials.json';
const API_KEY_FILE_NAME = '.coda.json';
export const DEFAULT_OAUTH_SERVER_PORT = 3000;

export async function setupAuthFromModule(
  manifestPath: string,
  module: any,
  opts: SetupAuthOptions = {},
): Promise<void> {
  const manifestDir = path.dirname(manifestPath);
  return setupAuth(manifestDir, getManifestFromModule(module), opts);
}

export function setupAuth(manifestDir: string, packDef: PackDefinition, opts: SetupAuthOptions = {}): void {
  const {name, defaultAuthentication} = packDef;
  if (!defaultAuthentication) {
    return printAndExit(
      `The pack ${name} has no declared authentication. Provide a value for defaultAuthentication in the pack definition.`,
    );
  }
  const handler = new CredentialHandler(manifestDir, name, defaultAuthentication, opts);
  switch (defaultAuthentication.type) {
    case AuthenticationType.None:
      return printAndExit(
        `The pack ${name} declares AuthenticationType.None and so does not require authentication. ` +
          `Please declare another AuthenticationType to use authentication with this pack.`,
      );
    case AuthenticationType.CodaApiHeaderBearerToken:
    case AuthenticationType.CustomHeaderToken:
    case AuthenticationType.HeaderBearerToken:
      return handler.handleToken();
    case AuthenticationType.MultiQueryParamToken:
      return handler.handleMultiQueryParams(defaultAuthentication.params);
    case AuthenticationType.QueryParamToken:
      return handler.handleQueryParam(defaultAuthentication.paramName);
    case AuthenticationType.WebBasic:
      return handler.handleWebBasic();
    case AuthenticationType.AWSSignature4:
      throw new Error('Not yet implemented');
    case AuthenticationType.OAuth2:
      return handler.handleOAuth2();
    default:
      return ensureUnreachable(defaultAuthentication);
  }
}

class CredentialHandler {
  private readonly _packName: string;
  private readonly _authDef: Authentication;
  private readonly _manifestDir: string;
  private readonly _oauthServerPort: number;

  constructor(
    manifestDir: string,
    packName: string,
    authDef: Authentication,
    {oauthServerPort}: SetupAuthOptions = {},
  ) {
    this._packName = packName;
    this._authDef = authDef;
    this._manifestDir = manifestDir;
    this._oauthServerPort = oauthServerPort || DEFAULT_OAUTH_SERVER_PORT;
  }

  private checkForExistingCredential(): Credentials | undefined {
    const existingCredentials = readCredentialsFile(this._manifestDir);
    if (existingCredentials) {
      const input = promptForInput(
        `Credentials already exist for ${this._packName}, press "y" to overwrite or "n" to cancel: `,
      );
      if (input.toLocaleLowerCase() !== 'y') {
        return process.exit(1);
      }
      return existingCredentials;
    }
  }

  handleToken() {
    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const input = promptForInput(`Paste the token or API key to use for ${this._packName}:\n`, {mask: true});
    this.storeCredential({endpointUrl, token: input});
    print('Credentials updated!');
  }

  handleWebBasic() {
    assertCondition(this._authDef.type === AuthenticationType.WebBasic);
    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const usernamePlaceholder = this._authDef.uxConfig?.placeholderUsername || 'username';
    const passwordPlaceholder = this._authDef.uxConfig?.placeholderPassword || 'password';
    const usernameOnly = this._authDef.uxConfig?.usernameOnly;
    const username = promptForInput(`Enter the ${usernamePlaceholder} for ${this._packName}:\n`);
    let password: string | undefined;
    if (!usernameOnly) {
      password = promptForInput(`Enter the ${passwordPlaceholder} for ${this._packName}:\n`, {mask: true});
    }
    this.storeCredential({endpointUrl, username, password});
    print('Credentials updated!');
  }

  handleQueryParam(paramName: string) {
    if (!paramName) {
      printAndExit(
        `Please provide a paramName attribute in the defaultAuthentication section of the ${this._packName} pack definition.`,
      );
    }
    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const input = promptForInput(`Enter the token to use for the "${paramName}" url param for ${this._packName}:\n`, {
      mask: true,
    });
    this.storeCredential({endpointUrl, paramValue: input});
    print('Credentials updated!');
  }

  handleMultiQueryParams(
    paramDefs: Array<{
      name: string;
      description: string;
    }>,
  ) {
    if (paramDefs.length === 0) {
      printAndExit(
        `Please define one or more entries for "params" in the defaultAuthentication section of the ${this._packName} pack definition.`,
      );
    }

    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const credentials: MultiQueryParamCredentials = {endpointUrl, params: {}};
    for (const paramDef of paramDefs) {
      const paramValue = promptForInput(
        `Enter the token to use for the "${paramDef.name}" url param for ${this._packName}:\n`,
        {mask: true},
      );
      credentials.params[paramDef.name] = paramValue;
    }
    this.storeCredential(credentials);
    print('Credentials updated!');
  }

  handleOAuth2() {
    assertCondition(this._authDef.type === AuthenticationType.OAuth2);
    const existingCredentials = this.checkForExistingCredential() as OAuth2Credentials | undefined;
    print(
      `*** Your application must have ${makeRedirectUrl(this._oauthServerPort)} whitelisted as an OAuth redirect url ` +
        'in order for this tool to work. ***',
    );
    const clientIdPrompt = existingCredentials
      ? `Enter the OAuth client id for ${this._packName} (or Enter to skip and use existing):\n`
      : `Enter the OAuth client id for ${this._packName}:\n`;
    const newClientId = promptForInput(clientIdPrompt);
    const clientSecretPrompt = existingCredentials
      ? `Enter the OAuth client secret for ${this._packName} (or Enter to skip and use existing):\n`
      : `Enter the OAuth client secret for ${this._packName}:\n`;
    const newClientSecret = promptForInput(clientSecretPrompt, {mask: true});

    const clientId = ensureNonEmptyString(newClientId || existingCredentials?.clientId);
    const clientSecret = ensureNonEmptyString(newClientSecret || existingCredentials?.clientSecret);

    const credentials: OAuth2Credentials = {
      clientId,
      clientSecret,
      accessToken: existingCredentials?.accessToken,
      refreshToken: existingCredentials?.refreshToken,
    };
    this.storeCredential(credentials);
    print('Credential secrets updated! Launching OAuth handshake in browser...\n');

    launchOAuthServerFlow({
      clientId,
      clientSecret,
      authDef: this._authDef,
      port: this._oauthServerPort,
      afterTokenExchange: ({accessToken, refreshToken}) => {
        const credentials: OAuth2Credentials = {
          clientId,
          clientSecret,
          accessToken,
          refreshToken,
        };
        this.storeCredential(credentials);
        print('Access token saved! Shutting down OAuth server and exiting...');
      },
    });
  }

  private maybePromptForEndpointUrl() {
    if (this._authDef.type === AuthenticationType.None) {
      return;
    }
    const {requiresEndpointUrl, endpointDomain} = this._authDef;
    if (!requiresEndpointUrl) {
      return;
    }
    const placeholder = endpointDomain
      ? `https://my-site.${endpointDomain}`
      : `https://${this._packName.toLowerCase()}.example.com`;
    return promptForInput(`Enter the endpoint url for ${this._packName} (for example, ${placeholder}):\n`);
  }

  storeCredential(credentials: Credentials): void {
    storeCredential(this._manifestDir, credentials);
  }
}

export function storeCredential(manifestDir: string, credentials: Credentials): void {
  const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
  writeCredentialsFile(filename, credentials);
}

export function getApiKey(codaApiEndpoint?: string): string | undefined {
  const baseFilename = path.join(process.env.PWD || '.', API_KEY_FILE_NAME);
  // Traverse up from the current directory for a while to see if we can find an API key file.
  // Usually it will be in the current directory, but if the user has cd'ed deeper into their
  // project it may be higher up.
  for (let i = 0; i < 10; i++) {
    const filename = path.join(`..${path.sep}`.repeat(i), baseFilename);
    const apiKeyFile = readApiKeyFile(filename);
    if (apiKeyFile) {
      if (codaApiEndpoint) {
        return apiKeyFile.environmentApiKeys?.[codaApiEndpoint];
      }
      return apiKeyFile.apiKey;
    }
  }
}

export function storeCodaApiKey(apiKey: string, projectDir: string = '.', codaApiEndpoint?: string) {
  const filename = path.join(projectDir, API_KEY_FILE_NAME);
  const apiKeyFile = readApiKeyFile(filename) || {apiKey: ''};
  if (codaApiEndpoint) {
    apiKeyFile.environmentApiKeys = apiKeyFile.environmentApiKeys || {};
    const {host} = urlParse(codaApiEndpoint);
    apiKeyFile.environmentApiKeys[host] = apiKey;
  } else {
    apiKeyFile.apiKey = apiKey;
  }
  writeApiKeyFile(filename, apiKeyFile);
}

export function readCredentialsFile(manifestDir: string): Credentials | undefined {
  const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
  const fileContents = readJSONFile(filename) as CredentialsFile | undefined;
  return fileContents?.credentials;
}

function writeCredentialsFile(credentialsFile: string, credentials: Credentials): void {
  const fileExisted = fs.existsSync(credentialsFile);
  const fileContents: CredentialsFile = {credentials};
  writeJSONFile(credentialsFile, fileContents);
  if (!fileExisted) {
    // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
    fs.chmodSync(credentialsFile, 0o600);
  }
}

function readApiKeyFile(filename: string): ApiKeyFile | undefined {
  return readJSONFile(filename);
}

function writeApiKeyFile(filename: string, fileContents: ApiKeyFile): void {
  const fileExisted = fs.existsSync(filename);
  writeJSONFile(filename, fileContents);
  if (!fileExisted) {
    // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
    fs.chmodSync(filename, 0o600);
  }
}
