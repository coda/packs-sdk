"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInit = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const PacksExamplesDirectory = 'node_modules/@codahq/packs-examples';
const GitIgnore = `.coda.json
.coda-credentials.json
`;
async function handleInit() {
    let isPacksExamplesInstalled;
    try {
        const listNpmPackages = (0, helpers_1.spawnProcess)('npm list @codahq/packs-examples');
        isPacksExamplesInstalled = listNpmPackages.status === 0;
    }
    catch (error) {
        isPacksExamplesInstalled = false;
    }
    if (!isPacksExamplesInstalled) {
        // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
        const installCommand = `npm install git+ssh://github.com/coda/packs-examples.git`;
        (0, helpers_1.spawnProcess)(installCommand);
    }
    const packageJson = JSON.parse(fs_1.default.readFileSync(`${PacksExamplesDirectory}/package.json`, 'utf-8'));
    const devDependencies = packageJson.devDependencies;
    const devDependencyPackages = Object.keys(devDependencies)
        .map(dependency => `${dependency}@${devDependencies[dependency]}`)
        .join(' ');
    (0, helpers_1.spawnProcess)(`npm install --save-dev ${devDependencyPackages}`);
    const copyCommand = `cp -r ${PacksExamplesDirectory}/examples/template/* ${process.cwd()}`;
    (0, helpers_1.spawnProcess)(copyCommand);
    // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
    // in the template example alongside the other files. So we just create it explicitly
    // here as part of the init step.
    const createIgnoreCommand = `echo "${GitIgnore}" > ${process.cwd()}/.gitignore`;
    (0, helpers_1.spawnProcess)(createIgnoreCommand);
    if (!isPacksExamplesInstalled) {
        const uninstallCommand = `npm uninstall @codahq/packs-examples`;
        (0, helpers_1.spawnProcess)(uninstallCommand);
    }
}
exports.handleInit = handleInit;
