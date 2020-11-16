import type {AllCredentials} from './auth_types';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from './auth_types';
import type {MultiQueryParamCredentials} from './auth_types';
import {ensureUnreachable} from '../helpers/ensure';
import fs from 'fs';
import {getManifestFromModule} from './helpers';
import path from 'path';
import {print} from './helpers';
import {printAndExit} from './helpers';
import readline from 'readline';

interface SetupAuthOptions {
  credentialsFile?: string;
}

const DEFAULT_CREDENTIALS_FILE = '.coda/credentials.json';

export async function setupAuth(module: any, opts: SetupAuthOptions = {}): Promise<void> {
  const {name, defaultAuthentication} = getManifestFromModule(module);
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
    case AuthenticationType.OAuth2:
      throw new Error('Not yet implemented');
    default:
      return ensureUnreachable(defaultAuthentication);
  }
}

class CredentialHandler {
  // TODO: Rename with underscores
  private readonly packName: string;
  private readonly authDef: Authentication;
  private readonly credentialsFile: string;

  constructor(
    packName: string,
    authDef: Authentication,
    {credentialsFile = DEFAULT_CREDENTIALS_FILE}: SetupAuthOptions,
  ) {
    this.packName = packName;
    this.authDef = authDef;
    this.credentialsFile = credentialsFile;
  }

  async checkForExistingCredential() {
    const existingCredentials = readCredentialsFile(this.credentialsFile);
    if (existingCredentials && existingCredentials[this.packName]) {
      const input = await this.promptForInput(
        `Credentials already exist for ${this.packName}, press "y" to overwrite or "n" to cancel: `,
      );
      if (input.toLocaleLowerCase() !== 'y') {
        return process.exit(1);
      }
    }
  }

  async handleToken() {
    await this.checkForExistingCredential();
    const endpointUrl = await this.maybePromptForEndpointUrl();
    const input = await this.promptForInput(`Paste the token or API key to use for ${this.packName}:\n`);
    this.storeCredential({endpointUrl, token: input});
    print('Credentials updated!');
  }

  async handleWebBasic() {
    await this.checkForExistingCredential();
    const endpointUrl = await this.maybePromptForEndpointUrl();
    const username = await this.promptForInput(`Enter the username for ${this.packName}:\n`);
    const password = await this.promptForInput(`Enter the password for ${this.packName} (if any):\n`);
    this.storeCredential({endpointUrl, username, password});
    print('Credentials updated!');
  }

  async handleQueryParam(paramName: string) {
    if (!paramName) {
      printAndExit(
        `Please provide a paramName attribute in the defaultAuthentication section of the ${this.packName} pack definition.`,
      );
    }
    await this.checkForExistingCredential();
    const endpointUrl = await this.maybePromptForEndpointUrl();
    const input = await this.promptForInput(
      `Enter the token to use for the "${paramName}" url param for ${this.packName}:\n`,
    );
    this.storeCredential({endpointUrl, token: input});
    print('Credentials updated!');
  }

  async handleMultiQueryParams(
    paramDefs: Array<{
      name: string;
      description: string;
    }>,
  ) {
    if (paramDefs.length === 0) {
      printAndExit(
        `Please define one or more entries for "params" in the defaultAuthentication section of the ${this.packName} pack definition.`,
      );
    }

    await this.checkForExistingCredential();
    const endpointUrl = await this.maybePromptForEndpointUrl();
    const credentials: MultiQueryParamCredentials = {endpointUrl, params: {}};
    for (const paramDef of paramDefs) {
      const paramValue = await this.promptForInput(
        `Enter the token to use for the "${paramDef.name}" url param for ${this.packName}:\n`,
      );
      credentials.params[paramDef.name] = paramValue;
    }
    this.storeCredential(credentials);
    print('Credentials updated!');
  }

  async maybePromptForEndpointUrl() {
    if (this.authDef.type === AuthenticationType.None) {
      return;
    }
    const {requiresEndpointUrl, endpointDomain} = this.authDef;
    if (!requiresEndpointUrl) {
      return;
    }
    const placeholder = endpointDomain
      ? `https://my-site.${endpointDomain}`
      : `https://${this.packName.toLowerCase()}.example.com`;
    return this.promptForInput(`Enter the endpoint url for ${this.packName} (for example, ${placeholder}):\n`);
  }

  storeCredential(credentials: Credentials): void {
    storeCredential(this.credentialsFile, this.packName, credentials);
  }

  async promptForInput(prompt: string): Promise<string> {
    const rl = readlineInterface();
    return new Promise(resolve =>
      rl.question(prompt, input => {
        rl.close();
        resolve(input);
      }),
    );
  }
}

function storeCredential(credentialsFile: string, packName: string, credentials: Credentials): void {
  const allCredentials: AllCredentials = readCredentialsFile(credentialsFile) || {};
  allCredentials[packName] = credentials;
  writeCredentialsFile(credentialsFile, allCredentials);
}

export function readCredentialsFile(credentialsFile: string = DEFAULT_CREDENTIALS_FILE): AllCredentials | undefined {
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

function readlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
}
