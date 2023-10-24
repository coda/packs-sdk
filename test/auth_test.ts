import {testHelper} from './test_helper';
import type {AfterAuthorizationCodeTokenExchangeCallback} from '../testing/oauth_server';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from '../testing/auth_types';
import type {FetcherFullResponse} from '../testing/node_fetcher';
import type {FetcherOptionsWithFullResponse} from '../testing/node_fetcher';
import type {PackDefinition} from '../types';
import type {SystemAuthentication} from '../types';
import {ValueType} from '../schema';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {getExpirationDate} from '../testing/helpers';
import * as helpers from '../testing/helpers';
import {makeFormula} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import mockFs from 'mock-fs';
import * as oauthHelpers from '../testing/oauth_helpers';
import * as oauthServer from '../testing/oauth_server';
import {readCredentialsFile} from '../testing/auth';
import {requestHelper} from '../testing/fetcher';
import {setupAuth} from '../testing/auth';
import sinon from 'sinon';
import {storeCredential} from '../testing/auth';

const MANIFEST_PATH = '.';

function makeFakePromptForInput(rawResponses: string | string[]): typeof helpers.promptForInput {
  const responses = typeof rawResponses === 'string' ? [rawResponses] : rawResponses;
  let counter = 0;
  function questionHandler(_text: string, _opts: {mask?: boolean} = {}): string {
    return responses[counter++];
  }

  return sinon.spy(questionHandler);
}

async function doSetupAuth(pack: PackDefinition) {
  return setupAuth(MANIFEST_PATH, pack);
}

