import type {ExecutionContext} from '../api';
import type {Context as IVMContext} from 'isolated-vm';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import {build as buildBundle} from '../cli/build';
import fs from 'fs';
import ivm from 'isolated-vm';
import path from 'path';

const IsolateMemoryLimit = 128;
const CodaRuntime = '__coda__runtime__';

// execution_helper_bundle.js is built by esbuild (see Makefile)
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = `${__dirname}/execution_helper_bundle.js`;
const HelperTsSourceFile = `${__dirname}/execution_helper.ts`;

// Maps a local function into the ivm context.
async function mapCallbackFunction(
  context: IVMContext,
  stubName: string,
  method: (...args: any[]) => void,
): Promise<void> {
  await context.evalClosure(
    `${stubName} = function(...args) {
       $0.applyIgnored(undefined, args, { arguments: { copy: true } });} `,
    [(...args: any[]) => method(...args)],
    {arguments: {reference: true}, result: {copy: true}},
  );
}

// Maps a local async function into the ivm context.
async function mapAsyncFunction(
  context: IVMContext,
  stubName: string,
  method: (...args: any[]) => void,
): Promise<void> {
  await context.evalClosure(
    `${stubName} = async function(...args) {
      return $0.apply(
        undefined,
        args,
        {
          arguments: {copy: true},
          result: {copy: true, promise: true},
        },
      );
    }`,
    [(...args: any[]) => method(...args)],
    {arguments: {reference: true}},
  );
}

export async function registerBundle(
  isolate: ivm.Isolate,
  context: IVMContext,
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

function getStubName(name: string): string {
  return `${CodaRuntime}.${name}`;
}

async function setupExecutionContext(ivmContext: IVMContext, executionContext: ExecutionContext) {
  const runtimeContext = await ivmContext.global.get(CodaRuntime, {reference: true});

  // set up a stub to be copied into the ivm context. we are not copying executionContext directly since
  // part of the object is not transferrable.
  const executionContextStub: ExecutionContext = {
    ...executionContext,

    // override the non-transferrable fields to empty stubs.
    fetcher: {} as any,
    temporaryBlobStorage: {} as any,
    logger: {} as any,
  };

  await runtimeContext.set('executionContext', executionContextStub, {copy: true});
  await mapAsyncFunction(
    ivmContext,
    getStubName('executionContext.fetcher.fetch'),
    executionContext.fetcher.fetch.bind(executionContext.fetcher),
  );
  await mapAsyncFunction(
    ivmContext,
    getStubName('executionContext.temporaryBlobStorage.storeUrl'),
    executionContext.temporaryBlobStorage.storeUrl.bind(executionContext.temporaryBlobStorage),
  );
  await mapAsyncFunction(
    ivmContext,
    getStubName('executionContext.temporaryBlobStorage.storeBlob'),
    executionContext.temporaryBlobStorage.storeBlob.bind(executionContext.temporaryBlobStorage),
  );
  await mapCallbackFunction(
    ivmContext,
    getStubName('executionContext.logger.trace'),
    executionContext.logger.trace.bind(executionContext.logger),
  );
  await mapCallbackFunction(
    ivmContext,
    getStubName('executionContext.logger.debug'),
    executionContext.logger.debug.bind(executionContext.logger),
  );
  await mapCallbackFunction(
    ivmContext,
    getStubName('executionContext.logger.info'),
    executionContext.logger.info.bind(executionContext.logger),
  );
  await mapCallbackFunction(
    ivmContext,
    getStubName('executionContext.logger.warn'),
    executionContext.logger.warn.bind(executionContext.logger),
  );
  await mapCallbackFunction(
    ivmContext,
    getStubName('executionContext.logger.error'),
    executionContext.logger.error.bind(executionContext.logger),
  );
}

async function createIvmContext(isolate: ivm.Isolate): Promise<IVMContext> {
  // context is like a container in ivm concept.
  const ivmContext = await isolate.createContext();

  // create global for the context. Otherwise it's going to be a reference object.
  const jail = ivmContext.global;
  await jail.set('global', jail.derefInto());

  // security protection
  await jail.set('eval', undefined, {copy: true});
  await ivmContext.eval('Function.constructor = undefined');
  await ivmContext.eval('Function.prototype.constructor = undefined');

  // coda runtime is used to store all the variables that we need to run the formula.
  // it avoids the risk of conflict if putting those variables under global.
  await ivmContext.global.set(CodaRuntime, {}, {copy: true});

  // for debugging purpose, map console.log into the ivm context. it should be removed once we
  // hook logger into the execution context.
  await ivmContext.global.set('console', {}, {copy: true});
  // eslint-disable-next-line no-console
  await mapCallbackFunction(ivmContext, 'console.log', console.log);
  return ivmContext;
}

export async function setupIvmContext(bundlePath: string, executionContext: ExecutionContext): Promise<IVMContext> {
  // creating an isolate with 128M memory limit.
  const isolate = new ivm.Isolate({memoryLimit: IsolateMemoryLimit});
  const ivmContext = await createIvmContext(isolate);

  const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path.join(process.cwd(), bundlePath);
  await registerBundle(isolate, ivmContext, bundleFullPath, getStubName('pack'));

  // If the ivm helper is running by node, the compiled execution_helper bundle should be ready at the
  // dist/ directory described by CompiledHelperBundlePath. If the ivm helper is running by mocha, the
  // bundle file may not be available or update-to-date, so we'd always compile it first from
  // HelperTsSourceFile.
  //
  // TODO(huayang): this is not efficient enough and needs optimization if to be used widely in testing.
  if (fs.existsSync(CompiledHelperBundlePath)) {
    await registerBundle(isolate, ivmContext, CompiledHelperBundlePath, getStubName('bundleExecutionHelper'));
  } else if (fs.existsSync(HelperTsSourceFile)) {
    const bundlePath = await buildBundle(HelperTsSourceFile);
    await registerBundle(isolate, ivmContext, bundlePath, getStubName('bundleExecutionHelper'));
  } else {
    throw new Error('cannot find the execution helper');
  }

  await setupExecutionContext(ivmContext, executionContext);

  return ivmContext;
}

export async function executeFormulaOrSyncWithRawParams(
  ivmContext: IVMContext,
  formulaName: string,
  rawParams: string[],
) {
  return ivmContext.evalClosure(
    `return ${getStubName('bundleExecutionHelper')}.executeFormulaOrSyncWithRawParams(
      ${getStubName('pack.pack')} || ${getStubName('pack.manifest')},
      $0,
      $1,
      ${getStubName('executionContext')}
    )`,
    [formulaName, rawParams],
    {arguments: {copy: true}, result: {copy: true, promise: true}},
  );
}

export async function executeFormulaOrSync(
  ivmContext: IVMContext,
  formulaName: string,
  params: ParamValues<ParamDefs>,
) {
  return ivmContext.evalClosure(
    `return ${getStubName('bundleExecutionHelper')}.executeFormulaOrSync(
      ${getStubName('pack.pack')} || ${getStubName('pack.manifest')},
      $0,
      $1,
      ${getStubName('executionContext')}
    )`,
    [formulaName, params],
    {arguments: {copy: true}, result: {copy: true, promise: true}},
  );
}
