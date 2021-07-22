import {AuthenticationType} from '../../types';
import type {ExecutionContext} from '../../api_types';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {FormulaSpecification} from '../types';
import {FormulaType} from '../types';
import type {MetadataFormula} from '../../api';
import {MetadataFormulaType} from '../types';
import type {PackDefinition} from '../../types';
import type {PackFormulaResult} from '../../api_types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {ParameterAutocompleteMetadataFormulaSpecification} from '../types';
import type {ParamsList} from '../../api_types';
import {PostSetupType} from '../../types';
import {StatusCodeError} from '../../api';
import type {SyncExecutionContext} from '../../api_types';
import type {SyncFormulaResult} from '../../api';
import type {TypedPackFormula} from '../../api';
import {isDynamicSyncTable} from '../../api';

// TODO(huayang)
function marshalError(err: Error): Error {
  return err;
}

// TODO(huayang)
function unmarshalError(err: Error): Error {
  return err;
}

/**
 * The thunk entrypoint - the first code that runs inside the v8 isolate once control is passed over.
 */
export async function findAndExecutePackFunction(
  params: ParamValues<ParamDefs>,
  formulaSpec: FormulaSpecification,
): Promise<PackFormulaResult | SyncFormulaResult<any>> {
  try {
    return await doFindAndExecutePackFunction(params, formulaSpec);
  } catch (err) {
    // all errors should be marshaled to avoid IVM dropping essential fields / name.
    throw marshalError(err);
  }
}

function doFindAndExecutePackFunction(
  params: ParamValues<ParamDefs>,
  formulaSpec: FormulaSpecification,
): Promise<PackFormulaResult | SyncFormulaResult<any>> {
  // Pull useful variables out of injected globals
  const manifest = (global.exports.pack || global.exports.manifest) as PackDefinition;
  const executionContext = (global as any).executionContext;

  const {formulas, syncTables, defaultAuthentication} = manifest;

  switch (formulaSpec.type) {
    case FormulaType.Standard: {
      if (formulas) {
        const namespacedFormulas = Array.isArray(formulas) ? formulas : Object.values(formulas)[0];
        const formula = namespacedFormulas.find(defn => defn.name === formulaSpec.formulaName);
        if (formula) {
          return formula.execute(params, executionContext as ExecutionContext);
        }
      }
      break;
    }
    case FormulaType.Sync: {
      if (syncTables) {
        const syncTable = syncTables.find(table => table.name === formulaSpec.formulaName);
        if (syncTable) {
          return syncTable.getter.execute(params, executionContext as SyncExecutionContext);
        }
      }
      break;
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
              return setupStep.getOptionsFormula.execute(params as any, executionContext);
            }
          }
          break;
        case MetadataFormulaType.SyncListDynamicUrls:
        case MetadataFormulaType.SyncGetDisplayUrl:
        case MetadataFormulaType.SyncGetTableName:
        case MetadataFormulaType.SyncGetSchema:
          if (syncTables) {
            const syncTable = syncTables.find(table => table.name === formulaSpec.syncTableName);
            if (syncTable && isDynamicSyncTable(syncTable)) {
              let formula: MetadataFormula | undefined;
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

function findParentFormula(manifest: PackDefinition, formulaSpec: ParameterAutocompleteMetadataFormulaSpecification) {
  const {formulas, syncTables} = manifest;
  let formula: TypedPackFormula | undefined;
  switch (formulaSpec.parentFormulaType) {
    case FormulaType.Standard:
      if (formulas) {
        const namespacedFormulas = Array.isArray(formulas) ? formulas : Object.values(formulas)[0];
        formula = namespacedFormulas.find(defn => defn.name === formulaSpec.parentFormulaName);
      }
      break;
    case FormulaType.Sync:
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
  } catch (err) {
    throw unmarshalError(err);
  }
}

export function handleError(func: () => any): any {
  try {
    return func();
  } catch (err) {
    throw unmarshalError(err);
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
