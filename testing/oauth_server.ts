import ClientOAuth2 from 'client-oauth2';
import type {Express} from 'express';
import type {OAuth2Authentication} from '../types';
import {exec} from 'child_process';
import express from 'express';
import type * as http from 'http';
import {print} from './helpers';

const DefaultPort = 3000;

interface AfterTokenExchangeParams {
  accessToken: string;
  refreshToken?: string;
}

type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;

export function launchOAuthServerFlow({
  clientId,
  clientSecret,
  authDef,
  port = DefaultPort,
  afterTokenExchange,
}: {
  clientId: string;
  clientSecret: string;
  authDef: OAuth2Authentication;
  port?: number;
  afterTokenExchange: AfterTokenExchangeCallback;
}) {
  // TODO: Handle endpointKey.
  const {authorizationUrl, tokenUrl, scopes, additionalParams} = authDef;
  const oauth2Client = new ClientOAuth2({
    clientId,
    clientSecret,
    authorizationUri: authorizationUrl,
    accessTokenUri: tokenUrl,
    scopes,
    redirectUri: makeRedirectUrl(port),
    query: additionalParams,
  });
  const serverContainer = new OAuthServerContainer(oauth2Client, afterTokenExchange, port);

  const launchCallback = () => {
    const authUrl = oauth2Client.code.getUri();
    print(
      `OAuth server running at http://localhost:${port}.\n` +
        `Complete the auth flow in your browser. If it does not open automatically, visit ${authUrl}`,
    );
    exec(`open "${authUrl}"`);
  };

  serverContainer.configureServer();
  serverContainer.startServer(launchCallback);
}

export function makeRedirectUrl(port: number = DefaultPort): string {
  return `http://localhost:${port}/oauth`;
}

class OAuthServerContainer {
  private readonly _app: Express;
  private readonly _port: number;
  private readonly _oauth2Client: ClientOAuth2;
  private readonly _afterTokenExchange: AfterTokenExchangeCallback;
  private _server: http.Server | undefined;

  constructor(oauth2Client: ClientOAuth2, afterTokenExchange: AfterTokenExchangeCallback, port: number) {
    this._app = express();
    this._port = port;
    this._oauth2Client = oauth2Client;
    this._afterTokenExchange = afterTokenExchange;
  }

  configureServer() {
    this._app.get('/oauth', async (req, res) => {
      // TODO: Figure out how to get refresh tokens, maybe including grant_type: 'authorization_code'.
      const tokenData = await this._oauth2Client.code.getToken(req.originalUrl);
      const {accessToken, refreshToken} = tokenData;
      this._afterTokenExchange({accessToken, refreshToken});
      setTimeout(() => this.shutDown(), 10);
      return res.send('OAuth authentication is complete! You can close this browser tab.');
    });
  }

  startServer(callback: () => void) {
    const port = this._port;
    this._server = this._app.listen(port, callback);
  }

  shutDown() {
    this._server?.close();
  }
}
