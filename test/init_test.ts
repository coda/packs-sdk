import * as cliHelpers from '../cli/helpers';
import fs from 'fs-extra';
import {handleInit} from '../cli/init';
import path from 'path';
import sinon from 'sinon';
import * as testingHelpers from '../testing/helpers';

const ExamplesDirectory = '/fake/node_modules/@codahq/packs-examples';
const TemplateDirectory = path.join(ExamplesDirectory, 'examples/template');

describe('Init command', () => {
  let cwd: string;
  let exitMessage: string | undefined;
  let spawnStub: sinon.SinonStub;
  let resolveStub: sinon.SinonStub;
  let copyStub: sinon.SinonStub;
  let appendStub: sinon.SinonStub;

  beforeEach(() => {
    cwd = fs.realpathSync(process.cwd());
    exitMessage = undefined;

    sinon.stub(testingHelpers, 'print');
    sinon.stub(testingHelpers, 'printAndExit').callsFake((msg: string) => {
      exitMessage = msg;
      // printAndExit exits the process, so throwing keeps the rest of the command from running.
      throw new Error(msg);
    });

    spawnStub = sinon.stub(cliHelpers, 'spawnProcess');
    // Never resolve for real, so a test can't find an installed package and copy it into this repo.
    resolveStub = sinon.stub(cliHelpers, 'resolvePackageDirectory').returns(ExamplesDirectory);

    // Only the files init reads or writes are faked; nothing reaches the real filesystem.
    sinon.stub(fs, 'existsSync').callsFake((file: any) => file === TemplateDirectory);
    sinon
      .stub(fs, 'readFileSync')
      .withArgs(path.join(ExamplesDirectory, 'package.json'))
      .returns(JSON.stringify({devDependencies: {typescript: '^5.0.0', mocha: '>=10 <11'}}));
    copyStub = sinon.stub(fs, 'copySync');
    appendStub = sinon.stub(fs, 'appendFileSync');
  });

  afterEach(() => {
    sinon.restore();
  });

  // Every command succeeds and every package is missing unless listed. `failures` and `installed` match a
  // command by prefix, so the long dev dependency install can be named by its start.
  function mockCommands({
    npmRoot = cwd,
    failures = [],
    installed = [],
  }: {npmRoot?: string; failures?: string[]; installed?: string[]} = {}) {
    spawnStub.callsFake((command: string) => {
      let stdout = '';
      if (command === 'npm prefix') {
        stdout = `${npmRoot}\n`;
      } else if (command.startsWith('npm ls ')) {
        const packageName = command.split(' ')[2];
        const dependencies = installed.includes(packageName) ? {[packageName]: {version: '1.0.0'}} : {};
        stdout = JSON.stringify({dependencies});
      }
      const failed = failures.some(failure => command.startsWith(failure));
      return {status: failed ? 1 : 0, stdout: Buffer.from(stdout)} as any;
    });
  }

  function commands(): string[] {
    return spawnStub.getCalls().map(call => call.args[0]);
  }

  async function runInit() {
    try {
      await handleInit();
    } catch {
      // Expected - printAndExit throws.
    }
  }

  it('creates the Pack and removes the examples it installed', async () => {
    mockCommands();

    await runInit();

    assert.isUndefined(exitMessage);
    assert.isTrue(copyStub.calledOnceWith(TemplateDirectory, process.cwd()));
    assert.include(commands(), 'npm install --save-dev "typescript@^5.0.0" "mocha@>=10 <11"');
    assert.equal(commands()[commands().length - 1], 'npm uninstall @codahq/packs-examples');
  });

  it('keeps examples the project already had', async () => {
    // Installed with a problem: npm ls exits non-zero but still lists the package.
    mockCommands({installed: ['@codahq/packs-examples'], failures: ['npm ls @codahq/packs-examples']});

    await runInit();

    assert.isUndefined(exitMessage);
    assert.notInclude(commands(), 'npm install https://github.com/coda/packs-examples.git');
    assert.notInclude(commands(), 'npm uninstall @codahq/packs-examples');
  });

  it('refuses to run outside the npm root', async () => {
    mockCommands({npmRoot: path.dirname(cwd)});

    await runInit();

    assert.include(exitMessage!, `npm installs packages into ${path.dirname(cwd)}`);
    assert.include(exitMessage!, 'Run "npm init -y" here first');
    // Nothing should have been installed into the parent directory.
    assert.deepEqual(commands(), ['npm prefix']);
  });

  it('exits with a message when npm is unavailable', async () => {
    mockCommands({npmRoot: '', failures: ['npm prefix']});

    await runInit();

    assert.include(exitMessage!, 'requires npm to be installed');
  });

  it('exits with a message when the examples cannot be installed', async () => {
    mockCommands({failures: ['npm install https://github.com/coda/packs-examples.git']});

    await runInit();

    assert.include(exitMessage!, 'could not install the Pack examples');
    assert.isFalse(copyStub.called);
  });

  it('exits with the error code when the installed examples cannot be resolved', async () => {
    mockCommands();
    resolveStub.throws(Object.assign(new Error('Cannot find module'), {code: 'MODULE_NOT_FOUND'}));

    await runInit();

    assert.include(exitMessage!, 'are installed, but @codahq/packs-examples could not be resolved');
    assert.include(exitMessage!, 'MODULE_NOT_FOUND');
    assert.include(commands(), 'npm uninstall @codahq/packs-examples');
    assert.isFalse(copyStub.called);
  });

  it('removes the examples when the dev dependencies cannot be installed', async () => {
    mockCommands({failures: ['npm install --save-dev']});

    await runInit();

    assert.include(exitMessage!, 'could not install the Pack development dependencies');
    assert.include(commands(), 'npm uninstall @codahq/packs-examples');
    assert.isFalse(copyStub.called);
  });

  it('removes the examples when the template is missing', async () => {
    mockCommands();
    (fs.existsSync as sinon.SinonStub).returns(false);

    await runInit();

    assert.include(exitMessage!, `could not find the Pack template in ${TemplateDirectory}`);
    assert.include(commands(), 'npm uninstall @codahq/packs-examples');
    assert.isFalse(copyStub.called);
  });

  it('refuses a dev dependency that would escape its shell quotes', async () => {
    mockCommands();
    (fs.readFileSync as sinon.SinonStub)
      .withArgs(path.join(ExamplesDirectory, 'package.json'))
      .returns(JSON.stringify({devDependencies: {typescript: '$(touch pwned)'}}));

    await runInit();

    assert.include(exitMessage!, 'cannot be installed safely: typescript@$(touch pwned)');
    assert.isFalse(commands().some(command => command.startsWith('npm install --save-dev')));
    assert.include(commands(), 'npm uninstall @codahq/packs-examples');
  });

  describe('.gitignore', () => {
    function mockGitIgnore(contents: string) {
      const gitIgnoreFile = path.join(process.cwd(), '.gitignore');
      (fs.existsSync as sinon.SinonStub).callsFake((file: any) => [TemplateDirectory, gitIgnoreFile].includes(file));
      (fs.readFileSync as sinon.SinonStub).withArgs(gitIgnoreFile).returns(contents);
    }

    it('starts on a new line when the existing file does not end with one', async () => {
      mockCommands();
      mockGitIgnore('node_modules');

      await runInit();

      assert.equal(appendStub.firstCall.args[1], '\n.coda.json\n.coda-credentials.json\n');
    });

    it('does not repeat entries that are already there', async () => {
      mockCommands();
      mockGitIgnore('node_modules\n.coda.json\n.coda-credentials.json\n');

      await runInit();

      assert.isFalse(appendStub.called);
    });
  });
});
