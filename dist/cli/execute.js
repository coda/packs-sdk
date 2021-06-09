"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecute = void 0;
const build_1 = require("./build");
const execution_1 = require("../testing/execution");
const helpers_1 = require("./helpers");
const helpers_2 = require("./helpers");
async function handleExecute({ manifestPath, formulaName, params, fetch, vm, dynamicUrl, }) {
    const fullManifestPath = helpers_2.makeManifestFullPath(manifestPath);
    const bundleFilename = await build_1.build(fullManifestPath);
    const manifest = await helpers_1.importManifest(bundleFilename);
    await execution_1.executeFormulaOrSyncFromCLI({
        formulaName,
        params,
        manifest,
        manifestPath,
        vm,
        dynamicUrl,
        contextOptions: { useRealFetcher: fetch },
    });
}
exports.handleExecute = handleExecute;
