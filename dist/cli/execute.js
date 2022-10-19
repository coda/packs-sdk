"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecute = void 0;
const compile_1 = require("../testing/compile");
const execution_1 = require("../testing/execution");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
const helpers_3 = require("../testing/helpers");
const ivm_wrapper_1 = require("../testing/ivm_wrapper");
async function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, timerStrategy, maxRows, }) {
    if (vm && !(0, ivm_wrapper_1.tryGetIvm)()) {
        return (0, helpers_3.printAndExit)('The --vm flag was specified, but the isolated-vm package is not installed, likely because this package is not ' +
            'compatible with your platform. Try again but omitting the --vm flag.');
    }
    const fullManifestPath = (0, helpers_2.makeManifestFullPath)(manifestPath);
    const { bundlePath, bundleSourceMapPath } = await (0, compile_1.compilePackBundle)({
        manifestPath: fullManifestPath,
        minify: false,
        timerStrategy,
    });
    const manifest = await (0, helpers_1.importManifest)(bundlePath);
    await (0, execution_1.executeFormulaOrSyncFromCLI)({
        formulaName,
        params,
        manifest,
        manifestPath,
        vm,
        dynamicUrl,
        maxRows,
        bundleSourceMapPath,
        bundlePath,
        contextOptions: { useRealFetcher: fetch },
    });
}
exports.handleExecute = handleExecute;
