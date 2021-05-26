import type {Arguments} from 'yargs';
import {escapeShellArg} from './helpers';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import {isTypescript} from './helpers';
import {makeManifestFullPath} from './helpers';
import {spawnBootstrapCommand} from './helpers';

export interface ExecuteArgs {
  manifestPath: string;
  formulaName: string;
  params: string[];
  fetch?: boolean;
  vm?: boolean;
  dynamicUrl?: string;
}

const EXECUTE_BOOTSTRAP_CODE = `
import {executeFormulaOrSyncFromCLI} from 'coda-packs-sdk/dist/testing/execution';

async function main() {
  const manifestPath = process.argv[1];
  const useRealFetcher = process.argv[2] === 'true';
  const vm = process.argv[3] === 'true';
  const dynamicUrl = process.argv[4]
  const formulaName = process.argv[5];
  const params = process.argv.slice(6);

  await executeFormulaOrSyncFromCLI({
    formulaName,
    params,
    manifestPath,
    vm,
    dynamicUrl,
    contextOptions: {useRealFetcher},
  });
}

void main();`;

export async function handleExecute({
  manifestPath,
  formulaName,
  params,
  fetch,
  vm,
  dynamicUrl,
}: Arguments<ExecuteArgs>) {
  const fullManifestPath = makeManifestFullPath(manifestPath);
  // If the given manifest source file is a .ts file, we need to evaluate it using ts-node in the user's environment.
  // We can reasonably assume the user has ts-node if they have built a pack definition using a .ts file.
  // Otherwise, the given manifest is most likely a plain .js file or a post-build .js dist file from a TS build.
  // In the latter case, we can import the given file as a regular node (non-TS) import without any bootstrapping.
  if (isTypescript(manifestPath)) {
    const tsCommand = `ts-node -e "${EXECUTE_BOOTSTRAP_CODE}" ${fullManifestPath} ${Boolean(fetch)} ${Boolean(
      vm,
    )} ${String(dynamicUrl || '""')} ${formulaName} ${params.map(escapeShellArg).join(' ')}`;
    spawnBootstrapCommand(tsCommand);
  } else {
    await executeFormulaOrSyncFromCLI({
      formulaName,
      params,
      manifestPath,
      vm,
      dynamicUrl,
      contextOptions: {useRealFetcher: fetch},
    });
  }
}
