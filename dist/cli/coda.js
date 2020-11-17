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
function makeManifestFullPath(manifestPath) {
    return manifestPath.startsWith('/') ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
}
function handleExecute({ manifestPath, formulaName, params }) {
    child_process_1.spawnSync(`ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)} ${formulaName} ${params.join(' ')}`, {
        shell: true,
        stdio: 'inherit',
    });
}
function handleAuth({ manifestPath }) {
    child_process_1.spawnSync(`ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)}`, {
        shell: true,
        stdio: 'inherit',
    });
}
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    yargs_1.default
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
