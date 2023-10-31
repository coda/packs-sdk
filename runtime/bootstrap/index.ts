import type {Context} from 'isolated-vm';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {Fetcher} from '../../api_types';
import type {FormulaSpecification} from '../types';
import type {InvocationLocation} from '../../api_types';
import {Isolate} from 'isolated-vm';
import type {IsolateOptions} from 'isolated-vm';
import type {Logger} from '../../api_types';
import type {PackFunctionResponse} from '../types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {Sync} from '../../api_types';
import type {SyncUpdate} from '../../api';
import type {TemporaryBlobStorage} from '../../api_types';
import fs from 'fs';
import {marshalValue} from '../common/marshaling';
import path from 'path';
import {translateErrorStackFromVM} from '../common/source_map';
import {unmarshalValue} from '../common/marshaling';
import {unwrapError} from '../common/marshaling';
import v8 from 'v8';

export type {Context} from 'isolated-vm';

// This helper avoids the need for other repos to directly depend on isolated-vm and
// know what version to import.
export function createIsolate(options: IsolateOptions): Isolate {
  return new Isolate(options);
}

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

// Log functions have no return value and do a more relaxed version of marshaling that doesn't
// raise an exception on unsupported types like normal marshaling would.
export async function injectLogFunction(
  context: Context,
  stubName: string,
  func: (...args: any[]) => void,
): Promise<void> {
  const stub = (marshaledArgs: any) => {
    func(...marshaledArgs.map(unmarshalValue));
  };

  await context.evalClosure(
    `${stubName} = function(...args) {
        coda.handleError(() => {
          $0.applyIgnored(undefined, [coda.marshalValuesForLogging(args)], {arguments: {copy: true}});
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
  {
    params,
    formulaSpec,
    updates,
  }: {
    params: ParamValues<ParamDefs>;
    formulaSpec: T;
    updates?: Array<SyncUpdate<any, any, any>>;
  },
  packBundlePath: string,
  packBundleSourceMapPath: string,
): Promise<PackFunctionResponse<T>> {
  try {
    const resultRef = await context.evalClosure(
      'return coda.findAndExecutePackFunction({params: $0, formulaSpec: $1, updates: $2, manifest: pack.pack || pack.manifest, executionContext: executionContext});',
      [params, formulaSpec, updates],
      {
        arguments: {copy: true},
        result: {reference: true, promise: true},
      },
    );

    // And marshal out the results into a local copy of the isolate object reference.
    const localIsolateValue = await resultRef.copy();
    return localIsolateValue;
  } catch (wrappedError: any) {
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

// Lambdas can't import the v8 serialize/deserialize functions which are helpful for safely
// data into or out of isolated-vm embedded into an error message string, so we explicitly
// make a serialization function available within the lambda.
export async function injectSerializer(context: Context, stubName: string) {
  const serializeFn = (arg: any) => v8.serialize(arg).toString('base64');
  const deserializeFn = (arg: any) => v8.deserialize(Buffer.from(arg, 'base64'));
  await context.evalClosure(
    `${stubName}.serialize = (arg) => $0.applySync(undefined, [arg], {arguments: {copy: true}, result: {copy: true }})`,
    [serializeFn],
    {
      arguments: {reference: true},
    },
  );

  await context.evalClosure(
    `${stubName}.deserialize = (arg) => $0.applySync(undefined, [arg], {arguments: {copy: true}, result: {copy: true }})`,
    [deserializeFn],
    {
      arguments: {reference: true},
    },
  );
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

  await context.global.set('codaInternal', {serializer: {}}, {copy: true});
  await injectSerializer(context, 'codaInternal.serializer');

  await injectFetcherFunction(context, 'executionContext.fetcher.fetch', fetcher.fetch.bind(fetcher));

  await injectLogFunction(context, 'console.trace', logger.trace.bind(logger));
  await injectLogFunction(context, 'console.debug', logger.debug.bind(logger));
  await injectLogFunction(context, 'console.info', logger.info.bind(logger));
  await injectLogFunction(context, 'console.warn', logger.warn.bind(logger));
  await injectLogFunction(context, 'console.error', logger.error.bind(logger));
  // console.log is an alias of logger.info
  await injectLogFunction(context, 'console.log', logger.info.bind(logger));

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
  requiresManualClosure: boolean = true,
): Promise<void> {
  // reset global.exports and module.exports to be used by this bundle.
  // see buildWithES for why we need both global.exports and module.exports.
  await context.global.set('exports', {}, {copy: true});
  await context.global.set('module', {}, {copy: true});

  // compiling the bundle allows IVM to map the stack trace.
  const bundle = fs.readFileSync(path).toString();

  // manual closure will break sourcemap. esp if it's minified.
  const scriptCode = requiresManualClosure
    ? // {...exports, ...module.exports} is only necessary when the pack
      // is bundled with new sdk but runtime is on the old sdk.
      `(() => { ${stubName} = (() => { ${bundle} \n return {...exports, ...module.exports}; })(); })()`
    : bundle;

  // bundle needs to be converted into a closure to avoid leaking variables to global scope.
  const script = await isolate.compileScript(scriptCode, {
    filename: path,
  });
  await script.run(context);

  if (!requiresManualClosure) {
    // see buildWithES for why we need both global.exports and module.exports.
    await context.eval(`global.${stubName} = {...global.exports, ...module.exports};`);
  }
}

export async function registerBundles(
  isolate: Isolate,
  context: Context,
  packBundlePath: string,
  thunkBundlePath: string,
  requiresManualClosure: boolean = true,
): Promise<void> {
  await registerBundle(isolate, context, thunkBundlePath, 'coda', requiresManualClosure);
  await registerBundle(isolate, context, packBundlePath, 'pack', requiresManualClosure);
}

export function getThunkPath(): string {
  return path.join(__dirname, '../../bundles/thunk_bundle.js');
}
