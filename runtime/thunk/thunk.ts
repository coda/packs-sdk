import {AuthenticationType} from '../../types';
import type {BasicPackDefinition} from '../../types';
import {Buffer} from 'buffer';
import type {ExecutionContext} from '../../api_types';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {FormulaSpecification} from '../types';
import {FormulaType} from '../types';
import type {GenericExecuteGetPermissionsRequest} from '../../api';
import type {GenericSyncFormulaResult} from '../../api';
import type {GenericSyncUpdate} from '../../api';
import type {GenericSyncUpdateResult} from '../../api';
import type {GenericSyncUpdateResultMarshaled} from '../../api';
import type {GetPermissionExecutionContext} from '../../api_types';
import type {MetadataFormula} from '../../api';
import {MetadataFormulaType} from '../types';
import type {PackFormulaResult} from '../../api_types';
import type {PackFunctionResponse} from '../types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {ParameterAutocompleteMetadataFormulaSpecification} from '../types';
import type {ParameterValidationResult} from '../../api';
import type {ParamsList} from '../../api_types';
import {PostSetupType} from '../../types';
import type {PropertyOptionsAnnotatedResult} from '../../api';
import type {PropertyOptionsExecutionContext} from '../../api_types';
import type {PropertyOptionsResults} from '../../api';
import {ReservedAuthenticationNames} from '../../types';
import {StatusCodeError} from '../../api';
import type {SyncExecutionContext} from '../../api_types';
import {UpdateOutcome} from '../../api';
import type {UpdateSyncExecutionContext} from '../../api_types';
import type {ValidateParametersFormulaSpecification} from '../types';
import {ensureExists} from '../../helpers/ensure';
import {findFormula} from '../common/helpers';
import {findSyncFormula} from '../common/helpers';
import {isDynamicSyncTable} from '../../api';
import {normalizePropertyOptionsResults} from '../../api';
import {setEndpointHelper} from '../../helpers/migration';
import {throwOnDynamicSchemaWithJsOptionsFunction} from '../../schema';
import {unwrapError} from '../common/marshaling';
import {wrapErrorForSameOrHigherNodeVersion} from '../common/marshaling';
import {wrapMetadataFunction} from '../../api';

export {
  marshalValue,
  unmarshalValue,
  marshalValueToStringForSameOrHigherNodeVersion,
  unmarshalValueFromString,
  marshalValuesForLogging,
} from '../common/marshaling';

interface FindAndExecutionPackFunctionArgs<T> {
  params: ParamValues<ParamDefs>;
  formulaSpec: T;
  manifest: BasicPackDefinition;
  executionContext: ExecutionContext | SyncExecutionContext;
  updates?: GenericSyncUpdate[];
  getPermissionsRequest?: GenericExecuteGetPermissionsRequest;
}

/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
export async function findAndExecutePackFunction<T extends FormulaSpecification>({
  shouldWrapError = true,
  ...args
}: {shouldWrapError: boolean} & FindAndExecutionPackFunctionArgs<T>): Promise<PackFunctionResponse<T>> {
  try {
    // in case the pack bundle is compiled in the browser, Buffer may not be browserified yet.
    if (!global.Buffer) {
      global.Buffer = Buffer;
    }

    return await doFindAndExecutePackFunction(args);
  } catch (err: any) {
    // all errors should be marshaled to avoid IVM dropping essential fields / name.
    throw shouldWrapError ? wrapErrorForSameOrHigherNodeVersion(err) : err;
  }
}

function getSelectedAuthentication(manifest: BasicPackDefinition, authenticationName?: string) {
  const {defaultAuthentication, systemConnectionAuthentication, adminAuthentications} = manifest;
  if (!authenticationName || authenticationName === ReservedAuthenticationNames.Default) {
    return defaultAuthentication;
  }
  if (authenticationName === ReservedAuthenticationNames.System) {
    return ensureExists(systemConnectionAuthentication, 'System connection authentication not found');
  }

  return ensureExists(
    adminAuthentications?.find(auth => auth.name === authenticationName)?.authentication,
    `Authentication ${authenticationName} not found`,
  );
}

async function doFindAndExecutePackFunction<T extends FormulaSpecification>({
  params,
  formulaSpec,
  manifest,
  executionContext,
  updates,
  getPermissionsRequest,
}: FindAndExecutionPackFunctionArgs<T>): Promise<PackFunctionResponse<T>>;
async function doFindAndExecutePackFunction<T extends FormulaSpecification>({
  params,
  formulaSpec,
  manifest,
  executionContext,
  updates,
  getPermissionsRequest,
}: FindAndExecutionPackFunctionArgs<T>): Promise<
  GenericSyncFormulaResult | GenericSyncUpdateResultMarshaled | PackFormulaResult
