import {confirmOrFail} from './confirm';
import fs from 'fs-extra';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {spawnProcess} from './helpers';

const GitIgnore = `.coda.json
.coda-credentials.json
`;

function getNpmRoot(): string {
  const {status, stdout} = spawnProcess('npm prefix', {stdio: 'pipe'});
  const npmRoot = status === 0 ? stdout.toString().trim() : '';
  if (!npmRoot) {
    return printAndExit(
      'The packs init command requires npm to be installed and available in your path. ' +
        'See https://nodejs.org/en/download for suggested ways to install.',
    );
  }
  return fs.realpathSync(npmRoot);
}

// npm may hoist the examples above the npm root, so ask Node where they actually landed instead of
// assuming they are in the nearest node_modules.
function getPacksExamplesDirectory(): string {
  try {
    return path.dirname(require.resolve('@codahq/packs-examples/package.json', {paths: [process.cwd()]}));
  } catch (error: any) {
    return printAndExit(
      `The packs init command could not find @codahq/packs-examples from ${process.cwd()}. ` +
        'Check that you can reach https://github.com/coda/packs-examples and try again.',
    );
  }
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

  // npm installs into the nearest ancestor directory containing a package.json, so a Pack created
  // anywhere else would have its dependencies added to that directory instead of this one.
  const npmRoot = getNpmRoot();
  if (npmRoot !== fs.realpathSync(process.cwd())) {
    return printAndExit(
      `npm installs packages into ${npmRoot}, so a Pack created here would have its dependencies added there ` +
        'instead. Run "npm init -y" here first to create the Pack in this directory, or run the packs init ' +
        `command in ${npmRoot}.`,
    );
  }

  const isPacksExamplesInstalled = spawnProcess('npm list @codahq/packs-examples').status === 0;

  if (!isPacksExamplesInstalled) {
    if (!isGitAvailable()) {
      return printAndExit(
        'The packs init command requires git to be installed and available in your path. ' +
          'See https://git-scm.com/downloads for suggested ways to install.',
      );
    }
    if (spawnProcess(`npm install https://github.com/coda/packs-examples.git`).status !== 0) {
      return printAndExit(
        'The packs init command could not install the Pack examples. ' +
          'Check that you can reach https://github.com/coda/packs-examples and try again.',
      );
    }
  }

  const packsExamplesDirectory = getPacksExamplesDirectory();
  const packageJson = JSON.parse(fs.readFileSync(path.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
  const devDependencies = packageJson.devDependencies;
  const devDependencyPackages = Object.keys(devDependencies)
    .map(dependency => `${dependency}@${devDependencies[dependency]}`)
    .join(' ');
  if (spawnProcess(escapeShellCmd(`npm install --save-dev ${devDependencyPackages}`)).status !== 0) {
    return printAndExit('The packs init command could not install the Pack development dependencies.');
  }
  if (
    spawnProcess('npm list @codahq/packs-sdk --depth=0').status !== 0 &&
    spawnProcess('npm install --save @codahq/packs-sdk').status !== 0
  ) {
    return printAndExit('The packs init command could not install @codahq/packs-sdk.');
  }

  fs.copySync(path.join(packsExamplesDirectory, 'examples/template'), process.cwd());
  // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
  // in the template example alongside the other files. So we just create it explicitly
  // here as part of the init step.
  fs.appendFileSync(path.join(process.cwd(), '.gitignore'), GitIgnore);

  // The Pack is usable at this point, so failing to clean up the examples is only worth a warning.
  if (!isPacksExamplesInstalled && spawnProcess('npm uninstall @codahq/packs-examples').status !== 0) {
    print('The Pack examples could not be removed. Run "npm uninstall @codahq/packs-examples" to remove them.');
  }
}
