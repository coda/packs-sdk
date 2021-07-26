import type {Context} from 'isolated-vm';
import type {FetchRequest} from '../../api_types';
import type {FetchResponse} from '../../api_types';
import type {FormulaSpecification} from '../types';
import type {Isolate} from 'isolated-vm';
import type {PackFormulaResult} from '../../api_types';
import type {ParamDefs} from '../../api_types';
import type {ParamValues} from '../../api_types';
import type {SyncFormulaResult} from '../../api';

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
    const result = await func(...args.map(arg => JSON.parse(arg)));
    return JSON.stringify(result);
  };

  // TODO(huayang): JSON.stringify/parse isn't able to serialize/deserialize error object. So context.logger.error(err)
  // is going to miss fields.
  await context.evalClosure(
    `${stubName} = async function(...args) {
        return handleErrorAsync(async () => {
         const result = await $0.apply(
           undefined,
           args.map(JSON.stringify),
           {
             arguments: {copy: true},
             result: {copy: true, promise: true},
           },
         );
         return JSON.parse(result);
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
    func(...args.map(arg => JSON.parse(arg)));
  };

  await context.evalClosure(
    `${stubName} = function(...args) {
        handleError(() => {
          $0.applyIgnored(undefined, args.map(JSON.stringify), {arguments: {copy: true}});
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
  const stub = async (requestJson: string) => {
    const result = await func(JSON.parse(requestJson) as FetchRequest);
    return JSON.stringify(result);
  };

  // TODO(huayang): JSON.stringify/parse isn't able to serialize/deserialize error object. So context.logger.error(err)
  // is going to miss fields.
  await context.evalClosure(
    `${stubName} = async function(fetchRequest) {
        return handleErrorAsync(async () => {
         const fetchResult = await $0.apply(
           undefined,
           [JSON.stringify(fetchRequest)],
           {
             arguments: {copy: true},
             result: {copy: true, promise: true},
           },
         );
         const parsedResult = JSON.parse(fetchResult);
         handleFetcherStatusError(parsedResult, fetchRequest);
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
export async function executeThunk(
  context: Context,
  {params, formulaSpec}: {params: ParamValues<ParamDefs>; formulaSpec: FormulaSpecification},
): Promise<SyncFormulaResult<object> | PackFormulaResult> {
  const resultRef = await context.evalClosure(
    'return findAndExecutePackFunction($0, $1, global.exports.pack || global.exports.manifest, global.executionContext);',
    [params, formulaSpec],
    {
      arguments: {copy: true},
      result: {reference: true, promise: true},
    },
  );

  // And marshal out the results into a local copy of the isolate object reference.
  const localIsolateValue = await resultRef.copy();
  return localIsolateValue;
}
