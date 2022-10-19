import type {ArgumentsCamelCase} from 'yargs';
import type {TimerShimStrategy} from '../testing/compile';
import {compilePackBundle} from '../testing/compile';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import {importManifest} from './helpers';
import {makeManifestFullPath} from './helpers';
import {printAndExit} from '../testing/helpers';
import {tryGetIvm} from '../testing/ivm_wrapper';

export interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
  fetch?: boolean;
  vm?: boolean;
  dynamicUrl?: string;
  timerStrategy: TimerShimStrategy;
  maxRows?: number;
}

export async function handleExecute({
  manifestPath,
  formulaName,
  params,
  fetch,
  vm,
  dynamicUrl,
  timerStrategy,
  maxRows,
}: ArgumentsCamelCase<ExecuteArgs>) {
  if (vm && !tryGetIvm()) {
    return printAndExit(
      'The --vm flag was specified, but the isolated-vm package is not installed, likely because this package is not ' +
        'compatible with your platform. Try again but omitting the --vm flag.',
    );
  }
  const fullManifestPath = makeManifestFullPath(manifestPath);
  const {bundlePath, bundleSourceMapPath} = await compilePackBundle({
    manifestPath: fullManifestPath,
    minify: false,
    timerStrategy,
  });
  const manifest = await importManifest(bundlePath);
  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    manifest,
    manifestPath,
    vm,
    dynamicUrl,
    maxRows,
    bundleSourceMapPath,
    bundlePath,
    contextOptions: {useRealFetcher: fetch},
  });
}
