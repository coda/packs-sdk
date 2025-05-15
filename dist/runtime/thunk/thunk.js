"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpBufferForTest = exports.handleFetcherStatusError = exports.handleError = exports.handleErrorAsync = exports.ensureSwitchUnreachable = exports.findAndExecutePackFunction = exports.marshalValuesForLogging = exports.unmarshalValueFromString = exports.marshalValueToStringForSameOrHigherNodeVersion = exports.unmarshalValue = exports.marshalValue = void 0;
const types_1 = require("../../types");
const buffer_1 = require("buffer");
const types_2 = require("../types");
const types_3 = require("../types");
const types_4 = require("../../types");
const types_5 = require("../../types");
const api_1 = require("../../api");
const api_2 = require("../../api");
const ensure_1 = require("../../helpers/ensure");
const helpers_1 = require("../common/helpers");
const helpers_2 = require("../common/helpers");
const api_3 = require("../../api");
const api_4 = require("../../api");
const migration_1 = require("../../helpers/migration");
const schema_1 = require("../../schema");
const marshaling_1 = require("../common/marshaling");
const marshaling_2 = require("../common/marshaling");
const api_5 = require("../../api");
var marshaling_3 = require("../common/marshaling");
Object.defineProperty(exports, "marshalValue", { enumerable: true, get: function () { return marshaling_3.marshalValue; } });
Object.defineProperty(exports, "unmarshalValue", { enumerable: true, get: function () { return marshaling_3.unmarshalValue; } });
Object.defineProperty(exports, "marshalValueToStringForSameOrHigherNodeVersion", { enumerable: true, get: function () { return marshaling_3.marshalValueToStringForSameOrHigherNodeVersion; } });
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
        throw shouldWrapError ? (0, marshaling_2.wrapErrorForSameOrHigherNodeVersion)(err) : err;
    }
}
exports.findAndExecutePackFunction = findAndExecutePackFunction;
function getSelectedAuthentication(manifest, authenticationName) {
    var _a;
    const { defaultAuthentication, systemConnectionAuthentication, adminAuthentications } = manifest;
    if (!authenticationName || authenticationName === types_5.ReservedAuthenticationNames.Default) {
        return defaultAuthentication;
    }
    if (authenticationName === types_5.ReservedAuthenticationNames.System) {
        return (0, ensure_1.ensureExists)(systemConnectionAuthentication, 'System connection authentication not found');
    }
    return (0, ensure_1.ensureExists)((_a = adminAuthentications === null || adminAuthentications === void 0 ? void 0 : adminAuthentications.find(auth => auth.name === authenticationName)) === null || _a === void 0 ? void 0 : _a.authentication, `Authentication ${authenticationName} not found`);
}
async function doFindAndExecutePackFunction({ params, formulaSpec, manifest, executionContext, updates, getPermissionsRequest, }) {
    var _a, _b;
    const { syncTables } = manifest;
    const selectedAuthentication = getSelectedAuthentication(manifest, executionContext.authenticationName);
    switch (formulaSpec.type) {
        case types_2.FormulaType.Standard: {
            const formula = (0, helpers_1.findFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.Sync: {
            const formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            return formula.execute(params, executionContext);
        }
        case types_2.FormulaType.SyncUpdate: {
            const formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            if (!formula.executeUpdate) {
                throw new Error(`No executeUpdate function defined on sync table formula ${formulaSpec.formulaName}`);
            }
            const response = await formula.executeUpdate(params, (0, ensure_1.ensureExists)(updates), executionContext);
            return parseSyncUpdateResult(response);
        }
        case types_2.FormulaType.GetPermissions: {
            const formula = (0, helpers_2.findSyncFormula)(manifest, formulaSpec.formulaName, executionContext.authenticationName);
            if (!formula.executeGetPermissions) {
                throw new Error(`No executeGetPermissions function defined on sync table formula ${formulaSpec.formulaName}`);
            }
            const response = await formula.executeGetPermissions(params, (0, ensure_1.ensureExists)(getPermissionsRequest), executionContext);
            return response;
        }
        case types_2.FormulaType.Metadata: {
            switch (formulaSpec.metadataFormulaType) {
                case types_3.MetadataFormulaType.GetConnectionName:
                    if ((selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.None &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.getConnectionName)) {
                        return selectedAuthentication.getConnectionName.execute(params, executionContext);
                    }
                    break;
                case types_3.MetadataFormulaType.GetConnectionUserId:
                    if ((selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.None &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.getConnectionUserId)) {
                        return selectedAuthentication.getConnectionUserId.execute(params, executionContext);
                    }
                    break;
                case types_3.MetadataFormulaType.ParameterAutocomplete: {
                    const autocompleteFormula = findParameterAutocompleteFormula(manifest, formulaSpec);
                    if (autocompleteFormula) {
                        return autocompleteFormula.execute(params, executionContext);
                    }
                    break;
                }
                case types_3.MetadataFormulaType.PropertyOptions:
                    const syncTable = syncTables === null || syncTables === void 0 ? void 0 : syncTables.find(table => table.name === formulaSpec.syncTableName);
                    const optionsFormula = (_a = syncTable === null || syncTable === void 0 ? void 0 : syncTable.namedPropertyOptions) === null || _a === void 0 ? void 0 : _a[formulaSpec.optionsFormulaKey];
                    if (optionsFormula) {
                        const propertyValues = {};
                        const cacheKeysUsed = [];
                        function recordPropertyAccess(key) {
                            if (!cacheKeysUsed.includes(key)) {
                                cacheKeysUsed.push(key);
                            }
                        }
                        for (const [key, value] of Object.entries(formulaSpec.propertyValues)) {
                            Object.defineProperty(propertyValues, key, {
                                enumerable: true,
                                get() {
                                    recordPropertyAccess(key);
                                    return value;
                                },
                            });
                        }
                        const propertyOptionsExecutionContext = {
                            ...executionContext,
                            propertyName: formulaSpec.propertyName,
                            propertyValues,
                            propertySchema: formulaSpec.propertySchema,
                        };
                        const contextUsed = {};
                        Object.defineProperty(propertyOptionsExecutionContext, 'search', {
                            enumerable: true,
                            get() {
                                contextUsed.searchUsed = true;
                                return formulaSpec.search;
                            },
                        });
                        const packResult = (await optionsFormula.execute(params, propertyOptionsExecutionContext));
                        const normalizedPackResult = (0, api_4.normalizePropertyOptionsResults)(packResult);
                        const result = {
                            packResult: normalizedPackResult,
                            propertiesUsed: ((_b = normalizedPackResult.unusedProperties) === null || _b === void 0 ? void 0 : _b.length)
                                ? cacheKeysUsed.filter(p => { var _a; return !((_a = normalizedPackResult.unusedProperties) === null || _a === void 0 ? void 0 : _a.includes(p)); })
                                : cacheKeysUsed,
                            ...contextUsed,
                        };
                        return result;
                    }
                    break;
                case types_3.MetadataFormulaType.PostSetupSetEndpoint:
                    if ((selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.None &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.type) !== types_1.AuthenticationType.Various &&
                        (selectedAuthentication === null || selectedAuthentication === void 0 ? void 0 : selectedAuthentication.postSetup)) {
                        const setupStep = selectedAuthentication.postSetup.find(step => step.type === types_4.PostSetupType.SetEndpoint && step.name === formulaSpec.stepName);
                        if (setupStep) {
                            return (0, migration_1.setEndpointHelper)(setupStep).getOptions.execute(params, executionContext);
                        }
                    }
                    break;
                case types_3.MetadataFormulaType.SyncListDynamicUrls:
                case types_3.MetadataFormulaType.SyncSearchDynamicUrls:
                case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                case types_3.MetadataFormulaType.SyncGetTableName:
                case types_3.MetadataFormulaType.SyncGetSchema:
                    if (syncTables) {
                        const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
                        if (syncTable) {
                            let isGetSchema = false;
                            let formula;
                            if ((0, api_3.isDynamicSyncTable)(syncTable)) {
                                switch (formulaSpec.metadataFormulaType) {
                                    case types_3.MetadataFormulaType.SyncListDynamicUrls:
                                        formula = syncTable.listDynamicUrls;
                                        break;
                                    case types_3.MetadataFormulaType.SyncSearchDynamicUrls:
                                        formula = syncTable.searchDynamicUrls;
                                        break;
                                    case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                                        formula = syncTable.getDisplayUrl;
                                        break;
                                    case types_3.MetadataFormulaType.SyncGetTableName:
                                        formula = syncTable.getName;
                                        break;
                                    case types_3.MetadataFormulaType.SyncGetSchema:
                                        formula = syncTable.getSchema;
                                        isGetSchema = true;
                                        break;
                                    default:
                                        return ensureSwitchUnreachable(formulaSpec);
                                }
                            }
                            else {
                                switch (formulaSpec.metadataFormulaType) {
                                    // Certain sync tables (Jira Issues, canonically) are not "dynamic" but have a getSchema formula
                                    // in order to augment a static base schema with dynamic properties.
                                    case types_3.MetadataFormulaType.SyncGetSchema:
                                        formula = syncTable.getSchema;
                                        isGetSchema = true;
                                        break;
                                    case types_3.MetadataFormulaType.SyncListDynamicUrls:
                                    case types_3.MetadataFormulaType.SyncSearchDynamicUrls:
                                    case types_3.MetadataFormulaType.SyncGetDisplayUrl:
                                    case types_3.MetadataFormulaType.SyncGetTableName:
                                        // Not applicable to static tables.
                                        break;
                                    default:
                                        return ensureSwitchUnreachable(formulaSpec);
                                }
                            }
                            if (formula) {
                                const formulaResult = formula.execute(params, executionContext);
                                if (isGetSchema) {
                                    (0, schema_1.throwOnDynamicSchemaWithJsOptionsFunction)(await formulaResult);
                                }
                                return formulaResult;
                            }
                        }
                    }
                    break;
                case types_3.MetadataFormulaType.ValidateParameters: {
                    const validateParametersFormula = (0, api_5.wrapMetadataFunction)(findValidateParametersFormula(manifest, formulaSpec));
                    if (validateParametersFormula) {
                        return validateParametersFormula.execute(params, executionContext);
                    }
                    break;
                }
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
function findParameterAutocompleteFormula(manifest, formulaSpec) {
    const parentFormula = findParentFormula(manifest, formulaSpec);
    if (parentFormula) {
        const params = parentFormula.parameters.concat(parentFormula.varargParameters || []);
        const paramDef = params.find(param => param.name === formulaSpec.parameterName);
        return paramDef === null || paramDef === void 0 ? void 0 : paramDef.autocomplete;
    }
}
function findValidateParametersFormula(manifest, formulaSpec) {
    const parentFormula = findParentFormula(manifest, formulaSpec);
    return parentFormula === null || parentFormula === void 0 ? void 0 : parentFormula.validateParameters;
}
function findParentFormula(manifest, formulaSpec) {
    const { formulas, syncTables } = manifest;
    const parentFormulaType = formulaSpec.parentFormulaType;
    switch (parentFormulaType) {
        case types_2.FormulaType.Standard:
            if (formulas) {
                return formulas.find(defn => defn.name === formulaSpec.parentFormulaName);
            }
            break;
        case types_2.FormulaType.Sync:
        case types_2.FormulaType.SyncUpdate:
            if (syncTables) {
                const syncTable = syncTables.find(table => table.getter.name === formulaSpec.parentFormulaName);
                return syncTable === null || syncTable === void 0 ? void 0 : syncTable.getter;
            }
            break;
        default:
            return ensureSwitchUnreachable(parentFormulaType);
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
    if (fetchResult.status >= 400) {
        // this mimics the "request-promise" package behavior of throwing error upon non-200 responses.
        // https://github.com/request/promise-core/blob/master/lib/plumbing.js#L89
        // Except we diverge by NOT throwing on 301/302, so that if you set followRedirects: false,
        // you get a normal response instead of an exception.
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
function parseSyncUpdateResult(response) {
    return {
        result: response.result.map(r => {
            if (r instanceof Error) {
                return {
                    outcome: api_2.UpdateOutcome.Error,
                    error: r,
                };
            }
            return {
                outcome: api_2.UpdateOutcome.Success,
                finalValue: r,
            };
        }),
    };
}
