import type {BasicPackDefinition} from '../types';
import {ChainableCommandType} from './types';
import type {ChainedCommand} from './types';
import {ChainedCommandType} from './types';
import type {Continuation} from '../api';
import type {Credentials} from './auth_types';
import type {ExecutionContext} from '../api_types';
import type {FormulaResultType} from './types';
import type {FormulaSpecification} from '../runtime/types';
import {FormulaType} from '../runtime/types';
import type {GenericExecuteGetPermissionsRequest} from '../api';
import type {GenericSyncFormulaResult} from '../api';
import type {GenericSyncUpdate} from '../api';
import type {GenericSyncUpdateResult} from '../api';
import type {GetPermissionsFormulaSpecification} from '../runtime/types';
import type {GetPermissionsResult} from '../api';
import type {InterleavedChainedCommand} from './types';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {MetadataFormulaSpecification} from '../runtime/types';
import {MetadataFormulaType} from '../runtime/types';
import {Buffer as NonNativeBuffer} from 'buffer/';
import type {ObjectSchemaDefinitionType} from '../schema';
import type {PackFormulaResult} from '../api_types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {PostSetupMetadataFormulaSpecification} from '../runtime/types';
import type {RowAccessDefinition} from '../schema';
import type {StandardFormulaSpecification} from '../runtime/types';
import type {SyncCompletionMetadata} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import type {SyncFormulaSpecification} from '../runtime/types';
import type {SyncMetadataFormulaSpecification} from '../runtime/types';
import type {SyncUpdateFormulaSpecification} from '../runtime/types';
import type {TypedPackFormula} from '../api';
import type {UpdateSyncExecutionContext} from '../api_types';
import {chunkArray} from './helpers';
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
import {printFull} from './helpers';
import {readCredentialsFile} from './auth';
import {storeCredential} from './auth';
import * as thunk from '../runtime/thunk/thunk';
import {transformBody} from '../handler_templates';
import {tryFindFormula} from '../runtime/common/helpers';
import {tryFindSyncFormula} from '../runtime/common/helpers';
import {untransformBody} from '../handler_templates';
import {validateParams} from './validation';
import {validateResult} from './validation';
import * as z from 'zod';
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
  syncUpdates?: GenericSyncUpdate[],
  getPermissionsRequest?: GenericExecuteGetPermissionsRequest,
  {
    validateParams: shouldValidateParams = true,
    validateResult: shouldValidateResult = true,
    // TODO(alexd): Switch this to false or remove when we launch 1.0.0
    useDeprecatedResultNormalization = true,
  }: ExecuteOptions = {},
): Promise<FormulaResultType<T>> {
  let formula: TypedPackFormula | undefined;
  switch (formulaSpec.type) {
    case FormulaType.Standard:
      formula = findFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      break;
    case FormulaType.Sync:
    case FormulaType.SyncUpdate:
    case FormulaType.GetPermissions:
      formula = findSyncFormula(manifest, formulaSpec.formulaName, executionContext.authenticationName);
      break;
  }

  if (shouldValidateParams && formula) {
    validateParams(formula, params);
  }

  let result;
  try {
    result = await thunk.findAndExecutePackFunction({
      params,
      formulaSpec,
      manifest,
      executionContext,
      shouldWrapError: false,
      updates: syncUpdates,
      getPermissionsRequest,
    });
  } catch (err: any) {
    throw new DeveloperError(err);
  }

  if (formulaSpec.type === FormulaType.SyncUpdate) {
    return result as FormulaResultType<T>;
  }

  if (formulaSpec.type === FormulaType.GetPermissions) {
    return result as FormulaResultType<T>;
  }

  if (formula) {
    const resultToNormalize =
      formulaSpec.type === FormulaType.Sync ? (result as GenericSyncFormulaResult).result : result;
    let resultToValidate = resultToNormalize;

    // Matches legacy behavior within handler_templates:generateObjectResponseHandler where we never
    // called transform body on non-object responses.
    if (typeof resultToNormalize === 'object') {
      const schema = executionContext?.sync?.schema ?? formula.schema;
      let normalizedResult = transformBody(resultToNormalize, schema);
      resultToValidate = normalizedResult;

      if (!useDeprecatedResultNormalization) {
        normalizedResult = untransformBody(normalizedResult, schema);
      }

      if (formulaSpec.type === FormulaType.Sync) {
        (result as GenericSyncFormulaResult).result = normalizedResult;
      } else {
        result = normalizedResult;
      }
    }

    if (shouldValidateResult) {
      validateResult(formula, resultToValidate);
    }
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
    undefined,
    undefined,
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

    const {formulaSpecification, chainedCommand} = getFormulaSpecAndChainedCommand(manifest, formulaName);

    if (formulaSpecification.type === FormulaType.Sync) {
      const result = await executeSyncFormulaWithOptionalChaining({
        formulaSpecification,
        chainedCommand,
        params,
        manifest,
        executionContext,
        vm,
        bundleSourceMapPath,
        bundlePath,
        maxRows,
      });
      printFull(result);
    } else if (formulaSpecification.type === FormulaType.GetPermissions) {
      const result = await executeGetPermissionsFormulaWithContinuations({
        formulaSpecification,
        params,
        manifest,
        executionContext,
        vm,
        bundleSourceMapPath,
        bundlePath,
      });
      printFull(result);
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
      printFull(result);
    }
  } catch (err: any) {
    if (err instanceof DeveloperError) {
      // The error came from the Pack code. Print the inner error, including the stack trace.
      print(err.cause);
      // If source maps are not enabled, print a warning.
      if (!vm && !isSourceMapsEnabled()) {
        print(`
Enable the Node flag --enable-source-maps to get an accurate stack trace. For example:
NODE_OPTIONS="--enable-source-maps" npx coda execute ...`);
      }
    } else {
      // Just print the error message.
      print(err.message);
    }
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

/**
 * Given a formula name with a > delimited chained command, returns the formula specification and the chained command.
 *
 * Chained commands can either be:
 * - interleaved (runs in the same loop as continuations)
 * - subsequent (runs in the completion loop, after the first completion is returned)
 *
 * We will only return at most a single command across these two types
 *
 * @param manifest The manifest of the pack.
 * @param formulaNameInput The formula name with a chained command.
 * @returns The formula specification and the chained command.
 */
function getFormulaSpecAndChainedCommand(
  manifest: BasicPackDefinition,
  formulaNameInput: string,
): {
  formulaSpecification: FormulaSpecification;
  chainedCommand?: ChainedCommand;
} {
  const chainedCommands = formulaNameInput.split('>');
  const formulaSpecification = makeFormulaSpec(manifest, chainedCommands[0]);

  if (chainedCommands[0].includes(':incremental')) {
    // TODO(zack): Allow direct calling of incremental sync while providing a completion via CLI
    throw new Error('Direct calling of incremental sync is not supported. Use the > syntax instead.');
  }

  if (chainedCommands.length === 1) {
    return {formulaSpecification};
  }

  if (formulaSpecification.type !== FormulaType.Sync) {
    throw new Error(`Chained commands are only supported for sync formulas. Received: ${formulaSpecification.type}`);
  }

  const chainedCommandFormulaSpecification = makeFormulaSpec(
    manifest,
    [formulaSpecification.formulaName, chainedCommands[1]].join(':'),
  );
  if (!chainedCommandFormulaSpecification) {
    throw new Error(`Could not find a formula or sync named "${chainedCommands[1]}".`);
  }

  switch (chainedCommandFormulaSpecification.type) {
    case FormulaType.GetPermissions:
      return {
        formulaSpecification,
        chainedCommand: {
          type: ChainedCommandType.Interleaved,
          formulaSpec: chainedCommandFormulaSpecification,
          commandType: ChainableCommandType.GetPermissions,
        },
      };
    case FormulaType.Sync:
      return {
        formulaSpecification,
        chainedCommand: {
          type: ChainedCommandType.Subsequent,
          formulaSpec: chainedCommandFormulaSpecification,
          commandType: ChainableCommandType.IncrementalSync,
        },
      };
    default:
      throw new Error(
        `Chained commands are only supported for GetPermissions and Sync formulas. Received: ${chainedCommandFormulaSpecification.type}`,
      );
  }
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

    if (metadataFormulaTypeStr === 'permissions') {
      if (!syncFormula) {
        throw new Error(`Permissions formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
      }
      return {
        type: FormulaType.GetPermissions,
        formulaName: formulaOrSyncName,
      };
    }
    if (metadataFormulaTypeStr === 'incremental') {
      if (!syncFormula) {
        throw new Error(`Incremental sync formula "${metadataFormulaTypeStr}" is only supported for sync formulas.`);
      }
      return {
        type: FormulaType.Sync,
        formulaName: formulaOrSyncName,
      };
    }
    if (metadataFormulaTypeStr === 'validateParameters') {
      return {
        type: FormulaType.Metadata,
        metadataFormulaType: MetadataFormulaType.ValidateParameters,
        parentFormulaName: formulaOrSyncName,
        parentFormulaType: syncFormula ? FormulaType.Sync : FormulaType.Standard,
      };
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

  try {
    return (await executeThunk(
      ivmContext,
      {params, formulaSpec: formulaSpecification},
      bundlePath,
      bundlePath + '.map',
    )) as T;
  } catch (err: any) {
    throw new DeveloperError(err);
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
}): Promise<FormulaResultType<T>> {
  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  const manifest = await importManifest(bundlePath);
  let params: ParamValues<ParamDefs>;
  let syncUpdates: GenericSyncUpdate[] | undefined;
  let permissionRequest: GenericExecuteGetPermissionsRequest | undefined;
  switch (formulaSpecification.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
      params = coerceParams(formula, rawParams as any);
      break;
    }
    case FormulaType.Sync: {
      const syncFormula = findSyncFormula(
        manifest,
        formulaSpecification.formulaName,
        executionContext.authenticationName,
      );
      params = coerceParams(syncFormula, rawParams as any);
      break;
    }
    case FormulaType.Metadata: {
      // Interestingly we don't need special handling for the formula context dict (the optional second arg
      // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
      // JSON string anyway which is already parsed by the compiled pack definition.
      params = rawParams as ParamValues<ParamDefs>;
      // Default the search string (first arg) to an empty string.
      params[0] ??= '';
      break;
    }
    case FormulaType.SyncUpdate: {
      ({params, syncUpdates} = parseSyncUpdates(manifest, formulaSpecification, rawParams));
      break;
    }
    case FormulaType.GetPermissions: {
      ({params, permissionRequest} = parseGetPermissionRequest(manifest, formulaSpecification, rawParams));
      break;
    }
    default:
      ensureUnreachable(formulaSpecification);
  }
  try {
    return (await executeThunk(
      ivmContext,
      {params, formulaSpec: formulaSpecification, updates: syncUpdates, permissionRequest},
      bundlePath,
      bundleSourceMapPath,
    )) as FormulaResultType<T>;
  } catch (err: any) {
    throw new DeveloperError(err);
  }
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
}): Promise<FormulaResultType<T>> {
  // Use non-native buffer if we're testing this without using isolated-vm, because otherwise
  // we could hit issues like Buffer.isBuffer() returning false if a non-native buffer was created
  // in pack code and we're checking it using native buffers somewhere like node_fetcher.ts
  global.Buffer = NonNativeBuffer as unknown as BufferConstructor;

  let params: ParamValues<ParamDefs>;
  let syncUpdates: GenericSyncUpdate[] | undefined;
  let permissionRequest: GenericExecuteGetPermissionsRequest | undefined;
  switch (formulaSpecification.type) {
    case FormulaType.Standard: {
      const formula = findFormula(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
      params = coerceParams(formula, rawParams as any);
      break;
    }
    case FormulaType.Sync: {
      const syncFormula = findSyncFormula(
        manifest,
        formulaSpecification.formulaName,
        executionContext.authenticationName,
      );
      params = coerceParams(syncFormula, rawParams as any);
      break;
    }
    case FormulaType.Metadata: {
      // Interestingly we don't need special handling for the formula context dict (the optional second arg
      // to an autocomplete metadata formula), because at execution time it gets passed as a serialized
      // JSON string anyway which is already parsed by the compiled pack definition.
      params = rawParams as ParamValues<ParamDefs>;
      // Default the search string (first arg) to an empty string.
      params[0] ??= '';
      break;
    }
    case FormulaType.SyncUpdate: {
      ({params, syncUpdates} = parseSyncUpdates(manifest, formulaSpecification, rawParams));
      break;
    }
    case FormulaType.GetPermissions: {
      ({params, permissionRequest} = parseGetPermissionRequest(manifest, formulaSpecification, rawParams));
      break;
    }
    default:
      ensureUnreachable(formulaSpecification);
  }
  return findAndExecutePackFunction(
    params,
    formulaSpecification,
    manifest,
    executionContext,
    syncUpdates,
    permissionRequest,
  );
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
export async function executeSyncFormula(
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
): Promise<GenericSyncFormulaResult> {
  const formula = findSyncFormula(packDef, syncFormulaName, context?.authenticationName);
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
  const permissionsContext = [];
  const deletedRowIds = [];
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
      undefined,
      undefined,
      {validateParams: false, validateResult: false, useDeprecatedResultNormalization},
    );

    result.push(...response.result);
    if (response.permissionsContext) {
      permissionsContext.push(...response.permissionsContext);
    }
    if (response.deletedRowIds) {
      deletedRowIds.push(...response.deletedRowIds);
    }
    executionContext.sync.continuation = response.continuation;
    iterations++;
  } while (executionContext.sync.continuation);

  if (shouldValidateResult && formula) {
    validateResult(formula, result);
  }

  return {
    result,
    deletedRowIds,
    permissionsContext,
  };
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
 * @deprecated Use {@link executeSyncFormula} instead.
 */
export async function executeSyncFormulaFromPackDef(
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
): Promise<Array<ObjectSchemaDefinitionType<any, any, any>>> {
  return Promise.resolve(
    (
      await executeSyncFormula(
        packDef,
        syncFormulaName,
        params,
        context,
        {
          validateParams: shouldValidateParams,
          validateResult: shouldValidateResult,
          useDeprecatedResultNormalization,
        },
        {useRealFetcher, manifestPath},
      )
    ).result,
  );
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
    undefined,
    undefined,
    options,
  );
}

/**
 * Executes an executeGetPermissions request and returns the result.
 *
 * @hidden
 */
export async function executeGetPermissionsFormulaFromPackDef(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  executeGetPermissionsRequest: GenericExecuteGetPermissionsRequest,
  context?: SyncExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<GetPermissionsResult> {
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
    {formulaName: syncFormulaName, type: FormulaType.GetPermissions},
    packDef,
    executionContext || newMockSyncExecutionContext(),
    undefined,
    executeGetPermissionsRequest,
    options,
  ) as Promise<GetPermissionsResult>;
}

/**
 * Executes an executeUpdate request for an update sync formula, and returns the result.
 *
 * @hidden
 */
export async function executeUpdateFormulaFromPackDef(
  packDef: BasicPackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context: UpdateSyncExecutionContext,
  syncUpdates: GenericSyncUpdate[],
  options?: ExecuteOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
): Promise<GenericSyncUpdateResult> {
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
    {formulaName: syncFormulaName, type: FormulaType.SyncUpdate},
    packDef,
    context,
    syncUpdates,
    undefined,
    options,
  );
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
  return newFetcherSyncExecutionContext(
    buildUpdateCredentialsCallback(manifestPath),
    getPackAuth(packDef),
    packDef.networkDomains,
    getCredentials(manifestPath),
  );
}

const SyncUpdateSchema = z.object({
  previousValue: z.object({}).passthrough(),
  newValue: z.object({}).passthrough(),
  updatedFields: z.array(z.string()),
});

const SyncUpdatesSchema = z.array(SyncUpdateSchema);

function parseSyncUpdates(
  manifest: BasicPackDefinition,
  formulaSpecification: SyncUpdateFormulaSpecification,
  rawParams: string[],
) {
  const paramsCopy = [...rawParams];
  const syncUpdatesStr = paramsCopy.pop();
  if (!syncUpdatesStr) {
    throw new Error(`Expected sync updates as last parameter.`);
  }

  const parseResult = SyncUpdatesSchema.safeParse(JSON.parse(syncUpdatesStr));
  if (!parseResult.success) {
    throw new Error(`Invalid sync updates: ${parseResult.error.message}`);
  }
  const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName, undefined, {
    verifyFormulaForAuthenticationName: false,
  });
  return {syncUpdates: parseResult.data, params: coerceParams(syncFormula, paramsCopy as any)};
}

const GetPermissionSchema = z.object({
  rows: z.array(z.object({row: z.object({}).passthrough()})),
  permissionsContext: z.array(z.object({}).passthrough()).optional(),
});

function parseGetPermissionRequest(
  manifest: BasicPackDefinition,
  formulaSpecification: GetPermissionsFormulaSpecification,
  rawParams: string[],
): {
  permissionRequest: GenericExecuteGetPermissionsRequest;
  params: ParamValues<ParamDefs>;
} {
  const paramsCopy = [...rawParams];
  const rowsString = paramsCopy.pop();
  if (!rowsString) {
    throw new Error(`Expected rows as last parameter.`);
  }

  const parseResult = GetPermissionSchema.safeParse(JSON.parse(rowsString));
  if (!parseResult.success) {
    throw new Error(`Invalid get permission request: ${parseResult.error.message}`);
  }

  const syncFormula = findSyncFormula(manifest, formulaSpecification.formulaName, undefined, {
    verifyFormulaForAuthenticationName: false,
  });

  return {permissionRequest: parseResult.data, params: coerceParams(syncFormula, paramsCopy as any)};
}

function isSourceMapsEnabled() {
  const flags = [...process.execArgv, ...(process.env.NODE_OPTIONS?.split(/\s+/) ?? [])];
  return flags.includes('--enable-source-maps');
}

class DeveloperError extends Error {
  constructor(err: Error) {
    super('The Pack code threw an error: ' + err.message, {
      cause: err,
    });
    this.stack = err.stack;
    Object.setPrototypeOf(this, DeveloperError.prototype);
  }
}

/**
 * Executes a sync formula with optional chaining.
 *
 * @param formulaSpecification The formula specification we want to run, should be a Sync formula
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param vm Whether to run in a VM
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @param maxRows The max rows to sync
 * @returns Returns either the sync result (if there is no chaining), the interleaved chained command results,
 *   or the result from the subsequent chained command.
 */
async function executeSyncFormulaWithOptionalChaining({
  formulaSpecification,
  chainedCommand,
  params,
  manifest,
  executionContext,
  vm,
  bundleSourceMapPath,
  bundlePath,
  maxRows = DEFAULT_MAX_ROWS,
}: {
  formulaSpecification: SyncFormulaSpecification;
  chainedCommand?: ChainedCommand;
  params: string[];
  manifest: BasicPackDefinition;
  executionContext: SyncExecutionContext;
  vm?: boolean;
  bundleSourceMapPath: string;
  bundlePath: string;
  maxRows?: number;
}) {
  if (formulaSpecification.type !== FormulaType.Sync) {
    throw new Error(`Expected a Sync formula, received: ${formulaSpecification.type}`);
  }

  const {result, chainedCommandResults, completion} = await executeSyncFormulaWithContinuations({
    formulaSpecification,
    chainedCommand: chainedCommand?.type === ChainedCommandType.Interleaved ? chainedCommand : undefined,
    params,
    manifest,
    executionContext,
    vm,
    bundleSourceMapPath,
    bundlePath,
    maxRows,
  });

  if (!chainedCommand) {
    return result;
  }

  if (chainedCommand.type === ChainedCommandType.Interleaved) {
    return chainedCommandResults;
  }

  switch (chainedCommand.commandType) {
    case ChainableCommandType.IncrementalSync:
      const {result: resultFromIncrementalSync} = await executeSyncFormulaWithContinuations({
        formulaSpecification: chainedCommand.formulaSpec,
        params,
        manifest,
        executionContext: completion
          ? {...executionContext, sync: {...executionContext.sync, previousCompletion: completion}}
          : executionContext,
        vm,
        bundleSourceMapPath,
        bundlePath,
        maxRows,
      });
      return resultFromIncrementalSync;
    default:
      ensureUnreachable(chainedCommand);
  }
}

/**
 * This function handles running a sync formula with continuations, looping until
 * we no longer have a continuation or we pass the maxRows limit.
 *
 * @param formulaSpecification The formula specification we want to run, should be a Sync formula
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @param maxRows The max rows to sync
 * @param vm Whether to run in a VM
 * @param contextOptions The context options.
 * @returns Returns an object with the sync result, chained command results, and completion if they exist
 */
async function executeSyncFormulaWithContinuations({
  formulaSpecification,
  chainedCommand,
  params,
  manifest,
  executionContext,
  bundleSourceMapPath,
  bundlePath,
  maxRows = DEFAULT_MAX_ROWS,
  vm,
}: {
  formulaSpecification: SyncFormulaSpecification;
  chainedCommand?: InterleavedChainedCommand;
  params: string[];
  manifest: BasicPackDefinition;
  executionContext: SyncExecutionContext;
  bundleSourceMapPath: string;
  bundlePath: string;
  maxRows?: number;
  vm?: boolean;
}) {
  let result = [];
  const chainedCommandResults = [];
  let iterations = 1;
  let completion;
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

    if (response.permissionsContext && response.permissionsContext.length !== response.result.length) {
      throw new Error(
        `Got ${response.result.length} results but only ${response.permissionsContext.length} passthrough items (on page ${iterations})`,
      );
    }
    // We may go over the maxRows limit within a single iteration, so make sure to only pass as many
    // as will actually fit into the result array through to the chained command.
    const resultSlice = response.result.slice(0, maxRows - result.length);
    result.push(...resultSlice);

    if (chainedCommand) {
      chainedCommandResults.push(
        ...(await chainCommandOnSyncResult({
          rows: resultSlice,
          formulaSpecification,
          chainedCommand,
          params,
          manifest,
          executionContext,
          vm,
          bundleSourceMapPath,
          bundlePath,
        })),
      );
    }
    executionContext.sync.continuation = response.continuation;

    // If we happen to have both a completion and a continuation, we ignore the completion
    if (response.completion && !response.continuation) {
      completion = response.completion as SyncCompletionMetadata<Continuation>;
      break;
    }
    iterations++;
  } while (executionContext.sync.continuation && result.length < maxRows);
  if (result.length > maxRows) {
    result = result.slice(0, maxRows);
  }

  return {result, chainedCommandResults, completion};
}

/**
 * Executes a get permissions formula with continuations, looping until
 * we no longer have a continuation.
 *
 * Note, there is no maxRows limit here. Limiting is expected to be handled on the actual
 * set of item rows, on the assumption that we can use that to roughly control how
 * many rowAccessDefinitions we will get back.
 *
 * @param formulaSpecification The formula specification we want to run, should be a GetPermissions formula
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context *of the sync loop*. We clone this for the getPermissions loop
 *   to avoid polluting the continuation on the sync loop.
 * @param vm Whether to run in a VM
 * @returns Returns an object with the row access definitions
 */
async function executeGetPermissionsFormulaWithContinuations({
  formulaSpecification,
  params,
  manifest,
  executionContext: itemsExecutionContext,
  bundleSourceMapPath,
  bundlePath,
  vm,
}: {
  formulaSpecification: GetPermissionsFormulaSpecification;
  params: string[];
  manifest: BasicPackDefinition;
  executionContext: SyncExecutionContext;
  bundleSourceMapPath: string;
  bundlePath: string;
  vm?: boolean;
}) {
  const result: RowAccessDefinition[] = [];
  let iterations = 1;

  // We need to make a copy of the execution context so we don't pollute the continuation on the Sync formula
  // if we are running inside of an actual Sync continuation loop.
  const executionContextCopy: SyncExecutionContext = {
    ...itemsExecutionContext,
    sync: {...itemsExecutionContext.sync, continuation: undefined},
  };
  do {
    if (iterations > MaxSyncIterations) {
      throw new Error(
        `GetPermissions is still running after ${MaxSyncIterations} iterations, this is likely due to an infinite loop.`,
      );
    }
    const response = vm
      ? await executeFormulaOrSyncWithRawParamsInVM({
          formulaSpecification,
          params,
          bundleSourceMapPath,
          bundlePath,
          executionContext: executionContextCopy,
        })
      : await executeFormulaOrSyncWithRawParams({
          formulaSpecification,
          params,
          manifest,
          executionContext: executionContextCopy,
        });

    result.push(...response.rowAccessDefinitions);
    executionContextCopy.sync.continuation = response.continuation;

    iterations++;
  } while (executionContextCopy.sync.continuation);

  return {rowAccessDefinitions: result};
}

/**
 * This function handles running a chained command formula for a given set of rows.
 *
 * @param rows The rows to run the chained command on
 * @param formulaSpecification The Sync formula specification that is driving the rows we want to run
 *    the chained command on.
 * @param chainedCommand The chained command to run after the formula specification.
 * @param params The params to pass to the formula
 * @param manifest The manifest of the pack
 * @param executionContext The execution context
 * @param vm Whether to run in a VM
 * @param bundleSourceMapPath The source map path
 * @param bundlePath The bundle path
 * @returns Returns the result from the chained command
 */
async function chainCommandOnSyncResult({
  rows,
  formulaSpecification,
  chainedCommand,
  params,
  manifest,
  executionContext,
  vm,
  bundleSourceMapPath,
  bundlePath,
}: {
  rows: any[];
  formulaSpecification: SyncFormulaSpecification;
  chainedCommand: InterleavedChainedCommand;
  params: string[];
  manifest: BasicPackDefinition;
  executionContext: SyncExecutionContext;
  vm?: boolean;
  bundleSourceMapPath: string;
  bundlePath: string;
}) {
  if (!chainedCommand) {
    return [];
  }

  // Denormalize the sync result before passing back into chained command
  const formula = findSyncFormula(manifest, formulaSpecification.formulaName, executionContext.authenticationName);
  const schema = executionContext.sync.schema ?? formula?.schema;
  const denormalizedSyncResult = vm ? rows : untransformBody(rows, schema);

  switch (chainedCommand.formulaSpec.type) {
    case FormulaType.GetPermissions:
      const mappedRows = denormalizedSyncResult.map((row: unknown) => ({row}));

      // 10 hardcoded as fallback to match process_csb_ingestion.ts
      const maxPermissionBatchSize = formula?.maxPermissionBatchSize || 10;
      const chunks = chunkArray(mappedRows, maxPermissionBatchSize);

      const chunkResponses = [];
      for (const chunk of chunks) {
        const getPermissionsParams = [...params, JSON.stringify({rows: chunk})];

        const result = await executeGetPermissionsFormulaWithContinuations({
          formulaSpecification: chainedCommand.formulaSpec,
          params: getPermissionsParams,
          manifest,
          executionContext,
          vm,
          bundleSourceMapPath,
          bundlePath,
        });
        chunkResponses.push(...result.rowAccessDefinitions);
      }
      return chunkResponses.flat();
    default:
      ensureUnreachable(chainedCommand.formulaSpec.type);
  }
}
