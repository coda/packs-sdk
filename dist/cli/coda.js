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
const auth_1 = require("../testing/auth");
const auth_2 = require("../testing/auth");
const execution_1 = require("../testing/execution");
const path_1 = __importDefault(require("path"));
const auth_3 = require("../testing/auth");
const child_process_1 = require("child_process");
const yargs_1 = __importDefault(require("yargs"));
const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaOrSyncFromCLI} from 'packs-sdk/dist/testing/execution';

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
import {setupAuthFromModule} from 'packs-sdk/dist/testing/auth';

async function main() {
  const manifestPath = process.argv[1];
  const credentialsFile = process.argv[2] || undefined;
  const oauthServerPort = process.argv[3] ? parseInt(process.argv[3]) : undefined;
  const module = await import(manifestPath);
  await setupAuthFromModule(module, {credentialsFile, oauthServerPort});
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
            const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${credentialsFile || '""'} ${formulaName} ${params.map(escapeShellArg).join(' ')}`;
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
function handleAuth({ manifestPath, credentialsFile, oauthServerPort }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullManifestPath = makeManifestFullPath(manifestPath);
        if (isTypescript(manifestPath)) {
            const tsCommand = `ts-node -e "${AUTH_BOOTSTRAP_CODE}" ${fullManifestPath} ${credentialsFile || '""'} ${oauthServerPort || '""'}`;
            spawnProcess(tsCommand);
        }
        else {
            const module = yield Promise.resolve().then(() => __importStar(require(fullManifestPath)));
            yield auth_3.setupAuthFromModule(module, { credentialsFile, oauthServerPort });
        }
    });
}
function handleInit() {
    return __awaiter(this, void 0, void 0, function* () {
        let isPacksExamplesInstalled;
        try {
            const listNpmPackages = spawnProcess('npm list coda-packs-examples');
            isPacksExamplesInstalled = listNpmPackages.status === 0;
        }
        catch (error) {
            isPacksExamplesInstalled = false;
        }
        if (!isPacksExamplesInstalled) {
            const installCommand = `npm install https://<coda-packs-examples-cli-token>:x-oauth-basic@github.com/kr-project/packs-examples`;
            spawnProcess(installCommand);
        }
        const copyCommand = `cp -r node_modules/coda-packs-examples/examples/template ${process.cwd()}`;
        spawnProcess(copyCommand);
        if (!isPacksExamplesInstalled) {
            const uninstallCommand = `npm uninstall coda-packs-examples`;
            spawnProcess(uninstallCommand);
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
    return child_process_1.spawnSync(cmd, {
        shell: true,
        stdio: 'inherit',
    });
}
function escapeShellArg(arg) {
    return `"${arg.replace(/(["'$`\\])/g, '\\$1')}"`;
}
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    yargs_1.default
        .parserConfiguration({ 'parse-numbers': false })
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
                default: auth_1.DEFAULT_CREDENTIALS_FILE,
                desc: 'Path to the credentials file.',
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
                default: auth_1.DEFAULT_CREDENTIALS_FILE,
                desc: 'Path to the credentials file.',
            },
            oauthServerPort: {
                alias: 'oauth_server_port',
                number: true,
                default: auth_2.DEFAULT_OAUTH_SERVER_PORT,
                desc: 'Port to use for the local server that handles OAuth setup.',
            },
        },
    })
        .command({
        command: 'init',
        describe: 'Initialize an empty pack',
        handler: handleInit,
    })
        .demandCommand()
        .help().argv;
}
