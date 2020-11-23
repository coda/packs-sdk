import {testHelper} from './test_helper';
import type {AfterTokenExchangeCallback} from '../testing/oauth_server';
import type {AllCredentials} from '../testing/auth_types';
import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import type {PackDefinition} from '../types';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import * as helpers from '../testing/helpers';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import mockFs from 'mock-fs';
import * as oauthServer from '../testing/oauth_server';
import {readCredentialsFile} from '../testing/auth';
import {requestHelper} from '../testing/fetcher';
import {setupAuth} from '../testing/auth';
import sinon from 'sinon';
import {storeCredential} from '../testing/auth';

function makeFakePromptForInput(rawResponses: string | string[]): typeof helpers.promptForInput {
  const responses = typeof rawResponses === 'string' ? [rawResponses] : rawResponses;
  let counter = 0;
  function questionHandler(_text: string, _opts: {mask?: boolean} = {}): string {
    return responses[counter++];
  }

  return sinon.spy(questionHandler);
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

  function assertCredentialsFileExactly(allCredentials: AllCredentials | undefined, credentialsFile?: string) {
    assert.deepEqual(readCredentialsFile(credentialsFile), allCredentials);
  }

  describe('setup', () => {
    it('no auth', () => {
      const pack = createFakePack({
        defaultAuthentication: undefined,
      });

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'The pack Fake Pack has no declared authentication. Provide a value for defaultAuthentication in the pack definition.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.None}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'The pack Fake Pack declares AuthenticationType.None and so does not require authentication. ' +
          'Please declare another AuthenticationType to use authentication with this pack.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.HeaderBearerToken}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      setupReadline('some-token');

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Paste the token or API key to use for Fake Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.HeaderBearerToken}, requires endpoint url`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          requiresEndpointUrl: true,
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-token']);

      setupAuth(pack);

      sinon.assert.calledWithExactly(
        mockPromptForInput,
        'Enter the endpoint url for Fake Pack (for example, https://fake pack.example.com):\n',
      );
      sinon.assert.calledWithExactly(mockPromptForInput, 'Paste the token or API key to use for Fake Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {endpointUrl: 'https://some-endpoint-url.com', token: 'some-token'}});
    });

    it(`${AuthenticationType.CodaApiHeaderBearerToken}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
        },
      });
      setupReadline('some-token');

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Paste the token or API key to use for Fake Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.CustomHeaderToken}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'MyHeader',
        },
      });
      setupReadline('some-token');

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Paste the token or API key to use for Fake Pack:\n', {
        mask: true,
      });
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.QueryParamToken}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.QueryParamToken,
          paramName: 'myParam',
        },
      });
      setupReadline('some-param-value');

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPromptForInput,
        'Enter the token to use for the "myParam" url param for Fake Pack:\n',
        {mask: true},
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {paramValue: 'some-param-value'}});
    });

    it(`${AuthenticationType.MultiQueryParamToken}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.MultiQueryParamToken,
          params: [
            {name: 'param1', description: 'Description for param1'},
            {name: 'param2', description: 'Description for param2'},
          ],
        },
      });
      setupReadline(['param-value-1', 'param-value-2']);

      setupAuth(pack);

      sinon.assert.calledWithExactly(
        mockPromptForInput,
        'Enter the token to use for the "param1" url param for Fake Pack:\n',
        {mask: true},
      );
      sinon.assert.calledWithExactly(
        mockPromptForInput,
        'Enter the token to use for the "param2" url param for Fake Pack:\n',
        {mask: true},
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {params: {param1: 'param-value-1', param2: 'param-value-2'}}});
    });

    it(`${AuthenticationType.WebBasic}`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
        },
      });
      setupReadline(['some-username', 'some-password']);

      setupAuth(pack);

      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for Fake Pack:\n', {mask: true});
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username', password: 'some-password'}});
    });

    it(`${AuthenticationType.WebBasic}, username only`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          uxConfig: {
            usernameOnly: true,
          },
        },
      });
      setupReadline(['some-username']);

      setupAuth(pack);

      sinon.assert.calledOnceWithExactly(mockPromptForInput, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username'}});
    });

    it(`${AuthenticationType.WebBasic}, custom field names`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          uxConfig: {
            placeholderUsername: 'API Key',
            placeholderPassword: 'API Password',
          },
        },
      });
      setupReadline(['some-username', 'some-password']);

      setupAuth(pack);

      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Key for Fake Pack:\n');
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the API Password for Fake Pack:\n', {mask: true});
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username', password: 'some-password'}});
    });

    it(`${AuthenticationType.WebBasic}, requires endpoint url`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          requiresEndpointUrl: true,
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

      setupAuth(pack);

      sinon.assert.calledWithExactly(
        mockPromptForInput,
        'Enter the endpoint url for Fake Pack (for example, https://fake pack.example.com):\n',
      );
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for Fake Pack:\n', {mask: true});
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({
        'Fake Pack': {
          endpointUrl: 'https://some-endpoint-url.com',
          username: 'some-username',
          password: 'some-password',
        },
      });
    });

    it(`${AuthenticationType.WebBasic}, requires endpoint url, for subdomain`, () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          requiresEndpointUrl: true,
          endpointDomain: 'myservice.com',
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

      setupAuth(pack);

      sinon.assert.calledWithMatch(
        mockPromptForInput,
        'Enter the endpoint url for Fake Pack (for example, https://my-site.myservice.com):\n',
      );
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithExactly(mockPromptForInput, 'Enter the password for Fake Pack:\n', {mask: true});
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({
        'Fake Pack': {
          endpointUrl: 'https://some-endpoint-url.com',
          username: 'some-username',
          password: 'some-password',
        },
      });
    });
  });

  describe('authenticated fetching', () => {
    function createPackWithAuth(authDef: Authentication | undefined, opts?: Partial<PackDefinition>) {
      return createFakePack({
        ...opts,
        defaultAuthentication: authDef,
        formulas: {
          Fake: [
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
        },
      });
    }

    async function executeFetch(packDef: PackDefinition, url: string, jsonResponse: object) {
      mockMakeRequest.returns({
        statusCode: 200,
        body: JSON.stringify(jsonResponse),
        headers: {
          'content-type': 'application/json',
        },
      });
      return executeFormulaFromPackDef(packDef, 'Fake::Fetch', [url], undefined, undefined, {useRealFetcher: true});
    }

    it(`no authentication`, async () => {
      const pack = createPackWithAuth(undefined);

      const result = await executeFetch(pack, 'https://example.com', {result: 'hello'});
      assert.equal(result, 'hello');

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.None}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.None,
      });
      const result = await executeFetch(pack, 'https://example.com', {result: 'hello'});
      assert.equal(result, 'hello');

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.HeaderBearerToken}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.HeaderBearerToken,
      });
      setupReadline('some-token');
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.HeaderBearerToken}, endpoint url specified in auth config`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      });
      setupReadline(['https://some-endpoint-url.com', 'some-token']);
      setupAuth(pack);

      await executeFetch(pack, '/foo', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://some-endpoint-url.com/foo',
      });
    });

    it(`${AuthenticationType.HeaderBearerToken}, endpoint url specified in auth config and also hardcoded`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      });
      setupReadline(['https://some-endpoint-url.com', 'some-token']);
      setupAuth(pack);

      await executeFetch(pack, 'https://some-endpoint-url.com/foo', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://some-endpoint-url.com/foo',
      });
    });

    it(`${AuthenticationType.HeaderBearerToken}, hardcoded domain doesn't match configured endpoint`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.HeaderBearerToken,
        requiresEndpointUrl: true,
      });
      setupReadline(['https://some-endpoint-url.com', 'some-token']);
      setupAuth(pack);

      await testHelper.willBeRejectedWith(
        executeFetch(pack, 'https://example.com/foo', {result: 'hello'}),
        new RegExp(
          'The url https://example.com/foo is not authorized. The host must match the host some-endpoint-url.com ' +
            'that was specified with the auth credentials. Or leave the host blank and the host will be filled in ' +
            'automatically from the credentials.',
        ),
      );

      sinon.assert.notCalled(mockMakeRequest);
    });

    it(`${AuthenticationType.CodaApiHeaderBearerToken}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.CodaApiHeaderBearerToken,
      });
      setupReadline('some-token');
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {Authorization: 'Bearer some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.CustomHeaderToken}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
      });
      setupReadline('some-token');
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {MyHeader: 'some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.CustomHeaderToken} with token prefix`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.CustomHeaderToken,
        headerName: 'MyHeader',
        tokenPrefix: 'MyPrefix',
      });
      setupReadline('some-token');
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {MyHeader: 'MyPrefix some-token', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.QueryParamToken}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.QueryParamToken,
        paramName: 'myParam',
      });
      setupReadline('some-param-value');
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com/foo?myParam=some-param-value&blah=123',
      });
    });

    it(`${AuthenticationType.MultiQueryParamToken}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.MultiQueryParamToken,
        params: [
          {name: 'param1', description: 'Description for param1'},
          {name: 'param2', description: 'Description for param2'},
        ],
      });
      setupReadline(['param-value-1', 'param-value-2']);
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com/foo?blah=123', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com/foo?blah=123&param1=param-value-1&param2=param-value-2',
      });
    });

    it(`${AuthenticationType.WebBasic}`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.WebBasic,
      });
      setupReadline(['some-username', 'some-password']);
      setupAuth(pack);

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
      });
    });

    it(`${AuthenticationType.WebBasic}, username only`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.WebBasic,
        uxConfig: {
          usernameOnly: true,
        },
      });
      setupReadline(['some-username']);
      setupAuth(pack);

      await executeFetch(pack, 'https://example.com', {result: 'hello'});

      sinon.assert.calledOnceWithExactly(mockMakeRequest, {
        body: undefined,
        form: undefined,
        headers: {Authorization: 'Basic c29tZS11c2VybmFtZTp1bmRlZmluZWQ=', 'User-Agent': 'Coda-Test-Server-Fetcher'},
        method: 'GET',
        url: 'https://example.com',
      });
    });

    it(`${AuthenticationType.WebBasic}, applies host automatially`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.WebBasic,
        requiresEndpointUrl: true,
      });
      setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);
      setupAuth(pack);

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
      });
    });

    it(`${AuthenticationType.WebBasic}, no auth configured`, async () => {
      const pack = createPackWithAuth({
        type: AuthenticationType.WebBasic,
      });

      await testHelper.willBeRejectedWith(
        executeFetch(pack, '/foo?bar=blah', {result: 'hello'}),
        new RegExp(
          'WebBasic authentication is required for this pack, but no local credentials were found. ' +
            'Run "coda auth path/to/pack/manifest to set up credentials.',
        ),
      );

      sinon.assert.notCalled(mockMakeRequest);
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
        const pack = createPackWithAuth({
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'https://auth-url.com',
          tokenUrl: 'https://token-url.com',

          clientIdEnvVarName: 'ignored',
          clientSecretEnvVarName: 'ignored',
        });
        setupReadline(['some-client-id', 'some-client-secret']);
        setupAuth(pack);

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
        });

        sinon.assert.calledOnceWithMatch(fakeLaunchOAuthServerFlow, {
          afterTokenExchange: sinon.match.func,
          authDef: {
            additionalParams: undefined,
            authorizationUrl: 'https://auth-url.com',
            clientIdEnvVarName: 'ignored',
            clientSecretEnvVarName: 'ignored',
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
        const pack = createPackWithAuth({
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'https://auth-url.com',
          tokenUrl: 'https://token-url.com',
          tokenPrefix: 'SomePrefix',
          scopes: ['scope1', 'scope2'],
          additionalParams: {foo: 'bar'},

          clientIdEnvVarName: 'ignored',
          clientSecretEnvVarName: 'ignored',
        });
        setupReadline(['some-client-id', 'some-client-secret']);
        setupAuth(pack);

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
        });

        sinon.assert.calledOnceWithMatch(fakeLaunchOAuthServerFlow, {
          afterTokenExchange: sinon.match.func,
          authDef: {
            additionalParams: {foo: 'bar'},
            authorizationUrl: 'https://auth-url.com',
            clientIdEnvVarName: 'ignored',
            clientSecretEnvVarName: 'ignored',
            scopes: ['scope1', 'scope2'],
            tokenUrl: 'https://token-url.com',
            type: 'OAuth2',
          },
          clientId: 'some-client-id',
          clientSecret: 'some-client-secret',
          port: 3000,
        });
      });

      it(`${AuthenticationType.OAuth2}, leaves existing secrets in place`, async () => {
        const credentialsFile = 'somedir/credentials.json';
        const pack = createPackWithAuth(
          {
            type: AuthenticationType.OAuth2,
            authorizationUrl: 'https://auth-url.com',
            tokenUrl: 'https://token-url.com',

            clientIdEnvVarName: 'ignored',
            clientSecretEnvVarName: 'ignored',
          },
          {name: 'Fake Pack'},
        );

        storeCredential(credentialsFile, 'Fake Pack', {
          clientId: 'existing-client-id',
          clientSecret: 'existing-client-secret',
        });

        setupReadline(['y', '', '']);
        setupAuth(pack, {credentialsFile});

        assertCredentialsFileExactly(
          {
            'Fake Pack': {
              clientId: 'existing-client-id',
              clientSecret: 'existing-client-secret',
              accessToken: 'some-access-token',
              refreshToken: 'some-refresh-token',
            },
          },
          credentialsFile,
        );
      });
    });
  });
});
