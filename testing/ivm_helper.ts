import type {ExecutionContext} from '../api';
import type {Context as IVMContext} from 'isolated-vm';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {StandardFormulaSpecification} from '../runtime/types';
import type {SyncFormulaSpecification} from '../runtime/types';
import {build as buildBundle} from '../cli/build';
import {createIsolateContext} from '../runtime/bootstrap';
import fs from 'fs';
import {injectExecutionContext} from '../runtime/bootstrap';
import ivm from 'isolated-vm';
import path from 'path';
import {registerBundle} from '../runtime/bootstrap';
import {translateErrorStackFromVM} from '../runtime/execution';
import {unwrapError} from '../runtime/thunk/thunk';

const IsolateMemoryLimit = 128;

// execution_helper_bundle.js is built by esbuild (see Makefile)
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = `${__dirname}/../thunk_bundle.js`;
const HelperTsSourceFile = `${__dirname}/../runtime/thunk/thunk.ts`;

export async function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext> {
  // creating an isolate with 128M memory limit.
  const isolate = new ivm.Isolate({memoryLimit: IsolateMemoryLimit});
  const ivmContext = await createIsolateContext(isolate);

  const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path.join(process.cwd(), bundlePath);
  await registerBundle(isolate, ivmContext, bundleFullPath, 'pack');

  // If the ivm helper is running by node, the compiled execution_helper bundle should be ready at the
  // dist/ directory described by CompiledHelperBundlePath. If the ivm helper is running by mocha, the
  // bundle file may not be available or update-to-date, so we'd always compile it first from
  // HelperTsSourceFile.
  //
  // TODO(huayang): this is not efficient enough and needs optimization if to be used widely in testing.
  if (fs.existsSync(CompiledHelperBundlePath)) {
    await registerBundle(isolate, ivmContext, CompiledHelperBundlePath, 'coda');
  } else if (fs.existsSync(HelperTsSourceFile)) {
    const bundlePath = await buildBundle(HelperTsSourceFile);
    await registerBundle(isolate, ivmContext, bundlePath, 'coda');
  } else {
    throw new Error('cannot find the execution helper');
  }

  await injectExecutionContext({
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

export async function executeFormulaOrSync(
  ivmContext: IVMContext,
  formulaSpecification: StandardFormulaSpecification | SyncFormulaSpecification,
  params: ParamValues<ParamDefs>,
  bundleSourceMapPath: string,
  vmFilename: string,
) {
  try {
    return await ivmContext.evalClosure(
      `return coda.findAndExecutePackFunction(
      $0,
      $1,
      pack.pack || pack.manifest,
      executionContext,
    )`,
      [params, formulaSpecification],
      {arguments: {copy: true}, result: {copy: true, promise: true}},
    );
  } catch (wrappedError) {
    const err = unwrapError(wrappedError);
    const translatedStacktrace = await translateErrorStackFromVM({
      stacktrace: err.stack,
      bundleSourceMapPath,
      vmFilename,
    });
    err.stack = `${err.constructor.name}${err.message ? `: ${err.message}` : ''}\n${translatedStacktrace}`;
    throw err;
  }
}