> {
  const {syncTables} = manifest;
  const selectedAuthentication = getSelectedAuthentication(manifest, executionContext.authenticationName);

  switch (formulaSpec.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      return formula.execute(params, executionContext as ExecutionContext);
    }
    case FormulaType.Sync: {
      const formula = findSyncFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      return formula.execute(params, executionContext as SyncExecutionContext);
    }
    case FormulaType.SyncUpdate: {
      const formula = findSyncFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      if (!formula.executeUpdate) {
        throw new Error(`No executeUpdate function defined on sync table formula ${formulaSpec.formulaName}`);
      }
      const response = await formula.executeUpdate(
        params,
        ensureExists(updates),
        executionContext as UpdateSyncExecutionContext,
      );
      return parseSyncUpdateResult(response);
    }
    case FormulaType.GetPermissions: {
      const formula = findSyncFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      if (!formula.executeGetPermissions) {
        throw new Error(`No executeGetPermissions function defined on sync table formula ${formulaSpec.formulaName}`);
      }
      const response = await formula.executeGetPermissions(
        params,
        ensureExists(getPermissionsRequest),
        executionContext as GetPermissionExecutionContext,
      );
      return response;
    }
    case FormulaType.Metadata: {
      switch (formulaSpec.metadataFormulaType) {
        case MetadataFormulaType.GetConnectionName:
          if (
            selectedAuthentication?.type !== AuthenticationType.None &&
            selectedAuthentication?.type !== AuthenticationType.Various &&
            selectedAuthentication?.getConnectionName
          ) {
            return selectedAuthentication.getConnectionName.execute(params as [string, string], executionContext);
          }
          break;
        case MetadataFormulaType.GetConnectionUserId:
          if (
            selectedAuthentication?.type !== AuthenticationType.None &&
            selectedAuthentication?.type !== AuthenticationType.Various &&
            selectedAuthentication?.getConnectionUserId
          ) {
            return selectedAuthentication.getConnectionUserId.execute(params as [string, string], executionContext);
          }
          break;
        case MetadataFormulaType.ParameterAutocomplete: {
          const autocompleteFormula = findParameterAutocompleteFormula(manifest, formulaSpec);
          if (autocompleteFormula) {
            return autocompleteFormula.execute(params as any, executionContext);
          }
          break;
        }
        case MetadataFormulaType.PropertyOptions:
          const syncTable = syncTables?.find(table => table.name === formulaSpec.syncTableName);
          const optionsFormula = syncTable?.namedPropertyOptions?.[formulaSpec.optionsFormulaKey];

          if (optionsFormula) {
            const propertyValues = {};

            const cacheKeysUsed: string[] = [];

            function recordPropertyAccess(key: string) {
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

            const propertyOptionsExecutionContext: Omit<PropertyOptionsExecutionContext, 'search'> = {
              ...(executionContext as SyncExecutionContext),
              propertyName: formulaSpec.propertyName,
              propertyValues,
              propertySchema: formulaSpec.propertySchema,
            };

            const contextUsed: Omit<PropertyOptionsAnnotatedResult, 'packResult' | 'propertiesUsed'> = {};

            Object.defineProperty(propertyOptionsExecutionContext, 'search', {
              enumerable: true,
              get() {
                contextUsed.searchUsed = true;
                return formulaSpec.search;
              },
            });

            const packResult = (await optionsFormula.execute(
              params as any,
              propertyOptionsExecutionContext,
            )) as PropertyOptionsResults;
            const normalizedPackResult = normalizePropertyOptionsResults(packResult);
            const result: PropertyOptionsAnnotatedResult = {
              packResult: normalizedPackResult,
              propertiesUsed: normalizedPackResult.unusedProperties?.length
                ? cacheKeysUsed.filter(p => !normalizedPackResult.unusedProperties?.includes(p))
                : cacheKeysUsed,
              ...contextUsed,
            };
            return result;
          }
          break;
        case MetadataFormulaType.PostSetupSetEndpoint:
          if (
            selectedAuthentication?.type !== AuthenticationType.None &&
            selectedAuthentication?.type !== AuthenticationType.Various &&
            selectedAuthentication?.postSetup
          ) {
            const setupStep = selectedAuthentication.postSetup.find(
              step => step.type === PostSetupType.SetEndpoint && step.name === formulaSpec.stepName,
            );
            if (setupStep) {
              return setEndpointHelper(setupStep).getOptions.execute(
                params as [undefined, undefined],
                executionContext,
              );
            }
          }
          break;
        case MetadataFormulaType.SyncListDynamicUrls:
        case MetadataFormulaType.SyncSearchDynamicUrls:
        case MetadataFormulaType.SyncGetDisplayUrl:
        case MetadataFormulaType.SyncGetTableName:
        case MetadataFormulaType.SyncGetSchema:
          if (syncTables) {
            const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
            if (syncTable) {
              let isGetSchema = false;
              let formula: MetadataFormula | undefined;
              if (isDynamicSyncTable(syncTable)) {
                switch (formulaSpec.metadataFormulaType) {
                  case MetadataFormulaType.SyncListDynamicUrls:
                    formula = syncTable.listDynamicUrls;
                    break;
                  case MetadataFormulaType.SyncSearchDynamicUrls:
                    formula = syncTable.searchDynamicUrls;
                    break;

                  case MetadataFormulaType.SyncGetDisplayUrl:
                    formula = syncTable.getDisplayUrl;
                    break;
                  case MetadataFormulaType.SyncGetTableName:
                    formula = syncTable.getName;
                    break;
                  case MetadataFormulaType.SyncGetSchema:
                    formula = syncTable.getSchema;
                    isGetSchema = true;
                    break;
                  default:
                    return ensureSwitchUnreachable(formulaSpec);
                }
              } else {
                switch (formulaSpec.metadataFormulaType) {
                  // Certain sync tables (Jira Issues, canonically) are not "dynamic" but have a getSchema formula
                  // in order to augment a static base schema with dynamic properties.
                  case MetadataFormulaType.SyncGetSchema:
                    formula = syncTable.getSchema;
                    isGetSchema = true;
                    break;
                  case MetadataFormulaType.SyncListDynamicUrls:
                  case MetadataFormulaType.SyncSearchDynamicUrls:
                  case MetadataFormulaType.SyncGetDisplayUrl:
                  case MetadataFormulaType.SyncGetTableName:
                    // Not applicable to static tables.
                    break;
                  default:
                    return ensureSwitchUnreachable(formulaSpec);
                }
              }
              if (formula) {
                const formulaResult = formula.execute(params as any, executionContext);
                if (isGetSchema) {
                  throwOnDynamicSchemaWithJsOptionsFunction(await formulaResult);
                }
                return formulaResult;
              }
            }
          }

          break;
        case MetadataFormulaType.ValidateParameters: {
          const validateParametersFormula = wrapMetadataFunction<ExecutionContext, ParameterValidationResult>(
            findValidateParametersFormula(manifest, formulaSpec),
          );
          if (validateParametersFormula) {
            return validateParametersFormula.execute(params as any, executionContext);
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

function findParameterAutocompleteFormula(
  manifest: BasicPackDefinition,
  formulaSpec: ParameterAutocompleteMetadataFormulaSpecification,
) {
  const parentFormula = findParentFormula(manifest, formulaSpec);
  if (parentFormula) {
    const params = (parentFormula.parameters as ParamsList).concat(parentFormula.varargParameters || []);
    const paramDef = params.find(param => param.name === formulaSpec.parameterName);
    return paramDef?.autocomplete;
  }
}

function findValidateParametersFormula(
  manifest: BasicPackDefinition,
  formulaSpec: ValidateParametersFormulaSpecification,
) {
  const parentFormula = findParentFormula(manifest, formulaSpec);
  return parentFormula?.validateParameters;
}

function findParentFormula(
  manifest: BasicPackDefinition,
  formulaSpec: ParameterAutocompleteMetadataFormulaSpecification | ValidateParametersFormulaSpecification,
) {
  const {formulas, syncTables} = manifest;
  const parentFormulaType = formulaSpec.parentFormulaType;
  switch (parentFormulaType) {
    case FormulaType.Standard:
      if (formulas) {
        return formulas.find(defn => defn.name === formulaSpec.parentFormulaName);
      }
      break;
    case FormulaType.Sync:
    case FormulaType.SyncUpdate:
      if (syncTables) {
        const syncTable = syncTables.find(table => table.getter.name === formulaSpec.parentFormulaName);
        return syncTable?.getter;
      }
      break;
    default:
      return ensureSwitchUnreachable(parentFormulaType);
  }
}

export function ensureSwitchUnreachable(value: never): never {
  throw new Error(`Unreachable code hit with value ${String(value)}`);
}

export async function handleErrorAsync(func: () => Promise<any>): Promise<any> {
  try {
    return await func();
  } catch (err: any) {
    throw unwrapError(err);
  }
}

export function handleError(func: () => any): any {
  try {
    return func();
  } catch (err: any) {
    throw unwrapError(err);
  }
}

export function handleFetcherStatusError(fetchResult: FetchResponse, fetchRequest: FetchRequest) {
  // using constant here to avoid another dependency.
  if (fetchResult.status >= 400) {
    // this mimics the "request-promise" package behavior of throwing error upon non-200 responses.
    // https://github.com/request/promise-core/blob/master/lib/plumbing.js#L89
    // Except we diverge by NOT throwing on 301/302, so that if you set followRedirects: false,
    // you get a normal response instead of an exception.
    throw new StatusCodeError(fetchResult.status, fetchResult.body, fetchRequest, {
      body: fetchResult.body,
      headers: fetchResult.headers,
    } as any);
  }
}

export function setUpBufferForTest() {
  if (!global.Buffer) {
    global.Buffer = Buffer;
  }
}

function parseSyncUpdateResult(response: GenericSyncUpdateResult): GenericSyncUpdateResultMarshaled {
  return {
    result: response.result.map(r => {
      if (r instanceof Error) {
        return {
          outcome: UpdateOutcome.Error,
          error: r,
        };
      }
      return {
        outcome: UpdateOutcome.Success,
        finalValue: r,
      };
    }),
  };
}
