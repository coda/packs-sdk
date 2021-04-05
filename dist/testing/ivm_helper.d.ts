import type { ExecutionContext } from '../api';
import type { Context as IVMContext } from 'isolated-vm';
import type { ParamDefs } from '../api_types';
import type { ParamValues } from '../api_types';
import ivm from 'isolated-vm';
export declare function registerBundle(isolate: ivm.Isolate, context: IVMContext, path: string, stubName: string): Promise<void>;
export declare function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext>;
export declare function executeFormulaOrSyncWithRawParams(ivmContext: IVMContext, formulaName: string, rawParams: string[]): Promise<any>;
export declare function executeFormulaOrSync(ivmContext: IVMContext, formulaName: string, params: ParamValues<ParamDefs>): Promise<any>;
