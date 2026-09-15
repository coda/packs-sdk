import {confirmOrFail} from './confirm';
import fs from 'fs-extra';
import path from 'path';
import {printAndExit} from '../testing/helpers';
import {spawnProcess} from './helpers';

const GitIgnore = `.coda.json
.coda-credentials.json
`;

// npm installs into the nearest ancestor directory containing a package.json, not into the current
// directory, so every node_modules path has to be resolved from there.
function getNpmRoot(): string {
  const {status, stdout} = spawnProcess('npm prefix', {stdio: 'pipe'});
  const npmRoot = status === 0 ? stdout.toString().trim() : '';
  return (
    npmRoot ||
    printAndExit(
      'The packs init command requires npm to be installed and available in your path. ' +
        'See https://nodejs.org/en/download for suggested ways to install.',
    )
  );
}

function isGitAvailable(): boolean {
  return spawnProcess('git --version').status === 0;
}

// By no means comprehensive, just an attempt to cover characters that can appear in a package.json declaration.
function escapeShellCmd(cmd: string): string {
  return cmd.replace('>', '\\>').replace('<', '\\<');
}

export async function handleInit({yes}: {yes?: boolean} = {}) {
  // Warn before clobbering an existing pack.ts, since init copies the template over it.
  if (fs.existsSync(path.join(process.cwd(), 'pack.ts'))) {
    confirmOrFail({
      yes,
      prompt: 'A pack.ts file already exists. Do you want to overwrite it? (y/N)?',
      example: 'packs init --yes',
    });
  }

  const packsExamplesDirectory = path.join(getNpmRoot(), 'node_modules/@codahq/packs-examples');

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
        'The packs init command requires git to be installed and available in your path. ' +
          'See https://git-scm.com/downloads for suggested ways to install.',
      );
    }
    const installCommand = `npm install https://github.com/coda/packs-examples.git`;
    if (spawnProcess(installCommand).status !== 0) {
      return printAndExit(
        'The packs init command could not install the Pack examples. ' +
          'Check that you can reach https://github.com/coda/packs-examples and try again.',
      );
    }
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  spawnProcess(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`));
  if (spawnProcess('npm list @codahq/packs-sdk --depth=0').status !== 0) {
    spawnProcess('npm install --save @codahq/packs-sdk');
  }

  fs.copySync(path.join(packsExamplesDirectory, 'examples/template'), process.cwd());
  // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
  // in the template example alongside the other files. So we just create it explicitly
  // here as part of the init step.
  fs.appendFileSync(path.join(process.cwd(), '.gitignore'), GitIgnore);

  if (!isPacksExamplesInstalled) {
    const uninstallCommand = `npm uninstall @codahq/packs-examples`;
    spawnProcess(uninstallCommand);
  }
}
