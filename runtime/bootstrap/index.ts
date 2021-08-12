import type {Context} from 'isolated-vm';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {Fetcher} from '../../api_types';
import type {FormulaSpecification} from '../types';
import type {InvocationLocation} from '../../api_types';
import type {Isolate} from 'isolated-vm';
import type {Logger} from '../../api_types';
import type {PackFormulaResult} from '../../api_types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {Sync} from '../../api_types';
import type {SyncFormulaResult} from '../../api';
import type {SyncFormulaSpecification} from '../types';
import type {TemporaryBlobStorage} from '../../api_types';
import fs from 'fs';
import {marshalValue} from '../common/marshaling';
import path from 'path';
import {translateErrorStackFromVM} from '../common/source_map';
import {unmarshalValue} from '../common/marshaling';
import {unwrapError} from '../common/marshaling';

/**
 * Setup an isolate context with sufficient globals needed to execute a pack.
 *
 * Notes:
 * 1. JSON.parse/stringify are built into v8, so we don't need to inject those.
 * 2. It is critically important that we do not leak isolated-vm object instances (e.g., Reference, ExternalCopy,
 *    etc.) directly into the untrusted isolate as that would allow it to gain access back into this nodejs root and
 *    take over the process.
 */
export async function createIsolateContext(isolate: Isolate): Promise<Context> {
  const context = await isolate.createContext();

  // Setup the global object.
  const jail = context.global;
  await jail.set('global', jail.derefInto());

  // Setup a dummy commonjs-style `exports` global to enable loading a packaged bundle.
  await jail.set('exports', {}, {copy: true});

  // Attempt to hide away eval as defense-in-depth against dynamic code gen.
  // We used to block Function, but the SDK bundles in a helper that needs it :(
  await jail.set('eval', undefined, {copy: true});

  // register bundle stubs.
  await jail.set('coda', {}, {copy: true});
  await jail.set('pack', {}, {copy: true});

  return context;
}

/**
 * Helper utilities which enables injection of a function stub into the isolate that will execute outside the sandbox.
 * Care must be taken in handling inputs in the func you pass in here.
 * See https://github.com/laverdet/isolated-vm#examples
 */
export async function injectAsyncFunction(
  context: Context,
  stubName: string,
  func: (...args: any[]) => Promise<any>,
): Promise<void> {
  const stub = async (...args: string[]) => {
    const result = await func(...args.map(arg => unmarshalValue(arg)));
    return marshalValue(result);
  };

  await context.evalClosure(
    `${stubName} = async function(...args) {
        return coda.handleErrorAsync(async () => {
         const result = await $0.apply(
           undefined,
           args.map(coda.marshalValue),
           {
             arguments: {copy: true},
             result: {copy: true, promise: true},
           },
         );
         return coda.unmarshalValue(result);
       });
     };`,
    [stub],
    {arguments: {reference: true}},
  );
}

export async function injectVoidFunction(
  context: Context,
  stubName: string,
  func: (...args: any[]) => void,
): Promise<void> {
  const stub = (...args: string[]) => {
    func(...args.map(arg => unmarshalValue(arg)));
  };

  await context.evalClosure(
    `${stubName} = function(...args) {
        coda.handleError(() => {
          $0.applyIgnored(undefined, args.map(coda.marshalValue), {arguments: {copy: true}});
        });
     };`,
    [stub],
    {arguments: {reference: true}},
  );
}

export async function injectFetcherFunction(
  context: Context,
  stubName: string,
  func: (request: FetchRequest) => Promise<FetchResponse>,
): Promise<void> {
  const stub = async (marshaledValue: string) => {
    const result = await func(unmarshalValue(marshaledValue) as FetchRequest);
    return marshalValue(result);
  };

  await context.evalClosure(
    `${stubName} = async function(fetchRequest) {
        return coda.handleErrorAsync(async () => {
         const fetchResult = await $0.apply(
           undefined,
           [coda.marshalValue(fetchRequest)],
           {
             arguments: {copy: true},
             result: {copy: true, promise: true},
           },
         );
         const parsedResult = coda.unmarshalValue(fetchResult);
         coda.handleFetcherStatusError(parsedResult, fetchRequest);
         return parsedResult;
       });
     };`,
    [stub],
    {arguments: {reference: true}},
  );
}

/**
 * Actually execute the pack function inside the isolate by loading and passing control to the thunk.
 */
