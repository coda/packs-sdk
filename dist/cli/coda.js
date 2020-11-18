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
import {executeFormulaOrSyncFromCLI} from 'packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[4];
  const useRealFetcher = process.argv[5] === 'true';
  const credentialsFile = process.argv[6] || undefined;
  const module = await import(manifestPath);
  await executeFormulaOrSyncFromCLI(process.argv.slice(7), module, {useRealFetcher, credentialsFile});
}

void main();`;
const AUTH_BOOTSTRAP_CODE = `
import {setupAuthFromModule} from 'packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[4];
  const credentialsFile = process.argv[5] || undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile});
}

void main();`;
function makeManifestFullPath(manifestPath) {
    return manifestPath.startsWith('/') ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
}
function handleExecute({ manifestPath, formulaName, params, fetch, credentialsFile }) {
    child_process_1.spawnSync(`ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)} ${Boolean(fetch)} ${credentialsFile || '""'} ${formulaName} ${params.join(' ')}`, {
        shell: true,
        stdio: 'inherit',
    });
}
function handleAuth({ manifestPath, credentialsFile }) {
    child_process_1.spawnSync(`ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${makeManifestFullPath(manifestPath)} ${credentialsFile || '""'}`, {
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
        builder: {
            fetch: {
                boolean: true,
                desc: 'Actually fetch http requests instead of using mocks. Run "coda auth" first to set up credentials.',
            },
            credentialsFile: {
                alias: 'credentials_file',
                string: true,
                desc: 'Path to the credentials file, if different than .coda/credentials.json',
            },
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
                desc: 'Path to the credentials file, if different than .coda/credentials.json',
            },
        },
    })
        .demandCommand()
        .help().argv;
}
