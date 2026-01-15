import type {Client} from '../helpers/external-api/coda';
import type {PublicApiPackRelease} from '../helpers/external-api/v1';
import * as gitHelpers from '../cli/git_helpers';
import * as helpers from '../cli/helpers';
import * as testingHelpers from '../testing/helpers';
import {handleRelease} from '../cli/release';
import {lockFileExists} from '../cli/lock_file';
import mockFs from 'mock-fs';
import {readLockFile} from '../cli/lock_file';
import sinon from 'sinon';
import {writeLockFile} from '../cli/lock_file';

const PROJECT_DIR = '/myproject';
const MANIFEST_FILE = `${PROJECT_DIR}/pack.ts`;
const PACK_ID = 12345;

const mockReleaseResponse: PublicApiPackRelease = {
  packId: PACK_ID,
  packVersion: '1.0.0',
  releaseId: 42,
  releaseVersion: '1.0.0',
  releaseNotes: 'Test release',
  createdAt: '2026-01-14T10:00:00.000Z',
  buildId: 999,
};

describe('Release command', () => {
  let mockClient: Partial<Client>;
  let exitCode: number | undefined;
  let exitMessage: string | undefined;

  beforeEach(() => {
    mockFs({
      [PROJECT_DIR]: {
        'pack.ts': 'export const pack = {};',
        '.coda-pack.json': JSON.stringify({packId: PACK_ID}),
      },
    });

    exitCode = undefined;
    exitMessage = undefined;

    sinon.stub(testingHelpers, 'print');
    sinon.stub(testingHelpers, 'printAndExit').callsFake((msg: string, code: number = 1) => {
      exitMessage = msg;
      exitCode = code;
      const error = new Error(msg);
      (error as any).exitCode = code;
      throw error;
    });

    mockClient = {
      createPackRelease: sinon.stub().resolves(mockReleaseResponse),
      listPackVersions: sinon.stub().resolves({items: [{packVersion: '1.0.0'}]}),
    };
    sinon.stub(helpers, 'createCodaClient').returns(mockClient as Client);
  });

  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  async function runRelease(overrides: Partial<Parameters<typeof handleRelease>[0]> = {}) {
    try {
      await handleRelease({
        manifestFile: MANIFEST_FILE,
        packVersion: '1.0.0',
        codaApiEndpoint: 'https://coda.io',
        notes: 'Test release',
        apiToken: 'test-token',
        $0: '',
        _: [],
        ...overrides,
      });
    } catch {
      // Expected - printAndExit throws
    }
  }

  describe('without lock file', () => {
    it('releases without creating lock file or calling git', async () => {
      const getGitStateStub = sinon.stub(gitHelpers, 'getGitState');

      await runRelease();

      // Release succeeded
      assert.equal(exitCode, 0);
      assert.isTrue((mockClient.createPackRelease as sinon.SinonStub).calledOnce);

      // No tracking: lock file not created, git not called
      assert.isFalse(lockFileExists(PROJECT_DIR));
      assert.isFalse(getGitStateStub.called);
    });
  });

  describe('with lock file, no git repo', () => {
    beforeEach(() => {
      writeLockFile(PROJECT_DIR, {releases: []});
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: false,
        isDirty: false,
        currentBranch: undefined,
        commitSha: undefined,
      });
    });

    it('updates lock file with null commitSha and no gitTag', async () => {
      sinon.stub(gitHelpers, 'createGitTag');

      await runRelease();

      assert.equal(exitCode, 0);

      const lockFile = readLockFile(PROJECT_DIR);
      assert.equal(lockFile!.releases.length, 1);
      assert.equal(lockFile!.releases[0].version, '1.0.0');
      assert.equal(lockFile!.releases[0].releaseId, 42);
      assert.isNull(lockFile!.releases[0].commitSha);
      assert.isUndefined(lockFile!.releases[0].gitTag);
    });
  });

  describe('with lock file and git repo', () => {
    beforeEach(() => {
      writeLockFile(PROJECT_DIR, {releases: []});
    });

    it('blocks release when there are uncommitted changes', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: true,
        currentBranch: 'main',
        commitSha: 'abc123',
      });

      await runRelease();

      // Release was blocked
      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'uncommitted changes');

      // API was NOT called
      assert.isFalse((mockClient.createPackRelease as sinon.SinonStub).called);

      // Lock file was NOT updated
      const lockFile = readLockFile(PROJECT_DIR);
      assert.equal(lockFile!.releases.length, 0);
    });

    it('records commitSha and gitTag on successful release', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'main',
        commitSha: 'abc123def456',
      });
      sinon.stub(gitHelpers, 'gitTagExists').returns(false);
      sinon.stub(gitHelpers, 'createGitTag').returns(true);

      await runRelease();

      assert.equal(exitCode, 0);

      const lockFile = readLockFile(PROJECT_DIR);
      const release = lockFile!.releases[0];
      assert.equal(release.commitSha, 'abc123def456');
      assert.equal(release.gitTag, `pack/${PACK_ID}/v1.0.0`);
    });

    it('skips git tag creation if tag already exists', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'main',
        commitSha: 'abc123',
      });
      sinon.stub(gitHelpers, 'gitTagExists').returns(true);
      const createGitTagStub = sinon.stub(gitHelpers, 'createGitTag');

      await runRelease();

      assert.equal(exitCode, 0);
      assert.isFalse(createGitTagStub.called);
    });
  });

  describe('with corrupted lock file', () => {
    beforeEach(() => {
      mockFs({
        [PROJECT_DIR]: {
          'pack.ts': 'export const pack = {};',
          '.coda-pack.json': JSON.stringify({packId: PACK_ID}),
          '.coda-pack.lock.json': 'invalid json {{{',
        },
      });
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: false,
        isDirty: false,
        currentBranch: undefined,
        commitSha: undefined,
      });
    });

    it('treats as empty and adds new release', async () => {
      await runRelease();

      assert.equal(exitCode, 0);

      const lockFile = readLockFile(PROJECT_DIR);
      assert.equal(lockFile!.releases.length, 1);
      assert.equal(lockFile!.releases[0].version, '1.0.0');
    });
  });
});
