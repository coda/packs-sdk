import type {BasicPackDefinition} from '../types';
import type {Credentials} from './auth_types';
import type {ExecutionContext} from '../api_types';
import type {FormulaSpecification} from '../runtime/types';
import {FormulaType} from '../runtime/types';
import type {GenericSyncFormulaResult} from '../api';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackFormulaResult} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {StandardFormulaSpecification} from '../runtime/types';
import type {SyncExecutionContext} from '../api_types';
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
import {transformBody} from '../handler_templates';
import {tryFindFormula} from '../runtime/common/helpers';
import {tryFindSyncFormula} from '../runtime/common/helpers';
import util from 'util';
import {validateParams} from './validation';
import {validateResult} from './validation';

const MaxSyncIterations = 100;
export const DEFAULT_MAX_ROWS = 1000;

export interface ExecuteOptions {
  validateParams?: boolean;
  validateResult?: boolean;
  useDeprecatedResultNormalization?: boolean;
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
  manifest: BasicPackDefinition,
  executionContext: ExecutionContext | SyncExecutionContext,
  {
    validateParams: shouldValidateParams = true,
    validateResult: shouldValidateResult = true,
    // TODO(alexd): Switch this to false or remove when we launch 1.0.0
    useDeprecatedResultNormalization = true,
  }: ExecuteOptions = {},
): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult> {
  let formula: TypedPackFormula | undefined;
  switch (formulaSpec.type) {
    case FormulaType.Standard:
      formula = findFormula(manifest, formulaSpec.formulaName);
      break;
    case FormulaType.Sync:
    case FormulaType.SyncUpdate:
      // TODO(Chris): Update the CLI so a user can select which of these executors they want to run.
      formula = findSyncFormula(manifest, formulaSpec.formulaName);
      break;
  }

  if (shouldValidateParams && formula) {
    validateParams(formula, params);
  }
  let result = await thunk.findAndExecutePackFunction({
    params,
    formulaSpec,
    manifest,
    executionContext,
    shouldWrapError: false,
  });

  if (useDeprecatedResultNormalization && formula) {
    const resultToNormalize =
      formulaSpec.type === FormulaType.Sync ? (result as GenericSyncFormulaResult).result : result;

    // Matches legacy behavior within handler_templates:generateObjectResponseHandler where we never
    // called transform body on non-object responses.
    if (typeof resultToNormalize === 'object') {
      const schema = executionContext?.sync?.schema ?? formula.schema;
      const normalizedResult = transformBody(resultToNormalize, schema);
      if (formulaSpec.type === FormulaType.Sync) {
        (result as GenericSyncFormulaResult).result = normalizedResult;
      } else {
        result = normalizedResult;
      }
    }
  }

  if (shouldValidateResult && formula) {
    const resultToValidate =
      formulaSpec.type === FormulaType.Sync ? (result as GenericSyncFormulaResult).result : result;
    validateResult(formula, resultToValidate);
  }

  return result;
}

export async function executeFormulaFromPackDef<T extends PackFormulaResult | GenericSyncFormulaResult = any>(
  packDef: BasicPackDefinition,
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
  maxRows = DEFAULT_MAX_ROWS,
  bundleSourceMapPath,
  bundlePath,
  contextOptions = {},
}: {
  formulaName: string;
  params: string[];
  manifest: BasicPackDefinition;
  manifestPath: string;
  vm?: boolean;
  dynamicUrl?: string;
  maxRows?: number;
  bundleSourceMapPath: string;
  bundlePath: string;
  contextOptions?: ContextOptions;
}) {
  try {
    if (maxRows <= 0) {
      throw new Error('The value of maxRows must be greater than zero.');
    }

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
    const formula = tryFindFormula(manifest, formulaName);
    if (!(syncFormula || formula)) {
      throw new Error(`Could not find a formula or sync named "${formulaName}".`);
    }
    const formulaSpecification: SyncFormulaSpecification | StandardFormulaSpecification = {
      type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
      formulaName,
    };

    if (formulaSpecification.type === FormulaType.Sync) {
      let result = [];
      let iterations = 1;
      do {
        if (iterations > MaxSyncIterations) {
          throw new Error(
            `Sync is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
          );
        }
        const response: GenericSyncFormulaResult = vm
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
      } while (executionContext.sync.continuation && result.length < maxRows);
      if (result.length > maxRows) {
        result = result.slice(0, maxRows);
      }
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
  } catch (err: any) {
    print(err);
    process.exit(1);
  }
}

// This method is used to execute a (sync) formula in testing with VM. Don't use it in lambda or calc service.
export async function executeFormulaOrSyncWithVM<T extends PackFormulaResult | GenericSyncFormulaResult = any>({
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
}): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult> {
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
  manifest: BasicPackDefinition;
  executionContext: SyncExecutionContext;
}): Promise<T extends SyncFormulaSpecification ? GenericSyncFormulaResult : PackFormulaResult> {
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
  packDef: BasicPackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  {
    validateParams: shouldValidateParams = true,
    validateResult: shouldValidateResult = true,
    useDeprecatedResultNormalization = true,
  }: ExecuteOptions = {},
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
      {validateParams: false, validateResult: false, useDeprecatedResultNormalization},
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
export async function executeSyncFormulaFromPackDefSingleIteration(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<GenericSyncFormulaResult> {
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
  ) as Promise<GenericSyncFormulaResult>;
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

export function newRealFetcherExecutionContext(packDef: BasicPackDefinition, manifestPath: string): ExecutionContext {
  return newFetcherExecutionContext(
    buildUpdateCredentialsCallback(manifestPath),
    getPackAuth(packDef),
    packDef.networkDomains,
    getCredentials(manifestPath),
  );
}

export function newRealFetcherSyncExecutionContext(
  packDef: BasicPackDefinition,
  manifestPath: string,
): SyncExecutionContext {
  const context = newRealFetcherExecutionContext(packDef, manifestPath);
  return {...context, sync: {}};
}
