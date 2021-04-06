import type { ExecutionContext } from '../api_types';
import type { GenericSyncFormula } from '../api';
import type { PackDefinition } from '../types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { SyncExecutionContext } from '../api_types';
import type { TypedStandardFormula } from '../api';
export interface ExecuteOptions {
    validateParams?: boolean;
    validateResult?: boolean;
}
export interface ExecuteSyncOptions extends ExecuteOptions {
    maxIterations?: number;
}
export declare function executeSyncFormulaWithoutValidation(formula: GenericSyncFormula, params: ParamValues<ParamDefs>, context: SyncExecutionContext, maxIterations?: number): Promise<any[]>;
export declare function executeFormulaOrSyncWithRawParams(manifest: PackDefinition, formulaName: string, rawParams: string[], context: SyncExecutionContext): Promise<any>;
export declare function executeFormulaOrSync(manifest: PackDefinition, formulaName: string, params: ParamValues<ParamDefs>, context: SyncExecutionContext): Promise<any>;
export declare function executeFormula(formula: TypedStandardFormula, params: ParamValues<ParamDefs>, context: ExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult }?: ExecuteOptions): Promise<any>;
export declare function executeSyncFormula(formula: GenericSyncFormula, params: ParamValues<ParamDefs>, context: SyncExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult, maxIterations: maxIterations, }?: ExecuteSyncOptions): Promise<any[]>;
export declare function findFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula;
export declare function findSyncFormula(packDef: PackDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: PackDefinition, formulaNameWithNamespace: string): TypedStandardFormula | undefined;
export declare function tryFindSyncFormula(packDef: PackDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
export declare function wrapError(err: Error): Error;
