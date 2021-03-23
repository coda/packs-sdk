import type { ContextOptions } from './execution';
import type {Context as IVMContext} from 'isolated-vm';
import type { SyncExecutionContext } from 'api_types';
import fs from 'fs';
import ivm from 'isolated-vm';
import { newFetcherSyncExecutionContext } from './fetcher';
import path from 'path';
import {print} from './helpers';

const IsolateMemoryLimit = 128;
const CodaRuntime = '__coda__runtime__';

// bundle_execution_helper_bundle.js is built by esbuild (see Makefile) 
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = `${__dirname}/bundle_execution_helper_bundle.js`;

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
    { arguments: { reference: true }, result: { copy: true } },
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
    {arguments: { reference: true }},
  );
}

let isolate: ivm.Isolate | null = null;

export async function registerBundle(context: IVMContext, path: string, stubName: string): Promise<void> {
  // init / reset global.exports for import. Assuming the bundle is following commonJS format.
  // be aware that we don't support commonJS2 (one of webpack's output format).
  await context.global.set('exports', {}, {copy: true});

  // compiling the bundle allows IVM to map the stack trace.
  const bundle = fs.readFileSync(path).toString();
  // await context.evalClosure(`${bundle}; ${stubName} = exports`);

  // compiling the bundle using a script will nicely give us the stack information. 
  // however ivm doesn't have an API to run script in a closure. instead all the
  // registries will leak to global scope and possibly override each other.
  const script = await isolate!.compileScript(bundle, {filename: `file:///${path}`});
  await script.run(context);
  await context.evalClosure(`${stubName} = exports`);
}

function getStubName(name: string): string {
  return `${CodaRuntime}.${name}`;
}

async function setupExecutionContext(
  ivmContext: IVMContext,
  {credentialsFile}: ContextOptions = {},
) {
  const runtimeContext = await ivmContext.global.get(CodaRuntime, {reference: true});

  // defaultAuthentication has a few function methods and can't be copied without being serialized first.
  const authJSON = await ivmContext.eval(`JSON.stringify(${getStubName('pack.manifest.defaultAuthentication')})`, {copy: true});
  const auth = JSON.parse(authJSON.result || '');
  const name = (await ivmContext.eval(`${getStubName('pack.manifest.name')}`, {copy: true})).result as string;
  const executionContext = newFetcherSyncExecutionContext(
    name,
    auth,
    credentialsFile,
  );

  // set up a stub to be copied into the ivm context. we are not copying executionContext directly since
  // part of the object is not transferrable. 
  const executionContextStub: SyncExecutionContext = {
    ...executionContext,

    // override the non-transferrable fields to empty stubs. 
    fetcher: {} as any,
    temporaryBlobStorage: {} as any,
    logger: {} as any,
  }

  await runtimeContext.set('executionContext', executionContextStub, {copy: true});
  await mapAsyncFunction(ivmContext, getStubName('executionContext.fetcher.fetch'), executionContext.fetcher.fetch.bind(executionContext.fetcher));
  await mapAsyncFunction(ivmContext, getStubName('executionContext.temporaryBlobStorage.storeUrl'), executionContext.temporaryBlobStorage.storeUrl.bind(executionContext.temporaryBlobStorage));
  await mapAsyncFunction(ivmContext, getStubName('executionContext.temporaryBlobStorage.storeBlob'), executionContext.temporaryBlobStorage.storeBlob.bind(executionContext.temporaryBlobStorage));
  await mapCallbackFunction(ivmContext, getStubName('executionContext.logger.trace'), executionContext.logger.trace.bind(executionContext.logger));
  await mapCallbackFunction(ivmContext, getStubName('executionContext.logger.debug'), executionContext.logger.debug.bind(executionContext.logger));
  await mapCallbackFunction(ivmContext, getStubName('executionContext.logger.info'), executionContext.logger.info.bind(executionContext.logger));
  await mapCallbackFunction(ivmContext, getStubName('executionContext.logger.warn'), executionContext.logger.warn.bind(executionContext.logger));
  await mapCallbackFunction(ivmContext, getStubName('executionContext.logger.error'), executionContext.logger.error.bind(executionContext.logger));  
}

async function createIvmContext(isolate: ivm.Isolate): Promise<IVMContext> {
  // context is like a container in ivm concept.
  const ivmContext = await isolate.createContext();

  // create global for the context. Otherwise it's going to be a reference object.
  const jail = ivmContext.global;
  await jail.set('global', jail.derefInto());

  // security protection
  await jail.set('eval', undefined, {copy: true});
  // await jail.set('Function', undefined, {copy: true});

  // coda runtime is used to store all the variables that we need to run the formula. 
  // it avoids the risk of conflict if putting those variables under global.
  await ivmContext.global.set(CodaRuntime, {}, {copy: true});

  // for debugging purpose, map console.log into the ivm context. it should be removed once we 
  // hook logger into the execution context.
  await ivmContext.global.set('console', {}, {copy: true});
  // eslint-disable-next-line no-console
  await mapCallbackFunction(ivmContext, 'console.log', console.log);
  // eslint-disable-next-line no-console
  await mapCallbackFunction(ivmContext, 'console.error', console.error);
  return ivmContext;
}

export async function executeFormulaOrSyncFromBundle({
  bundlePath,
  formulaName,
  params: rawParams,
  contextOptions: executionContextOptions = {},
}: {
  bundlePath: string;
  formulaName: string;
  params: string[];
  contextOptions?: ContextOptions;
}) {
  try {
    // creating an isolate with 128M memory limit.    
    isolate = new ivm.Isolate({ memoryLimit: IsolateMemoryLimit });
    const ivmContext = await createIvmContext(isolate);

    const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path.join(process.cwd(), bundlePath);
    await registerBundle(ivmContext, bundleFullPath, getStubName('pack'));
    await registerBundle(ivmContext, CompiledHelperBundlePath, getStubName('bundleExecutionHelper'));
    await setupExecutionContext(ivmContext, executionContextOptions);

    // run the formula and redirect result/error.
    const resultPromise = await ivmContext.evalClosure(
      `return ${getStubName('bundleExecutionHelper')}.executeFormulaOrSyncWithRawParams(
        ${getStubName('pack.manifest')}, 
        $0, 
        $1, 
        ${getStubName('executionContext')}
      )`, 
      [formulaName, rawParams],
      {arguments: {copy: true}, result: {copy: true, promise: true}},
    );
    const result = await resultPromise.result;
    print(result);
  } catch (err) {
    print(err);
    process.exit(1);
  } finally {
    if (isolate) {
      isolate.dispose();
    }
  }
}