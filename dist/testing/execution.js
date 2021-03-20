"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeMetadataFormula = exports.executeSyncFormulaFromPackDef = exports.executeSyncFormula = exports.executeFormulaOrSyncFromCLI = exports.executeFormulaFromPackDef = exports.executeFormula = void 0;
const coercion_1 = require("./coercion");
const bundle_execution_helper_1 = require("./bundle_execution_helper");
const bundle_execution_helper_2 = require("./bundle_execution_helper");
const bundle_execution_helper_3 = require("./bundle_execution_helper");
const helpers_1 = require("./helpers");
const fetcher_1 = require("./fetcher");
const fetcher_2 = require("./fetcher");
const mocks_1 = require("./mocks");
const mocks_2 = require("./mocks");
const helpers_2 = require("./helpers");
const bundle_execution_helper_4 = require("./bundle_execution_helper");
const bundle_execution_helper_5 = require("./bundle_execution_helper");
const validation_1 = require("./validation");
const validation_2 = require("./validation");
const bundle_execution_helper_6 = require("./bundle_execution_helper");
async function executeFormula(formula, params, context = mocks_1.newMockExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true } = {}) {
    if (shouldValidateParams) {
        validation_1.validateParams(formula, params);
    }
    let result;
    try {
        result = await formula.execute(params, context);
    }
    catch (err) {
        throw bundle_execution_helper_6.wrapError(err);
    }
    if (shouldValidateResult) {
        validation_2.validateResult(formula, result);
    }
    return result;
}
exports.executeFormula = executeFormula;
async function executeFormulaFromPackDef(packDef, formulaNameWithNamespace, params, context, options, { useRealFetcher, credentialsFile } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        executionContext = fetcher_1.newFetcherExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
    }
    const formula = bundle_execution_helper_2.findFormula(packDef, formulaNameWithNamespace);
    return executeFormula(formula, params, executionContext, options);
}
exports.executeFormulaFromPackDef = executeFormulaFromPackDef;
async function executeFormulaOrSyncFromCLI({ formulaName, params: rawParams, module, contextOptions = {}, }) {
    const manifest = helpers_1.getManifestFromModule(module);
    try {
        const formula = bundle_execution_helper_4.tryFindFormula(manifest, formulaName);
        if (formula) {
            const params = coercion_1.coerceParams(formula, rawParams);
            const result = await executeFormulaFromPackDef(manifest, formulaName, params, undefined, undefined, contextOptions);
            helpers_2.print(result);
            return;
        }
        const syncFormula = bundle_execution_helper_5.tryFindSyncFormula(manifest, formulaName);
        if (syncFormula) {
            const params = coercion_1.coerceParams(syncFormula, rawParams);
            const result = await executeSyncFormulaFromPackDef(manifest, formulaName, params, undefined, undefined, contextOptions);
            helpers_2.print(result);
            return;
        }
        throw new Error(`Pack definition for ${manifest.name} has no formula or sync called ${formulaName}.`);
    }
    catch (err) {
        helpers_2.print(err);
        process.exit(1);
    }
}
exports.executeFormulaOrSyncFromCLI = executeFormulaOrSyncFromCLI;
async function executeSyncFormula(formula, params, context = mocks_2.newMockSyncExecutionContext(), { validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true, maxIterations: maxIterations = 1000, } = {}) {
    if (shouldValidateParams) {
        validation_1.validateParams(formula, params);
    }
    const result = await bundle_execution_helper_1.executeSyncFormulaWithoutValidation(formula, params, context, maxIterations);
    if (shouldValidateResult) {
        validation_2.validateResult(formula, result);
    }
    return result;
}
exports.executeSyncFormula = executeSyncFormula;
async function executeSyncFormulaFromPackDef(packDef, syncFormulaName, params, context, options, { useRealFetcher, credentialsFile } = {}) {
    let executionContext = context;
    if (!executionContext && useRealFetcher) {
        executionContext = fetcher_2.newFetcherSyncExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
    }
    const formula = bundle_execution_helper_3.findSyncFormula(packDef, syncFormulaName);
    return executeSyncFormula(formula, params, executionContext, options);
}
exports.executeSyncFormulaFromPackDef = executeSyncFormulaFromPackDef;
async function executeMetadataFormula(formula, metadataParams = {}, context = mocks_1.newMockExecutionContext()) {
    const { search, formulaContext } = metadataParams;
    return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}
exports.executeMetadataFormula = executeMetadataFormula;
