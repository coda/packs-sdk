"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleExecuteBundle = void 0;
const bundle_execution_1 = require("../testing/bundle_execution");
async function handleExecuteBundle({ bundlePath, formulaName, params, fetch, credentialsFile, }) {
    await bundle_execution_1.executeFormulaOrSyncFromBundle({
        bundlePath,
        formulaName,
        params,
        _contextOptions: { useRealFetcher: fetch, credentialsFile },
    });
}
exports.handleExecuteBundle = handleExecuteBundle;
