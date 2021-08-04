import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from './auth_types';
import type {CredentialsFile} from './auth_types';
import type {MultiQueryParamCredentials} from './auth_types';
import type {OAuth2Credentials} from './auth_types';
import type {PackVersionDefinition} from '../types';
import {assertCondition} from '../helpers/ensure';
import {ensureExists} from '../helpers/ensure';
import {ensureNonEmptyString} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {getPackAuth} from '../cli/helpers';
import {launchOAuthServerFlow} from './oauth_server';
import {makeRedirectUrl} from './oauth_server';
import * as path from 'path';
import {print} from './helpers';
import {printAndExit} from './helpers';
import {promptForInput} from './helpers';
import {readJSONFile} from './helpers';
import {writeJSONFile} from './helpers';

interface SetupAuthOptions {
  oauthServerPort?: number;
  extraOAuthScopes?: string;
}

const CREDENTIALS_FILE_NAME = '.coda-credentials.json';
export const DEFAULT_OAUTH_SERVER_PORT = 3000;

export async function setupAuthFromModule(
  manifestPath: string,
  manifest: PackVersionDefinition,
  opts: SetupAuthOptions = {},
): Promise<void> {
  const manifestDir = path.dirname(manifestPath);
  return setupAuth(manifestDir, manifest, opts);
}

export function setupAuth(manifestDir: string, packDef: PackVersionDefinition, opts: SetupAuthOptions = {}): void {
  const auth = getPackAuth(packDef);
  if (!auth) {
    return printAndExit(
      `This Pack has no declared authentication. ` +
        `Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.`,
    );
  }
  const handler = new CredentialHandler(manifestDir, auth, opts);
  switch (auth.type) {
    case AuthenticationType.None:
      return printAndExit(
        `This Pack declares AuthenticationType.None and so does not require authentication. ` +
          `Please declare another AuthenticationType to use authentication with this Pack.`,
      );
    case AuthenticationType.CodaApiHeaderBearerToken:
      ensureExists(
        packDef.defaultAuthentication,
        'CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.',
      );
    case AuthenticationType.CustomHeaderToken:
    case AuthenticationType.HeaderBearerToken:
      return handler.handleToken();
    case AuthenticationType.MultiQueryParamToken:
      return handler.handleMultiQueryParams(auth.params);
    case AuthenticationType.QueryParamToken:
      return handler.handleQueryParam(auth.paramName);
    case AuthenticationType.WebBasic:
      return handler.handleWebBasic();
    case AuthenticationType.OAuth2:
      ensureExists(packDef.defaultAuthentication, 'OAuth2 only works with defaultAuthentication, not system auth.');
      return handler.handleOAuth2();
    case AuthenticationType.AWSSignature4:
    case AuthenticationType.Various:
      return printAndExit('This authentication type is not yet implemented');
    default:
      return ensureUnreachable(auth);
  }
}

class CredentialHandler {
  private readonly _authDef: Authentication;
  private readonly _manifestDir: string;
  private readonly _oauthServerPort: number;
  private readonly _extraOAuthScopes: string[];

  constructor(
    manifestDir: string,
    authDef: Authentication,
    {oauthServerPort, extraOAuthScopes}: SetupAuthOptions = {},
  ) {
    this._authDef = authDef;
    this._manifestDir = manifestDir;
    this._oauthServerPort = oauthServerPort || DEFAULT_OAUTH_SERVER_PORT;
    this._extraOAuthScopes = extraOAuthScopes?.split(' ') || [];
  }

  private checkForExistingCredential(): Credentials | undefined {
    const existingCredentials = readCredentialsFile(this._manifestDir);
    if (existingCredentials) {
      const input = promptForInput(
        `Credentials already exist for this Pack, press "y" to overwrite or "n" to cancel: `,
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
    const input = promptForInput(`Paste the token or API key to use for this Pack:\n`, {mask: true});
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
    const username = promptForInput(`Enter the ${usernamePlaceholder} for this Pack:\n`);
    let password: string | undefined;
    if (!usernameOnly) {
      password = promptForInput(`Enter the ${passwordPlaceholder} for this Pack:\n`, {mask: true});
    }
    this.storeCredential({endpointUrl, username, password});
    print('Credentials updated!');
  }

  handleQueryParam(paramName: string) {
    if (!paramName) {
      printAndExit(
        `Please provide a paramName attribute in the defaultAuthentication section of this Pack definition.`,
      );
    }
    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const input = promptForInput(`Enter the token to use for the "${paramName}" url param for this Pack:\n`, {
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
        `Please define one or more entries for "params" in the defaultAuthentication section of this Pack definition.`,
      );
    }

    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const credentials: MultiQueryParamCredentials = {endpointUrl, params: {}};
    for (const paramDef of paramDefs) {
      const paramValue = promptForInput(
        `Enter the token to use for the "${paramDef.name}" url param for this Pack:\n`,
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
      ? `Enter the OAuth client id for this Pack (or Enter to skip and use existing):\n`
      : `Enter the OAuth client id for this Pack:\n`;
    const newClientId = promptForInput(clientIdPrompt);
    const clientSecretPrompt = existingCredentials
      ? `Enter the OAuth client secret for this Pack (or Enter to skip and use existing):\n`
      : `Enter the OAuth client secret for this Pack:\n`;
    const newClientSecret = promptForInput(clientSecretPrompt, {mask: true});

    const clientId = ensureNonEmptyString(newClientId || existingCredentials?.clientId);
    const clientSecret = ensureNonEmptyString(newClientSecret || existingCredentials?.clientSecret);

    const credentials: OAuth2Credentials = {
      clientId,
      clientSecret,
      accessToken: existingCredentials?.accessToken,
      refreshToken: existingCredentials?.refreshToken,
      expires: existingCredentials?.expires,
      scopes: existingCredentials?.scopes,
    };
    this.storeCredential(credentials);
    print('Credential secrets updated! Launching OAuth handshake in browser...\n');

    const manifestScopes = this._authDef.scopes || [];
    const requestedScopes =
      this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;

    launchOAuthServerFlow({
      clientId,
      clientSecret,
      authDef: this._authDef,
      port: this._oauthServerPort,
      afterTokenExchange: ({accessToken, refreshToken, expires}) => {
        const credentials: OAuth2Credentials = {
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

  private maybePromptForEndpointUrl() {
    if (this._authDef.type === AuthenticationType.None || this._authDef.type === AuthenticationType.Various) {
      return;
    }
    const {requiresEndpointUrl, endpointDomain} = this._authDef;
    if (!requiresEndpointUrl) {
      return;
    }
    const placeholder = endpointDomain ? `https://my-site.${endpointDomain}` : 'https://foo.example.com';
    return promptForInput(`Enter the endpoint url for this Pack (for example, ${placeholder}):\n`);
  }

  storeCredential(credentials: Credentials): void {
    storeCredential(this._manifestDir, credentials);
  }
}

export function storeCredential(manifestDir: string, credentials: Credentials): void {
  const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
  writeCredentialsFile(filename, credentials);
}

export function readCredentialsFile(manifestDir: string): Credentials | undefined {
  const filename = path.join(manifestDir, CREDENTIALS_FILE_NAME);
  const fileContents = readJSONFile(filename) as CredentialsFile | undefined;
  return fileContents?.credentials;
}

function writeCredentialsFile(credentialsFile: string, credentials: Credentials): void {
  const fileContents: CredentialsFile = {credentials};
  writeJSONFile(credentialsFile, fileContents, 0o600);
}
