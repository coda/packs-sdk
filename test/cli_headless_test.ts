import './test_helper';
import {ResponseError} from '../helpers/external-api/coda';
import * as configStorage from '../cli/config_storage';
import * as confirm from '../cli/confirm';
import {confirmOrFail} from '../cli/confirm';
import fsExtra from 'fs-extra';
import * as gitHelpers from '../cli/git_helpers';
import {handleAgentInstall} from '../cli/agent_install';
import {handleAgentLogs} from '../cli/agent_logs';
import {handleInit} from '../cli/init';
import {handleRegister} from '../cli/register';
import {handleRelease} from '../cli/release';
import {handleValidate} from '../cli/validate';
import * as helpers from '../cli/helpers';
import mockFs from 'mock-fs';
import path from 'path';
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

  describe('init', () => {
    // Sentinel thrown by the stubbed spawnProcess to prove execution got past the
    // overwrite guard without doing any real npm work.
    const SPAWN_SENTINEL = 'spawnProcess was called';

    it('aborts before doing any work when pack.ts already exists and is not confirmed', async () => {
      sinon.stub(fsExtra, 'existsSync').callsFake(p => String(p).endsWith('pack.ts'));
      sinon.stub(confirm, 'isInteractive').returns(false);
      const spawnStub = sinon.stub(helpers, 'spawnProcess');

      try {
        await handleInit();
        assert.fail('expected printAndExit');
      } catch {
        // printAndExit throws
      }

      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'pack.ts file already exists');
      assert.isFalse(spawnStub.called, 'should not run npm work after aborting');
    });

    it('asks to confirm the overwrite and passes yes through when pack.ts exists', async () => {
      sinon.stub(fsExtra, 'existsSync').callsFake(p => String(p).endsWith('pack.ts'));
      const confirmStub = sinon.stub(confirm, 'confirmOrFail');
      sinon.stub(helpers, 'spawnProcess').throws(new Error(SPAWN_SENTINEL));

      try {
        await handleInit({yes: true});
      } catch {
        // sentinel thrown once execution proceeds past the guard
      }

      assert.isTrue(confirmStub.calledOnce);
      const args = confirmStub.firstCall.firstArg;
      assert.equal(args.yes, true);
      assert.include(args.prompt, 'pack.ts file already exists');
    });

    it('does not ask to confirm when pack.ts does not exist', async () => {
      sinon.stub(fsExtra, 'existsSync').returns(false);
      const confirmStub = sinon.stub(confirm, 'confirmOrFail');
      sinon.stub(helpers, 'spawnProcess').throws(new Error(SPAWN_SENTINEL));

      try {
        await handleInit();
      } catch {
        // sentinel thrown once execution proceeds past the guard
      }

      assert.isFalse(confirmStub.called);
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

  describe('agent install', () => {
    const apiEndpoint = 'https://coda.io';
    let postedUrls: string[];
    let postedBodies: unknown[];

    function jsonResponse(body: unknown, status = 200, statusText = 'OK') {
      return {
        ok: status >= 200 && status < 300,
        status,
        statusText,
        json: async () => body,
        text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
      } as any;
    }

    beforeEach(() => {
      postedUrls = [];
      postedBodies = [];
      sinon.stub(configStorage, 'getPackId').returns(1234);
      sinon.stub(helpers, 'createCodaClient').returns({
        listPackVersions: async () => ({items: [{packVersion: '3'}]}),
      } as any);
      sinon.stub(global, 'fetch').callsFake(async (url: any, init: any) => {
        postedUrls.push(String(url));
        postedBodies.push(init?.body ? JSON.parse(String(init.body)) : undefined);
        return jsonResponse({});
      });
    });

    async function install(args: Partial<Parameters<typeof handleAgentInstall>[0]>) {
      await handleAgentInstall({
        manifestPath: 'pack.ts',
        apiEndpoint,
        apiToken: 'test-token',
        $0: '',
        _: [],
        ...args,
      } as any);
    }

    function printedOutput(): string {
      return (testingHelpers.print as unknown as sinon.SinonStub).args.map(call => String(call[0])).join('\n');
    }

    it('installs the latest version without confirming', async () => {
      const confirmStub = sinon.stub(confirm, 'confirmOrFail');
      await install({});

      sinon.assert.notCalled(confirmStub);
      assert.deepEqual(postedUrls, ['https://coda.io/apis/v1/packs/1234/versions/3/agentInstall']);
      assert.deepEqual(postedBodies, [{reinstall: false}]);
      assert.include(printedOutput(), 'Installed agent version 3 of pack 1234.');
    });

    it('uses an explicit version and skips the version lookup', async () => {
      await install({version: '2'});

      assert.deepEqual(postedUrls, ['https://coda.io/apis/v1/packs/1234/versions/2/agentInstall']);
      assert.deepEqual(postedBodies, [{reinstall: false}]);
    });

    it('exits with guidance for a headless reinstall without --yes', async () => {
      sinon.stub(confirm, 'isInteractive').returns(false);
      try {
        await install({reinstall: true});
        assert.fail('expected printAndExit');
      } catch {
        // printAndExit throws
      }

      assert.equal(exitCode, 1);
      assert.include(exitMessage, '--reinstall --yes');
      assert.isEmpty(postedUrls);
    });

    it('sends reinstall true when --yes is set', async () => {
      await install({reinstall: true, yes: true});

      assert.deepEqual(postedBodies, [{reinstall: true}]);
      assert.include(printedOutput(), 'Reinstalled agent version 3 of pack 1234.');
    });

    it('prints the attempted URL and browser fallback for a missing route', async () => {
      (global.fetch as unknown as sinon.SinonStub).callsFake(async (url: any) => {
        postedUrls.push(String(url));
        return {ok: false, status: 404, statusText: 'Not Found', text: async () => '<html>nope</html>'} as any;
      });
      try {
        await install({});
        assert.fail('expected printAndExit');
      } catch {
        // printAndExit throws
      }

      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'https://coda.io/apis/v1/packs/1234/versions/3/agentInstall');
      assert.include(exitMessage, 'agent directory');
      assert.notInclude(printedOutput(), 'Installed agent version');
    });

    it('reports API failures instead of a missing route', async () => {
      (global.fetch as unknown as sinon.SinonStub).callsFake(async (url: any) => {
        postedUrls.push(String(url));
        return jsonResponse({statusCode: 404, message: 'nope'}, 404, 'Not Found');
      });
      try {
        await install({});
        assert.fail('expected printAndExit');
      } catch {
        // printAndExit throws
      }

      assert.equal(exitCode, 1);
      assert.include(exitMessage, 'Agent install failed: 404');
    });
  });

  describe('agent logs', () => {
    const apiEndpoint = 'https://coda.io';

    function logRow(id: string, sessionId: string, createdAt: string, type: string) {
      return {context: {logId: id, agentSessionId: sessionId, createdAt}, type};
    }

    function printedLines(): string[] {
      return (testingHelpers.print as unknown as sinon.SinonStub).args.map(call => String(call[0]));
    }

    it('follows new sessions without dropping or repeating their logs', async () => {
      sinon.stub(configStorage, 'getPackId').returns(1234);
      sinon.stub(helpers, 'createCodaClient').returns({
        listPackVersions: async () => ({items: []}),
        listAgentSessionIds: (() => {
          let calls = 0;
          return async () => {
            calls += 1;
            const rows =
              calls === 1
                ? [{context: {agentSessionId: 's-1'}}]
                : [{context: {agentSessionId: 's-1'}}, {context: {agentSessionId: 's-2'}}];
            return {items: rows};
          };
        })(),
        listAgentLogs: (async (_tenant: any, _instance: any, params: any) => {
          if (params?.agentSessionId === 's-1') {
            return {items: [logRow('a', 's-1', '2026-01-01T00:00:01Z', 'fetcher')]};
          }
          return {items: [logRow('b', 's-2', '2026-01-01T00:00:02Z', 'custom')]};
        }) as any,
      } as any);
      const clock = sinon.useFakeTimers();
      try {
        // 60 polls trip the 5-minute cap and end the loop; earlier polls exercise the follow logic.
        const done = handleAgentLogs({
          manifestPath: 'pack.ts',
          tenant: 'bt-1',
          instance: 'agent-1',
          tail: true,
          apiEndpoint,
          apiToken: 'test-token',
          $0: '',
          _: [],
        } as any);
        await clock.tickAsync(310000);
        await done;
      } finally {
        clock.restore();
      }

      const lines = printedLines();
      assert.include(lines.join('\n'), 'Following new session s-2.');
      assert.equal(lines.filter(line => line.includes('[fetcher]')).length, 1);
      assert.equal(lines.filter(line => line.includes('[custom]')).length, 1);
      assert.include(lines.join('\n'), 'Stopped polling after 5 minutes.');
    });
  });

  describe('validate connector check', () => {
    const apiEndpoint = 'https://coda.io';
    let dir: string;
    let manifestFile: string;
    let createdClientArgs: Array<{apiToken: string; endpoint: string}>;
    let listingBehavior: (packId: number) => Promise<unknown>;

    function writeAgentPack() {
      dir = fsExtra.mkdtempSync(path.join(__dirname, 'packs', '.tmp-validate-connectors-'));
      manifestFile = path.join(dir, 'pack.ts');
      fsExtra.writeFileSync(
        manifestFile,
        [
          "import * as sdk from '../../../index';",
          'export const pack = sdk.newAgent();',
          "pack.setInstructions('Hi.');",
          'pack.setTools({docs: true, connectors: [{packId: 1234}]});',
          '',
        ].join('\n'),
      );
    }

    function printedLines(): string[] {
      return (testingHelpers.print as unknown as sinon.SinonStub).args.map(call => String(call[0]));
    }

    beforeEach(() => {
      writeAgentPack();
      createdClientArgs = [];
      listingBehavior = async () => ({id: 1234});
      sinon.stub(helpers, 'isTestCommand').returns(true);
      sinon.stub(helpers, 'createCodaClient').callsFake(((apiToken: string, endpoint: string) => {
        createdClientArgs.push({apiToken, endpoint});
        return {getPackListing: listingBehavior};
      }) as any);
    });

    afterEach(() => {
      fsExtra.removeSync(dir);
    });

    async function validate(args: Record<string, unknown>) {
      await handleValidate({
        manifestFile,
        checkDeprecationWarnings: false,
        apiEndpoint,
        $0: '',
        _: [],
        ...args,
      } as any);
    }

    it('skips listing requests without a token and still passes', async () => {
      sinon.stub(configStorage, 'getApiKey').returns(undefined);
      let listed = false;
      listingBehavior = (async () => {
        listed = true;
        return {id: 1234};
      }) as any;
      await validate({});

      assert.isFalse(listed);
      assert.include(printedLines().join('\n'), 'Pack is valid.');
    });

    it('skips listing requests when checkConnectors is false', async () => {
      sinon.stub(configStorage, 'getApiKey').returns('saved-token');
      let listed = false;
      listingBehavior = (async () => {
        listed = true;
        return {id: 1234};
      }) as any;
      await validate({checkConnectors: false, apiToken: 'test-token'});

      assert.isFalse(listed);
      assert.include(printedLines().join('\n'), 'Pack is valid.');
    });

    it('checks using the saved token when the flag is omitted', async () => {
      sinon.stub(configStorage, 'getApiKey').returns('saved-token');
      await validate({});

      assert.deepEqual(createdClientArgs, [{apiToken: 'saved-token', endpoint: 'https://coda.io'}]);
      assert.include(printedLines().join('\n'), 'Pack is valid.');
    });

    it('prefers an explicit apiToken over stored credentials', async () => {
      const getApiKeyStub = sinon.stub(configStorage, 'getApiKey');
      await validate({apiToken: 'explicit-token'});

      sinon.assert.notCalled(getApiKeyStub);
      assert.deepEqual(createdClientArgs, [{apiToken: 'explicit-token', endpoint: 'https://coda.io'}]);
    });

    it('looks up credentials and builds the client for a bare endpoint', async () => {
      const getApiKeyStub = sinon.stub(configStorage, 'getApiKey').returns('saved-token');
      await validate({apiEndpoint: 'coda.io'});

      sinon.assert.calledWith(getApiKeyStub, 'https://coda.io');
      assert.deepEqual(createdClientArgs, [{apiToken: 'saved-token', endpoint: 'https://coda.io'}]);
    });

    it('warns on a 404 listing but still passes', async () => {
      sinon.stub(configStorage, 'getApiKey').returns('saved-token');
      listingBehavior = (async () => {
        throw new ResponseError({
          status: 404,
          statusText: 'Not Found',
          text: async () => JSON.stringify({statusCode: 404, message: 'nope'}),
        } as any);
      }) as any;
      await validate({});

      const lines = printedLines().join('\n');
      assert.include(lines, 'Connector pack 1234');
      assert.include(lines, 'superhuman.com/store/connectors');
      assert.include(lines, 'Pack is valid.');
    });

    it('warns instead of throwing when verification fails outright', async () => {
      sinon.stub(configStorage, 'getApiKey').returns('saved-token');
      listingBehavior = (async () => {
        throw new TypeError('fetch failed');
      }) as any;
      await validate({});

      const lines = printedLines().join('\n');
      assert.include(lines, 'Could not verify connector pack 1234');
      assert.include(lines, 'Pack is valid.');
    });
  });
});
