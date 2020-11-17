#!/usr/bin/env node

import type {Arguments} from 'yargs';
import path from 'path';
import {spawnSync} from 'child_process';
import yargs from 'yargs';

interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
}

interface AuthArgs {
  manifestPath: string;
}

const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaFromCLI} from 'packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[4];
  const module = await import(manifestPath);
  await executeFormulaFromCLI(process.argv.slice(5), module);
}

void main();`;

const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[4];
  const module = await import(manifestPath);
  await setupAuthFromModule(module);
}

void main();`;

function makeManifestFullPath(manifestPath: string): string {
  return manifestPath.startsWith('/') ? manifestPath : path.join(process.cwd(), manifestPath);
}

function handleExecute({manifestPath, formulaName, params}: Arguments<ExecuteArgs>) {
  spawnSync(
    `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)} ${formulaName} ${params.join(' ')}`,
    {
      shell: true,
      stdio: 'inherit',
    },
  );
}

function handleAuth({manifestPath}: Arguments<AuthArgs>) {
  spawnSync(`ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)}`, {
    shell: true,
    stdio: 'inherit',
  });
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  yargs
    .command({
      command: 'execute <manifestPath> <formulaName> [params..]',
      describe: 'Execute a formula',
      handler: handleExecute,
    })
    .command({
      command: 'auth <manifestPath>',
      describe: 'Set up authentication for a pack',
      handler: handleAuth,
    })

    .help().argv;
}
