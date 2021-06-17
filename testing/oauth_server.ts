import ClientOAuth2 from 'client-oauth2';
import type {OAuth2Authentication} from '../types';
import {exec} from 'child_process';
import express from 'express';
import {getExpirationDate} from './helpers';
import type * as http from 'http';
import {print} from './helpers';

interface AfterTokenExchangeParams {
  accessToken: string;
  refreshToken?: string;
  expires?: string;
}

export type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;

export function launchOAuthServerFlow({
  clientId,
  clientSecret,
  authDef,
  port,
  afterTokenExchange,
  scopes,
}: {
  clientId: string;
  clientSecret: string;
  authDef: OAuth2Authentication;
  port: number;
  afterTokenExchange: AfterTokenExchangeCallback;
  scopes?: string[];
}) {
  // TODO: Handle endpointKey.
  const {authorizationUrl, tokenUrl, additionalParams} = authDef;
  // Use the manifest's scopes as a default.
  const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
  const oauth2Client = new ClientOAuth2({
    clientId,
    clientSecret,
    authorizationUri: authorizationUrl,
    accessTokenUri: tokenUrl,
    scopes: requestedScopes,
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
      const tokenData = await this._oauth2Client.code.getToken(req.originalUrl);
      const {accessToken, refreshToken, data} = tokenData;
      const expires = data.expires_in && getExpirationDate(Number(data.expires_in)).toString();
      this._afterTokenExchange({accessToken, refreshToken, expires});
      setTimeout(() => this.shutDown(), 10);
      return res.send('OAuth authentication is complete! You can close this browser tab.');
    });
    this._server = app.listen(this._port, launchCallback);
  }

  shutDown() {
    this._server?.close();
  }
}
