import { AuthenticationType } from '../../types';
import { Buffer } from 'buffer';
import { FormulaType } from '../types';
import { MetadataFormulaType } from '../types';
import { PostSetupType } from '../../types';
import { StatusCodeError } from '../../api';
import { findFormula } from '../common/helpers';
import { findSyncFormula } from '../common/helpers';
import { isDynamicSyncTable } from '../../api';
import { setEndpointHelper } from '../../helpers/migration';
import { unwrapError } from '../common/marshaling';
import { wrapError } from '../common/marshaling';
export { marshalValue, unmarshalValue, marshalValueToString, unmarshalValueFromString, marshalValuesForLogging, } from '../common/marshaling';
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
export async function findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, shouldWrapError = true) {
    try {
        // in case the pack bundle is compiled in the browser, Buffer may not be browserified yet.
        if (!global.Buffer) {
            global.Buffer = Buffer;
        }
        return await doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext);
    }
    catch (err) {
        // all errors should be marshaled to avoid IVM dropping essential fields / name.
        throw shouldWrapError ? wrapError(err) : err;
    }
}
function doFindAndExecutePackFunction(params, formulaSpec, manifest, executionContext) {
    const { syncTables, defaultAuthentication } = manifest;
    switch (formulaSpec.type) {
        case FormulaType.Standard: {
            const formula = findFormula(manifest, formulaSpec.formulaName);
            // for some reasons TS can't tell that
            // `T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult` is now PackFormulaResult.
            return formula.execute(params, executionContext);
        }
        case FormulaType.Sync: {
            const formula = findSyncFormula(manifest, formulaSpec.formulaName);
            return formula.execute(params, executionContext);
        }
        case FormulaType.Metadata: {
            switch (formulaSpec.metadataFormulaType) {
                case MetadataFormulaType.GetConnectionName:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.getConnectionName)) {
                        return defaultAuthentication.getConnectionName.execute(params, executionContext);
                    }
                    break;
                case MetadataFormulaType.GetConnectionUserId:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.getConnectionUserId)) {
                        return defaultAuthentication.getConnectionUserId.execute(params, executionContext);
                    }
                    break;
                case MetadataFormulaType.ParameterAutocomplete:
                    const parentFormula = findParentFormula(manifest, formulaSpec);
                    if (parentFormula) {
                        return parentFormula.execute(params, executionContext);
                    }
                    break;
                case MetadataFormulaType.PostSetupSetEndpoint:
                    if ((defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.None &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.type) !== AuthenticationType.Various &&
                        (defaultAuthentication === null || defaultAuthentication === void 0 ? void 0 : defaultAuthentication.postSetup)) {
                        const setupStep = defaultAuthentication.postSetup.find(step => step.type === PostSetupType.SetEndpoint && step.name === formulaSpec.stepName);
                        if (setupStep) {
                            return setEndpointHelper(setupStep).getOptions.execute(params, executionContext);
                        }
                    }
                    break;
                case MetadataFormulaType.SyncListDynamicUrls:
                case MetadataFormulaType.SyncGetDisplayUrl:
                case MetadataFormulaType.SyncGetTableName:
                case MetadataFormulaType.SyncGetSchema:
                    if (syncTables) {
                        const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
                        if (syncTable) {
                            let formula;
                            if (isDynamicSyncTable(syncTable)) {
                                switch (formulaSpec.metadataFormulaType) {
                                    case MetadataFormulaType.SyncListDynamicUrls:
                                        formula = syncTable.listDynamicUrls;
                                        break;
                                    case MetadataFormulaType.SyncGetDisplayUrl:
                                        formula = syncTable.getDisplayUrl;
                                        break;
                                    case MetadataFormulaType.SyncGetTableName:
                                        formula = syncTable.getName;
                                        break;
                                    case MetadataFormulaType.SyncGetSchema:
                                        formula = syncTable.getSchema;
                                        break;
                                    default:
                                        return ensureSwitchUnreachable(formulaSpec);
                                }
                            }
                            else if (formulaSpec.metadataFormulaType === MetadataFormulaType.SyncGetSchema) {
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
        case FormulaType.Standard:
            if (formulas) {
                formula = formulas.find(defn => defn.name === formulaSpec.parentFormulaName);
            }
            break;
        case FormulaType.Sync:
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
export function ensureSwitchUnreachable(value) {
    throw new Error(`Unreachable code hit with value ${String(value)}`);
}
export async function handleErrorAsync(func) {
    try {
        return await func();
    }
    catch (err) {
        throw unwrapError(err);
    }
}
export function handleError(func) {
    try {
        return func();
    }
    catch (err) {
        throw unwrapError(err);
    }
}
export function handleFetcherStatusError(fetchResult, fetchRequest) {
    // using constant here to avoid another dependency.
    if (fetchResult.status >= 300) {
        // this mimics the "request-promise" package behavior of throwing error upon non-200 responses.
        // https://github.com/request/promise-core/blob/master/lib/plumbing.js#L89
        // this usually doesn't throw for 3xx since it by default follows redirects and will end up with
        // another status code.
        throw new StatusCodeError(fetchResult.status, fetchResult.body, fetchRequest, {
            body: fetchResult.body,
            headers: fetchResult.headers,
        });
    }
}
export function setUpBufferForTest() {
    if (!global.Buffer) {
        global.Buffer = Buffer;
    }
}
