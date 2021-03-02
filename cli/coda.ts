#!/usr/bin/env node

import type {Arguments} from 'yargs';
import {DEFAULT_CREDENTIALS_FILE} from '../testing/auth';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import type {Options} from 'yargs';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import fs from 'fs';
import {handleBuild} from './build';
import {handleCreate} from './create';
import {handlePublish} from './publish';
import {handleRegister} from './register';
import {isTestCommand} from './helpers';
import path from 'path';
import {setupAuthFromModule} from '../testing/auth';
import {spawnProcess} from './helpers';
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
    spawnBootstrapCommand(tsCommand);
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
    spawnBootstrapCommand(tsCommand);
  } else {
    const module = await import(fullManifestPath);
    await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
  }
}

function spawnBootstrapCommand(command: string) {
  let cmd = command;
  // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
  // needing it installed as an npm package.
  if (isTestCommand()) {
    cmd = command.replace('coda-packs-sdk/dist', process.env.PWD!);
  }
  spawnProcess(cmd);
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

function isTypescript(path: string): boolean {
  return path.toLowerCase().endsWith('.ts');
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
      command: 'register [apiToken]',
      describe: 'Register API token to publish a pack',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handleRegister,
    })
    .command({
      command: 'build <manifestFile>',
      describe: 'Generate a bundle for your pack',
      builder: {
        compiler: {
          string: true,
          default: 'esbuild',
          desc: '`esbuild` or `webpack`',
        } as Options,
      },
      handler: handleBuild,
    })
    .command({
      command: 'publish <manifestFile>',
      describe: 'Upload your pack to Coda',
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handlePublish,
    })
    .command({
      command: 'create <packName>',
      describe: "Register a new pack with Coda's servers",
      builder: {
        codaApiEndpoint: {
          string: true,
          hidden: true,
          default: 'https://coda.io',
        } as Options,
      },
      handler: handleCreate,
    })
    .demandCommand()
    .strict()
    .help().argv;
}
