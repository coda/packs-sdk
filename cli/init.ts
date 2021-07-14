import fs from 'fs';
import {spawnProcess} from './helpers';

const PACKS_EXAMPLES_DIRECTORY = 'node_modules/@codahq/packs-examples';

export async function handleInit() {
  let isPacksExamplesInstalled: boolean;
  try {
    const listNpmPackages = spawnProcess('npm list @codahq/packs-examples');
    isPacksExamplesInstalled = listNpmPackages.status === 0;
  } catch (error) {
    isPacksExamplesInstalled = false;
  }

  if (!isPacksExamplesInstalled) {
    // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
    const installCommand = `npm install git+ssh://github.com/coda/packs-examples.git`;
    spawnProcess(installCommand);
  }

  const packageJson = JSON.parse(fs.readFileSync(`${PACKS_EXAMPLES_DIRECTORY}/package.json`, 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(`npm install --save-dev ${devDependencyPackages}`);

  const copyCommand = `cp -r ${PACKS_EXAMPLES_DIRECTORY}/examples/template/* ${process.cwd()}`;
  spawnProcess(copyCommand);

  if (!isPacksExamplesInstalled) {
    const uninstallCommand = `npm uninstall @codahq/packs-examples`;
    spawnProcess(uninstallCommand);
  }
}
