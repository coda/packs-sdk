import type {Arguments} from 'yargs';
import {build} from './build';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import {importManifest} from './helpers';
import {makeManifestFullPath} from './helpers';

export interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
  fetch?: boolean;
  vm?: boolean;
  dynamicUrl?: string;
}

export async function handleExecute({
  manifestPath,
  formulaName,
  params,
  fetch,
  vm,
  dynamicUrl,
}: Arguments<ExecuteArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  const bundleFilename = await build(fullManifestPath);
  const manifest = await importManifest(bundleFilename);
  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    manifest,
    manifestPath,
    vm,
    dynamicUrl,
    contextOptions: {useRealFetcher: fetch},
  });
}
