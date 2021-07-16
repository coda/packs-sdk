import type {Credentials} from './auth_types';
import type {ExecuteOptions} from './execution_helper';
import type {ExecutionContext} from '../api_types';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackVersionDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import type {SyncFormulaResult} from '../api';
import {compilePackBundle} from './compile';
import {getPackAuth} from '../cli/helpers';
import * as helper from './execution_helper';
import * as ivmHelper from './ivm_helper';
import {newFetcherExecutionContext} from './fetcher';
import {newFetcherSyncExecutionContext} from './fetcher';
import {newMockExecutionContext} from './mocks';
import {newMockSyncExecutionContext} from './mocks';
import * as path from 'path';
import {print} from './helpers';
import {readCredentialsFile} from './auth';
import {storeCredential} from './auth';
import {translateErrorStackFromVM} from '../runtime/execution';
import util from 'util';

const MaxSyncIterations = 100;

export {ExecuteOptions} from './execution_helper';

export interface ContextOptions {
  useRealFetcher?: boolean;
  manifestPath?: string;
}

export async function executeFormulaFromPackDef(
  packDef: PackVersionDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
) {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    const credentials = getCredentials(manifestPath);
    executionContext = newFetcherExecutionContext(
      buildUpdateCredentialsCallback(manifestPath),
      getPackAuth(packDef),
      packDef.networkDomains,
      credentials,
    );
  }

  const formula = helper.findFormula(packDef, formulaNameWithNamespace);
  return helper.executeFormula(formula, params, executionContext || newMockExecutionContext(), options);
}

