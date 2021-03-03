"use strict";
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
exports.handleInit = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("./helpers");
const PACKS_EXAMPLES_DIRECTORY = 'node_modules/coda-packs-examples';
function handleInit() {
    return __awaiter(this, void 0, void 0, function* () {
        let isPacksExamplesInstalled;
        try {
            const listNpmPackages = helpers_1.spawnProcess('npm list coda-packs-examples');
            isPacksExamplesInstalled = listNpmPackages.status === 0;
        }
        catch (error) {
            isPacksExamplesInstalled = false;
        }
        if (!isPacksExamplesInstalled) {
            // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
            const installCommand = `npm install git+ssh://github.com/kr-project/packs-examples.git`;
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
            const uninstallCommand = `npm uninstall coda-packs-examples`;
            helpers_1.spawnProcess(uninstallCommand);
        }
    });
}
exports.handleInit = handleInit;
