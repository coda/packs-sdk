import type {ExecutionContext} from '../api_types';
import type {Formula} from '../api';
import type {GenericSyncFormula} from '../api';
import type {PackVersionDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import {coerceParams} from './coercion';
import {ensureExists} from '../helpers/ensure';
import {validateParams} from './validation';
import {validateResult} from './validation';

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
}

export async function executeFormulaOrSyncWithRawParams(
  manifest: PackVersionDefinition,
  formulaName: string,
  rawParams: string[],
  context: SyncExecutionContext,
) {
  try {
    const formula = tryFindFormula(manifest, formulaName);
    if (formula) {
      const params = coerceParams(formula, rawParams as any);
      return await executeFormula(formula, params, context);
    }

    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const params = coerceParams(syncFormula, rawParams as any);
      return await executeSyncFormula(syncFormula, params, context);
    }
    throw new Error(`Pack definition has no formula or sync called ${formulaName}.`);
  } catch (err) {
    throw wrapError(err);
  }
}

export async function executeFormulaOrSync(
  manifest: PackVersionDefinition,
  formulaName: string,
  params: ParamValues<ParamDefs>,
  context: SyncExecutionContext,
) {
  try {
    const formula = tryFindFormula(manifest, formulaName);
    if (formula) {
      return await executeFormula(formula, params, context);
    }

    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      return await executeSyncFormula(syncFormula, params, context);
    }
    throw new Error(`Pack definition has no formula or sync called ${formulaName}.`);
  } catch (err) {
    throw wrapError(err);
  }
}

export async function executeFormula(
  formula: Formula,
  params: ParamValues<ParamDefs>,
  context: ExecutionContext,
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }

  // TODO(patrick): We should not execute a formula that requests scopes that we don't have
  // in our stored credentials. Either we check stored credentials here or we pass the requested
  // scopes from formula.requiredOAuthScopes in to the execution context.

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

export async function executeSyncFormula(
  formula: GenericSyncFormula,
  params: ParamValues<ParamDefs>,
  context: SyncExecutionContext,
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
) {
  if (shouldValidateParams) {
    validateParams(formula, params);
  }

  const result = await formula.execute(params, context);

  if (shouldValidateResult) {
    validateResult(formula, result.result);
  }
  return result;
}

export function findFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula {
  const packFormulas = packDef.formulas;
  if (!packFormulas) {
    throw new Error(`Pack definition has no formulas.`);
  }

  const [namespace, name] = formulaNameWithNamespace.includes('::')
    ? formulaNameWithNamespace.split('::')
    : [ensureExists(packDef.formulaNamespace), formulaNameWithNamespace];
  if (!(namespace && name)) {
    throw new Error(
      `Formula names must be specified as FormulaNamespace::FormulaName, but got "${formulaNameWithNamespace}".`,
    );
  }

  const formulas: Formula[] = Array.isArray(packFormulas) ? packFormulas : packFormulas[namespace];
  if (!formulas || !formulas.length) {
    throw new Error(`Pack definition has no formulas for namespace "${namespace}".`);
  }
  for (const formula of formulas) {
    if (formula.name === name) {
      return formula;
    }
  }
  throw new Error(`Pack definition has no formula "${name}" in namespace "${namespace}".`);
}

export function findSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula {
  if (!packDef.syncTables) {
    throw new Error(`Pack definition has no sync tables.`);
  }

  for (const syncTable of packDef.syncTables) {
    const syncFormula = syncTable.getter;
    if (syncFormula.name === syncFormulaName) {
      return syncFormula;
    }
  }

  throw new Error(`Pack definition has no sync formula "${syncFormulaName}" in its sync tables.`);
}

export function tryFindFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula | undefined {
  try {
    return findFormula(packDef, formulaNameWithNamespace);
  } catch (_err) {}
}

export function tryFindSyncFormula(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
): GenericSyncFormula | undefined {
  try {
    return findSyncFormula(packDef, syncFormulaName);
  } catch (_err) {}
}

export function wrapError(err: Error): Error {
  if (err.name === 'TypeError' && err.message === `Cannot read property 'body' of undefined`) {
    err.message +=
      '\nThis means your formula was invoked with a mock fetcher that had no response configured.' +
      '\nThis usually means you invoked your formula from the commandline with `coda execute` but forgot to add the --fetch flag ' +
      'to actually fetch from the remote API.';
  }
  return err;
}
