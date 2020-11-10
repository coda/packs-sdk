// tslint:disable:no-console

import type {ExecutionContext} from '../api_types';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {coerceParams} from './coercion';
import {validateParams} from './validation';
import {validateResult} from './validation';
import {v4} from 'uuid';

export interface ExecuteOptions {
  coerceParams?: boolean;
  validateParams?: boolean;
  validateResult?: boolean;
}

// TODO(alan/jonathan): Write a comparable function that handles syncs.
export async function executeFormula(
  formula: TypedStandardFormula,
  params: ParamValues<ParamDefs>,
  context: ExecutionContext = newExecutionContext(),
  {
    coerceParams: shouldCoerceParams,
    validateParams: shouldValidateParams,
    validateResult: shouldValidateResult,
  }: ExecuteOptions = {},
) {
  const paramsToUse = shouldCoerceParams ? coerceParams(formula, params) : params;
  if (shouldValidateParams) {
    validateParams(formula, paramsToUse);
  }
  const result = await formula.execute(paramsToUse, context);
  if (shouldValidateResult) {
    validateResult(formula, result);
  }
  return result;
}

export function executeFormulaFromPackDef(
  packDef: PackDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
) {
  const formula = findFormula(packDef, formulaNameWithNamespace);
  return executeFormula(formula, params, context, options);
}

export async function executeFormulaFromCLI(args: string[], module: any) {
  const formulaNameWithNamespace = args[0];
  const params = args.slice(1);
  if (!module.manifest) {
    console.log('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
    return process.exit(1);
  }
  try {
    const result = await executeFormulaFromPackDef(
      module.manifest,
      formulaNameWithNamespace,
      params as any,
      undefined,
      {
        coerceParams: true,
        validateParams: true,
        validateResult: true,
      },
    );
    console.log(result);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export function newExecutionContext(): ExecutionContext {
  // TODO(jonathan): Add a mock fetcher.
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken: v4(),
  };
}

function findFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula {
  if (!packDef.formulas) {
    throw new Error(`Pack definition for ${packDef.name} (id ${packDef.id}) has no formulas.`);
  }
  const [namespace, name] = formulaNameWithNamespace.split('::');
  if (!(namespace && name)) {
    throw new Error(
      `Formula names must be specified as FormulaNamespace::FormulaName, but got ${formulaNameWithNamespace}.`,
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
