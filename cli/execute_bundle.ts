import type {Arguments} from 'yargs';
import type { ExecuteArgs } from './execute';
import {executeFormulaOrSyncFromBundle} from '../testing/bundle_execution';

type ExecuteBundleArgs = Omit<ExecuteArgs, 'manifestPath'> & {
  bundlePath: string;
}

export async function handleExecuteBundle({
  bundlePath,
  formulaName,
  params,
  fetch,
  credentialsFile,
}: Arguments<ExecuteBundleArgs>) {
  await executeFormulaOrSyncFromBundle({
    bundlePath,
    formulaName,
    params,
    _contextOptions: {useRealFetcher: fetch, credentialsFile},
  });
}
