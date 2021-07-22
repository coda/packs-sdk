import type { Context } from 'isolated-vm';
import type { FetchRequest } from '../../api_types';
import type { FetchResponse } from '../../api_types';
import type { FormulaSpecification } from '../types';
import type { Isolate } from 'isolated-vm';
import type { PackFormulaResult } from '../../api_types';
import type { ParamDefs } from '../../api_types';
import type { ParamValues } from '../../api_types';
import type { SyncFormulaResult } from '../../api';
/**
 * Setup an isolate context with sufficient globals needed to execute a pack.
 *
 * Notes:
 * 1. JSON.parse/stringify are built into v8, so we don't need to inject those.
 * 2. It is critically important that we do not leak isolated-vm object instances (e.g., Reference, ExternalCopy,
 *    etc.) directly into the untrusted isolate as that would allow it to gain access back into this nodejs root and
 *    take over the process.
 */
export declare function createIsolateContext(isolate: Isolate): Promise<Context>;
/**
 * Helper utilities which enables injection of a function stub into the isolate that will execute outside the sandbox.
 * Care must be taken in handling inputs in the func you pass in here.
 * See https://github.com/laverdet/isolated-vm#examples
 */
export declare function injectAsyncFunction(context: Context, stubName: string, func: (...args: any[]) => Promise<any>): Promise<void>;
export declare function injectVoidFunction(context: Context, stubName: string, func: (...args: any[]) => void): Promise<void>;
export declare function injectFetcherFunction(context: Context, stubName: string, func: (request: FetchRequest) => Promise<FetchResponse>): Promise<void>;
/**
 * Actually execute the pack function inside the isolate by loading and passing control to the thunk.
 */
export declare function executeThunk(context: Context, { params, formulaSpec }: {
    params: ParamValues<ParamDefs>;
    formulaSpec: FormulaSpecification;
}): Promise<SyncFormulaResult<object> | PackFormulaResult>;