export async function executeFormulaOrSyncFromCLI({
  formulaName,
  params,
  manifest,
  manifestPath,
  vm,
  dynamicUrl,
  contextOptions = {},
}: {
  formulaName: string;
  params: string[];
  manifest: PackVersionDefinition;
  manifestPath: string;
  vm?: boolean;
  dynamicUrl?: string;
  contextOptions?: ContextOptions;
}) {
  try {
    const {useRealFetcher} = contextOptions;

    const credentials = useRealFetcher && manifestPath ? getCredentials(manifestPath) : undefined;
    // A sync context would work for both formula / syncFormula execution for now.
    // TODO(jonathan): Pass the right context, just to set user expectations correctly for runtime values.
    const executionContext = useRealFetcher
      ? newFetcherSyncExecutionContext(
          buildUpdateCredentialsCallback(manifestPath),
          getPackAuth(manifest),
          manifest.networkDomains,
          credentials,
        )
      : newMockSyncExecutionContext();
    executionContext.sync.dynamicUrl = dynamicUrl || undefined;

    const syncFormula = helper.tryFindSyncFormula(manifest, formulaName);
    if (syncFormula) {
      const result = [];
      let iterations = 1;
      do {
        if (iterations > MaxSyncIterations) {
          throw new Error(
            `Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
          );
        }
        const response: SyncFormulaResult<any> = vm
          ? await executeFormulaOrSyncWithRawParamsInVM({formulaName, params, manifestPath, executionContext})
          : await executeFormulaOrSyncWithRawParams({formulaName, params, manifest, executionContext});

        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
      } while (executionContext.sync.continuation);
      print(result);
    } else {
      const result = vm
        ? await executeFormulaOrSyncWithRawParamsInVM({formulaName, params, manifestPath, executionContext})
        : await executeFormulaOrSyncWithRawParams({formulaName, params, manifest, executionContext});
      print(result);
    }
  } catch (err) {
    print(err);
    process.exit(1);
  }
}

export async function executeFormulaOrSyncWithVM({
  formulaName,
  params,
  bundlePath,
  executionContext = newMockSyncExecutionContext(),
}: {
  formulaName: string;
  params: ParamValues<ParamDefs>;
  bundlePath: string;
  executionContext?: SyncExecutionContext;
}) {
  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  return ivmHelper.executeFormulaOrSync(ivmContext, formulaName, params);
}

export class VMError {
  name: string;
  message: string;
  stack: string;

  constructor(name: string, message: string, stack: string) {
    this.name = name;
    this.message = message;
    this.stack = stack;
  }

  [util.inspect.custom]() {
    return `${this.name}: ${this.message}\n${this.stack}`;
  }
}

export async function executeFormulaOrSyncWithRawParamsInVM({
  formulaName,
  params: rawParams,
  manifestPath,
  executionContext = newMockSyncExecutionContext(),
}: {
  formulaName: string;
  params: string[];
  manifestPath: string;
  executionContext?: SyncExecutionContext;
}) {
  const {bundleSourceMapPath, bundlePath} = await compilePackBundle({manifestPath, minify: false});

  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  try {
    return await ivmHelper.executeFormulaOrSyncWithRawParams(ivmContext, formulaName, rawParams);
  } catch (err) {
    throw new VMError(
      err.name,
      err.message,
      (await translateErrorStackFromVM({stacktrace: err.stack, bundleSourceMapPath, vmFilename: bundlePath})) || '',
    );
  }
}

export async function executeFormulaOrSyncWithRawParams({
  formulaName,
  params: rawParams,
  manifest,
  executionContext,
}: {
  formulaName: string;
  params: string[];
  manifest: PackVersionDefinition;
  vm?: boolean;
  executionContext: SyncExecutionContext;
}) {
  return helper.executeFormulaOrSyncWithRawParams(manifest, formulaName, rawParams, executionContext);
}

/**
 * Executes multiple iterations of a sync formula in a loop until there is no longer
 * a `continuation` returned, aggregating each page of results and returning an array
 * with results of all iterations combined and flattened.
 *
 * NOTE: This currently runs all the iterations in a simple loop, which does not
 * adequately simulate the fact that in a real execution environment each iteration
 * will be run in a completely isolated environment, with absolutely no sharing
 * of state or global variables between iterations.
 *
 * For now, use `coda execute --vm` to simulate that level of isolation.
 */
export async function executeSyncFormulaFromPackDef(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<any[]> {
  let executionContext = context;
  if (!executionContext) {
    if (useRealFetcher) {
      const credentials = getCredentials(manifestPath);
      executionContext = newFetcherSyncExecutionContext(
        buildUpdateCredentialsCallback(manifestPath),
        getPackAuth(packDef),
        packDef.networkDomains,
        credentials,
      );
    } else {
      executionContext = newMockSyncExecutionContext();
    }
  }
  const formula = helper.findSyncFormula(packDef, syncFormulaName);

  const result = [];
  let iterations = 1;
  do {
    if (iterations > MaxSyncIterations) {
      throw new Error(
        `Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
      );
    }
    const response = await helper.executeSyncFormula(formula, params, executionContext, options);
    result.push(...response.result);
    executionContext.sync.continuation = response.continuation;
    iterations++;
  } while (executionContext.sync.continuation);

  return result;
}

/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export async function executeSyncFormulaFromPackDefSingleIteration(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<SyncFormulaResult<any>> {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    const credentials = getCredentials(manifestPath);
    executionContext = newFetcherSyncExecutionContext(
      buildUpdateCredentialsCallback(manifestPath),
      getPackAuth(packDef),
      packDef.networkDomains,
      credentials,
    );
  }

  const formula = helper.findSyncFormula(packDef, syncFormulaName);
  return helper.executeSyncFormula(formula, params, executionContext || newMockSyncExecutionContext(), options);
}

export async function executeMetadataFormula(
  formula: MetadataFormula,
  metadataParams: {
    search?: string;
    formulaContext?: MetadataContext;
  } = {},
  context: ExecutionContext = newMockExecutionContext(),
) {
  const {search, formulaContext} = metadataParams;
  return formula.execute([search || '', formulaContext ? JSON.stringify(formulaContext) : ''], context);
}

function getCredentials(manifestPath: string | undefined) {
  if (manifestPath) {
    const manifestDir = path.dirname(manifestPath);
    return readCredentialsFile(manifestDir);
  }
}

function buildUpdateCredentialsCallback(manifestPath: string | undefined): (newCredentials: Credentials) => void {
  return newCredentials => {
    if (manifestPath) {
      storeCredential(path.dirname(manifestPath), newCredentials);
    }
  };
}
