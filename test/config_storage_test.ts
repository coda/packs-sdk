import {DEFAULT_API_ENDPOINT} from '../cli/config_storage';
import {PackOptionKey} from '../cli/config_storage';
import {getApiKey} from '../cli/config_storage';
import {getPackId} from '../cli/config_storage';
import {getPackOptions} from '../cli/config_storage';
import mockFs from 'mock-fs';
import * as path from 'path';
import {resolveApiEndpoint} from '../cli/helpers';
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

  describe('resolveApiEndpoint', () => {
    it('returns stored endpoint when present', () => {
      storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://my-env.coda.io'});
      const result = resolveApiEndpoint(DEFAULT_API_ENDPOINT, PROJECT_DIR);
      assert.equal(result, 'https://my-env.coda.io');
    });

    it('returns CLI value when no stored endpoint', () => {
      const result = resolveApiEndpoint(DEFAULT_API_ENDPOINT, PROJECT_DIR);
      assert.equal(result, DEFAULT_API_ENDPOINT);
    });

    it('stored endpoint takes priority over CLI default', () => {
      storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://staging.coda.io'});
      const result = resolveApiEndpoint(DEFAULT_API_ENDPOINT, PROJECT_DIR);
      assert.equal(result, 'https://staging.coda.io');
    });

    it('returns CLI value when no manifestDir and no config in PWD', () => {
      const result = resolveApiEndpoint('https://custom.coda.io');
      assert.equal(result, 'https://custom.coda.io');
    });

    it('uses PWD when manifestDir not provided and config exists there', () => {
      storePackOptions(PROJECT_DIR, {[PackOptionKey.apiEndpoint]: 'https://from-pwd.coda.io'});
      const result = resolveApiEndpoint(DEFAULT_API_ENDPOINT);
      assert.equal(result, 'https://from-pwd.coda.io');
    });

    it('different directories resolve different endpoints', () => {
      const dir1 = path.join(PROJECT_DIR, 'pack1');
      const dir2 = path.join(PROJECT_DIR, 'pack2');
      storePackOptions(dir1, {[PackOptionKey.apiEndpoint]: 'https://env1.coda.io'});
      storePackOptions(dir2, {[PackOptionKey.apiEndpoint]: 'https://env2.coda.io'});

      assert.equal(resolveApiEndpoint(DEFAULT_API_ENDPOINT, dir1), 'https://env1.coda.io');
      assert.equal(resolveApiEndpoint(DEFAULT_API_ENDPOINT, dir2), 'https://env2.coda.io');
    });
  });
});
