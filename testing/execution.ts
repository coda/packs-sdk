import type {Credentials} from './auth_types';
import type {ExecutionContext} from '../api_types';
import type {FormulaSpecification} from '../runtime/types';
import {FormulaType} from '../runtime/types';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackFormulaResult} from '../api_types';
import type {PackVersionDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {StandardFormulaSpecification} from '../runtime/types';
import type {SyncExecutionContext} from '../api_types';
import type {SyncFormulaResult} from '../api';
import type {SyncFormulaSpecification} from '../runtime/types';
import type {TypedPackFormula} from '../api';
import {coerceParams} from './coercion';
import {executeThunk} from '../runtime/bootstrap';
import {findFormula} from '../runtime/common/helpers';
import {findSyncFormula} from '../runtime/common/helpers';
import {getPackAuth} from '../cli/helpers';
import {importManifest} from '../cli/helpers';
import * as ivmHelper from './ivm_helper';
import {newFetcherExecutionContext} from './fetcher';
import {newFetcherSyncExecutionContext} from './fetcher';
import {newMockExecutionContext} from './mocks';
import {newMockSyncExecutionContext} from './mocks';
import * as path from 'path';
import {print} from './helpers';
import {readCredentialsFile} from './auth';
import {storeCredential} from './auth';
import * as thunk from '../runtime/thunk/thunk';
import {tryFindSyncFormula} from '../runtime/common/helpers';
import util from 'util';
import {validateParams} from './validation';
import {validateResult} from './validation';

const MaxSyncIterations = 100;

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
}

export interface ContextOptions {
  useRealFetcher?: boolean;
  manifestPath?: string;
}

function resolveFormulaNameWithNamespace(formulaNameWithNamespace: string): string {
  const [namespace, name] = formulaNameWithNamespace.includes('::')
    ? formulaNameWithNamespace.split('::')
    : ['', formulaNameWithNamespace];

  if (namespace) {
    // eslint-disable-next-line no-console
    console.log(
      `Warning: formula was invoked with a namespace (${formulaNameWithNamespace}), but namespaces are now deprecated.`,
    );
  }

  return name;
}

async function findAndExecutePackFunction<T extends FormulaSpecification>(
  params: ParamValues<ParamDefs>,
  formulaSpec: T,
  manifest: PackVersionDefinition,
  executionContext: ExecutionContext | SyncExecutionContext,
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
): Promise<T extends SyncFormulaSpecification ? SyncFormulaResult<object> : PackFormulaResult> {
  let formula: TypedPackFormula | undefined;
  switch (formulaSpec.type) {
    case FormulaType.Standard:
      formula = findFormula(manifest, formulaSpec.formulaName);
      break;
    case FormulaType.Sync:
      formula = findSyncFormula(manifest, formulaSpec.formulaName);
      break;
  }

  if (shouldValidateParams && formula) {
    validateParams(formula, params);
  }
  const result = await thunk.findAndExecutePackFunction(params, formulaSpec, manifest, executionContext, false);

  if (shouldValidateResult && formula) {
    const resultToValidate =
      formulaSpec.type === FormulaType.Sync ? (result as SyncFormulaResult<object>).result : result;
    validateResult(formula, resultToValidate);
  }

  return result;
}

