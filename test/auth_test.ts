import {testHelper} from './test_helper';
import type {AfterTokenExchangeCallback} from '../testing/oauth_server';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {Credentials} from '../testing/auth_types';
import type {PackDefinition} from '../types';
import type {SystemAuthentication} from '../types';
import {ValueType} from '../schema';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import * as helpers from '../testing/helpers';
import {makeFormula} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import mockFs from 'mock-fs';
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

function doSetupAuth(pack: PackDefinition) {
  return setupAuth(MANIFEST_PATH, pack);
}

describe('Auth', () => {
  let mockPrint: sinon.SinonStub;
  let mockPrintAndExit: sinon.SinonStub;
  let mockPromptForInput: sinon.SinonStub;
  let mockMakeRequest: sinon.SinonStub;

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
    it('no auth', () => {
      const pack = createFakePack({
        defaultAuthentication: undefined,
      });

      doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'This Pack has no declared authentication. ' +
          'Provide a value for defaultAuthentication or systemConnectionAuthentication in the Pack definition.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.None}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });

      doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'This Pack declares AuthenticationType.None and so does not require authentication. ' +
          'Please declare another AuthenticationType to use authentication with this Pack.',
      );
      assertCredentialsFileExactly(undefined);
    });

    // Several tests run this exact same flow.
    const testTokenAuthFlow = (pack: PackDefinition) => {
      setupReadline('some-token');

      doSetupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Paste the token or API key to use for this Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({token: 'some-token'});
    };

    describe(`${AuthenticationType.HeaderBearerToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
      };
      it('defaultAuthentication', () => {
        testTokenAuthFlow(createFakePack({defaultAuthentication: auth}));
      });
      it('systemAuthentication', () => {
        testTokenAuthFlow(createFakePack({systemConnectionAuthentication: auth}));
      });
    });

    describe(`${AuthenticationType.HeaderBearerToken}, requires endpoint url`, () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);

        doSetupAuth(pack);

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
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.CodaApiHeaderBearerToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.CodaApiHeaderBearerToken,
      };
      it('defaultAuthentication', () => testTokenAuthFlow(createFakePack({defaultAuthentication: auth})));
      it('fails systemAuth', () => {
        expect(() =>
          testTokenAuthFlow(createFakePack({systemConnectionAuthentication: auth as unknown as SystemAuthentication})),
        ).to.throw('CodaApiHeaderBearerToken only works with defaultAuthentication, not system auth.');
      });
    });

    describe(`${AuthenticationType.CustomHeaderToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
      };
      it('defaultAuthenticatio', () => testTokenAuthFlow(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => testTokenAuthFlow(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.QueryParamToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.QueryParamToken,
        paramName: 'myParam',
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline('some-param-value');

        doSetupAuth(pack);

        sinon.assert.calledOnceWithExactly(
          mockPromptForInput,
          'Enter the token to use for the "myParam" url param for this Pack:\n',
          {mask: true},
        );
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({paramValue: 'some-param-value'});
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.MultiQueryParamToken}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.MultiQueryParamToken,
        params: [
          {name: 'param1', description: 'Description for param1'},
          {name: 'param2', description: 'Description for param2'},
        ],
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['param-value-1', 'param-value-2']);

        doSetupAuth(pack);

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
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['some-username', 'some-password']);

        doSetupAuth(pack);

        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username', password: 'some-password'});
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, username only`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        uxConfig: {
          usernameOnly: true,
        },
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['some-username']);

        doSetupAuth(pack);

        sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Enter the username for this Pack:\n');
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username'});
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, custom field names`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        uxConfig: {
          placeholderUsername: 'API Key',
          placeholderPassword: 'API Password',
        },
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['some-username', 'some-password']);

        doSetupAuth(pack);

        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Key for this Pack:\n');
        sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Password for this Pack:\n', {mask: true});
        sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

        assertCredentialsFileExactly({username: 'some-username', password: 'some-password'});
      };
      it('defaultAuthentication', () => execTest(createFakePack({defaultAuthentication: auth})));
      it('systemAuthentication', () => execTest(createFakePack({systemConnectionAuthentication: auth})));
    });

    describe(`${AuthenticationType.WebBasic}, requires endpoint url`, () => {
      const auth: Authentication = {
        type: AuthenticationType.WebBasic,
        requiresEndpointUrl: true,
      };
      const execTest = (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

        doSetupAuth(pack);

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

      const execTest = (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

        doSetupAuth(pack);

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
      mockMakeRequest.returns({
        statusCode: 200,
        body: Buffer.isBuffer(responseBody) ? responseBody : JSON.stringify(responseBody),
        headers: {
          'content-type': Buffer.isBuffer(responseBody) ? 'application/octet-stream' : 'application/json',
        },
      });
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
        url: 'https://example.com',
        isBinaryResponse: undefined,
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
          url: 'https://example.com',
          isBinaryResponse: undefined,
        });
      };
      it('defaultAuthentication', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuthentication', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}`, async () => {
      const auth: Authentication = {type: AuthenticationType.HeaderBearerToken};
      const execTest = async (pack: PackDefinition) => {
        setupReadline('some-token');
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
        });
      };
      it('defaultAuth', () => execTest(createPackWithDefaultAuth(auth)));
      it('systemAuth', () => execTest(createPackWithSystemAuth(auth)));
    });

    describe(`${AuthenticationType.HeaderBearerToken}, endpoint url specified in auth config`, async () => {
      const auth: Authentication = {
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      };
      const opts: Partial<PackDefinition> = {networkDomains: ['some-endpoint-url.com']};
      const execTest = async (pack: PackDefinition) => {
        setupReadline(['https://some-endpoint-url.com', 'some-token']);
        doSetupAuth(pack);

        await executeFetch(pack, '/foo', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://some-endpoint-url.com/foo',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://some-endpoint-url.com/foo', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://some-endpoint-url.com/foo',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {MyHeader: 'some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {MyHeader: 'MyPrefix some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com/foo?myParam=some-param-value&blah=123',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com/foo?blah=123&param1=param-value-1&param2=param-value-2',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        mockMakeRequest.returns({
          statusCode: 200,
          body: JSON.stringify({}),
          headers: {
            'content-type': 'application/json',
          },
        });

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
        doSetupAuth(pack);

        mockMakeRequest.returns({
          statusCode: 200,
          body: JSON.stringify({}),
          headers: {
            'content-type': 'application/json',
          },
        });

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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Basic c29tZS11c2VybmFtZTp1bmRlZmluZWQ=', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, '/foo?bar=blah', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'Basic c29tZS11c2VybmFtZTpzb21lLXBhc3N3b3Jk',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          url: 'https://some-endpoint-url.com/foo?bar=blah',
          isBinaryResponse: undefined,
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
      doSetupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'}, 'FetchNoAuth');

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
        isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com/some-blob.jpg', Buffer.from('adf'), 'StoreBlob');

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
          method: 'GET',
          url: 'https://example.com/some-blob.jpg',
          isBinaryResponse: true,
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
      let fakeLaunchOAuthServerFlow: sinon.SinonSpy;

      beforeEach(() => {
        fakeLaunchOAuthServerFlow = sinon.spy(
          ({afterTokenExchange}: {afterTokenExchange: AfterTokenExchangeCallback}) => {
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'Bearer some-access-token',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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
        doSetupAuth(pack);

        await executeFetch(pack, 'https://example.com', {result: 'hello'});

        sinon.assert.calledOnceWithExactly(mockMakeRequest, {
          body: undefined,
          form: undefined,
          headers: {
            Authorization: 'SomePrefix some-access-token',
            'User-Agent': 'Coda-Test-Server-Fetcher',
          },
          method: 'GET',
          url: 'https://example.com',
          isBinaryResponse: undefined,
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

        setupReadline(['y', '', '']);
        doSetupAuth(pack);

        assertCredentialsFileExactly({
          clientId: 'existing-client-id',
          clientSecret: 'existing-client-secret',
          accessToken: 'some-access-token',
          refreshToken: 'some-refresh-token',
          scopes: [],
        });
      });
    });
  });
});
