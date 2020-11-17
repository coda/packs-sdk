import type {ExecutionContext} from '../api_types';
import type {GenericSyncFormula} from '../api';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {coerceParams} from './coercion';
import {getManifestFromModule} from './helpers';
import {newFetcherExecutionContext} from './fetcher';
import {newFetcherSyncExecutionContext} from './fetcher';
import {newMockExecutionContext} from './mocks';
import {newMockSyncExecutionContext} from './mocks';
import {validateParams} from './validation';
import {validateResult} from './validation';

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
  const result = await formula.execute(params, context);
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

export async function executeFormulaOrSyncFromCLI(args: string[], module: any, contextOptions: ContextOptions = {}) {
  const formulaName = args[0];
  const manifest = getManifestFromModule(module);

  try {
    const formula = tryFindFormula(manifest, formulaName);
    if (formula) {
      const params = coerceParams(formula, args.slice(1) as any);
      const result = await executeFormulaFromPackDef(
        manifest,
        formulaName,
        params,
        undefined,
        undefined,
        contextOptions,
      );
      // eslint-disable-next-line no-console
      console.log(result);
      return;
    }
    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const params = coerceParams(syncFormula, args.slice(1) as any);
      const result = await executeSyncFormulaFromPackDef(
        manifest,
        formulaName,
        params,
        undefined,
        undefined,
        contextOptions,
      );
      // eslint-disable-next-line no-console
      console.log(result);
      return;
    }
    throw new Error(`Pack definition for ${manifest.name} has no formula or sync called ${formulaName}.`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
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

  const result = [];
  let iterations = 1;
  do {
    if (iterations > maxIterations) {
      throw new Error(
        `Sync is still running after ${maxIterations} iterations, this is likely due to an infinite loop. If more iterations are needed, use the maxIterations option.`,
      );
    }
    const response = await formula.execute(params, context);
    result.push(...response.result);
    context.sync.continuation = response.continuation;
    iterations++;
  } while (context.sync.continuation);

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

function findFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula {
  if (!packDef.formulas) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
  }
  const [namespace, name] = formulaNameWithNamespace.split('::');
  if (!(namespace && name)) {
    throw new Error(
      `Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`,
    );
  }
  const formulas = packDef.formulas[namespace];
  if (!formulas || !formulas.length) {
    throw new Error(
      `Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas for namespace "${namespace}".`,
    );
  }
  for (const formula of formulas) {
    if (formula.name === name) {
      return formula;
    }
  }
  throw new Error(
    `Pack definition for ${packDef.name} (id ${packDef.id}) has no formula "${name}" in namespace "${namespace}".`,
  );
}

function tryFindFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula | undefined {
  try {
    return findFormula(packDef, formulaNameWithNamespace);
  } catch (_err) {}
}

function findSyncFormula(packDef: PackDefinition, syncFormulaName: string): GenericSyncFormula {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no sync tables.`);
  }

  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncFormula.name === syncFormulaName) {
      return syncFormula;
    }
  }

  throw new Error(
    `Pack definition for ${packDef.name} (id ${packDef.id}) has no sync formula "${syncFormulaName}" in its sync tables.`,
  );
}

function tryFindSyncFormula(packDef: PackDefinition, syncFormulaName: string): GenericSyncFormula | undefined {
  try {
    return findSyncFormula(packDef, syncFormulaName);
  } catch (_err) {}
}
