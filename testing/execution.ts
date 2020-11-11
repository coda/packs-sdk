import type {ExecutionContext} from '../api_types';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {TypedStandardFormula} from '../api';
import {coerceParams} from './coercion';
import {newMockExecutionContext} from './mocks';
import {validateParams} from './validation';
import {validateResult} from './validation';

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
}

// TODO(alan/jonathan): Write a comparable function that handles syncs.
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
) {
  const formula = findFormula(packDef, formulaNameWithNamespace);
  return executeFormula(formula, params, context, options);
}

export async function executeFormulaFromCLI(args: string[], module: any) {
  const formulaNameWithNamespace = args[0];
  if (!module.manifest) {
    // eslint-disable-next-line no-console
    console.log('Manifest file must export a variable called "manifest" that refers to a PackDefinition.');
    return process.exit(1);
  }

  try {
    const formula = findFormula(module.manifest, formulaNameWithNamespace);
    const params = coerceParams(formula, args.slice(1) as any);
    const result = await executeFormula(formula, params);
    // eslint-disable-next-line no-console
    console.log(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
  }
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
