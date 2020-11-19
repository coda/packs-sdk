#!/usr/bin/env node

import type {Arguments} from 'yargs';
import {DEFAULT_CREDENTIALS_FILE} from '../testing/auth';
import {DEFAULT_OAUTH_SERVER_PORT} from '../testing/auth';
import type {Options} from 'yargs';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import path from 'path';
import {setupAuthFromModule} from '../testing/auth';
import {spawnSync} from 'child_process';
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
import {executeFormulaOrSyncFromCLI} from 'packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[4];
  const useRealFetcher = process.argv[5] === 'true';
  const credentialsFile = process.argv[6] || undefined;
  const formulaName = process.argv[7];
  const params = process.argv.slice(8);

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
import {setupAuthFromModule} from 'packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[4];
  const credentialsFile = process.argv[5] || undefined;
  const oauthServerPort = process.argv[6] ? parseInt(process.argv[6]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
}

void main();`;

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

function isTypescript(path: string): boolean {
  return path.toLowerCase().endsWith('.ts');
}

function spawnProcess(command: string) {
  let cmd = command;
  // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
  // needing it installed as an npm package.
  if (process.argv[1].endsWith('coda.ts')) {
    cmd = command.replace('packs-sdk/dist', '.');
  }

  spawnSync(cmd, {
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
    .demandCommand()
    .help().argv;
}
