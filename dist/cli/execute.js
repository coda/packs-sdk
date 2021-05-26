"use strict";
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
  const vm = process.argv[3] === 'true';
  const dynamicUrl = process.argv[4]
  const formulaName = process.argv[5];
  const params = process.argv.slice(6);

  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    manifestPath,
    vm,
    dynamicUrl,
    contextOptions: {useRealFetcher},
  });
}

void main();`;
async function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, }) {
    const fullManifestPath = helpers_3.makeManifestFullPath(manifestPath);
    // If the given manifest source file is a .ts file, we need to evaluate it using ts-node in the user's environment.
    // We can reasonably assume the user has ts-node if they have built a pack definition using a .ts file.
    // Otherwise, the given manifest is most likely a plain .js file or a post-build .js dist file from a TS build.
    // In the latter case, we can import the given file as a regular node (non-TS) import without any bootstrapping.
    if (helpers_2.isTypescript(manifestPath)) {
        const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${Boolean(vm)} ${String(dynamicUrl || '""')} ${formulaName} ${params.map(helpers_1.escapeShellArg).join(' ')}`;
        helpers_4.spawnBootstrapCommand(tsCommand);
    }
    else {
        await execution_1.executeFormulaOrSyncFromCLI({
            formulaName,
            params,
            manifestPath,
            vm,
            dynamicUrl,
            contextOptions: { useRealFetcher: fetch },
        });
    }
}
exports.handleExecute = handleExecute;
