import type {Arguments} from 'yargs';
import {compilePackBundle} from '../testing/compile';
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
  timers: boolean;
}

export async function handleExecute({
  manifestPath,
  formulaName,
  params,
  fetch,
  vm,
  dynamicUrl,
  timers,
}: Arguments<ExecuteArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
    manifestPath: fullManifestPath,
    minify: false,
    enableTimers: timers,
  });
  const manifest = await importManifest(bundlePath);
  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    manifest,
    manifestPath,
    vm,
    dynamicUrl,
    bundleSourceMapPath,
    bundlePath,
    contextOptions: {useRealFetcher: fetch},
  });
}
