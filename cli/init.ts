import fs from 'fs-extra';
import path from 'path';
import {printAndExit} from '../testing/helpers';
import {spawnProcess} from './helpers';

const PacksExamplesDirectory = 'node_modules/@codahq/packs-examples';

const GitIgnore = `.coda.json
.coda-credentials.json
`;

function updateMoldSourceMap() {
  // unfortuanately Windows has no grep.
  const packageFileName = 'node_modules/mold-source-map/package.json';
  const lines = fs.readFileSync(packageFileName).toString().split('\n');
  const validLines = lines.filter(line => !line.includes('"main":'));
  fs.writeFileSync(packageFileName, validLines.join('\n'));
}

function addPatches() {
  spawnProcess(`npm set-script postinstall "npx patch-package"`);

  updateMoldSourceMap();

  spawnProcess(`npx patch-package --exclude 'nothing' mold-source-map`);
}

function isGitAvailable(): boolean {
  return spawnProcess('git --version').status === 0;
}

// By no means comprehensive, just an attempt to cover characters that can appear in a package.json declaration.
function escapeShellCmd(cmd: string): string {
  return cmd.replace('>', '\\>').replace('<', '\\<');
}

export async function handleInit() {
  // stdout looks like `8.1.2\n`.
  const npmVersion = parseInt(spawnProcess('npm -v', {stdio: 'pipe'}).stdout.toString().trim().split('.', 1)[0], 10);
  if (npmVersion < 7) {
    // need npm 7 to support "npm set-script"
    throw new Error(`Your npm version is older than 7. Please upgrade npm to at least 7 with "npm install -g npm@7"`);
  }

  let isPacksExamplesInstalled: boolean;
  try {
    const listNpmPackages = spawnProcess('npm list @codahq/packs-examples');
    isPacksExamplesInstalled = listNpmPackages.status === 0;
  } catch (error: any) {
    isPacksExamplesInstalled = false;
  }

  if (!isPacksExamplesInstalled) {
    if (!isGitAvailable()) {
      return printAndExit(
        'The coda init command requires git to be installed and available in your path. ' +
          'See https://git-scm.com/downloads for suggested ways to install.',
      );
    }
    const installCommand = `npm install https://github.com/coda/packs-examples.git`;
    spawnProcess(installCommand);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(PacksExamplesDirectory, 'package.json'), 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`));
  if (spawnProcess('npm list @codahq/packs-sdk --depth=0').status !== 0) {
    spawnProcess('npm install --save @codahq/packs-sdk');
  }

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
