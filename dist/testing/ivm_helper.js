"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIvmContext = void 0;
const build_1 = require("../cli/build");
const bootstrap_1 = require("../runtime/bootstrap");
const fs_1 = __importDefault(require("fs"));
const bootstrap_2 = require("../runtime/bootstrap");
const bootstrap_3 = require("../runtime/bootstrap");
const isolated_vm_1 = __importDefault(require("isolated-vm"));
const path_1 = __importDefault(require("path"));
const bootstrap_4 = require("../runtime/bootstrap");
const IsolateMemoryLimit = 128;
// execution_helper_bundle.js is built by esbuild (see Makefile)
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = bootstrap_2.getThunkPath();
const HelperTsSourceFile = `${__dirname}/../runtime/thunk/thunk.ts`;
async function setupIvmContext(bundlePath, executionContext) {
    // creating an isolate with 128M memory limit.
    const isolate = new isolated_vm_1.default.Isolate({ memoryLimit: IsolateMemoryLimit });
    const ivmContext = await bootstrap_1.createIsolateContext(isolate);
    const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path_1.default.join(process.cwd(), bundlePath);
    // If the ivm helper is running by node, the compiled execution_helper bundle should be ready at the
    // dist/ directory described by CompiledHelperBundlePath. If the ivm helper is running by mocha, the
    // bundle file may not be available or update-to-date, so we'd always compile it first from
    // HelperTsSourceFile.
    //
    // TODO(huayang): this is not efficient enough and needs optimization if to be used widely in testing.
    if (fs_1.default.existsSync(CompiledHelperBundlePath)) {
        await bootstrap_4.registerBundles(isolate, ivmContext, bundleFullPath, CompiledHelperBundlePath);
    }
    else if (fs_1.default.existsSync(HelperTsSourceFile)) {
        const bundlePath = await build_1.build(HelperTsSourceFile);
        await bootstrap_4.registerBundles(isolate, ivmContext, bundleFullPath, bundlePath);
    }
    else {
        throw new Error('cannot find the execution helper');
    }
    await bootstrap_3.injectExecutionContext({
        context: ivmContext,
        fetcher: executionContext.fetcher,
        temporaryBlobStorage: executionContext.temporaryBlobStorage,
        logger: console,
        endpoint: executionContext.endpoint,
        invocationLocation: executionContext.invocationLocation,
        timezone: executionContext.timezone,
        invocationToken: executionContext.invocationToken,
        sync: executionContext.sync,
    });
    return ivmContext;
}
exports.setupIvmContext = setupIvmContext;
