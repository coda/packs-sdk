import type {Credentials} from './auth_types';
import type {ExecuteOptions} from './execution_helper';
import type {ExecuteSyncOptions} from './execution_helper';
import type {ExecutionContext} from '../api_types';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackVersionDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import { compilePackBundle } from './compile';
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
import { translateErrorStackFromVM } from '../runtime/execution';
import util from 'util';

export {ExecuteOptions} from './execution_helper';
export {ExecuteSyncOptions} from './execution_helper';

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

    const result = vm
      ? await executeFormulaOrSyncWithRawParamsInVM({formulaName, params, manifestPath, executionContext})
      : await executeFormulaOrSyncWithRawParams({formulaName, params, manifest, executionContext});
    print(result);
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
      await translateErrorStackFromVM({stacktrace: err.stack, bundleSourceMapPath, vmFilename: bundlePath}) || '',
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

export async function executeSyncFormulaFromPackDef(
  packDef: PackVersionDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteSyncOptions,
  {useRealFetcher, manifestPath}: ContextOptions = {},
) {
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
