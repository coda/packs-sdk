import ClientOAuth2 from 'client-oauth2';
import type {OAuth2Authentication} from '../types';
import {exec} from 'child_process';
import express from 'express';
import type * as http from 'http';
import {print} from './helpers';

interface AfterTokenExchangeParams {
  accessToken: string;
  refreshToken?: string;
}

export type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;

export function launchOAuthServerFlow({
  clientId,
  clientSecret,
  authDef,
  port,
  afterTokenExchange,
}: {
  clientId: string;
  clientSecret: string;
  authDef: OAuth2Authentication;
  port: number;
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

  serverContainer.start(launchCallback);
}

export function makeRedirectUrl(port: number): string {
  return `http://localhost:${port}/oauth`;
}

class OAuthServerContainer {
  private readonly _port: number;
  private readonly _oauth2Client: ClientOAuth2;
  private readonly _afterTokenExchange: AfterTokenExchangeCallback;
  private _server: http.Server | undefined;

  constructor(oauth2Client: ClientOAuth2, afterTokenExchange: AfterTokenExchangeCallback, port: number) {
    this._port = port;
    this._oauth2Client = oauth2Client;
    this._afterTokenExchange = afterTokenExchange;
  }

  start(launchCallback: () => void) {
    const app = express();
    app.get('/oauth', async (req, res) => {
      // TODO: Figure out how to get refresh tokens, maybe including grant_type: 'authorization_code'.
      const tokenData = await this._oauth2Client.code.getToken(req.originalUrl);
      const {accessToken, refreshToken} = tokenData;
      this._afterTokenExchange({accessToken, refreshToken});
      setTimeout(() => this.shutDown(), 10);
      return res.send('OAuth authentication is complete! You can close this browser tab.');
    });
    this._server = app.listen(this._port, launchCallback);
  }

  shutDown() {
    this._server?.close();
  }
}
