import type {Client} from '../helpers/external-api/coda';
import type {PublicApiPackRelease} from '../helpers/external-api/v1';
import * as configStorage from '../cli/config_storage';
import * as gitHelpers from '../cli/git_helpers';
import {handleRelease} from '../cli/release';
import * as helpers from '../cli/helpers';
import mockFs from 'mock-fs';
import sinon from 'sinon';
import * as testingHelpers from '../testing/helpers';

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
        gitTag: false,
        $0: '',
        _: [],
        ...overrides,
      });
    } catch {
      // Expected - printAndExit throws
    }
  }

  describe('without git repo', () => {
    beforeEach(() => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: false,
        isDirty: false,
        currentBranch: undefined,
        commitSha: undefined,
      });
    });

    it('releases successfully without creating git tag', async () => {
      const createGitTagStub = sinon.stub(gitHelpers, 'createGitTag');

      await runRelease();

      assert.equal(exitCode, 0);
      assert.isTrue((mockClient.createPackRelease as sinon.SinonStub).calledOnce);
      assert.isFalse(createGitTagStub.called);
    });
  });

  describe('with git repo', () => {
    it('blocks release when there are uncommitted changes', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: true,
        currentBranch: 'main',
        commitSha: 'abc123',
      });

      await runRelease();

      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'uncommitted changes');
      assert.isFalse((mockClient.createPackRelease as sinon.SinonStub).called);
    });

    it('does not create git tag by default', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'main',
        commitSha: 'abc123def456',
      });
      const createGitTagStub = sinon.stub(gitHelpers, 'createGitTag').returns(true);

      await runRelease();

      assert.equal(exitCode, 0);
      assert.isFalse(createGitTagStub.called);
    });

    it('creates git tag when --git-tag flag is passed', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'main',
        commitSha: 'abc123def456',
      });
      sinon.stub(gitHelpers, 'gitTagExists').returns(false);
      const createGitTagStub = sinon.stub(gitHelpers, 'createGitTag').returns(true);

      await runRelease({gitTag: true});

      assert.equal(exitCode, 0);
      assert.isTrue(createGitTagStub.calledOnce);
      const [tagName, tagMessage] = createGitTagStub.firstCall.args;
      assert.equal(tagName, `pack/${PACK_ID}/v1.0.0`);
      assert.include(tagMessage, 'Release ID: 42');
      assert.include(tagMessage, 'Test release');
    });

    it('creates git tag when enableGitTags option is set', async () => {
      sinon.stub(gitHelpers, 'getGitState').returns({
        isGitRepo: true,
        isDirty: false,
        currentBranch: 'main',
        commitSha: 'abc123def456',
      });
      sinon.stub(gitHelpers, 'gitTagExists').returns(false);
      sinon.stub(configStorage, 'getPackOptions').returns({enableGitTags: true});
      const createGitTagStub = sinon.stub(gitHelpers, 'createGitTag').returns(true);

      await runRelease();

      assert.equal(exitCode, 0);
      assert.isTrue(createGitTagStub.calledOnce);
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

      await runRelease({gitTag: true});

      assert.equal(exitCode, 0);
      assert.isFalse(createGitTagStub.called);
    });
  });
});
