import type {ExecutionContext} from '../api_types';
import type {GenericSyncFormula} from '../api';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {coerceParams} from './coercion';
import {executeSyncFormulaWithoutValidation} from './bundle_execution_helper';
import {findFormula} from './bundle_execution_helper';
import {findSyncFormula} from './bundle_execution_helper';
import {getManifestFromModule} from './helpers';
import {newFetcherExecutionContext} from './fetcher';
import {newFetcherSyncExecutionContext} from './fetcher';
import {newMockExecutionContext} from './mocks';
import {newMockSyncExecutionContext} from './mocks';
import {print} from './helpers';
import {tryFindFormula} from './bundle_execution_helper';
import {tryFindSyncFormula} from './bundle_execution_helper';
import {validateParams} from './validation';
import {validateResult} from './validation';
import {wrapError} from './bundle_execution_helper';

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
}

export interface ContextOptions {
  useRealFetcher?: boolean;
  credentialsFile?: string;
}

export interface ExecuteSyncOptions extends ExecuteOptions {
  maxIterations?: number;
}

export async function executeFormula(
  formula: TypedStandardFormula,
  params: ParamValues<ParamDefs>,
  context: ExecutionContext = newMockExecutionContext(),
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }
  let result: any;
  try {
    result = await formula.execute(params, context);
  } catch (err) {
    throw wrapError(err);
  }
  if (shouldValidateResult) {
    validateResult(formula, result);
  }
  return result;
}

export async function executeFormulaFromPackDef(
  packDef: PackDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, credentialsFile}: ContextOptions = {},
) {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    executionContext = newFetcherExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
  }

  const formula = findFormula(packDef, formulaNameWithNamespace);
  return executeFormula(formula, params, executionContext, options);
}

export async function executeFormulaOrSyncFromCLI({
  formulaName,
  params: rawParams,
  module,
  contextOptions = {},
}: {
  formulaName: string;
  params: string[];
  module: any;
  contextOptions?: ContextOptions;
}) {
  const manifest = getManifestFromModule(module);

  try {
    const formula = tryFindFormula(manifest, formulaName);
    if (formula) {
      const params = coerceParams(formula, rawParams as any);
      const result = await executeFormulaFromPackDef(
        manifest,
        formulaName,
        params,
        undefined,
        undefined,
        contextOptions,
      );
      print(result);
      return;
    }
    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const params = coerceParams(syncFormula, rawParams as any);
      const result = await executeSyncFormulaFromPackDef(
        manifest,
        formulaName,
        params,
        undefined,
        undefined,
        contextOptions,
      );
      print(result);
      return;
    }
    throw new Error(`Pack definition for ${manifest.name} has no formula or sync called ${formulaName}.`);
  } catch (err) {
    print(err);
    process.exit(1);
  }
}

export async function executeSyncFormula(
  formula: GenericSyncFormula,
  params: ParamValues<ParamDefs>,
  context: SyncExecutionContext = newMockSyncExecutionContext(),
  {
    validateParams: shouldValidateParams = true,
    validateResult: shouldValidateResult = true,
    maxIterations: maxIterations = 1000,
  }: ExecuteSyncOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }

  const result = await executeSyncFormulaWithoutValidation(formula, params, context, maxIterations);

  if (shouldValidateResult) {
    validateResult(formula, result);
  }
  return result;
}

export async function executeSyncFormulaFromPackDef(
  packDef: PackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteSyncOptions,
  {useRealFetcher, credentialsFile}: ContextOptions = {},
) {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    executionContext = newFetcherSyncExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
  }

  const formula = findSyncFormula(packDef, syncFormulaName);
  return executeSyncFormula(formula, params, executionContext, options);
}

export async function executeMetadataFormula(
  formula: MetadataFormula,
  metadataParams: {
    search?: string;
    formulaContext?: MetadataContext;
  } = {},
  context: ExecutionContext = newMockExecutionContext(),
) {
  const {search, formulaContext} = metadataParams;
  return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}
