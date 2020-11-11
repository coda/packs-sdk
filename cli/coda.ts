#!/usr/bin/env ts-node
import {Arguments} from 'yargs';
import {executeFormulaFromCLI} from '../index';
import path from 'path';
import yargs from 'yargs';

interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
}

async function handleExecute({manifestPath, formulaName, params}: Arguments<ExecuteArgs>) {
  const manifestFullPath = manifestPath.startsWith('/') ? manifestPath : path.join(process.cwd(), manifestPath);
  const module = await import(manifestFullPath);
  await executeFormulaFromCLI([formulaName, ...params], module);
}

// tslint:disable-next-line:no-unused-expression
yargs
  .command({
    command: 'execute <manifestPath> <formulaName> [params..]',
    describe: 'Execute a formula',
    handler: handleExecute,
  })
  .help().argv;
