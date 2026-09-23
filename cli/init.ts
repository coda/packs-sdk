import {confirmOrFail} from './confirm';
import fs from 'fs-extra';
import path from 'path';
import {print} from '../testing/helpers';
import {printAndExit} from '../testing/helpers';
import {resolvePackageDirectory} from './helpers';
import {spawnProcess} from './helpers';

const PacksExamplesPackage = '@codahq/packs-examples';

const GitIgnoreEntries = ['.coda.json', '.coda-credentials.json'];

// Each dependency spec is double-quoted for the shell. These are the characters that stay special inside
// double quotes in sh ($, `, ", \) or in cmd.exe (%, "), plus line breaks, which end a command in both.
const UnsafeSpecCharacters = /[$`"\\%\r\n]/;

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

// `npm ls` exits non-zero when the package is installed but has a problem, such as a version that no
// longer matches package.json, so read the listing instead of the exit code.
function isInstalled(packageName: string): boolean {
  const {stdout} = spawnProcess(`npm ls ${packageName} --json --depth=0`, {stdio: 'pipe'});
  try {
    return Boolean(JSON.parse(stdout.toString()).dependencies?.[packageName]?.version);
  } catch {
    return false;
  }
}

function isGitAvailable(): boolean {
  return spawnProcess('git --version').status === 0;
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
        'instead. Run "npm init -y" here first to create the Pack in this directory, or run this command ' +
        `in ${npmRoot}.`,
    );
  }

  const isPacksExamplesInstalled = isInstalled(PacksExamplesPackage);

  // Once we have installed the examples ourselves, every way out removes them again.
  function removePacksExamples() {
    if (!isPacksExamplesInstalled && spawnProcess(`npm uninstall ${PacksExamplesPackage}`).status !== 0) {
      print(`The Pack examples could not be removed. Run "npm uninstall ${PacksExamplesPackage}" to remove them.`);
    }
  }
  function exit(message: string) {
    removePacksExamples();
    return printAndExit(message);
  }

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

  let packsExamplesDirectory: string;
  try {
    packsExamplesDirectory = resolvePackageDirectory(PacksExamplesPackage);
  } catch (error: any) {
    return exit(
      `The Pack examples are installed, but ${PacksExamplesPackage} could not be resolved from ${process.cwd()} ` +
        `(${error.code ?? error.message}).`,
    );
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(packsExamplesDirectory, 'package.json'), 'utf-8'));
  const devDependencies: Record<string, string> = packageJson.devDependencies ?? {};
  const devDependencySpecs = Object.entries(devDependencies).map(([name, version]) => `${name}@${version}`);
  const unsafeSpec = devDependencySpecs.find(spec => UnsafeSpecCharacters.test(spec));
  if (unsafeSpec) {
    return exit(`The Pack examples declare a development dependency that cannot be installed safely: ${unsafeSpec}`);
  }
  const quotedSpecs = devDependencySpecs.map(spec => `"${spec}"`).join(' ');
  if (spawnProcess(`npm install --save-dev ${quotedSpecs}`).status !== 0) {
    return exit('The packs init command could not install the Pack development dependencies.');
  }
  if (!isInstalled('@codahq/packs-sdk') && spawnProcess('npm install --save @codahq/packs-sdk').status !== 0) {
    return exit('The packs init command could not install @codahq/packs-sdk.');
  }

  const templateDirectory = path.join(packsExamplesDirectory, 'examples/template');
  if (!fs.existsSync(templateDirectory)) {
    return exit(`The packs init command could not find the Pack template in ${templateDirectory}.`);
  }
  fs.copySync(templateDirectory, process.cwd());
  // npm removes .gitignore files when installing a package, so we can't simply put the .gitignore
  // in the template example alongside the other files. So we just create it explicitly
  // here as part of the init step, adding only what is missing and starting on a new line.
  const gitIgnoreFile = path.join(process.cwd(), '.gitignore');
  const gitIgnore = fs.existsSync(gitIgnoreFile) ? fs.readFileSync(gitIgnoreFile, 'utf-8') : '';
  const missingEntries = GitIgnoreEntries.filter(entry => !gitIgnore.split(/\r?\n/).includes(entry));
  if (missingEntries.length) {
    const separator = gitIgnore && !gitIgnore.endsWith('\n') ? '\n' : '';
    fs.appendFileSync(gitIgnoreFile, `${separator}${missingEntries.join('\n')}\n`);
  }

  // The Pack is usable at this point, so failing to clean up the examples is only worth a warning.
  removePacksExamples();
}
