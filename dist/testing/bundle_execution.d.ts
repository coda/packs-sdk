import type { ContextOptions } from './execution';
import type { Context as IVMContext } from 'isolated-vm';
import type { Isolate } from 'isolated-vm';
export declare function registerBundle(isolate: Isolate, context: IVMContext, path: string, stubName: string): Promise<void>;
export declare function executeFormulaOrSyncFromBundle({ bundlePath, formulaName, params: rawParams, _contextOptions, }: {
    bundlePath: string;
    formulaName: string;
    params: string[];
    _contextOptions?: ContextOptions;
}): Promise<void>;
