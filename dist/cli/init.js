"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInit = void 0;
const confirm_1 = require("./confirm");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("./helpers");
const GitIgnore = `.coda.json
.coda-credentials.json
`;
// npm installs into the nearest ancestor directory containing a package.json, not into the current
// directory, so every node_modules path has to be resolved from there.
function getNpmRoot() {
    return (0, helpers_2.spawnProcess)('npm prefix', { stdio: 'pipe' }).stdout.toString().trim();
}
function isGitAvailable() {
    return (0, helpers_2.spawnProcess)('git --version').status === 0;
}
// By no means comprehensive, just an attempt to cover characters that can appear in a package.json declaration.
function escapeShellCmd(cmd) {
    return cmd.replace('>', '\\>').replace('<', '\\<');
}
async function handleInit({ yes } = {}) {
    // Warn before clobbering an existing pack.ts, since init copies the template over it.
    if (fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), 'pack.ts'))) {
        (0, confirm_1.confirmOrFail)({
            yes,
            prompt: 'A pack.ts file already exists. Do you want to overwrite it? (y/N)?',
            example: 'packs init --yes',
        });
    }
    const packsExamplesDirectory = path_1.default.join(getNpmRoot(), 'node_modules/@codahq/packs-examples');
    let isPacksExamplesInstalled;
    try {
        const listNpmPackages = (0, helpers_2.spawnProcess)('npm list @codahq/packs-examples');
        isPacksExamplesInstalled = listNpmPackages.status === 0;
    }
    catch (error) {
        isPacksExamplesInstalled = false;
    }
    if (!isPacksExamplesInstalled) {
        if (!isGitAvailable()) {
            return (0, helpers_1.printAndExit)('The packs init command requires git to be installed and available in your path. ' +
                'See https://git-scm.com/downloads for suggested ways to install.');
        }
        const installCommand = `npm install https://github.com/coda/packs-examples.git`;
        (0, helpers_2.spawnProcess)(installCommand);
    }
    const packageJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
    const devDependencies = packageJson.devDependencies;
    const devDependencyPackages = Object.keys(devDependencies)
        .map(dependency => `${dependency}@${devDependencies[dependency]}`)
        .join(' ');
    (0, helpers_2.spawnProcess)(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`));
    if ((0, helpers_2.spawnProcess)('npm list @codahq/packs-sdk --depth=0').status !== 0) {
        (0, helpers_2.spawnProcess)('npm install --save @codahq/packs-sdk');
    }
    fs_extra_1.default.copySync(path_1.default.join(packsExamplesDirectory, 'examples/template'), process.cwd());
    // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
    // in the template example alongside the other files. So we just create it explicitly
    // here as part of the init step.
    fs_extra_1.default.appendFileSync(path_1.default.join(process.cwd(), '.gitignore'), GitIgnore);
    if (!isPacksExamplesInstalled) {
        const uninstallCommand = `npm uninstall @codahq/packs-examples`;
        (0, helpers_2.spawnProcess)(uninstallCommand);
    }
}
exports.handleInit = handleInit;
