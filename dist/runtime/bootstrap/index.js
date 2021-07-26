"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeThunk = exports.injectFetcherFunction = exports.injectVoidFunction = exports.injectAsyncFunction = exports.createIsolateContext = void 0;
/**
 * Setup an isolate context with sufficient globals needed to execute a pack.
 *
 * Notes:
 * 1. JSON.parse/stringify are built into v8, so we don't need to inject those.
 * 2. It is critically important that we do not leak isolated-vm object instances (e.g., Reference, ExternalCopy,
 *    etc.) directly into the untrusted isolate as that would allow it to gain access back into this nodejs root and
 *    take over the process.
 */
async function createIsolateContext(isolate) {
    const context = await isolate.createContext();
    // Setup the global object.
    const jail = context.global;
    await jail.set('global', jail.derefInto());
    // Setup a dummy commonjs-style `exports` global to enable loading a packaged bundle.
    await jail.set('exports', {}, { copy: true });
    // Attempt to hide away eval as defense-in-depth against dynamic code gen.
    // We used to block Function, but the SDK bundles in a helper that needs it :(
    await jail.set('eval', undefined, { copy: true });
    return context;
}
exports.createIsolateContext = createIsolateContext;
/**
 * Helper utilities which enables injection of a function stub into the isolate that will execute outside the sandbox.
 * Care must be taken in handling inputs in the func you pass in here.
 * See https://github.com/laverdet/isolated-vm#examples
 */
async function injectAsyncFunction(context, stubName, func) {
    const stub = async (...args) => {
        const result = await func(...args.map(arg => JSON.parse(arg)));
        return JSON.stringify(result);
    };
    // TODO(huayang): JSON.stringify/parse isn't able to serialize/deserialize error object. So context.logger.error(err)
    // is going to miss fields.
    await context.evalClosure(`${stubName} = async function(...args) {
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
     };`, [stub], { arguments: { reference: true } });
}
exports.injectAsyncFunction = injectAsyncFunction;
async function injectVoidFunction(context, stubName, func) {
    const stub = (...args) => {
        func(...args.map(arg => JSON.parse(arg)));
    };
    await context.evalClosure(`${stubName} = function(...args) {
        handleError(() => {
          $0.applyIgnored(undefined, args.map(JSON.stringify), {arguments: {copy: true}});
        });
     };`, [stub], { arguments: { reference: true } });
}
exports.injectVoidFunction = injectVoidFunction;
async function injectFetcherFunction(context, stubName, func) {
    const stub = async (requestJson) => {
        const result = await func(JSON.parse(requestJson));
        return JSON.stringify(result);
    };
    // TODO(huayang): JSON.stringify/parse isn't able to serialize/deserialize error object. So context.logger.error(err)
    // is going to miss fields.
    await context.evalClosure(`${stubName} = async function(fetchRequest) {
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
     };`, [stub], { arguments: { reference: true } });
}
exports.injectFetcherFunction = injectFetcherFunction;
/**
 * Actually execute the pack function inside the isolate by loading and passing control to the thunk.
 */
async function executeThunk(context, { params, formulaSpec }) {
    const resultRef = await context.evalClosure('return findAndExecutePackFunction($0, $1, global.exports.pack || global.exports.manifest, global.executionContext);', [params, formulaSpec], {
        arguments: { copy: true },
        result: { reference: true, promise: true },
    });
    // And marshal out the results into a local copy of the isolate object reference.
    const localIsolateValue = await resultRef.copy();
    return localIsolateValue;
}
exports.executeThunk = executeThunk;
