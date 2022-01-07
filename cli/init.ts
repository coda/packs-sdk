import fs from 'fs-extra';
import path from 'path';
import {spawnProcess} from './helpers';

const PacksExamplesDirectory = 'node_modules/@codahq/packs-examples';

const GitIgnore = `.coda.json
.coda-credentials.json
`;

function addPatches() {
  spawnProcess(`npm set-script postinstall "npx patch-package"`);

  spawnProcess(
    `grep -v '"main":' node_modules/mold-source-map/package.json > node_modules/mold-source-map/package.json.new`,
  );
  spawnProcess(`mv node_modules/mold-source-map/package.json.new node_modules/mold-source-map/package.json`);

  spawnProcess(`npx patch-package --exclude 'nothing' mold-source-map`);
}

export async function handleInit() {
  // stdout looks like `8.1.2\n`.
  const npmVersion = parseInt(spawnProcess('npm -v', {stdio: 'pipe'}).stdout.toString().trim().split('.', 1)[0], 10);
  if (npmVersion < 7) {
    throw new Error(`Your npm version is older than 7. Please upgrade npm to at least 7 with "npm install npm@7"`);
  }

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

  const packageJson = JSON.parse(fs.readFileSync(path.join(PacksExamplesDirectory, 'package.json'), 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(`npm install --save-dev ${devDependencyPackages}`);

  // developers may run in NodeJs 16 where some packages need to be patched to avoid warnings.
  addPatches();

  fs.copySync(`${PacksExamplesDirectory}/examples/template`, process.cwd());
  // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
  // in the template example alongside the other files. So we just create it explicitly
  // here as part of the init step.
  fs.appendFileSync(path.join(process.cwd(), '.gitignore'), GitIgnore);

  if (!isPacksExamplesInstalled) {
    const uninstallCommand = `npm uninstall @codahq/packs-examples`;
    spawnProcess(uninstallCommand);
  }
}
