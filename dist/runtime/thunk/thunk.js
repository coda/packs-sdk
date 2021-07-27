"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetcherStatusError = exports.handleError = exports.handleErrorAsync = exports.ensureSwitchUnreachable = exports.tryFindSyncFormula = exports.tryFindFormula = exports.findAndExecutePackFunction = exports.findSyncFormula = exports.findFormula = void 0;
const types_1 = require("../../types");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../../types");
const api_1 = require("../../api");
const api_2 = require("../../api");
const marshaling_1 = require("../common/marshaling");
const marshaling_2 = require("../common/marshaling");
function findFormula(packDef, formulaNameWithNamespace) {
    const packFormulas = packDef.formulas;
    if (!packFormulas) {
        throw new Error(`Pack definition has no formulas.`);
    }
    const [namespace, name] = formulaNameWithNamespace.includes('::')
        ? formulaNameWithNamespace.split('::')
        : ['', formulaNameWithNamespace];
    if (namespace) {
        // eslint-disable-next-line no-console
        console.log(`Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`);
    }
    const formulas = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
    if (!formulas || !formulas.length) {
        throw new Error(`Pack definition has no formulas${namespace !== null && namespace !== void 0 ? namespace : ` for namespace "${namespace}"`}.`);
    }
    for (const formula of formulas) {
        if (formula.name === name) {
            return formula;
        }
    }
    throw new Error(`Pack definition has no formula "${name}"${namespace !== null && namespace !== void 0 ? namespace : ` in namespace "${namespace}"`}.`);
}
exports.findFormula = findFormula;
function findSyncFormula(packDef, syncFormulaName) {
    if (!packDef.syncTables) {
        throw new Error(`Pack definition has no sync tables.`);
    }
    for (const syncTable of packDef.syncTables) {
        const syncFormula = syncTable.getter;
        if (syncFormula.name === syncFormulaName) {
            return syncFormula;
        }
    }
    throw new Error(`Pack definition has no sync formula "${syncFormulaName}" in its sync tables.`);
}
exports.findSyncFormula = findSyncFormula;
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, shouldWrapError = true) {
    try {
        return await doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext);
    }
    catch (err) {
        // all errors should be marshaled to avoid IVM dropping essential fields / name.
        throw shouldWrapError ? marshaling_2.wrapError(err) : err;
    }
}
exports.findAndExecutePackFunction = findAndExecutePackFunction;
function tryFindFormula(packDef, formulaNameWithNamespace) {
    try {
        return findFormula(packDef, formulaNameWithNamespace);
    }
    catch (_err) { }
}
exports.tryFindFormula = tryFindFormula;
function tryFindSyncFormula(packDef, syncFormulaName) {
    try {
        return findSyncFormula(packDef, syncFormulaName);
    }
    catch (_err) { }
}
exports.tryFindSyncFormula = tryFindSyncFormula;
function doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext) {
    const { syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
        case types_2.FormulaType.Standard: {
            const formula = findFormula(manifest, formulaSpec.formulaName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.Sync: {
            const formula = findSyncFormula(manifest, formulaSpec.formulaName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.Metadata: {
            switch (formulaSpec.metadataFormulaType) {
                case types_3.MetadataFormulaType.GetConnectionName:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.getConnectionName)) {
                        return defaultAuthentication.getConnectionName.execute(params, executionContext);
                    }
                    break;
                case types_3.MetadataFormulaType.GetConnectionUserId:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.getConnectionUserId)) {
                        return defaultAuthentication.getConnectionUserId.execute(params, executionContext);
                    }
                    break;
                case types_3.MetadataFormulaType.ParameterAutocomplete:
                    const parentFormula = findParentFormula(manifest, formulaSpec);
                    if (parentFormula) {
                        return parentFormula.execute(params, executionContext);
                    }
                    break;
                case types_3.MetadataFormulaType.PostSetupSetEndpoint:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.postSetup)) {
                        const setupStep = defaultAuthentication.postSetup.find(step => step.type === types_4.PostSetupType.SetEndpoint && step.name === formulaSpec.stepName);
                        if (setupStep) {
                            return setupStep.getOptionsFormula.execute(params, executionContext);
                        }
                    }
                    break;
                case types_3.MetadataFormulaType.SyncListDynamicUrls:
                case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                case types_3.MetadataFormulaType.SyncGetTableName:
                case types_3.MetadataFormulaType.SyncGetSchema:
                    if (syncTables) {
                        const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
                        if (syncTable && api_2.isDynamicSyncTable(syncTable)) {
                            let formula;
                            switch (formulaSpec.metadataFormulaType) {
                                case types_3.MetadataFormulaType.SyncListDynamicUrls:
                                    formula = syncTable.listDynamicUrls;
                                    break;
                                case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                                    formula = syncTable.getDisplayUrl;
                                    break;
                                case types_3.MetadataFormulaType.SyncGetTableName:
                                    formula = syncTable.getName;
                                    break;
                                case types_3.MetadataFormulaType.SyncGetSchema:
                                    formula = syncTable.getSchema;
                                    break;
                                default:
                                    return ensureSwitchUnreachable(formulaSpec);
                            }
                            if (formula) {
                                return formula.execute(params, executionContext);
                            }
                        }
                    }
                    break;
                default:
                    return ensureSwitchUnreachable(formulaSpec);
            }
            break;
        }
        default:
            return ensureSwitchUnreachable(formulaSpec);
    }
    // TODO(Chris): Log an error
    throw new Error(`Could not find a formula matching formula spec ${JSON.stringify(formulaSpec)}`);
}
function findParentFormula(manifest, formulaSpec) {
    const { formulas, syncTables } = manifest;
    let formula;
    switch (formulaSpec.parentFormulaType) {
        case types_2.FormulaType.Standard:
            if (formulas) {
                const namespacedFormulas = Array.isArray(formulas) ? formulas : Object.values(formulas)[0];
                formula = namespacedFormulas.find(defn => defn.name === formulaSpec.parentFormulaName);
            }
            break;
        case types_2.FormulaType.Sync:
            if (syncTables) {
                const syncTable = syncTables.find(table => table.getter.name === formulaSpec.parentFormulaName);
                formula = syncTable === null || syncTable === void 0 ? void 0 : syncTable.getter;
            }
            break;
        default:
            return ensureSwitchUnreachable(formulaSpec.parentFormulaType);
    }
    if (formula) {
        const params = formula.parameters.concat(formula.varargParameters || []);
        const paramDef = params.find(param => param.name === formulaSpec.parameterName);
        return paramDef === null || paramDef === void 0 ? void 0 : paramDef.autocomplete;
    }
}
function ensureSwitchUnreachable(value) {
    throw new Error(`Unreachable code hit with value ${String(value)}`);
}
exports.ensureSwitchUnreachable = ensureSwitchUnreachable;
async function handleErrorAsync(func) {
    try {
        return await func();
    }
    catch (err) {
        throw marshaling_1.unwrapError(err);
    }
}
exports.handleErrorAsync = handleErrorAsync;
function handleError(func) {
    try {
        return func();
    }
    catch (err) {
        throw marshaling_1.unwrapError(err);
    }
}
exports.handleError = handleError;
function handleFetcherStatusError(fetchResult, fetchRequest) {
    // using constant here to avoid another dependency.
    if (fetchResult.status >= 300) {
        // this mimics the "request-promise" package behavior of throwing error upon non-200 responses.
        // https://github.com/request/promise-core/blob/master/lib/plumbing.js#L89
        // this usually doesn't throw for 3xx since it by default follows redirects and will end up with
        // another status code.
        throw new api_1.StatusCodeError(fetchResult.status, fetchResult.body, fetchRequest, {
            body: fetchResult.body,
            headers: fetchResult.headers,
        });
    }
}
exports.handleFetcherStatusError = handleFetcherStatusError;
