import type {AllCredentials} from './auth_types';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from './auth_types';
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
import path from 'path';
import {print} from './helpers';
import {printAndExit} from './helpers';
import {promptForInput} from './helpers';

interface SetupAuthOptions {
  credentialsFile?: string;
  oauthServerPort?: number;
}

export const DEFAULT_CREDENTIALS_FILE = '.coda/credentials.json';
export const DEFAULT_OAUTH_SERVER_PORT = 3000;

export async function setupAuthFromModule(module: any, opts: SetupAuthOptions = {}): Promise<void> {
  return setupAuth(await getManifestFromModule(module), opts);
}

export function setupAuth(packDef: PackDefinition, opts: SetupAuthOptions = {}): void {
  const {name, defaultAuthentication} = packDef;
  if (!defaultAuthentication) {
    return printAndExit(
      `The pack ${name} has no declared authentication. Provide a value for defaultAuthentication in the pack definition.`,
    );
  }
  const handler = new CredentialHandler(name, defaultAuthentication, opts);
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
  private readonly _credentialsFile: string;
  private readonly _oauthServerPort: number;

  constructor(packName: string, authDef: Authentication, {credentialsFile, oauthServerPort}: SetupAuthOptions = {}) {
    this._packName = packName;
    this._authDef = authDef;
    this._credentialsFile = credentialsFile || DEFAULT_CREDENTIALS_FILE;
    this._oauthServerPort = oauthServerPort || DEFAULT_OAUTH_SERVER_PORT;
  }

  private checkForExistingCredential(): Credentials | undefined {
    const existingCredentials = readCredentialsFile(this._credentialsFile);
    if (existingCredentials && existingCredentials[this._packName]) {
      const input = promptForInput(
        `Credentials already exist for ${this._packName}, press "y" to overwrite or "n" to cancel: `,
      );
      if (input.toLocaleLowerCase() !== 'y') {
        return process.exit(1);
      }
      return existingCredentials[this._packName];
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
    storeCredential(this._credentialsFile, this._packName, credentials);
  }
}

export function storeCredential(credentialsFile: string, packName: string, credentials: Credentials): void {
  const allCredentials: AllCredentials = readCredentialsFile(credentialsFile) || {packs: {}};
  allCredentials.packs[packName] = credentials;
  writeCredentialsFile(credentialsFile, allCredentials);
}

export function storeCodaApiKey(apiKey: string, credentialsFile: string = DEFAULT_CREDENTIALS_FILE) {
  const allCredentials: AllCredentials = readCredentialsFile(credentialsFile) || {packs: {}};
  allCredentials.__coda__ = {apiKey};
  writeCredentialsFile(credentialsFile, allCredentials);
}

export function readCredentialsFile(credentialsFile: string = DEFAULT_CREDENTIALS_FILE): AllCredentials | undefined {
  ensureNonEmptyString(credentialsFile);
  let file: Buffer;
  try {
    file = fs.readFileSync(credentialsFile);
  } catch (err) {
    if (err.message && err.message.includes('no such file or directory')) {
      return;
    }
    throw err;
  }
  return JSON.parse(file.toString());
}

function writeCredentialsFile(credentialsFile: string, allCredentials: AllCredentials): void {
  ensureNonEmptyString(credentialsFile);
  const dirname = path.dirname(credentialsFile);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  const fileExisted = fs.existsSync(credentialsFile);
  fs.writeFileSync(credentialsFile, JSON.stringify(allCredentials, undefined, 2));
  if (!fileExisted) {
    // When we create the file, make sure only the owner can read it, because it contains sensitive credentials.
    fs.chmodSync(credentialsFile, 0o600);
  }
}
