"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFormulaOrSync = exports.setupIvmContext = void 0;
const build_1 = require("../cli/build");
const bootstrap_1 = require("../runtime/bootstrap");
const fs_1 = __importDefault(require("fs"));
const bootstrap_2 = require("../runtime/bootstrap");
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const path_1 = __importDefault(require("path"));
const bootstrap_3 = require("../runtime/bootstrap");
const execution_1 = require("../runtime/execution");
const thunk_1 = require("../runtime/thunk/thunk");
const IsolateMemoryLimit = 128;
// execution_helper_bundle.js is built by esbuild (see Makefile)
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = `${__dirname}/../thunk_bundle.js`;
const HelperTsSourceFile = `${__dirname}/../runtime/thunk/thunk.ts`;
async function setupIvmContext(bundlePath, executionContext) {
    // creating an isolate with 128M memory limit.
    const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: IsolateMemoryLimit });
    const ivmContext = await bootstrap_1.createIsolateContext(isolate);
    const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path_1.default.join(process.cwd(), bundlePath);
    await bootstrap_3.registerBundle(isolate, ivmContext, bundleFullPath, 'pack');
    // If the ivm helper is running by node, the compiled execution_helper bundle should be ready at the
    // dist/ directory described by CompiledHelperBundlePath. If the ivm helper is running by mocha, the
    // bundle file may not be available or update-to-date, so we'd always compile it first from
    // HelperTsSourceFile.
    //
    // TODO(huayang): this is not efficient enough and needs optimization if to be used widely in testing.
    if (fs_1.default.existsSync(CompiledHelperBundlePath)) {
        await bootstrap_3.registerBundle(isolate, ivmContext, CompiledHelperBundlePath, 'coda');
    }
    else if (fs_1.default.existsSync(HelperTsSourceFile)) {
        const bundlePath = await build_1.build(HelperTsSourceFile);
        await bootstrap_3.registerBundle(isolate, ivmContext, bundlePath, 'coda');
    }
    else {
        throw new Error('cannot find the execution helper');
    }
    await bootstrap_2.injectExecutionContext({
        context: ivmContext,
        fetcher: executionContext.fetcher,
        temporaryBlobStorage: executionContext.temporaryBlobStorage,
        logger: console,
        endpoint: executionContext.endpoint,
        timezone: executionContext.timezone,
        invocationToken: executionContext.invocationToken,
        sync: executionContext.sync,
    });
    return ivmContext;
}
exports.setupIvmContext = setupIvmContext;
async function executeFormulaOrSync(ivmContext, formulaSpecification, params, bundleSourceMapPath, vmFilename) {
    try {
        return await ivmContext.evalClosure(`return coda.findAndExecutePackFunction(
      $0,
      $1,
      pack.pack || pack.manifest,
      executionContext,
    )`, [params, formulaSpecification], { arguments: { copy: true }, result: { copy: true, promise: true } });
    }
    catch (wrappedError) {
        const err = thunk_1.unwrapError(wrappedError);
        const translatedStacktrace = await execution_1.translateErrorStackFromVM({
            stacktrace: err.stack,
            bundleSourceMapPath,
            vmFilename,
        });
        err.stack = `${err.constructor.name}${err.message ? `: ${err.message}` : ''}\n${translatedStacktrace}`;
        throw err;
    }
}
exports.executeFormulaOrSync = executeFormulaOrSync;
