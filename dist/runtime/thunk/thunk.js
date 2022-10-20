"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpBufferForTest = exports.handleFetcherStatusError = exports.handleError = exports.handleErrorAsync = exports.ensureSwitchUnreachable = exports.findAndExecutePackFunction = exports.marshalValuesForLogging = exports.unmarshalValueFromString = exports.marshalValueToString = exports.unmarshalValue = exports.marshalValue = void 0;
const types_1 = require("../../types");
const buffer_1 = require("buffer");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../../types");
const api_1 = require("../../api");
const ensure_1 = require("../../helpers/ensure");
const helpers_1 = require("../common/helpers");
const helpers_2 = require("../common/helpers");
const api_2 = require("../../api");
const migration_1 = require("../../helpers/migration");
const marshaling_1 = require("../common/marshaling");
const marshaling_2 = require("../common/marshaling");
var marshaling_3 = require("../common/marshaling");
Object.defineProperty(exports, "marshalValue", { enumerable: true, get: function () { return marshaling_3.marshalValue; } });
Object.defineProperty(exports, "unmarshalValue", { enumerable: true, get: function () { return marshaling_3.unmarshalValue; } });
Object.defineProperty(exports, "marshalValueToString", { enumerable: true, get: function () { return marshaling_3.marshalValueToString; } });
Object.defineProperty(exports, "unmarshalValueFromString", { enumerable: true, get: function () { return marshaling_3.unmarshalValueFromString; } });
Object.defineProperty(exports, "marshalValuesForLogging", { enumerable: true, get: function () { return marshaling_3.marshalValuesForLogging; } });
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
async function findAndExecutePackFunction({ shouldWrapError = true, ...args }) {
    try {
        // in case the pack bundle is compiled in the browser, Buffer may not be browserified yet.
        if (!global.Buffer) {
            global.Buffer = buffer_1.Buffer;
        }
        return await doFindAndExecutePackFunction(args);
    }
    catch (err) {
        // all errors should be marshaled to avoid IVM dropping essential fields / name.
        throw shouldWrapError ? (0, marshaling_2.wrapError)(err) : err;
    }
}
exports.findAndExecutePackFunction = findAndExecutePackFunction;
function doFindAndExecutePackFunction({ params, formulaSpec, manifest, executionContext, updates }) {
    const { syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
        case types_2.FormulaType.Standard: {
            const formula = (0, helpers_1.findFormula)(manifest, formulaSpec.formulaName);
            // for some reasons TS can't tell that
            // `T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult` is now PackFormulaResult.
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.Sync: {
            const formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.SyncUpdate: {
            const formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName);
            if (!formula.executeUpdate) {
                throw new Error(`No executeUpdate function defined on sync table formula ${formulaSpec.formulaName}`);
            }
            return formula.executeUpdate(params, (0, ensure_1.ensureExists)(updates), executionContext);
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
                            return (0, migration_1.setEndpointHelper)(setupStep).getOptions.execute(params, executionContext);
                        }
                    }
                    break;
                case types_3.MetadataFormulaType.SyncListDynamicUrls:
                case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                case types_3.MetadataFormulaType.SyncGetTableName:
                case types_3.MetadataFormulaType.SyncGetSchema:
                    if (syncTables) {
                        const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
                        if (syncTable) {
                            let formula;
                            if ((0, api_2.isDynamicSyncTable)(syncTable)) {
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
                            }
                            else if (formulaSpec.metadataFormulaType === types_3.MetadataFormulaType.SyncGetSchema) {
                                // Certain sync tables (Jira Issues, canonically) are not "dynamic" but have a getSchema formula
                                // in order to augment a static base schema with dynamic properties.
                                formula = syncTable.getSchema;
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
                formula = formulas.find(defn => defn.name === formulaSpec.parentFormulaName);
            }
            break;
        case types_2.FormulaType.Sync:
        case types_2.FormulaType.SyncUpdate:
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
        throw (0, marshaling_1.unwrapError)(err);
    }
}
exports.handleErrorAsync = handleErrorAsync;
function handleError(func) {
    try {
        return func();
    }
    catch (err) {
        throw (0, marshaling_1.unwrapError)(err);
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
function setUpBufferForTest() {
    if (!global.Buffer) {
        global.Buffer = buffer_1.Buffer;
    }
}
exports.setUpBufferForTest = setUpBufferForTest;