export async function executeThunk<T extends FormulaSpecification>(
  context: Context,
  {params, formulaSpec}: {params: ParamValues<ParamDefs>; formulaSpec: T},
  packBundlePath: string,
  packBundleSourceMapPath: string,
): Promise<T extends SyncFormulaSpecification ? SyncFormulaResult<object> : PackFormulaResult> {
  try {
    const resultRef = await context.evalClosure(
      'return coda.findAndExecutePackFunction($0, $1, pack.pack || pack.manifest, executionContext);',
      [params, formulaSpec],
      {
        arguments: {copy: true},
        result: {reference: true, promise: true},
      },
    );

    // And marshal out the results into a local copy of the isolate object reference.
    const localIsolateValue = await resultRef.copy();
    return localIsolateValue;
  } catch (wrappedError) {
    const err = unwrapError(wrappedError);
    const translatedStacktrace = await translateErrorStackFromVM({
      stacktrace: err.stack,
      // the sourcemap needs packBundleSourceMapPath to be either absolute or relative, but not something like
      // 'bundle.js' or 'bundle.js.map'.
      bundleSourceMapPath: path.resolve(packBundleSourceMapPath),
      vmFilename: path.resolve(packBundlePath),
    });
    const messageSuffix = err.message ? `: ${err.message}` : '';
    err.stack = `${err.constructor.name}${messageSuffix}\n${translatedStacktrace}`;
    throw err;
  }
}

/**
 * Injects the ExecutionContext object, including stubs for network calls, into the isolate.
 */
export async function injectExecutionContext({
  context,
  fetcher,
  temporaryBlobStorage,
  logger,
  endpoint,
  invocationLocation,
  timezone,
  invocationToken,
  sync,
}: {
  context: Context;
  fetcher: Fetcher;
  temporaryBlobStorage: TemporaryBlobStorage;
  logger: Logger;
  endpoint?: string;
  invocationLocation: InvocationLocation;
  timezone: string;
  invocationToken?: string;
  sync?: Sync;
}): Promise<void> {
  // Inject all of the primitives into a global we'll access when we execute the pack function.
  const executionContextPrimitives = {
    fetcher: {},
    temporaryBlobStorage: {},
    logger: {},
    endpoint,
    invocationLocation,
    timezone,
    invocationToken,
    sync,
  };

  await context.global.set('executionContext', executionContextPrimitives, {copy: true});
  await context.global.set('console', {}, {copy: true});

  await injectFetcherFunction(context, 'executionContext.fetcher.fetch', fetcher.fetch.bind(fetcher));

  await injectVoidFunction(context, 'executionContext.logger.trace', logger.trace.bind(logger));
  await injectVoidFunction(context, 'executionContext.logger.debug', logger.debug.bind(logger));
  await injectVoidFunction(context, 'executionContext.logger.info', logger.info.bind(logger));
  await injectVoidFunction(context, 'executionContext.logger.warn', logger.warn.bind(logger));
  await injectVoidFunction(context, 'executionContext.logger.error', logger.error.bind(logger));

  await injectVoidFunction(context, 'console.trace', logger.trace.bind(logger));
  await injectVoidFunction(context, 'console.debug', logger.debug.bind(logger));
  await injectVoidFunction(context, 'console.info', logger.info.bind(logger));
  await injectVoidFunction(context, 'console.warn', logger.warn.bind(logger));
  await injectVoidFunction(context, 'console.error', logger.error.bind(logger));
  // console.log is an alias of logger.info
  await injectVoidFunction(context, 'console.log', logger.info.bind(logger));

  await injectAsyncFunction(
    context,
    'executionContext.temporaryBlobStorage.storeBlob',
    temporaryBlobStorage.storeBlob.bind(temporaryBlobStorage),
  );
  await injectAsyncFunction(
    context,
    'executionContext.temporaryBlobStorage.storeUrl',
    temporaryBlobStorage.storeUrl.bind(temporaryBlobStorage),
  );
}

export async function registerBundle(
  isolate: Isolate,
  context: Context,
  path: string,
  stubName: string,
): Promise<void> {
  // init / reset global.exports for import. Assuming the bundle is following commonJS format.
  // be aware that we don't support commonJS2 (one of webpack's output format).
  await context.global.set('exports', {}, {copy: true});

  // compiling the bundle allows IVM to map the stack trace.
  const bundle = fs.readFileSync(path).toString();

  // bundle needs to be converted into a closure to avoid leaking variables to global scope.
  const script = await isolate.compileScript(`(() => { ${bundle} \n ${stubName} = exports })()`, {
    filename: path,
  });
  await script.run(context);
}

export async function registerBundles(
  isolate: Isolate,
  context: Context,
  packBundlePath: string,
  thunkBundlePath: string,
): Promise<void> {
  await registerBundle(isolate, context, thunkBundlePath, 'coda');
  await registerBundle(isolate, context, packBundlePath, 'pack');
}

export function getThunkPath(): string {
  return path.join(__dirname, '../../bundles/thunk_bundle.js');
}
