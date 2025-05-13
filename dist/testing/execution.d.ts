import type { BasicPackDefinition } from '../types';
import type { ExecutionContext } from '../api_types';
import type { FormulaResultType } from './types';
import type { FormulaSpecification } from '../runtime/types';
import type { GenericExecuteGetPermissionsRequest } from '../api';
import type { GenericSyncFormulaResult } from '../api';
import type { GenericSyncUpdate } from '../api';
import type { GenericSyncUpdateResult } from '../api';
import type { GetPermissionsResult } from '../api';
import type { MetadataContext } from '../api';
import type { MetadataFormula } from '../api';
import type { ObjectSchemaDefinitionType } from '../schema';
import type { PackFormulaResult } from '../api_types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { SyncExecutionContext } from '../api_types';
import type { UpdateSyncExecutionContext } from '../api_types';
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
export declare function makeFormulaSpec(manifest: BasicPackDefinition, formulaNameInput: string): FormulaSpecification;
export declare function executeFormulaOrSyncWithVM<T extends PackFormulaResult | GenericSyncFormulaResult = any>({ formulaName, params, bundlePath, executionContext, }: {
    formulaName: string;
    params: ParamValues<ParamDefs>;
    bundlePath: string;
    executionContext?: ExecutionContext;
}): Promise<T>;
export declare function executeFormulaOrSyncWithRawParams<T extends FormulaSpecification>({ formulaSpecification, params: rawParams, manifest, executionContext, }: {
    formulaSpecification: T;
    params: string[];
    manifest: BasicPackDefinition;
    executionContext: SyncExecutionContext;
}): Promise<FormulaResultType<T>>;
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
export declare function executeSyncFormula(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult, useDeprecatedResultNormalization, }?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<GenericSyncFormulaResult>;
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
 * @deprecated Use {@link executeSyncFormula} instead.
 */
export declare function executeSyncFormulaFromPackDef(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, { validateParams: shouldValidateParams, validateResult: shouldValidateResult, useDeprecatedResultNormalization, }?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<Array<ObjectSchemaDefinitionType<any, any, any>>>;
/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export declare function executeSyncFormulaFromPackDefSingleIteration(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<GenericSyncFormulaResult>;
/**
 * Executes an executeGetPermissions request and returns the result.
 *
 * @hidden
 */
export declare function executeGetPermissionsFormulaFromPackDef(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, executeGetPermissionsRequest: GenericExecuteGetPermissionsRequest, context?: SyncExecutionContext, options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<GetPermissionsResult>;
/**
 * Executes an executeUpdate request for an update sync formula, and returns the result.
 *
 * @hidden
 */
export declare function executeUpdateFormulaFromPackDef(packDef: BasicPackDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context: UpdateSyncExecutionContext, syncUpdates: GenericSyncUpdate[], options?: ExecuteOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<GenericSyncUpdateResult>;
export declare function executeMetadataFormula(formula: MetadataFormula, metadataParams?: {
    search?: string;
    formulaContext?: MetadataContext;
}, context?: ExecutionContext): Promise<import("../api").LegacyDefaultMetadataReturnType>;
export declare function newRealFetcherExecutionContext(packDef: BasicPackDefinition, manifestPath: string): ExecutionContext;
export declare function newRealFetcherSyncExecutionContext(packDef: BasicPackDefinition, manifestPath: string): SyncExecutionContext;