export async function executeFormulaFromPackDef<T extends PackFormulaResult | SyncFormulaResult<object> = any>(
  packDef: PackVersionDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<T> {
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

  return findAndExecutePackFunction(
    params,
    {type: FormulaType.Standard, formulaName: resolveFormulaNameWithNamespace(formulaNameWithNamespace)},
    packDef,
    executionContext || newMockExecutionContext(),
    options,
  ) as T;
}

export async function executeFormulaOrSyncFromCLI({
  formulaName,
  params,
  manifest,
  manifestPath,
  vm,
  dynamicUrl,
  bundleSourceMapPath,
  bundlePath,
  contextOptions = {},
}: {
  formulaName: string;
  params: string[];
  manifest: PackVersionDefinition;
  manifestPath: string;
  vm?: boolean;
  dynamicUrl?: string;
  bundleSourceMapPath: string;
  bundlePath: string;
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

    const syncFormula = tryFindSyncFormula(manifest, formulaName);
    const formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification = {
      type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
      formulaName,
    };

    if (formulaSpecification.type === FormulaType.Sync) {
      const result = [];
      let iterations = 1;
      do {
        if (iterations > MaxSyncIterations) {
          throw new Error(
            `Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
          );
        }
        const response: SyncFormulaResult<any> = vm
          ? await executeFormulaOrSyncWithRawParamsInVM({
              formulaSpecification,
              params,
              bundleSourceMapPath,
              bundlePath,
              executionContext,
            })
          : await executeFormulaOrSyncWithRawParams({formulaSpecification, params, manifest, executionContext});

        result.push(...response.result);
        executionContext.sync.continuation = response.continuation;
        iterations++;
      } while (executionContext.sync.continuation);
      print(result);
    } else {
      const result = vm
        ? await executeFormulaOrSyncWithRawParamsInVM({
            formulaSpecification,
            params,
            bundleSourceMapPath,
            bundlePath,
            executionContext,
          })
        : await executeFormulaOrSyncWithRawParams({formulaSpecification, params, manifest, executionContext});
      print(result);
    }
  } catch (err) {
    print(err);
    process.exit(1);
  }
}

export async function executeFormulaOrSyncWithVM<T extends PackFormulaResult | SyncFormulaResult<object> = any>({
  formulaName,
  params,
  bundlePath,
  executionContext = newMockSyncExecutionContext(),
}: {
  formulaName: string;
  params: ParamValues<ParamDefs>;
  bundlePath: string;
  executionContext?: ExecutionContext;
}): Promise<T> {
  // TODO(huayang): importing manifest makes this method not usable in production, where we are not
  // supposed to load a manifest outside of the VM context.
  const manifest = await importManifest(bundlePath);
  const syncFormula = tryFindSyncFormula(manifest, formulaName);
  const formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification = {
    type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
    formulaName,
  };

  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  return executeThunk(ivmContext, {params, formulaSpec: formulaSpecification}, bundlePath, bundlePath + '.map') as T;
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

async function executeFormulaOrSyncWithRawParamsInVM<
  T extends SyncFormulaSpecification | StandardFormulaSpecification,
>({
  formulaSpecification,
  params: rawParams,
  bundlePath,
  bundleSourceMapPath,
  executionContext = newMockSyncExecutionContext(),
}: {
  formulaSpecification: T;
  params: string[];
  executionContext?: SyncExecutionContext;
  bundleSourceMapPath: string;
  bundlePath: string;
}): Promise<T extends SyncFormulaSpecification ? SyncFormulaResult<object> : PackFormulaResult> {
  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  const manifest = await importManifest(bundlePath);
  let params: ParamValues<ParamDefs>;
  if (formulaSpecification.type === FormulaType.Standard) {
    const formula = findFormula(manifest, formulaSpecification.formulaName);
    params = coerceParams(formula, rawParams as any);
  } else {
    const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
    params = coerceParams(syncFormula, rawParams as any);
  }

  return executeThunk(ivmContext, {params, formulaSpec: formulaSpecification}, bundlePath, bundleSourceMapPath);
}

export async function executeFormulaOrSyncWithRawParams<
  T extends StandardFormulaSpecification | SyncFormulaSpecification,
>({
  formulaSpecification,
  params: rawParams,
  manifest,
  executionContext,
}: {
  formulaSpecification: T;
  params: string[];
  manifest: PackVersionDefinition;
  vm?: boolean;
  executionContext: SyncExecutionContext;
}): Promise<T extends SyncFormulaSpecification ? SyncFormulaResult<object> : PackFormulaResult> {
  let params: ParamValues<ParamDefs>;
  if (formulaSpecification.type === FormulaType.Standard) {
    const formula = findFormula(manifest, formulaSpecification.formulaName);
    params = coerceParams(formula, rawParams as any);
  } else {
    const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
    params = coerceParams(syncFormula, rawParams as any);
  }

  return findAndExecutePackFunction(params, formulaSpecification, manifest, executionContext);
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
export async function executeSyncFormulaFromPackDef<T extends object = any>(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  {validateParams: shouldValidateParams = true, validateResult: shouldValidateResult = true}: ExecuteOptions = {},
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<T[]> {
  const formula = findSyncFormula(packDef, syncFormulaName);
  if (shouldValidateParams && formula) {
    validateParams(formula, params);
  }

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
  const result = [];
  let iterations = 1;
  do {
    if (iterations > MaxSyncIterations) {
      throw new Error(
        `Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
      );
    }
    const response = await findAndExecutePackFunction(
      params,
      {formulaName: syncFormulaName, type: FormulaType.Sync},
      packDef,
      executionContext,
      {validateParams: false, validateResult: false},
    );

    result.push(...response.result);
    executionContext.sync.continuation = response.continuation;
    iterations++;
  } while (executionContext.sync.continuation);

  if (shouldValidateResult && formula) {
    validateResult(formula, result);
  }

  return result as T[];
}

/**
 * Executes a single sync iteration, and returns the return value from the sync formula
 * including the continuation, for inspection.
 */
export async function executeSyncFormulaFromPackDefSingleIteration<T extends object>(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<SyncFormulaResult<T>> {
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

  return findAndExecutePackFunction(
    params,
    {formulaName: syncFormulaName, type: FormulaType.Sync},
    packDef,
    executionContext || newMockSyncExecutionContext(),
    options,
  ) as Promise<SyncFormulaResult<T>>;
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
