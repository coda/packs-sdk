import type {ExecutionContext} from '../api';
import type {Context as IVMContext} from 'isolated-vm';
import {build as buildBundle} from '../cli/build';
import {createIsolateContext} from '../runtime/bootstrap';
import fs from 'fs';
import {getIvm} from './ivm_wrapper';
import {getThunkPath} from '../runtime/bootstrap';
import {injectExecutionContext} from '../runtime/bootstrap';
import {injectSerializer} from '../runtime/bootstrap';
import path from 'path';
import {registerBundles} from '../runtime/bootstrap';

const IsolateMemoryLimit = 128;

// execution_helper_bundle.js is built by esbuild (see Makefile)
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = getThunkPath();
const HelperTsSourceFile = `${__dirname}/../runtime/thunk/thunk.ts`;

export async function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext> {
  const ivm = getIvm();
  // creating an isolate with 128M memory limit.
  const isolate = new ivm.Isolate({memoryLimit: IsolateMemoryLimit});
  const ivmContext = await createIsolateContext(isolate);

  const bundleFullPath = path.isAbsolute(bundlePath) ? bundlePath : path.join(process.cwd(), bundlePath);

  // If the ivm helper is running by node, the compiled execution_helper bundle should be ready at the
  // dist/ directory described by CompiledHelperBundlePath. If the ivm helper is running by mocha, the
  // bundle file may not be available or update-to-date, so we'd always compile it first from
  // HelperTsSourceFile.
  //
  // TODO(huayang): this is not efficient enough and needs optimization if to be used widely in testing.
  if (fs.existsSync(CompiledHelperBundlePath)) {
    await ivmContext.global.set('codaInternal', {serializer: {}}, {copy: true});
    await injectSerializer(ivmContext, 'codaInternal.serializer');

    await registerBundles(isolate, ivmContext, bundleFullPath, CompiledHelperBundlePath, false);
  } else if (fs.existsSync(HelperTsSourceFile)) {
    await ivmContext.global.set('codaInternal', {serializer: {}}, {copy: true});
    await injectSerializer(ivmContext, 'codaInternal.serializer');

    const bundlePath = await buildBundle(HelperTsSourceFile);
    await registerBundles(isolate, ivmContext, bundleFullPath, bundlePath, false);
  } else {
    throw new Error('cannot find the execution helper');
  }

  await injectExecutionContext({
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
