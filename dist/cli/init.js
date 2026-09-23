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
const helpers_2 = require("../testing/helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const PacksExamplesPackage = '@codahq/packs-examples';
const GitIgnoreEntries = ['.coda.json', '.coda-credentials.json'];
// Each dependency spec is double-quoted for the shell. These are the characters that stay special inside
// double quotes in sh ($, `, ", \) or in cmd.exe (%, "), plus line breaks, which end a command in both.
const UnsafeSpecCharacters = /[$`"\\%\r\n]/;
function getNpmRoot() {
    const { status, stdout } = (0, helpers_4.spawnProcess)('npm prefix', { stdio: 'pipe' });
    const npmRoot = status === 0 ? stdout.toString().trim() : '';
    if (!npmRoot) {
        return (0, helpers_2.printAndExit)('The packs init command requires npm to be installed and available in your path. ' +
            'See https://nodejs.org/en/download for suggested ways to install.');
    }
    return fs_extra_1.default.realpathSync(npmRoot);
}
// `npm ls` exits non-zero when the package is installed but has a problem, such as a version that no
// longer matches package.json, so read the listing instead of the exit code.
function isInstalled(packageName) {
    var _a, _b;
    const { stdout } = (0, helpers_4.spawnProcess)(`npm ls ${packageName} --json --depth=0`, { stdio: 'pipe' });
    try {
        return Boolean((_b = (_a = JSON.parse(stdout.toString()).dependencies) === null || _a === void 0 ? void 0 : _a[packageName]) === null || _b === void 0 ? void 0 : _b.version);
    }
    catch {
        return false;
    }
}
function isGitAvailable() {
    return (0, helpers_4.spawnProcess)('git --version').status === 0;
}
async function handleInit({ yes } = {}) {
    var _a, _b;
    // Warn before clobbering an existing pack.ts, since init copies the template over it.
    if (fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), 'pack.ts'))) {
        (0, confirm_1.confirmOrFail)({
            yes,
            prompt: 'A pack.ts file already exists. Do you want to overwrite it? (y/N)?',
            example: 'packs init --yes',
        });
    }
    // npm installs into the nearest ancestor directory containing a package.json, so a Pack created
    // anywhere else would have its dependencies added to that directory instead of this one.
    const npmRoot = getNpmRoot();
    if (npmRoot !== fs_extra_1.default.realpathSync(process.cwd())) {
        return (0, helpers_2.printAndExit)(`npm installs packages into ${npmRoot}, so a Pack created here would have its dependencies added there ` +
            'instead. Run "npm init -y" here first to create the Pack in this directory, or run this command ' +
            `in ${npmRoot}.`);
    }
    const isPacksExamplesInstalled = isInstalled(PacksExamplesPackage);
    // Once we have installed the examples ourselves, every way out removes them again.
    function removePacksExamples() {
        if (!isPacksExamplesInstalled && (0, helpers_4.spawnProcess)(`npm uninstall ${PacksExamplesPackage}`).status !== 0) {
            (0, helpers_1.print)(`The Pack examples could not be removed. Run "npm uninstall ${PacksExamplesPackage}" to remove them.`);
        }
    }
    function exit(message) {
        removePacksExamples();
        return (0, helpers_2.printAndExit)(message);
    }
    if (!isPacksExamplesInstalled) {
        if (!isGitAvailable()) {
            return (0, helpers_2.printAndExit)('The packs init command requires git to be installed and available in your path. ' +
                'See https://git-scm.com/downloads for suggested ways to install.');
        }
        if ((0, helpers_4.spawnProcess)(`npm install https://github.com/coda/packs-examples.git`).status !== 0) {
            return (0, helpers_2.printAndExit)('The packs init command could not install the Pack examples. ' +
                'Check that you can reach https://github.com/coda/packs-examples and try again.');
        }
    }
    let packsExamplesDirectory;
    try {
        packsExamplesDirectory = (0, helpers_3.resolvePackageDirectory)(PacksExamplesPackage);
    }
    catch (error) {
        return exit(`The Pack examples are installed, but ${PacksExamplesPackage} could not be resolved from ${process.cwd()} ` +
            `(${(_a = error.code) !== null && _a !== void 0 ? _a : error.message}).`);
    }
    const packageJson = JSON.parse(fs_extra_1.default.readFileSync(path_1.default.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
    const devDependencies = (_b = packageJson.devDependencies) !== null && _b !== void 0 ? _b : {};
    const devDependencySpecs = Object.entries(devDependencies).map(([name, version]) => `${name}@${version}`);
    const unsafeSpec = devDependencySpecs.find(spec => UnsafeSpecCharacters.test(spec));
    if (unsafeSpec) {
        return exit(`The Pack examples declare a development dependency that cannot be installed safely: ${unsafeSpec}`);
    }
    const quotedSpecs = devDependencySpecs.map(spec => `"${spec}"`).join(' ');
    if ((0, helpers_4.spawnProcess)(`npm install --save-dev ${quotedSpecs}`).status !== 0) {
        return exit('The packs init command could not install the Pack development dependencies.');
    }
    if (!isInstalled('@codahq/packs-sdk') && (0, helpers_4.spawnProcess)('npm install --save @codahq/packs-sdk').status !== 0) {
        return exit('The packs init command could not install @codahq/packs-sdk.');
    }
    const templateDirectory = path_1.default.join(packsExamplesDirectory, 'examples/template');
    if (!fs_extra_1.default.existsSync(templateDirectory)) {
        return exit(`The packs init command could not find the Pack template in ${templateDirectory}.`);
    }
    fs_extra_1.default.copySync(templateDirectory, process.cwd());
    // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
    // in the template example alongside the other files. So we just create it explicitly
    // here as part of the init step, adding only what is missing and starting on a new line.
    const gitIgnoreFile = path_1.default.join(process.cwd(), '.gitignore');
    const gitIgnore = fs_extra_1.default.existsSync(gitIgnoreFile) ? fs_extra_1.default.readFileSync(gitIgnoreFile, 'utf-8') : '';
    const missingEntries = GitIgnoreEntries.filter(entry => !gitIgnore.split(/\r?\n/).includes(entry));
    if (missingEntries.length) {
        const separator = gitIgnore && !gitIgnore.endsWith('\n') ? '\n' : '';
        fs_extra_1.default.appendFileSync(gitIgnoreFile, `${separator}${missingEntries.join('\n')}\n`);
    }
    // The Pack is usable at this point, so failing to clean up the examples is only worth a warning.
    removePacksExamples();
}
exports.handleInit = handleInit;
