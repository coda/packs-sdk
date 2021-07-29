"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetcherStatusError = exports.handleError = exports.handleErrorAsync = exports.ensureSwitchUnreachable = exports.findAndExecutePackFunction = exports.unmarshalValue = exports.marshalValue = void 0;
const types_1 = require("../../types");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../../types");
const api_1 = require("../../api");
const helpers_1 = require("../common/helpers");
const helpers_2 = require("../common/helpers");
const api_2 = require("../../api");
const marshaling_1 = require("../common/marshaling");
const marshaling_2 = require("../common/marshaling");
var marshaling_3 = require("../common/marshaling");
Object.defineProperty(exports, "marshalValue", { enumerable: true, get: function () { return marshaling_3.marshalValue; } });
var marshaling_4 = require("../common/marshaling");
Object.defineProperty(exports, "unmarshalValue", { enumerable: true, get: function () { return marshaling_4.unmarshalValue; } });
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
function doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext) {
    const { syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
        case types_2.FormulaType.Standard: {
            const formula = helpers_1.findFormula(manifest, formulaSpec.formulaName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.Sync: {
            const formula = helpers_2.findSyncFormula(manifest, formulaSpec.formulaName);
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
