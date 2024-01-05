import type {BasicPackDefinition} from '../types';
import type {Credentials} from './auth_types';
import type {ExecutionContext} from '../api_types';
import type {FormulaSpecification} from '../runtime/types';
import {FormulaType} from '../runtime/types';
import type {GenericSyncFormulaResult} from '../api';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {MetadataFormulaSpecification} from '../runtime/types';
import {MetadataFormulaType} from '../runtime/types';
import {Buffer as NonNativeBuffer} from 'buffer/';
import type {PackFormulaResult} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {PostSetupMetadataFormulaSpecification} from '../runtime/types';
import type {StandardFormulaSpecification} from '../runtime/types';
import type {SyncExecutionContext} from '../api_types';
import type {SyncFormulaSpecification} from '../runtime/types';
import type {SyncMetadataFormulaSpecification} from '../runtime/types';
import type {TypedPackFormula} from '../api';
import {coerceParams} from './coercion';
import {ensureExists} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
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

    const formulaSpecification = makeFormulaSpec(manifest, formulaName);

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
    print(err.message || err);
    process.exit(1);
  }
}

type SyncMetadataFormulaType = SyncMetadataFormulaSpecification['metadataFormulaType'];
type GlobalMetadataFormulaType = MetadataFormulaSpecification['metadataFormulaType'];
type PostSetupMetadataFormulaType = PostSetupMetadataFormulaSpecification['metadataFormulaType'];

const SyncMetadataFormulaTokens: Record<SyncMetadataFormulaType, string> = Object.freeze({
  [MetadataFormulaType.SyncListDynamicUrls]: 'listDynamicUrls',
  [MetadataFormulaType.SyncSearchDynamicUrls]: 'searchDynamicUrls',
  [MetadataFormulaType.SyncGetDisplayUrl]: 'getDisplayUrl',
  [MetadataFormulaType.SyncGetTableName]: 'getName',
  [MetadataFormulaType.SyncGetSchema]: 'getSchema',
});

const GlobalMetadataFormulaTokens: Record<GlobalMetadataFormulaType, string> = Object.freeze({
  [MetadataFormulaType.GetConnectionName]: 'getConnectionName',
  [MetadataFormulaType.GetConnectionUserId]: 'getConnectionUserId',
});

const PostSetupMetadataFormulaTokens: Record<PostSetupMetadataFormulaType, string> = Object.freeze({
  [MetadataFormulaType.PostSetupSetEndpoint]: 'setEndpoint',
});

function invert<K extends string | number | symbol, V extends string | number | symbol>(
  obj: Record<K, V>,
): Record<V, K> {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
}

