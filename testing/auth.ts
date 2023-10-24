import type {AWSAccessKeyCredentials} from './auth_types';
import type {AWSAssumeRoleCredentials} from './auth_types';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {BasicPackDefinition} from '../types';
import type {Credentials} from './auth_types';
import type {CredentialsFile} from './auth_types';
import type {CustomAuthParameter} from '../types';
import type {CustomCredentials} from './auth_types';
import type {MultiHeaderCredentials} from './auth_types';
import type {MultiHeaderTokenAuthentication} from '../types';
import type {MultiQueryParamCredentials} from './auth_types';
import type {OAuth2ClientCredentials} from './auth_types';
import type {OAuth2Credentials} from './auth_types';
import {assertCondition} from '../helpers/ensure';
import {ensureExists} from '../helpers/ensure';
import {ensureNonEmptyString} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {getPackAuth} from '../cli/helpers';
import {launchOAuthServerFlow} from './oauth_server';
import {makeRedirectUrl} from './oauth_server';
import * as path from 'path';
import {performOAuthClientCredentialsServerFlow} from './oauth_helpers';
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
  manifest: BasicPackDefinition,
  opts: SetupAuthOptions = {},
): Promise<void> {
  const manifestDir = path.dirname(manifestPath);
  return setupAuth(manifestDir, manifest, opts);
}

export async function setupAuth(manifestDir: string, packDef: BasicPackDefinition, opts: SetupAuthOptions = {})
    : Promise<void> {
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
    case AuthenticationType.MultiHeaderToken:
      return handler.handleMultiToken(auth.headers);
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
    case AuthenticationType.OAuth2ClientCredentials:
      return handler.handleOAuth2ClientCredentials();
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
      const input = promptForInput(`Credentials already exist for this Pack, overwrite? (y/N): `, {yesOrNo: true});
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
    const input = promptForInput(`Paste the token or API key to use for this Pack:\n`, {mask: true});
    this.storeCredential({endpointUrl, token: input});
    print('Credentials updated!');
  }

  handleMultiToken(headers: MultiHeaderTokenAuthentication['headers']) {
    if (headers.length === 0) {
      printAndExit(
        `Please define one or more entries for "headers" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`,
      );
    }

    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const credentials: MultiHeaderCredentials = {endpointUrl, headers: {}};
    for (const {name} of headers) {
      const value = promptForInput(`Enter the token to use for the "${name}" header for this Pack:\n`, {mask: true});
      credentials.headers[name] = value;
    }
    this.storeCredential(credentials);
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

  handleCustom(paramDefs: CustomAuthParameter[]) {
    assertCondition(this._authDef.type === AuthenticationType.Custom);
    if (paramDefs.length === 0) {
      printAndExit(
        `Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`,
      );
    }
    this.checkForExistingCredential();
    const endpointUrl = this.maybePromptForEndpointUrl();
    const {params: parameters} = this._authDef;
    const credentials: CustomCredentials = {endpointUrl, params: {}};
    for (const param of parameters) {
      const {description, name} = param;
      const descriptionText = description ? ` (${description})` : '';
      credentials.params[name] = promptForInput(
        `Enter the value to use for the '${name}'${descriptionText} parameter for this Pack:\n`,
        {
          mask: true,
        },
      );
    }
    this.storeCredential(credentials);
    print('Credentials updated!');
  }

  handleQueryParam(paramName: string) {
    if (!paramName) {
      printAndExit(
        `Please provide a paramName attribute in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`,
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
        `Please define one or more entries for "params" in the setUserAuthentication or setSystemAuthentication section of this Pack definition.`,
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

  private _promptOAuth2ClientIdAndSecret(existingCredentials: OAuth2Credentials | OAuth2ClientCredentials | undefined):
      {clientId: string, clientSecret: string} {
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

    return {clientId, clientSecret};
  }

  handleOAuth2() {
    assertCondition(this._authDef.type === AuthenticationType.OAuth2);
    const existingCredentials = this.checkForExistingCredential() as OAuth2Credentials | undefined;
    print(
      `*** Your application must have ${makeRedirectUrl(this._oauthServerPort)} allowlisted as an OAuth redirect url ` +
        'in order for this tool to work. ***',
    );
    const {clientId, clientSecret} = this._promptOAuth2ClientIdAndSecret(existingCredentials);

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

  async handleOAuth2ClientCredentials() {
    assertCondition(this._authDef.type === AuthenticationType.OAuth2ClientCredentials);
    const existingCredentials = this.checkForExistingCredential() as OAuth2ClientCredentials | undefined;
    const {clientId, clientSecret} = this._promptOAuth2ClientIdAndSecret(existingCredentials);
    const credentials: OAuth2ClientCredentials = {
      clientId,
      clientSecret,
      accessToken: existingCredentials?.accessToken,
      expires: existingCredentials?.expires,
      scopes: existingCredentials?.scopes,
    };
    this.storeCredential(credentials);

    const manifestScopes = this._authDef.scopes || [];
    const requestedScopes =
        this._extraOAuthScopes.length > 0 ? [...manifestScopes, ...this._extraOAuthScopes] : manifestScopes;

    const {accessToken, expires} = await performOAuthClientCredentialsServerFlow({
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
    print('Access token saved!');
  }


  handleAWSAccessKey() {
    assertCondition(this._authDef.type === AuthenticationType.AWSAccessKey);
    const existingCredentials = this.checkForExistingCredential() as AWSAccessKeyCredentials | undefined;

    const endpointUrl = this.maybePromptForEndpointUrl();
    const newAccessKeyId = promptForInput(`Enter the AWS Access Key Id for this Pack:\n`);
    const newSecretAccessKey = promptForInput(`Enter the AWS Secret Access Key for this Pack:\n`, {mask: true});

    const accessKeyId = ensureNonEmptyString(newAccessKeyId || existingCredentials?.accessKeyId);
    const secretAccessKey = ensureNonEmptyString(newSecretAccessKey || existingCredentials?.secretAccessKey);

    this.storeCredential({accessKeyId, secretAccessKey, endpointUrl});
    print('Credentials updated!');
  }

  handleAWSAssumeRole() {
    assertCondition(this._authDef.type === AuthenticationType.AWSAssumeRole);
    const existingCredentials = this.checkForExistingCredential() as AWSAssumeRoleCredentials | undefined;

    const endpointUrl = this.maybePromptForEndpointUrl();
    const newRoleArn = promptForInput(`Enter the AWS Role ARN for this Pack:\n`);
    const externalId = promptForInput(`[Optional] Enter the External ID for this Pack:\n`, {mask: true});

    const roleArn = ensureNonEmptyString(newRoleArn || existingCredentials?.roleArn);

    this.storeCredential({roleArn, externalId, endpointUrl});
    print('Credentials updated!');
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
