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

const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaFromCLI} from 'packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[4];
  const module = await import(manifestPath);
  await executeFormulaFromCLI(process.argv.slice(5), module);
}

void main();`;

function handleExecute({manifestPath, formulaName, params}: Arguments<ExecuteArgs>) {
  const manifestFullPath = manifestPath.startsWith('/') ? manifestPath : path.join(process.cwd(), manifestPath);
  spawnSync(`ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${manifestFullPath} ${formulaName} ${params.join(' ')}`, {
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
    .help().argv;
}
