import {AuthenticationType} from '../../types';
import type {BasicPackDefinition} from '../../types';
import {Buffer} from 'buffer';
import type {ExecutionContext} from '../../api_types';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {FormulaSpecification} from '../types';
import {FormulaType} from '../types';
import type {GenericSyncFormulaResult} from '../../api';
import type {GenericSyncUpdate} from '../../api';
import type {MetadataFormula} from '../../api';
import {MetadataFormulaType} from '../types';
import type {PackFormulaResult} from '../../api_types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {ParameterAutocompleteMetadataFormulaSpecification} from '../types';
import type {ParamsList} from '../../api_types';
import {PostSetupType} from '../../types';
import {StatusCodeError} from '../../api';
import type {SyncExecutionContext} from '../../api_types';
import type {SyncFormulaSpecification} from '../types';
import type {TypedPackFormula} from '../../api';
import type {UpdateSyncExecutionContext} from '../../api_types';
import {ensureExists} from '../../helpers/ensure';
import {findFormula} from '../common/helpers';
import {findSyncFormula} from '../common/helpers';
import {isDynamicSyncTable} from '../../api';
import {setEndpointHelper} from '../../helpers/migration';
import {unwrapError} from '../common/marshaling';
import {wrapError} from '../common/marshaling';

export {
  marshalValue,
  unmarshalValue,
  marshalValueToString,
  unmarshalValueFromString,
  marshalValuesForLogging,
} from '../common/marshaling';

interface FindAndExecutionPackFunctionArgs<T> {
  params: ParamValues<ParamDefs>;
  formulaSpec: T;
  manifest: BasicPackDefinition;
  executionContext: ExecutionContext | SyncExecutionContext;
  updates?: GenericSyncUpdate[];
}
/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
export async function findAndExecutePackFunction<T extends FormulaSpecification>(
  {shouldWrapError = true, ...args}:
  {shouldWrapError: boolean} & FindAndExecutionPackFunctionArgs<T>,
): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult> {
  try {
    // in case the pack bundle is compiled in the browser, Buffer may not be browserified yet.
    if (!global.Buffer) {
      global.Buffer = Buffer;
    }

    return await doFindAndExecutePackFunction(args);
  } catch (err: any) {
    // all errors should be marshaled to avoid IVM dropping essential fields / name.
    throw shouldWrapError ? wrapError(err) : err;
  }
}

function doFindAndExecutePackFunction<T extends FormulaSpecification>(
  {params, formulaSpec, manifest, executionContext, updates}: FindAndExecutionPackFunctionArgs<T>,
): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult> {
  const {syncTables, defaultAuthentication} = manifest;

  switch (formulaSpec.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpec.formulaName);
      // for some reasons TS can't tell that
      // `T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult` is now PackFormulaResult.
      return formula.execute(params, executionContext as ExecutionContext) as any;
    }
    case FormulaType.Sync: {
      const formula = findSyncFormula(manifest, formulaSpec.formulaName);
      return formula.execute(params, executionContext as SyncExecutionContext);
    }
    case FormulaType.SyncUpdate: {
      const formula = findSyncFormula(manifest, formulaSpec.formulaName);
      if (!formula.executeUpdate) {
        throw new Error(`No executeUpdate function defined on sync table formula ${formulaSpec.formulaName}`);
      }
      return formula.executeUpdate(params, ensureExists(updates), executionContext as UpdateSyncExecutionContext);
    }
    case FormulaType.Metadata: {
      switch (formulaSpec.metadataFormulaType) {
        case MetadataFormulaType.GetConnectionName:
          if (
            defaultAuthentication?.type !== AuthenticationType.None &&
            defaultAuthentication?.type !== AuthenticationType.Various &&
            defaultAuthentication?.getConnectionName
          ) {
            return defaultAuthentication.getConnectionName.execute(params as any, executionContext as ExecutionContext);
          }
          break;
        case MetadataFormulaType.GetConnectionUserId:
          if (
            defaultAuthentication?.type !== AuthenticationType.None &&
            defaultAuthentication?.type !== AuthenticationType.Various &&
            defaultAuthentication?.getConnectionUserId
          ) {
            return defaultAuthentication.getConnectionUserId.execute(
              params as any,
              executionContext as ExecutionContext,
            );
          }
          break;
        case MetadataFormulaType.ParameterAutocomplete:
          const parentFormula = findParentFormula(manifest, formulaSpec);
          if (parentFormula) {
            return parentFormula.execute(params as any, executionContext);
          }
          break;
        case MetadataFormulaType.PostSetupSetEndpoint:
          if (
            defaultAuthentication?.type !== AuthenticationType.None &&
            defaultAuthentication?.type !== AuthenticationType.Various &&
            defaultAuthentication?.postSetup
          ) {
            const setupStep = defaultAuthentication.postSetup.find(
              step => step.type === PostSetupType.SetEndpoint && step.name === formulaSpec.stepName,
            );
            if (setupStep) {
              return setEndpointHelper(setupStep).getOptions.execute(params as any, executionContext);
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
              let formula: MetadataFormula | undefined;
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
              } else if (formulaSpec.metadataFormulaType === MetadataFormulaType.SyncGetSchema) {
                // Certain sync tables (Jira Issues, canonically) are not "dynamic" but have a getSchema formula
                // in order to augment a static base schema with dynamic properties.
                formula = syncTable.getSchema;
              }
              if (formula) {
                return formula.execute(params as any, executionContext);
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

function findParentFormula(
  manifest: BasicPackDefinition,
  formulaSpec: ParameterAutocompleteMetadataFormulaSpecification,
) {
  const {formulas, syncTables} = manifest;
  let formula: TypedPackFormula | undefined;
  switch (formulaSpec.parentFormulaType) {
    case FormulaType.Standard:
      if (formulas) {
        formula = formulas.find(defn => defn.name === formulaSpec.parentFormulaName);
      }
      break;
    case FormulaType.Sync:
    case FormulaType.SyncUpdate:
      if (syncTables) {
        const syncTable = syncTables.find(table => table.getter.name === formulaSpec.parentFormulaName);
        formula = syncTable?.getter;
      }
      break;
    default:
      return ensureSwitchUnreachable(formulaSpec.parentFormulaType);
  }
  if (formula) {
    const params = (formula.parameters as ParamsList).concat(formula.varargParameters || []);
    const paramDef = params.find(param => param.name === formulaSpec.parameterName);
    return paramDef?.autocomplete;
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
  if (fetchResult.status >= 300) {
    // this mimics the "request-promise" package behavior of throwing error upon non-200 responses.
    // https://github.com/request/promise-core/blob/master/lib/plumbing.js#L89
    // this usually doesn't throw for 3xx since it by default follows redirects and will end up with
    // another status code.
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
