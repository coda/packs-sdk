#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const yargs_1 = __importDefault(require("yargs"));
const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaFromCLI} from 'packs-sdk';

async function main() {
  const manifestPath = process.argv[4];
  const module = await import(manifestPath);
  await executeFormulaFromCLI(process.argv.slice(5), module);
}

void main();`;
function handleExecute({ manifestPath, formulaName, params }) {
    const manifestFullPath = manifestPath.startsWith('/') ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
    child_process_1.spawnSync(`ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${manifestFullPath} ${formulaName} ${params.join(' ')}`, {
        shell: true,
        stdio: 'inherit',
    });
}
// tslint:disable-next-line:no-unused-expression
yargs_1.default
    .command({
    command: 'execute <manifestPath> <formulaName> [params..]',
    describe: 'Execute a formula',
    handler: handleExecute,
})
    .help().argv;
