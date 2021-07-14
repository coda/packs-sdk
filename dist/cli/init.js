"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInit = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const PACKS_EXAMPLES_DIRECTORY = 'node_modules/@codahq/packs-examples';
async function handleInit() {
    let isPacksExamplesInstalled;
    try {
        const listNpmPackages = helpers_1.spawnProcess('npm list @codahq/packs-examples');
        isPacksExamplesInstalled = listNpmPackages.status === 0;
    }
    catch (error) {
        isPacksExamplesInstalled = false;
    }
    if (!isPacksExamplesInstalled) {
        // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
        const installCommand = `npm install git+ssh://github.com/coda/packs-examples.git`;
        helpers_1.spawnProcess(installCommand);
    }
    const packageJson = JSON.parse(fs_1.default.readFileSync(`${PACKS_EXAMPLES_DIRECTORY}/package.json`, 'utf-8'));
    const devDependencies = packageJson.devDependencies;
    const devDependencyPackages = Object.keys(devDependencies)
        .map(dependency => `${dependency}@${devDependencies[dependency]}`)
        .join(' ');
    helpers_1.spawnProcess(`npm install --save-dev ${devDependencyPackages}`);
    const copyCommand = `cp -r ${PACKS_EXAMPLES_DIRECTORY}/examples/template/* ${process.cwd()}`;
    helpers_1.spawnProcess(copyCommand);
    if (!isPacksExamplesInstalled) {
        const uninstallCommand = `npm uninstall @codahq/packs-examples`;
        helpers_1.spawnProcess(uninstallCommand);
    }
}
exports.handleInit = handleInit;
