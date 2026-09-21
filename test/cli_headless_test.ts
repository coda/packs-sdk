import './test_helper';
import * as confirm from '../cli/confirm';
import {confirmOrFail} from '../cli/confirm';
import * as gitHelpers from '../cli/git_helpers';
import {handleRegister} from '../cli/register';
import {handleRelease} from '../cli/release';
import * as helpers from '../cli/helpers';
import mockFs from 'mock-fs';
import sinon from 'sinon';
import * as testingHelpers from '../testing/helpers';

describe('Headless CLI', () => {
  let exitMessage: string | undefined;
  let exitCode: number | undefined;

  beforeEach(() => {
    exitMessage = undefined;
    exitCode = undefined;
    sinon.stub(testingHelpers, 'print');
    sinon.stub(testingHelpers, 'printAndExit').callsFake((msg: string, code: number = 1) => {
      exitMessage = msg;
      exitCode = code;
      const error = new Error(msg);
      (error as any).exitCode = code;
      throw error;
    });
  });

  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  describe('confirmOrFail', () => {
    it('returns immediately when --yes is set', () => {
      confirmOrFail({
        yes: true,
        prompt: 'Overwrite? (y/N)',
        example: 'packs clone 1234 --yes',
        interactive: false,
      });
    });

    it('fails with an example invocation when not interactive', () => {
      try {
        confirmOrFail({
          yes: false,
          prompt: 'Overwrite pack.ts? (y/N)',
          example: 'packs clone 1234 --yes',
          interactive: false,
        });
        assert.fail('expected printAndExit');
      } catch {
        assert.equal(exitCode, 1);
        assert.include(exitMessage, 'Pass --yes to continue without a prompt.');
        assert.include(exitMessage, 'packs clone 1234 --yes');
      }
    });
  });

  describe('register', () => {
    it('fails fast without a token in non-interactive mode', async () => {
      sinon.stub(confirm, 'isInteractive').returns(false);
      try {
        await handleRegister({
          apiEndpoint: 'https://coda.io',
          $0: 'packs',
          _: ['register'],
        });
      } catch {
        // printAndExit
      }
      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'No API token specified.');
      assert.include(exitMessage, 'packs register --apiToken <token>');
    });
  });

  describe('release', () => {
    const PROJECT_DIR = '/myproject';
    const MANIFEST_FILE = `${PROJECT_DIR}/pack.ts`;

    beforeEach(() => {
      mockFs({
        [PROJECT_DIR]: {
          'pack.ts': 'export const pack = {};',
          '.coda-pack.json': JSON.stringify({packId: 12345}),
        },
      });
      sinon.stub(helpers, 'createCodaClient').returns({
        createPackRelease: sinon.stub().resolves({
          packId: 12345,
          packVersion: '1.0.0',
          releaseId: 42,
          releaseNotes: 'Test release',
        }),
        listPackVersions: sinon.stub().resolves({items: [{packVersion: '1.0.0'}]}),
      } as any);
    });

    it('requires --yes when releasing from a non-main branch without a TTY', async () => {
      sinon.stub(confirm, 'isInteractive').returns(false);
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'feature',
        commitSha: 'abc123',
      });

      try {
        await handleRelease({
          manifestFile: MANIFEST_FILE,
          packVersion: '1.0.0',
          apiEndpoint: 'https://coda.io',
          notes: 'Test release',
          apiToken: 'test-token',
          gitTag: false,
          $0: '',
          _: [],
        });
      } catch {
        // printAndExit
      }

      assert.equal(exitCode, 1);
      assert.include(exitMessage, '--yes');
    });

    it('releases from a non-main branch when --yes is set', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'feature',
        commitSha: 'abc123',
      });

      try {
        await handleRelease({
          manifestFile: MANIFEST_FILE,
          packVersion: '1.0.0',
          apiEndpoint: 'https://coda.io',
          notes: 'Test release',
          apiToken: 'test-token',
          gitTag: false,
          yes: true,
          $0: '',
          _: [],
        });
      } catch {
        // printAndExit
      }

      assert.equal(exitCode, 0);
    });
  });
});
