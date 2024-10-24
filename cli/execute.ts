import type {ArgumentsCamelCase} from 'yargs';
import {PackOptionKey} from './config_storage';
import type {TimerShimStrategy} from '../testing/compile';
import {compilePackBundle} from '../testing/compile';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import {getPackOptions} from './config_storage';
import {importManifest} from './helpers';
import {makeManifestFullPath} from './helpers';
import path from 'path';
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
  allowMultipleNetworkDomains?: boolean;
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
  allowMultipleNetworkDomains,
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

  // If using multiple network domains, check that they set the flag or option.
  const options = getPackOptions(path.dirname(manifestPath));
  allowMultipleNetworkDomains ||= options?.[PackOptionKey.allowMultipleNetworkDomains];
  if (manifest.networkDomains && manifest.networkDomains.length > 1 && !allowMultipleNetworkDomains) {
    return printAndExit('Using multiple network domains requires approval from Coda. Visit https://coda.io/packs/build/latest/support#approvals to make a request. Disable this warning by including the flag: --allowMultipleNetworkDomains');
  }

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
