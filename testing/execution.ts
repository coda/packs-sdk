import type {ExecuteOptions} from './execution_helper';
import type {ExecuteSyncOptions} from './execution_helper';
import type {ExecutionContext} from '../api_types';
import type {MetadataContext} from '../api';
import type {MetadataFormula} from '../api';
import type {PackDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import type {ParamValues} from '../api_types';
import type {SyncExecutionContext} from '../api_types';
import { build as buildBundle } from '../cli/build';
import {getManifestFromModule} from './helpers';
import * as helper from './execution_helper';
import * as ivmHelper from './ivm_helper';
import {newFetcherExecutionContext} from './fetcher';
import {newFetcherSyncExecutionContext} from './fetcher';
import {newMockExecutionContext} from './mocks';
import {newMockSyncExecutionContext} from './mocks';
import {print} from './helpers';

export {ExecuteOptions} from './execution_helper';
export {ExecuteSyncOptions} from './execution_helper';

export interface ContextOptions {
  useRealFetcher?: boolean;
  credentialsFile?: string;
}

export async function executeFormulaFromPackDef(
  packDef: PackDefinition,
  formulaNameWithNamespace: string,
  params: ParamValues<ParamDefs>,
  context?: ExecutionContext,
  options?: ExecuteOptions,
  {useRealFetcher, credentialsFile}: ContextOptions = {},
) {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    executionContext = newFetcherExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
  }

  const formula = helper.findFormula(packDef, formulaNameWithNamespace);
  return helper.executeFormula(formula, params, executionContext || newMockExecutionContext(), options);
}

export async function executeFormulaOrSyncFromCLI({
  formulaName,
  params,
  manifestPath,
  vm,
  contextOptions = {},
}: {
  formulaName: string;
  params: string[];
  manifestPath: string;
  vm?: boolean;
  contextOptions?: ContextOptions;
}) {
  try {    
    const module = await import(manifestPath);
    const manifest = getManifestFromModule(module);
    const {useRealFetcher, credentialsFile} = contextOptions;

    // A sync context would work for both formula / syncFormula execution for now.
    const executionContext = useRealFetcher 
      ? newFetcherSyncExecutionContext(manifest.name, manifest.defaultAuthentication, credentialsFile) 
      : newMockSyncExecutionContext();

    const result = vm
      ? await executeFormulaOrSyncWithRawParamsInVM({formulaName, params, manifestPath, executionContext})
      : await executeFormulaOrSyncWithRawParams({formulaName, params, module, executionContext});
    print(result);
  } catch (err) {
    print(err);
    process.exit(1);
  }
}

export async function executeFormulaOrSyncWithVM({
  formulaName,
  params,
  manifestPath,
  executionContext = newMockSyncExecutionContext(),
}: {
  formulaName: string;
  params: ParamValues<ParamDefs>;
  manifestPath: string;
  executionContext?: SyncExecutionContext;
}) {
  const bundlePath = await buildBundle(manifestPath, 'esbuild');

  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  return ivmHelper.executeFormulaOrSync(ivmContext, formulaName, params);
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
  const bundlePath = await buildBundle(manifestPath, 'esbuild');

  const ivmContext = await ivmHelper.setupIvmContext(bundlePath, executionContext);

  return ivmHelper.executeFormulaOrSyncWithRawParams(ivmContext, formulaName, rawParams);
}

export async function executeFormulaOrSyncWithRawParams({
  formulaName,
  params: rawParams,
  module,
  executionContext,
}: {
  formulaName: string;
  params: string[];
  module: any;
  vm?: boolean;
  executionContext: SyncExecutionContext;
}) {
  const manifest = getManifestFromModule(module);

  return helper.executeFormulaOrSyncWithRawParams(
    manifest,
    formulaName,
    rawParams,
    executionContext,
  );  
}

export async function executeSyncFormulaFromPackDef(
  packDef: PackDefinition,
  syncFormulaName: string,
  params: ParamValues<ParamDefs>,
  context?: SyncExecutionContext,
  options?: ExecuteSyncOptions,
  {useRealFetcher, credentialsFile}: ContextOptions = {},
) {
  let executionContext = context;
  if (!executionContext && useRealFetcher) {
    executionContext = newFetcherSyncExecutionContext(packDef.name, packDef.defaultAuthentication, credentialsFile);
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
