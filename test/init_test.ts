import * as cliHelpers from '../cli/helpers';
import fs from 'fs-extra';
import {handleInit} from '../cli/init';
import path from 'path';
import sinon from 'sinon';
import * as testingHelpers from '../testing/helpers';

describe('Init command', () => {
  let exitMessage: string | undefined;
  let spawnStub: sinon.SinonStub;

  beforeEach(() => {
    exitMessage = undefined;

    sinon.stub(testingHelpers, 'print');
    sinon.stub(testingHelpers, 'printAndExit').callsFake((msg: string) => {
      exitMessage = msg;
      // printAndExit exits the process, so throwing keeps the rest of the command from running.
      throw new Error(msg);
    });

    spawnStub = sinon.stub(cliHelpers, 'spawnProcess');
  });

  afterEach(() => {
    sinon.restore();
  });

  // Commands not listed here succeed, which is the case that lets init proceed.
  function mockCommands({npmRoot, failures = []}: {npmRoot: string; failures?: string[]}) {
    spawnStub.callsFake((command: string) => {
      const stdout = Buffer.from(command === 'npm prefix' ? `${npmRoot}\n` : '');
      return {status: failures.includes(command) ? 1 : 0, stdout} as any;
    });
  }

  async function runInit() {
    try {
      await handleInit();
    } catch {
      // Expected - printAndExit throws.
    }
  }

  it('refuses to run outside the npm root', async () => {
    const cwd = fs.realpathSync(process.cwd());
    mockCommands({npmRoot: path.dirname(cwd)});

    await runInit();

    assert.include(exitMessage!, `npm installs packages into ${path.dirname(cwd)}`);
    assert.include(exitMessage!, 'Run "npm init -y" here first');
    // Nothing should have been installed into the parent directory.
    assert.deepEqual(
      spawnStub.getCalls().map(call => call.args[0]),
      ['npm prefix'],
    );
  });

  it('exits with a message when npm is unavailable', async () => {
    mockCommands({npmRoot: '', failures: ['npm prefix']});

    await runInit();

    assert.include(exitMessage!, 'requires npm to be installed');
  });

  it('exits with a message when the examples cannot be installed', async () => {
    mockCommands({
      npmRoot: fs.realpathSync(process.cwd()),
      failures: ['npm list @codahq/packs-examples', 'npm install https://github.com/coda/packs-examples.git'],
    });

    await runInit();

    assert.include(exitMessage!, 'could not install the Pack examples');
  });

  it('exits with a message when the examples cannot be found after installing', async () => {
    // @codahq/packs-examples is not a dependency of this repo, so resolution fails here.
    mockCommands({npmRoot: fs.realpathSync(process.cwd())});

    await runInit();

    assert.include(exitMessage!, 'could not find @codahq/packs-examples');
  });
});