describe('Auth', () => {
  let mockPrint: sinon.SinonStub;
  let mockPrintAndExit: sinon.SinonStub;
  let mockPromptForInput: sinon.SinonStub;
  let mockMakeRequest: sinon.SinonStub<[FetcherOptionsWithFullResponse], Promise<FetcherFullResponse>>;

  beforeEach(() => {
    mockFs();
    mockPrint = sinon.stub(helpers, 'print');
    mockPrintAndExit = sinon.stub(helpers, 'printAndExit');
    mockPromptForInput = sinon.stub(helpers, 'promptForInput');
    mockMakeRequest = sinon.stub(requestHelper, 'makeRequest');
  });

  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  function setupReadline(responses: string | string[]) {
    mockPromptForInput.callsFake(makeFakePromptForInput(responses));
  }

  function assertCredentialsFileExactly(credentials: Credentials | undefined) {
    assert.deepEqual(readCredentialsFile(MANIFEST_PATH), credentials);
  }

  describe('setup', () => {
    it('no auth', async () => {
      const pack = createFakePack({
        defaultAuthentication: undefined,
      });

      await doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'This Pack has no declared authentication. ' +
          'Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.None}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });

      await doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'This Pack declares AuthenticationType.None and so does not require authentication. ' +
          'Please declare another AuthenticationType to use authentication with this Pack.',
      );
      assertCredentialsFileExactly(undefined);
    });

    // Several tests run this exact same flow.
    const testTokenAuthFlow = async (pack: PackDefinition) => {
      setupReadline('some-token');

      await doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Paste the token or API key to use for this Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({token: 'some-token'});
    };

    describe(`${AuthenticationType.HeaderBearerToken}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
      };
      it('defaultAuthentication', async () => {
        await testTokenAuthFlow(createFakePack({defaultAuthentication: auth}));
      });
      it('systemAuthentication', async () => {
        await testTokenAuthFlow(createFakePack({systemConnectionAuthentication: auth}));
      });
    });

    describe(`${AuthenticationType.HeaderBearerToken}, requires endpoint url`, () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the endpoint url for this Pack (for example, https://foo.example.com):\n',
        );
        sinon.assert.calledWithExactly(mockPromptForInput, 'Paste the token or API key to use for this Pack:\n', {
          mask: true,
        });
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({endpointUrl: 'https://some-endpoint-url.com', token: 'some-token'});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.CodaApiHeaderBearerToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.CodaApiHeaderBearerToken,
      };
      it('defaultAuthentication', async () => testTokenAuthFlow(createFakePack({defaultAuthentication: auth})));
      it('fails systemAuth', async () => {
        try {
          await testTokenAuthFlow(
            createFakePack({systemConnectionAuthentication: auth as unknown as SystemAuthentication})
          );
        } catch (err: any) {
          assert.match(err, /CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth./);
          return;
        }

        throw new Error('Promise unexpectedly resolved');
      });
    });

    describe(`${AuthenticationType.CustomHeaderToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
      };
      it('defaultAuthentication', async () => testTokenAuthFlow(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => testTokenAuthFlow(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.MultiHeaderToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.MultiHeaderToken,
        headers: [
          {
            name: 'Header1',
            description: 'description 1',
          },
          {
            name: 'Header2',
            description: 'description 2',
          },
        ],
      };

      const execTest = async (pack: PackDefinition) => {
        setupReadline(['token1', 'token2']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "Header1" header for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "Header2" header for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({headers: {Header1: 'token1', Header2: 'token2'}});
      };

      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.QueryParamToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.QueryParamToken,
        paramName: 'myParam',
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-param-value');

        await doSetupAuth(pack);

        sinon.assert.calledOnceWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "myParam" url param for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({paramValue: 'some-param-value'});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.MultiQueryParamToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.MultiQueryParamToken,
        params: [
          {name: 'param1', description: 'Description for param1'},
          {name: 'param2', description: 'Description for param2'},
        ],
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['param-value-1', 'param-value-2']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "param1" url param for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "param2" url param for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({params: {param1: 'param-value-1', param2: 'param-value-2'}});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['some-username', 'some-password']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username', password: 'some-password'});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, username only`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        uxConfig: {
          usernameOnly: true,
        },
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['some-username']);

        await doSetupAuth(pack);

        sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username'});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, custom field names`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        uxConfig: {
          placeholderUsername: 'API Key',
          placeholderPassword: 'API Password',
        },
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['some-username', 'some-password']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Key for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username', password: 'some-password'});
      };
      it('defaultAuthentication', async () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', async () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, requires endpoint url`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        requiresEndpointUrl: true,
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the endpoint url for this Pack (for example, https://foo.example.com):\n',
        );
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({
          endpointUrl: 'https://some-endpoint-url.com',
          username: 'some-username',
          password: 'some-password',
        });
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, requires endpoint url, for subdomain`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        requiresEndpointUrl: true,
        endpointDomain: 'myservice.com',
      };

      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          'Enter the endpoint url for this Pack (for example, https://my-site.myservice.com):\n',
        );
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({
          endpointUrl: 'https://some-endpoint-url.com',
          username: 'some-username',
          password: 'some-password',
        });
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });
  });

  describe('authenticated fetching', () => {
    function createPack(opts?: Partial<PackDefinition>) {
      return createFakePack({
        networkDomains: ['example.com'],
        formulas: [
          makeStringFormula({
            name: 'Fetch',
            description: 'Fetch a url',
            examples: [],
            parameters: [makeStringParameter('url', 'An example url to fetch.')],
            execute: async ([url], context) => {
              const response = await context.fetcher.fetch({method: 'GET', url});
              return response.body.result;
            },
          }),
        ],
        ...opts,
      });
    }

    function createPackWithDefaultAuth(auth: Authentication, opts?: Partial<PackDefinition>) {
      return createPack({
        defaultAuthentication: auth,
        ...opts,
      });
    }

    function createPackWithSystemAuth(auth: Authentication, opts?: Partial<PackDefinition>) {
      return createPack({
        systemConnectionAuthentication: auth as SystemAuthentication,
        ...opts,
      });
    }

    async function executeFetch(
      packDef: PackDefinition,
      url: string,
      responseBody: object,
      formulaName: string = 'Fetch',
    ) {
      mockMakeRequest.returns(
        Promise.resolve({
          url,
          statusCode: 200,
          statusMessage: 'OK',
          body: Buffer.isBuffer(responseBody) ? responseBody : JSON.stringify(responseBody),
          headers: {
            'content-type': Buffer.isBuffer(responseBody) ? 'application/octet-stream' : 'application/json',
          },
        }),
      );
      return executeFormulaFromPackDef(packDef, formulaName, [url], undefined, undefined, {
        useRealFetcher: true,
        manifestPath: MANIFEST_PATH,
      });
    }

    it(`no authentication`, async () => {
      const pack = createPack();

      const result = await executeFetch(pack, 'https://example.com', {result: 'hello'});
      assert.equal(result, 'hello');

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        uri: 'https://example.com',
        encoding: undefined,
        resolveWithFullResponse: true,
        followRedirect: true,
        throwOnRedirect: false,
      });
    });

    describe(`${AuthenticationType.None}`, async () => {
      const auth: Authentication = {type: AuthenticationType.None};
      const execTest = async (pack: PackDefinition) => {
        const result = await executeFetch(pack, 'https://example.com', {result: 'hello'});
        assert.equal(result, 'hello');

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuthentication', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuthentication', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}`, async () => {
      const auth: Authentication = {type: AuthenticationType.HeaderBearerToken};
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', async () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', async () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}, endpoint url specified in auth config`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const opts: Partial<PackDefinition> = {networkDomains: ['some-endpoint-url.com']};
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);
        await doSetupAuth(pack);

        await executeFetch(pack, '/foo', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://some-endpoint-url.com/foo',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth, opts)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth, opts)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}, endpoint url specified in auth config and also hardcoded`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const opts: Partial<PackDefinition> = {networkDomains: ['some-endpoint-url.com']};
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://some-endpoint-url.com/foo', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://some-endpoint-url.com/foo',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth, opts)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth, opts)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}, hardcoded domain doesn't match configured endpoint`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);
        await doSetupAuth(pack);

        await testHelper.willBeRejectedWith(
          executeFetch(pack, 'https://example.com/foo', {result: 'hello'}),
          new RegExp(
            'The url https://example.com/foo is not authorized. The host must match the host some-endpoint-url.com ' +
              'that was specified with the auth credentials. Or leave the host blank and the host will be filled in ' +
              'automatically from the credentials.',
          ),
        );

        sinon.assert.notCalled(mockMakeRequest);
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.CodaApiHeaderBearerToken}`, async () => {
      const auth: Authentication = {type: AuthenticationType.CodaApiHeaderBearerToken};
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('fails systemAuth fetch', async () => {
        await testHelper.willBeRejectedWith(
          execTest(createFakePack({systemConnectionAuthentication: auth as unknown as SystemAuthentication})),
          new RegExp('CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.'),
        );
      });
    });

    describe(`${AuthenticationType.CustomHeaderToken}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {MyHeader: 'some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.CustomHeaderToken} with token prefix`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
        tokenPrefix: 'MyPrefix',
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {MyHeader: 'MyPrefix some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.MultiHeaderToken}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.MultiHeaderToken,
        headers: [
          {name: 'Header1', description: 'description 1', tokenPrefix: 'prefix1'},
          {name: 'Header2', description: 'description 2'},
        ],
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['token1', 'token2']);
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Header1: 'prefix1 token1', Header2: 'token2', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.QueryParamToken}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.QueryParamToken,
        paramName: 'myParam',
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-param-value');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com/foo?myParam=some-param-value&blah=123',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.MultiQueryParamToken}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.MultiQueryParamToken,
        params: [
          {name: 'param1', description: 'Description for param1'},
          {name: 'param2', description: 'Description for param2'},
        ],
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['param-value-1', 'param-value-2']);
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com/foo?blah=123&param1=param-value-1&param2=param-value-2',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.WebBasic}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['some-username', 'some-password']);
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));

      it('template variable replacement in string body', async () => {
        setupReadline(['some-username', 'some-password']);
        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: 'https://some-url.com',
                  isBinaryResponse: undefined,
                  body: `some-body {{username-${context.invocationToken}}} {{password-${context.invocationToken}}}`,
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'https://some-url.com',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.equal(mockMakeRequest.getCall(0).args[0].body, 'some-body some-username some-password');
      });

      it('template variable replacement in json body', async () => {
        setupReadline(['some-username', 'some-password']);
        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: 'https://some-url.com',
                  isBinaryResponse: undefined,
                  body: JSON.stringify({
                    foo: 'bar',
                    username: `{{username-${context.invocationToken}}}`,
                    password: `{{password-${context.invocationToken}}}`,
                  }),
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'https://some-url.com',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.equal(
          mockMakeRequest.getCall(0).args[0].body,
          '{"foo":"bar","username":"some-username","password":"some-password"}',
        );
      });
    });

    describe(`${AuthenticationType.WebBasic}, username only`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        uxConfig: {
          usernameOnly: true,
        },
      };
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['some-username']);
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Basic c29tZS11c2VybmFtZTo=', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.WebBasic}, applies host automatially`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        requiresEndpointUrl: true,
      };
      const opts: Partial<PackDefinition> = {networkDomains: ['some-endpoint-url.com']};

      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);
        await doSetupAuth(pack);

        await executeFetch(pack, '/foo?bar=blah', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          uri: 'https://some-endpoint-url.com/foo?bar=blah',
          encoding: undefined,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth, opts)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth, opts)));
    });

    describe(`${AuthenticationType.WebBasic}, no auth configured`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
      };

      const execTest = async (pack: PackDefinition) => {
        await testHelper.willBeRejectedWith(
          executeFetch(pack, '/foo?bar=blah', {result: 'hello'}),
          new RegExp(
            'WebBasic authentication is required for this pack, but no local credentials were found. ' +
              'Run "coda auth path/to/pack/manifest to set up credentials.',
          ),
        );

        sinon.assert.notCalled(mockMakeRequest);
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.Custom}`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.Custom,
        params: [
          {name: 'secretValue', description: 'Description for param1'},
          {name: 'secretToken', description: 'Description for param2'},
        ],
      };

      const execTest = async (pack: PackDefinition) => {
        setupReadline(['secret-value', 'secret-token']);
        await doSetupAuth(pack);

        sinon.assert.calledWithExactly(
          mockPromptForInput,
          "Enter the value to use for the 'secretValue' (Description for param1) parameter for this Pack:\n",
          {mask: true},
        );
        sinon.assert.calledWithExactly(
          mockPromptForInput,
          "Enter the value to use for the 'secretToken' (Description for param2) parameter for this Pack:\n",
          {mask: true},
        );
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({params: {secretValue: 'secret-value', secretToken: 'secret-token'}});
      };

      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));

      it('template variable replacement in string body', async () => {
        setupReadline(['secret-value', 'secret-token']);
        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: 'https://some-url.com',
                  isBinaryResponse: undefined,
                  body: `some-body {{secretValue-${context.invocationToken}}} {{secretToken-${context.invocationToken}}}`,
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'https://some-url.com',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.equal(mockMakeRequest.getCall(0).args[0].body, 'some-body secret-value secret-token');
      });

      it('template variable replacement in headers and form', async () => {
        setupReadline(['secret-value', 'secret-token']);

        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: 'https://some-url.com',
                  isBinaryResponse: undefined,
                  headers: {
                    'X-Some-Header': `some-header {{secretValue-${context.invocationToken}}}`,
                    'X-Some-Header-2': `some-header  {{secretToken-${context.invocationToken}}}`,
                  },
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'https://some-url.com',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.deepEqual(mockMakeRequest.getCall(0).args[0].headers, {
          'User-Agent': 'Coda-Test-Server-Fetcher',
          'X-Some-Header': `some-header secret-value`,
          'X-Some-Header-2': 'some-header  secret-token',
        });
      });

      it('template variable replacement in url', async () => {
        setupReadline(['secret value', 'secret token']);

        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: `https://some-url.com/{{secretValue-${context.invocationToken}}}/{{secretToken-${
                    context.invocationToken
                  }}}?secretToken=${encodeURIComponent(`{{secretToken-${context.invocationToken}}}`)}`,
                  isBinaryResponse: undefined,
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'some-url',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.equal(
          mockMakeRequest.getCall(0).args[0].uri,
          `https://some-url.com/secret%20value/secret%20token?secretToken=secret%20token`,
        );
      });

      it('template variable replacement in json body', async () => {
        setupReadline(['secret-value', 'secret-token']);
        const pack = createPackWithDefaultAuth(auth, {
          networkDomains: ['some-url.com'],
          formulas: [
            makeFormula({
              resultType: ValueType.String,
              name: 'FormulaWithTemplateReplacement',
              description: '',
              parameters: [],
              execute: async (_, context) => {
                await context.fetcher.fetch({
                  method: 'GET',
                  url: 'https://some-url.com',
                  isBinaryResponse: undefined,
                  body: JSON.stringify({
                    foo: 'bar',
                    username: `{{secretValue-${context.invocationToken}}}`,
                    password: `{{secretToken-${context.invocationToken}}}`,
                  }),
                });
                return '';
              },
            }),
          ],
        });
        await doSetupAuth(pack);

        mockMakeRequest.returns(
          Promise.resolve({
            url: 'https://some-url.com',
            statusCode: 200,
            statusMessage: 'OK',
            body: JSON.stringify({}),
            headers: {
              'content-type': 'application/json',
            },
          }),
        );

        await executeFormulaFromPackDef(pack, 'FormulaWithTemplateReplacement', [], undefined, undefined, {
          useRealFetcher: true,
          manifestPath: MANIFEST_PATH,
        });

        sinon.assert.calledOnce(mockMakeRequest);
        assert.equal(
          mockMakeRequest.getCall(0).args[0].body,
          '{"foo":"bar","username":"secret-value","password":"secret-token"}',
        );
      });
    });

    describe(`${AuthenticationType.Custom}, no auth configured`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.Custom,
        params: [
          {name: 'secretValue', description: 'Description for param1'},
          {name: 'secretToken', description: 'Description for param2'},
        ],
      };

      const execTest = async (pack: PackDefinition) => {
        await testHelper.willBeRejectedWith(
          executeFetch(pack, '/foo?bar=blah', {result: 'hello'}),
          new RegExp(
            'Custom authentication is required for this pack, but no local credentials were found. ' +
              'Run "coda auth path/to/pack/manifest to set up credentials.',
          ),
        );

        sinon.assert.notCalled(mockMakeRequest);
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    it('disableAuthentication forces auth headers not to be applied', async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
        networkDomains: ['example.com'],
        formulas: [
          makeStringFormula({
            name: 'FetchNoAuth',
            description: 'Fetch a url without authentication',
            examples: [],
            parameters: [makeStringParameter('url', 'An example url to fetch.')],
            execute: async ([url], context) => {
              const response = await context.fetcher.fetch({method: 'GET', url, disableAuthentication: true});
              return response.body.result;
            },
          }),
        ],
      });

      setupReadline('some-token');
      await doSetupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'}, 'FetchNoAuth');

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        uri: 'https://example.com',
        encoding: undefined,
        resolveWithFullResponse: true,
        followRedirect: true,
        throwOnRedirect: false,
      });
    });

    describe(`authentication is applied to temporary blob storage`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
      };
      const opts: Partial<PackDefinition> = {
        networkDomains: ['example.com'],
        formulas: [
          makeStringFormula({
            name: 'StoreBlob',
            description: 'Fetch a url without authentication',
            examples: [],
            parameters: [makeStringParameter('url', 'An example url to fetch.')],
            execute: async ([url], context) => {
              return context.temporaryBlobStorage.storeUrl(url);
            },
          }),
        ],
      };

      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        await doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/some-blob.jpg', Buffer.from('adf'), 'StoreBlob');

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          uri: 'https://example.com/some-blob.jpg',
          encoding: null,
          resolveWithFullResponse: true,
          followRedirect: true,
          throwOnRedirect: false,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth, opts)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth, opts)));
    });

    describe(`unauthorized domain fails`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.None,
      };
      const opts: Partial<PackDefinition> = {networkDomains: ['foo.com']};

      const execTest = async (pack: PackDefinition) => {
        await testHelper.willBeRejectedWith(
          executeFetch(pack, 'https://example.com', {result: 'hello'}),
          /Attempted to connect to undeclared host 'example.com'/,
        );
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth, opts)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth, opts)));
    });

    describe('OAuth', () => {
      describe('OAuth 2 authorization code flow', () => {
        let fakeLaunchOAuthServerFlow: sinon.SinonSpy;

        beforeEach(() => {
          fakeLaunchOAuthServerFlow = sinon.spy(
              ({afterTokenExchange}: {afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback}) => {
                afterTokenExchange({accessToken: 'some-access-token', refreshToken: 'some-refresh-token'});
              },
          );

          sinon.replace(oauthServer, 'launchOAuthServerFlow', fakeLaunchOAuthServerFlow);
        });

        it(`${AuthenticationType.OAuth2}`, async () => {
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2,
            authorizationUrl: 'https://auth-url.com',
            tokenUrl: 'https://token-url.com',
          });
          setupReadline(['some-client-id', 'some-client-secret']);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: 'Bearer some-access-token',
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });

          sinon.assert.calledOnceWithMatch(fakeLaunchOAuthServerFlow, {
            afterTokenExchange: sinon.match.func,
            authDef: {
              additionalParams: undefined,
              authorizationUrl: 'https://auth-url.com',
              scopes: undefined,
              tokenUrl: 'https://token-url.com',
              type: 'OAuth2',
            },
            clientId: 'some-client-id',
            clientSecret: 'some-client-secret',
            port: 3000,
          });
        });

        it(`${AuthenticationType.OAuth2}, with scope, tokenPrefix, and additional params`, async () => {
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2,
            authorizationUrl: 'https://auth-url.com',
            tokenUrl: 'https://token-url.com',
            tokenPrefix: 'SomePrefix',
            scopes: ['scope1', 'scope2'],
            additionalParams: {foo: 'bar'},
          });
          setupReadline(['some-client-id', 'some-client-secret']);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: 'SomePrefix some-access-token',
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });

          sinon.assert.calledOnceWithMatch(fakeLaunchOAuthServerFlow, {
            afterTokenExchange: sinon.match.func,
            authDef: {
              additionalParams: {foo: 'bar'},
              authorizationUrl: 'https://auth-url.com',
              scopes: ['scope1', 'scope2'],
              tokenUrl: 'https://token-url.com',
              type: 'OAuth2',
            },
            clientId: 'some-client-id',
            clientSecret: 'some-client-secret',
            port: 3000,
          });

          assertCredentialsFileExactly({
            clientId: 'some-client-id',
            clientSecret: 'some-client-secret',
            accessToken: 'some-access-token',
            refreshToken: 'some-refresh-token',
            scopes: ['scope1', 'scope2'],
          });
        });

        it(`${AuthenticationType.OAuth2}, with empty token prefix`, async () => {
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2,
            authorizationUrl: 'https://auth-url.com',
            tokenUrl: 'https://token-url.com',
            tokenPrefix: '',
            scopes: ['scope1', 'scope2'],
          });
          setupReadline(['some-client-id', 'some-client-secret']);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: 'some-access-token',
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });
        });

        it(`${AuthenticationType.OAuth2}, leaves existing secrets in place`, async () => {
          const pack = createPackWithDefaultAuth(
              {
                type: AuthenticationType.OAuth2,
                authorizationUrl: 'https://auth-url.com',
                tokenUrl: 'https://token-url.com',
              },
              {name: 'Fake Pack'},
          );

          storeCredential(MANIFEST_PATH, {
            clientId: 'existing-client-id',
            clientSecret: 'existing-client-secret',
          });

          setupReadline(['yes', '', '']);
          await doSetupAuth(pack);

          assertCredentialsFileExactly({
            clientId: 'existing-client-id',
            clientSecret: 'existing-client-secret',
            accessToken: 'some-access-token',
            refreshToken: 'some-refresh-token',
            scopes: [],
          });
        });
      });

      describe('OAuth 2 client credentials flow', () => {
        const clientId = 'some-client-id';
        const clientSecret = 'some-client-secret';
        const tokenUrl = 'https://token-url.com';
        const accessToken = 'some-access-token';
        const expiresString =  getExpirationDate(1000).toString();
        let fakePerformOAuthClientCredentialsServerFlow: sinon.SinonStub;

        beforeEach(() => {
          fakePerformOAuthClientCredentialsServerFlow = sinon.stub(oauthHelpers, 'performOAuthClientCredentialsServerFlow').callsFake(async ({}) => {
            return {accessToken, expires: expiresString};
          });
        });

        it(`${AuthenticationType.OAuth2ClientCredentials}`, async () => {
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2ClientCredentials,
            tokenUrl: 'https://token-url.com',
          });
          setupReadline([clientId, clientSecret]);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });
        });

        it(`${AuthenticationType.OAuth2ClientCredentials}, with scope and tokenPrefix`, async () => {
          const tokenPrefix = 'SomePrefix';
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2ClientCredentials,
            tokenUrl: 'https://token-url.com',
            tokenPrefix,
            scopes: ['scope1', 'scope2'],
          });
          setupReadline([clientId, clientSecret]);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: `SomePrefix ${accessToken}`,
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });

          sinon.assert.calledOnceWithMatch(fakePerformOAuthClientCredentialsServerFlow, {
            authDef: {
              type: AuthenticationType.OAuth2ClientCredentials,
              scopes: ['scope1', 'scope2'],
              tokenUrl,
              tokenPrefix
            },
            clientId,
            clientSecret,
            scopes: ['scope1', 'scope2'],
          });

          assertCredentialsFileExactly({
            clientId,
            clientSecret,
            accessToken,
            scopes: ['scope1', 'scope2'],
            expires: expiresString
          });
        });

        it(`${AuthenticationType.OAuth2ClientCredentials}, with empty token prefix`, async () => {
          const pack = createPackWithDefaultAuth({
            type: AuthenticationType.OAuth2ClientCredentials,
            tokenUrl,
            tokenPrefix: '',
            scopes: ['scope1', 'scope2'],
          });
          setupReadline([clientId, clientSecret]);
          await doSetupAuth(pack);

          await executeFetch(pack, 'https://example.com', {result: 'hello'});

          sinon.assert.calledOnceWithExactly(mockMakeRequest, {
            body: undefined,
            form: undefined,
            headers: {
              Authorization: accessToken,
              'User-Agent': 'Coda-Test-Server-Fetcher',
            },
            method: 'GET',
            uri: 'https://example.com',
            encoding: undefined,
            resolveWithFullResponse: true,
            followRedirect: true,
            throwOnRedirect: false,
          });
        });

        it(`${AuthenticationType.OAuth2ClientCredentials}, leaves existing secrets in place`, async () => {
          const pack = createPackWithDefaultAuth(
              {
                type: AuthenticationType.OAuth2ClientCredentials,
                tokenUrl: 'https://token-url.com',
              },
              {name: 'Fake Pack'},
          );

          storeCredential(MANIFEST_PATH, {
            clientId: 'existing-client-id',
            clientSecret: 'existing-client-secret',
          });

          setupReadline(['yes', '', '']);
          await doSetupAuth(pack);

          assertCredentialsFileExactly({
            clientId: 'existing-client-id',
            clientSecret: 'existing-client-secret',
            accessToken,
            expires: expiresString,
            scopes: [],
          });
        });
      });
    });
  });
});
