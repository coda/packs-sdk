import type {AllCredentials} from '../testing/auth_types';
import {AuthenticationType} from '../types';
import {createFakePack} from './test_utils';
import * as helpers from '../testing/helpers';
import mockFs from 'mock-fs';
import {readCredentialsFile} from '../testing/auth';
import readline from 'readline';
import {setupAuth} from '../testing/auth';
import sinon from 'sinon';

interface FakeReadlineInterface {
  question: sinon.SinonSpy;
  close: () => void;
}

function makeFakeReadlineInterface(rawResponses: string | string[]): FakeReadlineInterface {
  const responses = typeof rawResponses === 'string' ? [rawResponses] : rawResponses;
  let counter = 0;
  function questionHandler(_text: string, cb: (value: string) => void): void {
    cb(responses[counter++]);
  }

  return {
    question: sinon.spy(questionHandler),
    close: () => {},
  };
}

describe('Auth', () => {
  let mockPrint: sinon.SinonStub;
  let mockPrintAndExit: sinon.SinonStub;
  let mockReadlineCreateInterface: sinon.SinonStub;
  let fakeReadlineInterface: FakeReadlineInterface;

  beforeEach(() => {
    mockFs();
    mockPrint = sinon.stub(helpers, 'print');
    mockPrintAndExit = sinon.stub(helpers, 'printAndExit');
    mockReadlineCreateInterface = sinon.stub(readline, 'createInterface');
  });

  afterEach(() => {
    mockFs.restore();
    sinon.restore();
  });

  function setupReadline(responses: string | string[]) {
    fakeReadlineInterface = makeFakeReadlineInterface(responses);
    mockReadlineCreateInterface.returns(fakeReadlineInterface);
  }

  function assertCredentialsFileExactly(allCredentials: AllCredentials | undefined) {
    assert.deepEqual(readCredentialsFile(), allCredentials);
  }

  describe('setup', () => {
    it('no auth', async () => {
      const pack = createFakePack({
        defaultAuthentication: undefined,
      });

      await setupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'The pack Fake Pack has no declared authentication. Provide a value for defaultAuthentication in the pack definition.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.None}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });

      await setupAuth(pack);

      sinon.assert.calledOnceWithExactly(
        mockPrintAndExit,
        'The pack Fake Pack declares AuthenticationType.None and so does not require authentication. ' +
          'Please declare another AuthenticationType to use authentication with this pack.',
      );
      assertCredentialsFileExactly(undefined);
    });

    it(`${AuthenticationType.HeaderBearerToken}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      setupReadline('some-token');

      await setupAuth(pack);

      sinon.assert.calledOnceWithMatch(
        fakeReadlineInterface.question,
        'Paste the token or API key to use for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.HeaderBearerToken}, requires endpoint url`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          requiresEndpointUrl: true,
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-token']);

      await setupAuth(pack);

      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Enter the endpoint url for Fake Pack (for example, https://fake pack.example.com):\n',
      );
      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Paste the token or API key to use for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {endpointUrl: 'https://some-endpoint-url.com', token: 'some-token'}});
    });

    it(`${AuthenticationType.CodaApiHeaderBearerToken}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
        },
      });
      setupReadline('some-token');

      await setupAuth(pack);

      sinon.assert.calledOnceWithMatch(
        fakeReadlineInterface.question,
        'Paste the token or API key to use for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.CustomHeaderToken}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'MyHeader',
        },
      });
      setupReadline('some-token');

      await setupAuth(pack);

      sinon.assert.calledOnceWithMatch(
        fakeReadlineInterface.question,
        'Paste the token or API key to use for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-token'}});
    });

    it(`${AuthenticationType.QueryParamToken}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.QueryParamToken,
          paramName: 'myParam',
        },
      });
      setupReadline('some-param-value');

      await setupAuth(pack);

      sinon.assert.calledOnceWithMatch(
        fakeReadlineInterface.question,
        'Enter the token to use for the "myParam" url param for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {token: 'some-param-value'}});
    });

    it(`${AuthenticationType.MultiQueryParamToken}`, async () => {
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

      await setupAuth(pack);

      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Enter the token to use for the "param1" url param for Fake Pack:\n',
      );
      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Enter the token to use for the "param2" url param for Fake Pack:\n',
      );
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {params: {param1: 'param-value-1', param2: 'param-value-2'}}});
    });

    it(`${AuthenticationType.WebBasic}`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
        },
      });
      setupReadline(['some-username', 'some-password']);

      await setupAuth(pack);

      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the password for Fake Pack:\n');
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username', password: 'some-password'}});
    });

    it(`${AuthenticationType.WebBasic}, username only`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          uxConfig: {
            usernameOnly: true,
          },
        },
      });
      setupReadline(['some-username']);

      await setupAuth(pack);

      sinon.assert.calledOnceWithMatch(fakeReadlineInterface.question, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username'}});
    });

    it(`${AuthenticationType.WebBasic}, custom field names`, async () => {
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

      await setupAuth(pack);

      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the API Key for Fake Pack:\n');
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the API Password for Fake Pack:\n');
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({'Fake Pack': {username: 'some-username', password: 'some-password'}});
    });

    it(`${AuthenticationType.WebBasic}, requires endpoint url`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          requiresEndpointUrl: true,
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

      await setupAuth(pack);

      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Enter the endpoint url for Fake Pack (for example, https://fake pack.example.com):\n',
      );
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the password for Fake Pack:\n');
      sinon.assert.calledOnceWithExactly(mockPrint, 'Credentials updated!');

      assertCredentialsFileExactly({
        'Fake Pack': {
          endpointUrl: 'https://some-endpoint-url.com',
          username: 'some-username',
          password: 'some-password',
        },
      });
    });

    it(`${AuthenticationType.WebBasic}, requires endpoint url, for subdomain`, async () => {
      const pack = createFakePack({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          requiresEndpointUrl: true,
          endpointDomain: 'myservice.com',
        },
      });
      setupReadline(['https://some-endpoint-url.com', 'some-username', 'some-password']);

      await setupAuth(pack);

      sinon.assert.calledWithMatch(
        fakeReadlineInterface.question,
        'Enter the endpoint url for Fake Pack (for example, https://my-site.myservice.com):\n',
      );
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the username for Fake Pack:\n');
      sinon.assert.calledWithMatch(fakeReadlineInterface.question, 'Enter the password for Fake Pack:\n');
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
});
