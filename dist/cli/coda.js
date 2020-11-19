#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execution_1 = require("../testing/execution");
const path_1 = __importDefault(require("path"));
const auth_1 = require("../testing/auth");
const child_process_1 = require("child_process");
const yargs_1 = __importDefault(require("yargs"));
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
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile});
}

void main();`;
function makeManifestFullPath(manifestPath) {
    return manifestPath.startsWith('/') ? manifestPath : path_1.default.join(process.cwd(), manifestPath);
}
function handleExecute({ manifestPath, formulaName, params, fetch, credentialsFile }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullManifestPath = makeManifestFullPath(manifestPath);
        // If the given manifest source file is a .ts file, we need to evalute it using ts-node in the user's environment.
        // We can reasonably assume the user has ts-node if they have built a pack definition using a .ts file.
        // Otherwise, the given manifest is most likely a plain .js file or a post-build .js dist file from a TS build.
        // In the latter case, we can import the given file as a regular node (non-TS) import without any bootstrapping.
        if (isTypescript(manifestPath)) {
            const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${credentialsFile || '""'} ${formulaName} ${params.join(' ')}`;
            spawnProcess(tsCommand);
        }
        else {
            const module = yield Promise.resolve().then(() => __importStar(require(fullManifestPath)));
            yield execution_1.executeFormulaOrSyncFromCLI({
                formulaName,
                params,
                module,
                contextOptions: { useRealFetcher: fetch, credentialsFile },
            });
        }
    });
}
function handleAuth({ manifestPath, credentialsFile }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullManifestPath = makeManifestFullPath(manifestPath);
        if (isTypescript(manifestPath)) {
            const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${credentialsFile || '""'}`;
            spawnProcess(tsCommand);
        }
        else {
            const module = yield Promise.resolve().then(() => __importStar(require(fullManifestPath)));
            yield auth_1.setupAuthFromModule(module, { credentialsFile });
        }
    });
}
function isTypescript(path) {
    return path.toLowerCase().endsWith('.ts');
}
function spawnProcess(command) {
    let cmd = command;
    // Hack to allow us to run this CLI tool for testing purposes from within this repo, without
    // needing it installed as an npm package.
    if (process.argv[1].endsWith('coda.ts')) {
        cmd = command.replace('packs-sdk/dist', '.');
    }
    child_process_1.spawnSync(cmd, {
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
