import {DEFAULT_API_ENDPOINT} from '../cli/config_storage';
import {DEFAULT_GIT_TAG} from '../cli/config_storage';
import {DEFAULT_TIMER_STRATEGY} from '../cli/config_storage';
import {DeprecatedPackOptionKey} from '../cli/config_storage';
import {PackOptionKey} from '../cli/config_storage';
import {TimerShimStrategy} from '../testing/compile';
import {backfillFromPackConfig} from '../cli/helpers';
import {getApiKey} from '../cli/config_storage';
import {getPackId} from '../cli/config_storage';
import {getPackOptions} from '../cli/config_storage';
import mockFs from 'mock-fs';
import * as path from 'path';
import sinon from 'sinon';
import {storeCodaApiKey} from '../cli/config_storage';
import {storePackId} from '../cli/config_storage';
import {storePackOptions} from '../cli/config_storage';

const PROJECT_DIR = '/myproject';

describe('Config storage', () => {
  let mockPWD: sinon.SinonStub;

  beforeEach(() => {
    mockFs();
    mockPWD = sinon.stub(process.env, 'PWD').value(`${PROJECT_DIR}`);
  });

  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  describe('API keys', () => {
    it('store and get API key', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      storeCodaApiKey('some-key', PROJECT_DIR, endpoint);
      const key = getApiKey(endpoint);
      assert.equal(key, 'some-key');
    });

    it('find API key in parent dir', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      storeCodaApiKey('some-key', PROJECT_DIR, endpoint);
      mockPWD.value(`${PROJECT_DIR}/foo/bar`);

      const key = getApiKey(endpoint);
      assert.equal(key, 'some-key');
    });

    it('no API key', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      const key = getApiKey(endpoint);
      assert.isUndefined(key);
    });

    it('no API key for environment', () => {
      const defaultEndpoint = DEFAULT_API_ENDPOINT;
      storeCodaApiKey('default-key', PROJECT_DIR, defaultEndpoint);
      assert.isUndefined(getApiKey('https://head.coda.io'));
    });

    it('environment overrides', () => {
      const defaultEndpoint = DEFAULT_API_ENDPOINT;
      const devEndpoint = 'https://dev.coda.io:8080';
      const headEndpoint = 'https://head.coda.io';
      storeCodaApiKey('dev-key', PROJECT_DIR, devEndpoint);
      assert.equal(getApiKey(devEndpoint), 'dev-key');
      storeCodaApiKey('head-key', PROJECT_DIR, headEndpoint);
      assert.equal(getApiKey(headEndpoint), 'head-key');

      storeCodaApiKey('default-key', PROJECT_DIR, defaultEndpoint);
      assert.equal(getApiKey(defaultEndpoint), 'default-key');
      assert.equal(getApiKey(devEndpoint), 'dev-key');
      assert.equal(getApiKey(headEndpoint), 'head-key');
    });
  });

  describe('pack ids', () => {
    it('store and get pack id', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      storePackId(PROJECT_DIR, 123, endpoint);
      assert.equal(123, getPackId(PROJECT_DIR, endpoint));
    });

    it('no pack id', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      assert.isUndefined(getPackId(PROJECT_DIR, endpoint));
    });

    it('environment overrides', () => {
      const defaultEndpoint = DEFAULT_API_ENDPOINT;
      const devEndpoint = 'https://dev.coda.io:8080';
      const headEndpoint = 'https://head.coda.io';
      storePackId(PROJECT_DIR, 111, devEndpoint);
      assert.equal(111, getPackId(PROJECT_DIR, devEndpoint));
      storePackId(PROJECT_DIR, 222, headEndpoint);
      assert.equal(222, getPackId(PROJECT_DIR, headEndpoint));

      storePackId(PROJECT_DIR, 333, defaultEndpoint);
      assert.equal(333, getPackId(PROJECT_DIR, defaultEndpoint));
      assert.equal(111, getPackId(PROJECT_DIR, devEndpoint));
      assert.equal(222, getPackId(PROJECT_DIR, headEndpoint));
    });

    it('different pack ids in different directories', () => {
      const endpoint = DEFAULT_API_ENDPOINT;
      const dir1 = path.join(PROJECT_DIR, 'pack1');
      const dir2 = path.join(PROJECT_DIR, 'pack2');
      storePackId(dir1, 111, endpoint);
      storePackId(dir2, 222, endpoint);

      assert.equal(111, getPackId(dir1, endpoint));
      assert.equal(222, getPackId(dir2, endpoint));
    });
  });

  describe('pack options - apiEndpoint', () => {
    it('store and get apiEndpoint', () => {
      storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://my-env.coda.io'});
      const options = getPackOptions(PROJECT_DIR);
      assert.equal(options?.[PackOptionKey.apiEndpoint], 'https://my-env.coda.io');
    });

    it('no apiEndpoint stored', () => {
      const options = getPackOptions(PROJECT_DIR);
      assert.isUndefined(options);
    });

    it('apiEndpoint merges with existing options', () => {
      storePackOptions(PROJECT_DIR, {[PackOptionKey.timerStrategy]: 'fake' as any});
      storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://my-env.coda.io'});
      const options = getPackOptions(PROJECT_DIR);
      assert.equal(options?.[PackOptionKey.timerStrategy], 'fake');
      assert.equal(options?.[PackOptionKey.apiEndpoint], 'https://my-env.coda.io');
    });
  });

  describe('backfillPackOptions', () => {
    describe('apiEndpoint', () => {
      it('uses CLI flag when provided', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://stored.coda.io'});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, apiEndpoint: 'https://flag.coda.io'};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, 'https://flag.coda.io');
      });

      it('falls back to stored config when flag is undefined', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://stored.coda.io'});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, 'https://stored.coda.io');
      });

      it('falls back to default when no flag and no config', () => {
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, DEFAULT_API_ENDPOINT);
      });
    });

    describe('timerStrategy', () => {
      it('uses CLI flag when provided', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.timerStrategy]: TimerShimStrategy.Fake});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, timerStrategy: TimerShimStrategy.Error};
        backfillFromPackConfig(argv);
        assert.equal(argv.timerStrategy, TimerShimStrategy.Error);
      });

      it('falls back to stored config when flag is undefined', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.timerStrategy]: TimerShimStrategy.Fake});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, timerStrategy: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.timerStrategy, TimerShimStrategy.Fake);
      });

      it('falls back to default when no flag and no config', () => {
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, timerStrategy: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.timerStrategy, DEFAULT_TIMER_STRATEGY);
      });
    });

    describe('gitTag', () => {
      it('uses CLI flag when provided', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.gitTag]: true});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, gitTag: false};
        backfillFromPackConfig(argv);
        assert.equal(argv.gitTag, false);
      });

      it('falls back to stored config when flag is undefined', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.gitTag]: true});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, gitTag: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.gitTag, true);
      });

      it('falls back to legacy enableGitTags config', () => {
        storePackOptions(PROJECT_DIR, {[DeprecatedPackOptionKey.enableGitTags]: true});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, gitTag: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.gitTag, true);
      });

      it('gitTag config takes priority over legacy enableGitTags', () => {
        storePackOptions(PROJECT_DIR, {[DeprecatedPackOptionKey.enableGitTags]: true, [PackOptionKey.gitTag]: false});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, gitTag: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.gitTag, false);
      });

      it('falls back to default when no flag and no config', () => {
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, gitTag: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.gitTag, DEFAULT_GIT_TAG);
      });
    });

    describe('manifest directory resolution', () => {
      it('derives directory from manifestFile', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://from-file.coda.io'});
        const argv: any = {manifestFile: `${PROJECT_DIR}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, 'https://from-file.coda.io');
      });

      it('derives directory from manifestPath', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://from-path.coda.io'});
        const argv: any = {manifestPath: `${PROJECT_DIR}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, 'https://from-path.coda.io');
      });

      it('uses manifestDir directly', () => {
        storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://from-dir.coda.io'});
        const argv: any = {manifestDir: PROJECT_DIR, apiEndpoint: undefined};
        backfillFromPackConfig(argv);
        assert.equal(argv.apiEndpoint, 'https://from-dir.coda.io');
      });

      it('different directories resolve different options', () => {
        const dir1 = path.join(PROJECT_DIR, 'pack1');
        const dir2 = path.join(PROJECT_DIR, 'pack2');
        storePackOptions(dir1, {[PackOptionKey.apiEndpoint]: 'https://env1.coda.io'});
        storePackOptions(dir2, {[PackOptionKey.apiEndpoint]: 'https://env2.coda.io'});

        const argv1: any = {manifestFile: `${dir1}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv1);
        assert.equal(argv1.apiEndpoint, 'https://env1.coda.io');

        const argv2: any = {manifestFile: `${dir2}/pack.ts`, apiEndpoint: undefined};
        backfillFromPackConfig(argv2);
        assert.equal(argv2.apiEndpoint, 'https://env2.coda.io');
      });
    });
  });
});
