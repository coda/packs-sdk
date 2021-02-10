#!/usr/bin/env node

import type {Arguments} from 'yargs';
import {AuthenticatingFetcher} from '../testing/fetcher';
import {AuthenticationType} from '../types';
import type {CodaApiBearerTokenAuthentication} from '../types';
import {DEFAULT_CREDENTIALS_FILE} from '../testing/auth';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import type {FetchRequest} from 'api';
import type {Options} from 'yargs';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import fs from 'fs';
import open from 'open';
import path from 'path';
import {printAndExit} from '../testing/helpers';
import {promptForInput} from '../testing/helpers';
import {readCredentialsFile} from '../testing/auth';
import {setupAuthFromModule} from '../testing/auth';
import {spawnSync} from 'child_process';
import {writeCredentialsFile} from '../testing/auth';
import yargs from 'yargs';

interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
  fetch?: boolean;
  credentialsFile?: string;
}

interface AuthArgs {
  manifestPath: string;
  credentialsFile?: string;
  oauthServerPort?: number;
}

interface RegisterArgs {
  apiToken?: string;
}

const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaOrSyncFromCLI} from 'coda-packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[1];
  const useRealFetcher = process.argv[2] === 'true';
  const credentialsFile = process.argv[3] || undefined;
  const formulaName = process.argv[4];
  const params = process.argv.slice(5);

  const module = await import(manifestPath);

  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    module,
    contextOptions: {useRealFetcher, credentialsFile},
  });
}

void main();`;

const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'coda-packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[1];
  const credentialsFile = process.argv[2] || undefined;
  const oauthServerPort = process.argv[3] ? parseInt(process.argv[3]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
}

void main();`;

const PACKS_EXAMPLES_DIRECTORY = 'node_modules/coda-packs-examples';
const API_TOKEN_FILE_PATH = '.coda/credentials.json';

function makeManifestFullPath(manifestPath: string): string {
  return manifestPath.startsWith('/') ? manifestPath : path.join(process.cwd(), manifestPath);
}

async function handleExecute({manifestPath, formulaName, params, fetch, credentialsFile}: Arguments<ExecuteArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  // If the given manifest source file is a .ts file, we need to evalute it using ts-node in the user's environment.
  // We can reasonably assume the user has ts-node if they have built a pack definition using a .ts file.
  // Otherwise, the given manifest is most likely a plain .js file or a post-build .js dist file from a TS build.
  // In the latter case, we can import the given file as a regular node (non-TS) import without any bootstrapping.
  if (isTypescript(manifestPath)) {
    const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${
      credentialsFile || '""'
    } ${formulaName} ${params.map(escapeShellArg).join(' ')}`;
    spawnProcess(tsCommand);
  } else {
    const module = await import(fullManifestPath);
    await executeFormulaOrSyncFromCLI({
      formulaName,
      params,
      module,
      contextOptions: {useRealFetcher: fetch, credentialsFile},
    });
  }
}

async function handleAuth({manifestPath, credentialsFile, oauthServerPort}: Arguments<AuthArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  if (isTypescript(manifestPath)) {
    const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${credentialsFile || '""'} ${
      oauthServerPort || '""'
    }`;
    spawnProcess(tsCommand);
  } else {
    const module = await import(fullManifestPath);
    await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
  }
}

async function handleInit() {
  let isPacksExamplesInstalled: boolean;
  try {
    const listNpmPackages = spawnProcess('npm list coda-packs-examples');
    isPacksExamplesInstalled = listNpmPackages.status === 0;
  } catch (error) {
    isPacksExamplesInstalled = false;
  }

  if (!isPacksExamplesInstalled) {
    // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
    const installCommand = `npm install git+ssh://github.com/kr-project/packs-examples.git`;
    spawnProcess(installCommand);
  }

  const packageJson = JSON.parse(fs.readFileSync(`${PACKS_EXAMPLES_DIRECTORY}/package.json`, 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(`npm install --save-dev ${devDependencyPackages}`);

  const copyCommand = `cp -r ${PACKS_EXAMPLES_DIRECTORY}/examples/template/* ${process.cwd()}`;
  spawnProcess(copyCommand);

  if (!isPacksExamplesInstalled) {
    const uninstallCommand = `npm uninstall coda-packs-examples`;
    spawnProcess(uninstallCommand);
  }
}

async function handleRegister({apiToken}: Arguments<RegisterArgs>) {
  if (!apiToken) {
    await open('https://coda.io/account');
    apiToken = promptForInput(
      'No API token provided. Please visit coda.io/account to create one and paste the token here: ',
      {mask: true},
    );
  }

  const auth: CodaApiBearerTokenAuthentication = {
    type: AuthenticationType.CodaApiHeaderBearerToken,
  };
  const fetcher = new AuthenticatingFetcher(auth, {token: apiToken});
  const request: FetchRequest = {
    method: 'GET',
    url: 'https://coda.io/apis/v1/whoami',
  };

  try {
    await fetcher.fetch(request);
  } catch (err) {
    const {statusCode, message} = JSON.parse(err.error);
    printAndExit(`Invalid API token provided: ${statusCode} ${message}`);
  }

  const existingCredentials = readCredentialsFile(API_TOKEN_FILE_PATH);
  if (existingCredentials) {
    const input = promptForInput(
      `API token file ${API_TOKEN_FILE_PATH} already exists, press "y" to overwrite or "n" to cancel: `,
    );
    if (input.toLocaleLowerCase() !== 'y') {
      return process.exit(1);
    }
  }
  writeCredentialsFile(API_TOKEN_FILE_PATH, {Coda: {token: apiToken}});
}

function isTypescript(path: string): boolean {
  return path.toLowerCase().endsWith('.ts');
}

function spawnProcess(command: string) {
  let cmd = command;
  // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
  // needing it installed as an npm package.
  if (process.argv[1].endsWith('coda.ts')) {
    cmd = command.replace('coda-packs-sdk/dist', '.');
  }

  return spawnSync(cmd, {
    shell: true,
    stdio: 'inherit',
  });
}

function escapeShellArg(arg: string): string {
  return `"${arg.replace(/(["'$`\\])/g, '\\$1')}"`;
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs
    .parserConfiguration({'parse-numbers': false})
    .command({
      command: 'execute <manifestPath> <formulaName> [params..]',
      describe: 'Execute a formula',
      handler: handleExecute,
      builder: {
        fetch: {
          boolean: true,
          desc: 'Actually fetch http requests instead of using mocks. Run "coda auth" first to set up credentials.',
        } as Options,
        credentialsFile: {
          alias: 'credentials_file',
          string: true,
          default: DEFAULT_CREDENTIALS_FILE,
          desc: 'Path to the credentials file.',
        } as Options,
      },
    })
    .command({
      command: 'auth <manifestPath>',
      describe: 'Set up authentication for a pack',
      handler: handleAuth,
      builder: {
        credentialsFile: {
          alias: 'credentials_file',
          string: true,
          default: DEFAULT_CREDENTIALS_FILE,
          desc: 'Path to the credentials file.',
        } as Options,
        oauthServerPort: {
          alias: 'oauth_server_port',
          number: true,
          default: DEFAULT_OAUTH_SERVER_PORT,
          desc: 'Port to use for the local server that handles OAuth setup.',
        } as Options,
      },
    })
    .command({
      command: 'init',
      describe: 'Initialize an empty pack',
      handler: handleInit,
    })
    .command({
      command: 'register',
      describe: 'Register API token to publish a pack',
      handler: handleRegister,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
