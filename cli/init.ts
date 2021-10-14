import fs from 'fs';
import {spawnProcess} from './helpers';

const PacksExamplesDirectory = 'node_modules/@codahq/packs-examples';

const GitIgnore = `.coda.json
.coda-credentials.json
`;

export async function handleInit() {
  let isPacksExamplesInstalled: boolean;
  try {
    const listNpmPackages = spawnProcess('npm list @codahq/packs-examples');
    isPacksExamplesInstalled = listNpmPackages.status === 0;
  } catch (error: any) {
    isPacksExamplesInstalled = false;
  }

  if (!isPacksExamplesInstalled) {
    // TODO(jonathan): Switch this to a regular https repo url when the repo becomes public.
    const installCommand = `npm install git+ssh://github.com/coda/packs-examples.git`;
    spawnProcess(installCommand);
  }

  const packageJson = JSON.parse(fs.readFileSync(`${PacksExamplesDirectory}/package.json`, 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(`npm install --save-dev ${devDependencyPackages}`);

  const copyCommand = `cp -r ${PacksExamplesDirectory}/examples/template/* ${process.cwd()}`;
  spawnProcess(copyCommand);
  // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
  // in the template example alongside the other files. So we just create it explicitly
  // here as part of the init step.
  const createIgnoreCommand = `echo "${GitIgnore}" > ${process.cwd()}/.gitignore`;
  spawnProcess(createIgnoreCommand);

  if (!isPacksExamplesInstalled) {
    const uninstallCommand = `npm uninstall @codahq/packs-examples`;
    spawnProcess(uninstallCommand);
  }
}
