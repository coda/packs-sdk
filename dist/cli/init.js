"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInit = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../testing/helpers");
const helpers_2 = require("../testing/helpers");
const helpers_3 = require("./helpers");
const GitIgnore = `.coda.json
.coda-credentials.json
`;
function getNpmRoot() {
    const { status, stdout } = (0, helpers_3.spawnProcess)('npm prefix', { stdio: 'pipe' });
    const npmRoot = status === 0 ? stdout.toString().trim() : '';
    if (!npmRoot) {
        return (0, helpers_2.printAndExit)('The packs init command requires npm to be installed and available in your path. ' +
            'See https://nodejs.org/en/download for suggested ways to install.');
    }
    return fs_extra_1.default.realpathSync(npmRoot);
}
// npm may hoist the examples above the npm root, so ask Node where they actually landed instead of
// assuming they are in the nearest node_modules.
function getPacksExamplesDirectory() {
    try {
        return path_1.default.dirname(require.resolve('@codahq/packs-examples/package.json', { paths: [process.cwd()] }));
    }
    catch (error) {
        return (0, helpers_2.printAndExit)(`The packs init command could not find @codahq/packs-examples from ${process.cwd()}. ` +
            'Check that you can reach https://github.com/coda/packs-examples and try again.');
    }
}
function isGitAvailable() {
    return (0, helpers_3.spawnProcess)('git --version').status === 0;
}
// By no means comprehensive, just an attempt to cover characters that can appear in a package.json declaration.
function escapeShellCmd(cmd) {
    return cmd.replace(/>/g, '\\>').replace(/</g, '\\<');
}
async function handleInit() {
    // npm installs into the nearest ancestor directory containing a package.json, so a Pack created
    // anywhere else would have its dependencies added to that directory instead of this one.
    const npmRoot = getNpmRoot();
    if (npmRoot !== fs_extra_1.default.realpathSync(process.cwd())) {
        return (0, helpers_2.printAndExit)(`npm installs packages into ${npmRoot}, so a Pack created here would have its dependencies added there ` +
            'instead. Run "npm init -y" here first to create the Pack in this directory, or run the packs init ' +
            `command in ${npmRoot}.`);
    }
    const isPacksExamplesInstalled = (0, helpers_3.spawnProcess)('npm list @codahq/packs-examples').status === 0;
    if (!isPacksExamplesInstalled) {
        if (!isGitAvailable()) {
            return (0, helpers_2.printAndExit)('The packs init command requires git to be installed and available in your path. ' +
                'See https://git-scm.com/downloads for suggested ways to install.');
        }
        if ((0, helpers_3.spawnProcess)(`npm install https://github.com/coda/packs-examples.git`).status !== 0) {
            return (0, helpers_2.printAndExit)('The packs init command could not install the Pack examples. ' +
                'Check that you can reach https://github.com/coda/packs-examples and try again.');
        }
    }
    const packsExamplesDirectory = getPacksExamplesDirectory();
    const packageJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
    const devDependencies = packageJson.devDependencies;
    const devDependencyPackages = Object.keys(devDependencies)
        .map(dependency => `${dependency}@${devDependencies[dependency]}`)
        .join(' ');
    if ((0, helpers_3.spawnProcess)(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`)).status !== 0) {
        return (0, helpers_2.printAndExit)('The packs init command could not install the Pack development dependencies.');
    }
    if ((0, helpers_3.spawnProcess)('npm list @codahq/packs-sdk --depth=0').status !== 0 &&
        (0, helpers_3.spawnProcess)('npm install --save @codahq/packs-sdk').status !== 0) {
        return (0, helpers_2.printAndExit)('The packs init command could not install @codahq/packs-sdk.');
    }
    const templateDirectory = path_1.default.join(packsExamplesDirectory, 'examples/template');
    if (!fs_extra_1.default.existsSync(templateDirectory)) {
        return (0, helpers_2.printAndExit)(`The packs init command could not find the Pack template in ${templateDirectory}.`);
    }
    fs_extra_1.default.copySync(templateDirectory, process.cwd());
    // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
    // in the template example alongside the other files. So we just create it explicitly
    // here as part of the init step.
    fs_extra_1.default.appendFileSync(path_1.default.join(process.cwd(), '.gitignore'), GitIgnore);
    // The Pack is usable at this point, so failing to clean up the examples is only worth a warning.
    if (!isPacksExamplesInstalled && (0, helpers_3.spawnProcess)('npm uninstall @codahq/packs-examples').status !== 0) {
        (0, helpers_1.print)('The Pack examples could not be removed. Run "npm uninstall @codahq/packs-examples" to remove them.');
    }
}
exports.handleInit = handleInit;
