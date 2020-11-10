import type { ExecutionContext } from '../api_types';
import type { PackDefinition } from '../types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { TypedStandardFormula } from '../api';
export interface ExecuteOptions {
    coerceParams?: boolean;
    validateParams?: boolean;
    validateResult?: boolean;
}
export declare function executeFormula(formula: TypedStandardFormula, params: ParamValues<ParamDefs>, context?: ExecutionContext, { coerceParams: shouldCoerceParams, validateParams: shouldValidateParams, validateResult: shouldValidateResult, }?: ExecuteOptions): Promise<any>;
export declare function executeFormulaFromPackDef(packDef: PackDefinition, formulaNameWithNamespace: string, params: ParamValues<ParamDefs>, context?: ExecutionContext, options?: ExecuteOptions): Promise<any>;
export declare function executeFormulaFromCLI(args: string[], module: any): Promise<undefined>;
export declare function newExecutionContext(): ExecutionContext;
