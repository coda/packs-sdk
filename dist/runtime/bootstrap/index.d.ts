import type { Context } from 'isolated-vm';
import type { FetchRequest } from '../../api_types';
import type { FetchResponse } from '../../api_types';
import type { Fetcher } from '../../api_types';
import type { FormulaSpecification } from '../types';
import type { InvocationLocation } from '../../api_types';
import { Isolate } from 'isolated-vm';
import type { IsolateOptions } from 'isolated-vm';
import type { Logger } from '../../api_types';
import type { PackFunctionResponse } from '../types';
import type { ParamDefs } from '../../api_types';
import type { ParamValues } from '../../api_types';
import type { Sync } from '../../api_types';
import type { SyncUpdate } from '../../api';
import type { TemporaryBlobStorage } from '../../api_types';
export type { Context } from 'isolated-vm';
export declare function createIsolate(options: IsolateOptions): Isolate;
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
export declare function injectLogFunction(context: Context, stubName: string, func: (...args: any[]) => void): Promise<void>;
export declare function injectFetcherFunction(context: Context, stubName: string, func: (request: FetchRequest) => Promise<FetchResponse>): Promise<void>;
/**
 * Actually execute the pack function inside the isolate by loading and passing control to the thunk.
 */
export declare function executeThunk<T extends FormulaSpecification>(context: Context, { params, formulaSpec, updates, }: {
    params: ParamValues<ParamDefs>;
    formulaSpec: T;
    updates?: Array<SyncUpdate<any, any, any>>;
}, packBundlePath: string, packBundleSourceMapPath: string): Promise<PackFunctionResponse<T>>;
export declare function injectSerializer(context: Context, stubName: string): Promise<void>;
/**
 * Injects the ExecutionContext object, including stubs for network calls, into the isolate.
 */
export declare function injectExecutionContext({ context, fetcher, temporaryBlobStorage, logger, endpoint, invocationLocation, timezone, invocationToken, sync, }: {
    context: Context;
    fetcher: Fetcher;
    temporaryBlobStorage: TemporaryBlobStorage;
    logger: Logger;
    endpoint?: string;
    invocationLocation: InvocationLocation;
    timezone: string;
    invocationToken?: string;
    sync?: Sync;
}): Promise<void>;
export declare function registerBundle(isolate: Isolate, context: Context, path: string, stubName: string, requiresManualClosure?: boolean): Promise<void>;
export declare function registerBundles(isolate: Isolate, context: Context, packBundlePath: string, thunkBundlePath: string, requiresManualClosure?: boolean): Promise<void>;
export declare function getThunkPath(): string;
