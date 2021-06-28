/// <reference types="node" />
import type { ExecuteOptions } from './execution_helper';
import type { ExecuteSyncOptions } from './execution_helper';
import type { ExecutionContext } from '../api_types';
import type { MetadataContext } from '../api';
import type { MetadataFormula } from '../api';
import type { PackVersionDefinition } from '../types';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import type { SyncExecutionContext } from '../api_types';
import util from 'util';
export { ExecuteOptions } from './execution_helper';
export { ExecuteSyncOptions } from './execution_helper';
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
    executionContext?: SyncExecutionContext;
}): Promise<any>;
export declare function translateErrorStackFromVM({ error, bundleSourceMapPath, vmFilename, }: {
    error: Error;
    bundleSourceMapPath: string;
    vmFilename: string;
}): Promise<string | undefined>;
export declare class VMError {
    name: string;
    message: string;
    stack: string;
    constructor(name: string, message: string, stack: string);
    [util.inspect.custom](): string;
}
export declare function executeFormulaOrSyncWithRawParamsInVM({ formulaName, params: rawParams, manifestPath, executionContext, }: {
    formulaName: string;
    params: string[];
    manifestPath: string;
    executionContext?: SyncExecutionContext;
}): Promise<any>;
export declare function executeFormulaOrSyncWithRawParams({ formulaName, params: rawParams, manifest, executionContext, }: {
    formulaName: string;
    params: string[];
    manifest: PackVersionDefinition;
    vm?: boolean;
    executionContext: SyncExecutionContext;
}): Promise<any>;
export declare function executeSyncFormulaFromPackDef(packDef: PackVersionDefinition, syncFormulaName: string, params: ParamValues<ParamDefs>, context?: SyncExecutionContext, options?: ExecuteSyncOptions, { useRealFetcher, manifestPath }?: ContextOptions): Promise<any[]>;
export declare function executeMetadataFormula(formula: MetadataFormula, metadataParams?: {
    search?: string;
    formulaContext?: MetadataContext;
}, context?: ExecutionContext): Promise<any>;
