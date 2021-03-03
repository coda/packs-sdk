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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecute = void 0;
const helpers_1 = require("./helpers");
const execution_1 = require("../testing/execution");
const helpers_2 = require("./helpers");
const helpers_3 = require("./helpers");
const helpers_4 = require("./helpers");
const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaOrSyncFromCLI} from 'coda-packs-sdk/dist/testing/execution';

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
function handleExecute({ manifestPath, formulaName, params, fetch, credentialsFile, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullManifestPath = helpers_3.makeManifestFullPath(manifestPath);
        // If the given manifest source file is a .ts file, we need to evaluate it using ts-node in the user's environment.
        // We can reasonably assume the user has ts-node if they have built a pack definition using a .ts file.
        // Otherwise, the given manifest is most likely a plain .js file or a post-build .js dist file from a TS build.
        // In the latter case, we can import the given file as a regular node (non-TS) import without any bootstrapping.
        if (helpers_2.isTypescript(manifestPath)) {
            const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${credentialsFile || '""'} ${formulaName} ${params.map(helpers_1.escapeShellArg).join(' ')}`;
            helpers_4.spawnBootstrapCommand(tsCommand);
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
exports.handleExecute = handleExecute;
