"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThunkPath = exports.registerBundles = exports.registerBundle = exports.injectExecutionContext = exports.executeThunk = exports.injectFetcherFunction = exports.injectVoidFunction = exports.injectAsyncFunction = exports.createIsolateContext = void 0;
const fs_1 = __importDefault(require("fs"));
const marshaling_1 = require("../common/marshaling");
const path_1 = __importDefault(require("path"));
const source_map_1 = require("../common/source_map");
const marshaling_2 = require("../common/marshaling");
const marshaling_3 = require("../common/marshaling");
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
    // register bundle stubs.
    await jail.set('coda', {}, { copy: true });
    await jail.set('pack', {}, { copy: true });
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
        const result = await func(...args.map(arg => marshaling_2.unmarshalValue(arg)));
        return marshaling_1.marshalValue(result);
    };
    await context.evalClosure(`${stubName} = async function(...args) {
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
     };`, [stub], { arguments: { reference: true } });
}
exports.injectAsyncFunction = injectAsyncFunction;
async function injectVoidFunction(context, stubName, func) {
    const stub = (...args) => {
        func(...args.map(arg => marshaling_2.unmarshalValue(arg)));
    };
    await context.evalClosure(`${stubName} = function(...args) {
        coda.handleError(() => {
          $0.applyIgnored(undefined, args.map(coda.marshalValue), {arguments: {copy: true}});
        });
     };`, [stub], { arguments: { reference: true } });
}
exports.injectVoidFunction = injectVoidFunction;
async function injectFetcherFunction(context, stubName, func) {
    const stub = async (marshaledValue) => {
        const result = await func(marshaling_2.unmarshalValue(marshaledValue));
        return marshaling_1.marshalValue(result);
    };
    await context.evalClosure(`${stubName} = async function(fetchRequest) {
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
     };`, [stub], { arguments: { reference: true } });
}
exports.injectFetcherFunction = injectFetcherFunction;
/**
 * Actually execute the pack function inside the isolate by loading and passing control to the thunk.
 */
async function executeThunk(context, { params, formulaSpec }, packBundlePath, packBundleSourceMapPath) {
    try {
        const resultRef = await context.evalClosure('return coda.findAndExecutePackFunction($0, $1, pack.pack || pack.manifest, executionContext);', [params, formulaSpec], {
            arguments: { copy: true },
            result: { reference: true, promise: true },
        });
        // And marshal out the results into a local copy of the isolate object reference.
        const localIsolateValue = await resultRef.copy();
        return localIsolateValue;
    }
    catch (wrappedError) {
        const err = marshaling_3.unwrapError(wrappedError);
        const translatedStacktrace = await source_map_1.translateErrorStackFromVM({
            stacktrace: err.stack,
            // the sourcemap needs packBundleSourceMapPath to be either absolute or relative, but not something like
            // 'bundle.js' or 'bundle.js.map'.
            bundleSourceMapPath: path_1.default.resolve(packBundleSourceMapPath),
            vmFilename: path_1.default.resolve(packBundlePath),
        });
        const messageSuffix = err.message ? `: ${err.message}` : '';
        err.stack = `${err.constructor.name}${messageSuffix}\n${translatedStacktrace}`;
        throw err;
    }
}
exports.executeThunk = executeThunk;
/**
 * Injects the ExecutionContext object, including stubs for network calls, into the isolate.
 */
async function injectExecutionContext({ context, fetcher, temporaryBlobStorage, logger, endpoint, invocationLocation, timezone, invocationToken, sync, }) {
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
    await context.global.set('executionContext', executionContextPrimitives, { copy: true });
    await context.global.set('console', {}, { copy: true });
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
    await injectAsyncFunction(context, 'executionContext.temporaryBlobStorage.storeBlob', temporaryBlobStorage.storeBlob.bind(temporaryBlobStorage));
    await injectAsyncFunction(context, 'executionContext.temporaryBlobStorage.storeUrl', temporaryBlobStorage.storeUrl.bind(temporaryBlobStorage));
}
exports.injectExecutionContext = injectExecutionContext;
async function registerBundle(isolate, context, path, stubName) {
    // init / reset global.exports for import. Assuming the bundle is following commonJS format.
    // be aware that we don't support commonJS2 (one of webpack's output format).
    await context.global.set('exports', {}, { copy: true });
    // compiling the bundle allows IVM to map the stack trace.
    const bundle = fs_1.default.readFileSync(path).toString();
    // bundle needs to be converted into a closure to avoid leaking variables to global scope.
    const script = await isolate.compileScript(`(() => { ${bundle} \n ${stubName} = exports })()`, {
        filename: path,
    });
    await script.run(context);
}
exports.registerBundle = registerBundle;
async function registerBundles(isolate, context, packBundlePath, thunkBundlePath) {
    await registerBundle(isolate, context, thunkBundlePath, 'coda');
    await registerBundle(isolate, context, packBundlePath, 'pack');
}
exports.registerBundles = registerBundles;
function getThunkPath() {
    return path_1.default.join(__dirname, '../../bundles/thunk_bundle.js');
}
exports.getThunkPath = getThunkPath;