// Exported for tests.
export function makeFormulaSpec(manifest: BasicPackDefinition, formulaNameInput: string): FormulaSpecification {
  const [formulaOrSyncName, ...parts] = formulaNameInput.split(':');

  if (formulaOrSyncName === 'Auth' && parts.length > 0) {
    if (parts.length === 1) {
      const metadataFormulaTypeStr = parts[0];
      const authFormulaType = invert(GlobalMetadataFormulaTokens)[metadataFormulaTypeStr];
      if (authFormulaType) {
        if (!manifest.defaultAuthentication) {
          throw new Error(`Pack definition has no user authentication.`);
        }
        return {
          type: FormulaType.Metadata,
          metadataFormulaType: authFormulaType,
        };
      }
    } else if (parts.length >= 2 && parts[0] === 'postSetup') {
      const setupStepTypeStr = parts[1];
      const setupStepType = invert(PostSetupMetadataFormulaTokens)[setupStepTypeStr];
      if (!setupStepType) {
        throw new Error(`Unrecognized setup step type "${setupStepTypeStr}".`);
      }
      const stepName = parts[2];
      if (!stepName) {
        throw new Error(`Expected a step name after "${setupStepTypeStr}".`);
      }
      return {
        type: FormulaType.Metadata,
        metadataFormulaType: setupStepType,
        stepName,
      };
    }
  }

  const syncFormula = tryFindSyncFormula(manifest, formulaOrSyncName);
  const standardFormula = tryFindFormula(manifest, formulaOrSyncName);
  if (!(syncFormula || standardFormula)) {
    throw new Error(`Could not find a formula or sync named "${formulaOrSyncName}".`);
  }

  const formula = ensureExists(syncFormula || standardFormula);

  if (parts.length === 0) {
    return {
      type: syncFormula ? FormulaType.Sync : FormulaType.Standard,
      formulaName: formulaOrSyncName,
    };
  }

  if (parts.length === 1) {
    const metadataFormulaTypeStr = parts[0];
    if (metadataFormulaTypeStr === 'update') {
      if (!syncFormula) {
        throw new Error(`Two-way sync formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
      }
      return {
        type: FormulaType.SyncUpdate,
        formulaName: formulaOrSyncName,
      };
    } else if (metadataFormulaTypeStr === 'autocomplete') {
      throw new Error(`No parameter name specified for autocomplete metadata formula.`);
    }
    const metadataFormulaType = invert(SyncMetadataFormulaTokens)[metadataFormulaTypeStr];
    if (!metadataFormulaType) {
      throw new Error(`Unrecognized metadata formula type "${metadataFormulaTypeStr}".`);
    }
    if (!syncFormula) {
      throw new Error(`Metadata formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
    }
    return {
      type: FormulaType.Metadata,
      metadataFormulaType,
      syncTableName: formulaOrSyncName,
    };
  }

  if (parts.length === 2) {
    if (parts[0] !== 'autocomplete') {
      throw new Error(`Unrecognized formula type "${parts[0]}", expected "autocomplete".`);
    }
    const parameterName = parts[1];
    const paramDef = formula.parameters.find(p => p.name === parameterName);
    if (!paramDef) {
      throw new Error(`Formula "${formulaOrSyncName}" has no parameter named "${parameterName}".`);
    }
    return {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.ParameterAutocomplete,
      parentFormulaName: formulaOrSyncName,
      parentFormulaType: syncFormula ? FormulaType.Sync : FormulaType.Standard,
      parameterName,
    };
  }

  throw new Error(`Unrecognized execution command: "${formulaNameInput}".`);
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

async function executeFormulaOrSyncWithRawParamsInVM<T extends FormulaSpecification>({
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
  switch (formulaSpecification.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpecification.formulaName);
      params = coerceParams(formula, rawParams as any);
      break;
    }
    case FormulaType.Sync: {
      const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
      params = coerceParams(syncFormula, rawParams as any);
      break;
    }
    case FormulaType.Metadata: {
      params = parseMetadataFormulaParams(rawParams) as ParamValues<ParamDefs>;
      break;
    }
    case FormulaType.SyncUpdate: {
      params = rawParams as ParamValues<ParamDefs>;
      break;
    }
    default:
      ensureUnreachable(formulaSpecification);
  }
  return executeThunk(ivmContext, {params, formulaSpec: formulaSpecification}, bundlePath, bundleSourceMapPath);
}

export async function executeFormulaOrSyncWithRawParams<T extends FormulaSpecification>({
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
  // Use non-native buffer if we're testing this without using isolated-vm, because otherwise
  // we could hit issues like Buffer.isBuffer() returning false if a non-native buffer was created
  // in pack code and we're checking it using native buffers somewhere like node_fetcher.ts
  global.Buffer = NonNativeBuffer as unknown as BufferConstructor;

  let params: ParamValues<ParamDefs>;
  switch (formulaSpecification.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpecification.formulaName);
      params = coerceParams(formula, rawParams as any);
      break;
    }
    case FormulaType.Sync: {
      const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName);
      params = coerceParams(syncFormula, rawParams as any);
      break;
    }
    case FormulaType.Metadata: {
      params = parseMetadataFormulaParams(rawParams) as ParamValues<ParamDefs>;
      break;
    }
    case FormulaType.SyncUpdate: {
      params = rawParams as ParamValues<ParamDefs>;
      break;
    }
    default:
      ensureUnreachable(formulaSpecification);
  }
  return findAndExecutePackFunction(params, formulaSpecification, manifest, executionContext);
}

function parseMetadataFormulaParams(rawParams: string[]): string[] {
  const [search = '', formulaContext = '{}'] = rawParams;
  return [search, JSON.parse(formulaContext)];
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
