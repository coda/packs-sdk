"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInit = void 0;
const confirm_1 = require("./confirm");
const fs_extra_1 = __importDefault(require("fs-extra"));
const helpers_1 = require("./helpers");
const path_1 = __importDefault(require("path"));
const helpers_2 = require("../testing/helpers");
const agent_template_1 = require("./agent_template");
const helpers_3 = require("./helpers");
const PacksExamplesDirectory = 'node_modules/@codahq/packs-examples';
const GitIgnore = `.coda.json
.coda-credentials.json
`;
function updateMoldSourceMap() {
    // unfortuanately Windows has no grep.
    const packageFileName = 'node_modules/mold-source-map/package.json';
    const lines = fs_extra_1.default.readFileSync(packageFileName).toString().split('\n');
    const validLines = lines.filter(line => !line.includes('"main":'));
    fs_extra_1.default.writeFileSync(packageFileName, validLines.join('\n'));
}
function addPatches() {
    (0, helpers_3.spawnProcess)(`npm set-script postinstall "npx patch-package"`);
    updateMoldSourceMap();
    (0, helpers_3.spawnProcess)(`npx patch-package --exclude 'nothing' mold-source-map`);
}
function isGitAvailable() {
    return (0, helpers_3.spawnProcess)('git --version').status === 0;
}
// By no means comprehensive, just an attempt to cover characters that can appear in a package.json declaration.
function escapeShellCmd(cmd) {
    return cmd.replace('>', '\\>').replace('<', '\\<');
}
// Warn before clobbering an existing pack.ts, since init copies the template over it.
function confirmPackOverwrite({ yes, example }) {
    if (fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), 'pack.ts'))) {
        (0, confirm_1.confirmOrFail)({
            yes,
            prompt: 'A pack.ts file already exists. Do you want to overwrite it? (y/N)?',
            example,
        });
    }
}
async function getCliSdkVersion() {
    // Since package.json isn't in dist, we grab it from the root directory instead.
    const packageJson = await Promise.resolve(`${(0, helpers_1.isTestCommand)() ? '../package.json' : '../../package.json'}`).then(s => __importStar(require(s)));
    return packageJson.version;
}
// Installs the SDK when missing. A pinned version keeps a stale pre-agent SDK
// from shadowing the scaffold with `sdk.newAgent is not a function`.
async function ensurePackSdkInstalled(version) {
    if ((0, helpers_3.spawnProcess)('npm list @codahq/packs-sdk --depth=0').status !== 0) {
        (0, helpers_3.spawnProcess)(`npm install --save @codahq/packs-sdk${version ? `@${version}` : ''}`);
    }
}
function appendGitIgnore() {
    fs_extra_1.default.appendFileSync(path_1.default.join(process.cwd(), '.gitignore'), GitIgnore);
}
async function handleInit({ yes, agent, name } = {}) {
    if (agent) {
        return handleAgentInit({ yes, name });
    }
    confirmPackOverwrite({ yes, example: 'packs init --yes' });
    // stdout looks like `8.1.2\n`.
    const npmVersion = parseInt((0, helpers_3.spawnProcess)('npm -v', { stdio: 'pipe' }).stdout.toString().trim().split('.', 1)[0], 10);
    if (npmVersion < 7) {
        // need npm 7 to support "npm set-script"
        throw new Error(`Your npm version is older than 7. Please upgrade npm to at least 7 with "npm install -g npm@7"`);
    }
    let isPacksExamplesInstalled;
    try {
        const listNpmPackages = (0, helpers_3.spawnProcess)('npm list @codahq/packs-examples');
        isPacksExamplesInstalled = listNpmPackages.status === 0;
    }
    catch (error) {
        isPacksExamplesInstalled = false;
    }
    if (!isPacksExamplesInstalled) {
        if (!isGitAvailable()) {
            return (0, helpers_2.printAndExit)('The packs init command requires git to be installed and available in your path. ' +
                'See https://git-scm.com/downloads for suggested ways to install.');
        }
        const installCommand = `npm install https://github.com/coda/packs-examples.git`;
        (0, helpers_3.spawnProcess)(installCommand);
    }
    const packageJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(PacksExamplesDirectory, 'package.json'), 'utf-8'));
    const devDependencies = packageJson.devDependencies;
    const devDependencyPackages = Object.keys(devDependencies)
        .map(dependency => `${dependency}@${devDependencies[dependency]}`)
        .join(' ');
    (0, helpers_3.spawnProcess)(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`));
    await ensurePackSdkInstalled();
    // developers may run in NodeJs 16 where some packages need to be patched to avoid warnings.
    addPatches();
    fs_extra_1.default.copySync(`${PacksExamplesDirectory}/examples/template`, process.cwd());
    // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
    // in the template example alongside the other files. So we just create it explicitly
    // here as part of the init step.
    appendGitIgnore();
    if (!isPacksExamplesInstalled) {
        const uninstallCommand = `npm uninstall @codahq/packs-examples`;
        (0, helpers_3.spawnProcess)(uninstallCommand);
    }
}
exports.handleInit = handleInit;
async function handleAgentInit({ yes, name }) {
    const agentName = name !== null && name !== void 0 ? name : path_1.default.basename(process.cwd());
    const packPath = path_1.default.join(process.cwd(), 'pack.ts');
    confirmPackOverwrite({ yes, example: 'packs init --agent --yes' });
    // Agent scaffolding is vendored in this package. Unlike the default path it
    // never shells out to git or github.com, so it works on machines with
    // neither.
    await ensurePackSdkInstalled(await getCliSdkVersion());
    fs_extra_1.default.writeFileSync(packPath, (0, agent_template_1.renderAgentPackTemplate)(agentName));
    appendGitIgnore();
    (0, helpers_2.printAndExit)(`Scaffolded agent "${agentName}" in pack.ts. Next: packs validate pack.ts`, 0);
}
