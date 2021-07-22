"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetcherStatusError = exports.handleError = exports.handleErrorAsync = exports.ensureSwitchUnreachable = exports.findAndExecutePackFunction = void 0;
const types_1 = require("../../types");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../../types");
const api_1 = require("../../api");
const api_2 = require("../../api");
// TODO(huayang)
function marshalError(err) {
    return err;
}
// TODO(huayang)
function unmarshalError(err) {
    return err;
}
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
async function findAndExecutePackFunction(params, formulaSpec) {
    try {
        return await doFindAndExecutePackFunction(params, formulaSpec);
    }
    catch (err) {
        // all errors should be marshaled to avoid IVM dropping essential fields / name.
        throw marshalError(err);
    }
}
exports.findAndExecutePackFunction = findAndExecutePackFunction;
function doFindAndExecutePackFunction(params, formulaSpec) {
    // Pull useful variables out of injected globals
    const manifest = (global.exports.pack || global.exports.manifest);
    const executionContext = global.executionContext;
    const { formulas, syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
        case types_2.FormulaType.Standard: {
            if (formulas) {
                const namespacedFormulas = Array.isArray(formulas) ? formulas : Object.values(formulas)[0];
                const formula = namespacedFormulas.find(defn => defn.name === formulaSpec.formulaName);
                if (formula) {
                    return formula.execute(params, executionContext);
                }
            }
            break;
        }
        case types_2.FormulaType.Sync: {
            if (syncTables) {
                const syncTable = syncTables.find(table => table.name === formulaSpec.formulaName);
                if (syncTable) {
                    return syncTable.getter.execute(params, executionContext);
                }
            }
            break;
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
        throw unmarshalError(err);
    }
}
exports.handleErrorAsync = handleErrorAsync;
function handleError(func) {
    try {
        return func();
    }
    catch (err) {
        throw unmarshalError(err);
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
