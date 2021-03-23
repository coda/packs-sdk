import type { ContextOptions } from './execution';
import type { Context as IVMContext } from 'isolated-vm';
import ivm from 'isolated-vm';
export declare function registerBundle(isolate: ivm.Isolate, context: IVMContext, path: string, stubName: string): Promise<void>;
export declare function executeFormulaOrSyncFromBundle({ bundlePath, formulaName, params: rawParams, contextOptions: executionContextOptions, }: {
    bundlePath: string;
    formulaName: string;
    params: string[];
    contextOptions?: ContextOptions;
}): Promise<void>;
