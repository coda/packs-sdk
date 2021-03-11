import type { ContextOptions } from './execution';
import type {Context as IVMContext} from 'isolated-vm';
import type {Isolate} from 'isolated-vm';
import fs from 'fs';
import ivm from 'isolated-vm';
import path from 'path';
import {print} from './helpers';

const IsolateMemoryLimit = 128;
const CodaRuntime = '__coda__runtime__';

// bundle_execution_helper_bundle.js is built by esbuild (see Makefile) 
// which puts it into the same directory: dist/testing/
const CompiledHelperBundlePath = `${__dirname}/bundle_execution_helper_bundle.js`;

// Maps a local function into the ivm context global function as a callback.
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

export async function registerBundle(
  isolate: Isolate, context: IVMContext, path: string, stubName: string): Promise<void> {
  // init / reset global.exports for import. Assuming the bundle is following commonJS format.
  // be aware that we don't support commonJS2 (one of webpack's output format).
  await context.global.set('exports', {}, {copy: true});

  // compiling the bundle allows IVM to map the stack trace.
  const bundle = fs.readFileSync(path).toString();
  const script = await isolate.compileScript(bundle, {filename: `file:///${path}`});
  await script.run(context);

  await context.eval(`${stubName} = exports`);
}

function getStubName(name: string): string {
  return `${CodaRuntime}.${name}`;
}

// TODO(huayang): support sync table, format, etc.
export async function executeFormulaOrSyncFromBundle({
  bundlePath,
  formulaName,
  params: rawParams,
  _contextOptions = {},
}: {
  bundlePath: string;
  formulaName: string;
  params: string[];
  _contextOptions?: ContextOptions;
}) {
  let isolate: ivm.Isolate | null = null;
  try {
    // creating an isolate with 128M memory limit.    
    isolate = new ivm.Isolate({ memoryLimit: IsolateMemoryLimit });

    // context is like a container in ivm concept.
    const ivmContext = await isolate.createContext();

    // create global for the context. Otherwise it's going to be a reference object.
    const jail = ivmContext.global;
    await jail.set('global', jail.derefInto());

    // coda runtime is used to store all the variables that we need to run the formula. 
    // it avoids the risk of conflict if putting those variables under global.
    await ivmContext.global.set(CodaRuntime, {}, {copy: true});

    // for debugging purpose, map console.log into the ivm context. it should be removed once we 
    // hook logger into the execution context.
    await ivmContext.global.set('console', {}, {copy: true});
    // eslint-disable-next-line no-console
    await mapCallbackFunction(ivmContext, 'console.log', console.log);

    // TODO(huayang): set up fetcher stub. we need to revisit every thing we have in the execution context 
    // since everything there needs to be explicitly passed in, using a callback.

    const bundleFullPath = bundlePath.startsWith('/') ? bundlePath : path.join(process.cwd(), bundlePath);
    await registerBundle(isolate, ivmContext, bundleFullPath, getStubName('pack'));
    await registerBundle(isolate, ivmContext, CompiledHelperBundlePath, getStubName('bundleExecutionHelper'));

    // run the formula and redirect result/error.
    const resultPromise = await ivmContext.evalClosure(
      `return ${getStubName('bundleExecutionHelper')}.executeFormulaWithRawParams(
        ${getStubName('pack.manifest')}, 
        $0, 
        $1, 
        {}
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