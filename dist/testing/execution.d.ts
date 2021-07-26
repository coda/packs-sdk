/// <reference types="node" />
import type { ExecuteOptions } from './execution_helper';
import type { ExecutionContext } from '../api_types';
import type { MetadataContext } from '../api';
import type { MetadataFormula } from '../api';
import type { PackVersionDefinition } from '../types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { StandardFormulaSpecification } from '../runtime/types';
import type { SyncExecutionContext } from '../api_types';
import type { SyncFormulaResult } from '../api';
import type { SyncFormulaSpecification } from '../runtime/types';
import util from 'util';
export { ExecuteOptions } from './execution_helper';
export interface ContextOptions {
    useRealFetcher?: boolean;
    manifestPath?: string;
}
export declare function executeFormulaFromPackDef(packDef: PackVersionDefinition, formulaNameWithNamespace: string, params: ParamValues<ParamDefs>, context?: ExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<any>;
export declare function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, contextOptions, }: {
    formulaName: string;
    params: string[];
    manifest: PackVersionDefinition;
    manifestPath: string;
    vm?: boolean;
    dynamicUrl?: string;
    contextOptions?: ContextOptions;
}): Promise<void>;
export declare function executeFormulaOrSyncWithVM({ formulaName, params, bundlePath, executionContext, }: {
    formulaName: string;
    params: ParamValues<ParamDefs>;
    bundlePath: string;
    executionContext?: ExecutionContext;
}): Promise<any>;
export declare class VMError {
    name: string;
    message: string;
    stack: string;
    constructor(name: string, message: string, stack: string);
    [util.inspect.custom](): string;
}
export declare function executeFormulaOrSyncWithRawParamsInVM({ formulaSpecification, params: rawParams, manifestPath, executionContext, }: {
    formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification;
    params: string[];
    manifestPath: string;
    executionContext?: SyncExecutionContext;
}): Promise<any>;
export declare function executeFormulaOrSyncWithRawParams({ formulaSpecification, params: rawParams, manifest, executionContext, }: {
    formulaSpecification: StandardFormulaSpecification | SyncFormulaSpecification;
    params: string[];
    manifest: PackVersionDefinition;
    vm?: boolean;
    executionContext: SyncExecutionContext;
}): Promise<any>;
/**
 * Executes multiple iterations of a sync formula in a loop until there is no longer
 * a `continuation` returned, aggregating each page of results and returning an array
 * with results of all iterations combined and flattened.
 *
 * NOTE: This currently runs all the iterations in a simple loop, which does not
 * adequately simulate the fact that in a real execution environment each iteration
 * will be run in a completely isolated environment, with absolutely no sharing
 * of state or global variables between iterations.
 *
 * For now, use `coda execute --vm` to simulate that level of isolation.
 */
export declare function executeSyncFormulaFromPackDef(packDef: PackVersionDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<any[]>;
/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export declare function executeSyncFormulaFromPackDefSingleIteration(packDef: PackVersionDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<SyncFormulaResult<any>>;
export declare function executeMetadataFormula(formula: MetadataFormula, metadataParams?: {
    search?: string;
    formulaContext?: MetadataContext;
}, context?: ExecutionContext): Promise<any>;
