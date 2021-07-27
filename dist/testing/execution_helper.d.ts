import type { ExecutionContext } from '../api_types';
import type { Formula } from '../api';
import type { GenericSyncFormula } from '../api';
import type { PackVersionDefinition } from '../types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { StandardFormulaSpecification } from '../runtime/types';
import type { SyncExecutionContext } from '../api_types';
import type { SyncFormulaSpecification } from '../runtime/types';
export interface ExecuteOptions {
    validateParams?: boolean;
    validateResult?: boolean;
}
export declare function executeFormulaOrSyncWithRawParams(manifest: PackVersionDefinition, formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification, rawParams: string[], context: SyncExecutionContext): Promise<any>;
export declare function executeFormulaOrSync(manifest: PackVersionDefinition, formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification, params: ParamValues<ParamDefs>, context: ExecutionContext | SyncExecutionContext, options?: ExecuteOptions): Promise<any>;
export declare function executeFormula(formula: Formula, params: ParamValues<ParamDefs>, context: ExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult }?: ExecuteOptions): Promise<any>;
export declare function executeSyncFormula(formula: GenericSyncFormula, params: ParamValues<ParamDefs>, context: SyncExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult }?: ExecuteOptions): Promise<import("../api").SyncFormulaResult<any>>;
export declare function findFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula;
export declare function findSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula;
export declare function tryFindFormula(packDef: PackVersionDefinition, formulaNameWithNamespace: string): Formula | undefined;
export declare function tryFindSyncFormula(packDef: PackVersionDefinition, syncFormulaName: string): GenericSyncFormula | undefined;
export declare function wrapError(err: Error): Error;
