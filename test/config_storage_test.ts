import {DEFAULT_API_ENDPOINT} from '../cli/config_storage';
import {getApiKey} from '../cli/config_storage';
import {getPackId} from '../cli/config_storage';
import mockFs from 'mock-fs';
import * as path from 'path';
import sinon from 'sinon';
import {storeCodaApiKey} from '../cli/config_storage';
import {storePackId} from '../cli/config_storage';

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
});
