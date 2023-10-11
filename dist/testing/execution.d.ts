/// <reference types="node" />
import type { BasicPackDefinition } from '../types';
import type { ExecutionContext } from '../api_types';
import type { GenericSyncFormulaResult } from '../api';
import type { MetadataContext } from '../api';
import type { MetadataFormula } from '../api';
import type { PackFormulaResult } from '../api_types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { StandardFormulaSpecification } from '../runtime/types';
import type { SyncExecutionContext } from '../api_types';
import type { SyncFormulaSpecification } from '../runtime/types';
import util from 'util';
export declare const DEFAULT_MAX_ROWS = 1000;
export interface ExecuteOptions {
    validateParams?: boolean;
    validateResult?: boolean;
    useDeprecatedResultNormalization?: boolean;
}
export interface ContextOptions {
    useRealFetcher?: boolean;
    manifestPath?: string;
}
export declare function executeFormulaFromPackDef<T extends PackFormulaResult | GenericSyncFormulaResult = any>(packDef: BasicPackDefinition, formulaNameWithNamespace: string, params: ParamValues<ParamDefs>, context?: ExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<T>;
export declare function executeFormulaOrSyncFromCLI({ formulaName, params, manifest, manifestPath, vm, dynamicUrl, maxRows, bundleSourceMapPath, bundlePath, contextOptions, }: {
    formulaName: string;
    params: string[];
    manifest: BasicPackDefinition;
    manifestPath: string;
    vm?: boolean;
    dynamicUrl?: string;
    maxRows?: number;
    bundleSourceMapPath: string;
    bundlePath: string;
    contextOptions?: ContextOptions;
}): Promise<void>;
export declare function executeFormulaOrSyncWithVM<T extends PackFormulaResult | GenericSyncFormulaResult = any>({ formulaName, params, bundlePath, executionContext, }: {
    formulaName: string;
    params: ParamValues<ParamDefs>;
    bundlePath: string;
    executionContext?: ExecutionContext;
}): Promise<T>;
export declare class VMError {
    name: string;
    message: string;
    stack: string;
    constructor(name: string, message: string, stack: string);
    [util.inspect.custom](): string;
}
export declare function executeFormulaOrSyncWithRawParams<T extends StandardFormulaSpecification | SyncFormulaSpecification>({ formulaSpecification, params: rawParams, manifest, executionContext, }: {
    formulaSpecification: T;
    params: string[];
    manifest: BasicPackDefinition;
    executionContext: SyncExecutionContext;
}): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult>;
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
export declare function executeSyncFormulaFromPackDef<T extends object = any>(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult, useDeprecatedResultNormalization, }?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<T[]>;
/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export declare function executeSyncFormulaFromPackDefSingleIteration(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<GenericSyncFormulaResult>;
export declare function executeMetadataFormula(formula: MetadataFormula, metadataParams?: {
    search?: string;
    formulaContext?: MetadataContext;
}, context?: ExecutionContext): Promise<any>;
export declare function newRealFetcherExecutionContext(packDef: BasicPackDefinition, manifestPath: string): ExecutionContext;
export declare function newRealFetcherSyncExecutionContext(packDef: BasicPackDefinition, manifestPath: string): SyncExecutionContext;
