import 'cross-fetch/polyfill';
import {HttpStatusCode} from './constants';
import type {OAuth2Authentication} from '../types';
import {exec} from 'child_process';
import express from 'express';
import {getExpirationDate} from './helpers';
import type * as http from 'http';
import {print} from './helpers';
import {withQueryParams} from '../helpers/url';

interface AfterTokenExchangeParams {
  accessToken: string;
  refreshToken?: string;
  expires?: string;
}

export type AfterTokenExchangeCallback = (params: AfterTokenExchangeParams) => void;

interface TokenCallbackResponse {
  accessToken: string;
  refreshToken?: string;
  data: {[key: string]: string};
}

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
  const {authorizationUrl, tokenUrl, additionalParams, scopeDelimiter, nestedResponseKey, scopeParamName} = authDef;
  // Use the manifest's scopes as a default.
  const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
  const scope = requestedScopes ? requestedScopes.join(scopeDelimiter || ' ') : requestedScopes;
  const redirectUri = makeRedirectUrl(port);
  const callback = async (code: string): Promise<TokenCallbackResponse> => {
    const params = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
    };

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    });

    const formParams = new URLSearchParams();
    const formParamsWithSecret = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      formParams.append(key, value.toString());
      formParamsWithSecret.append(key, value.toString());
    }

    formParamsWithSecret.append('client_secret', clientSecret);

    let oauthResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: formParamsWithSecret,
      headers,
    });

    if (oauthResponse.status === HttpStatusCode.Unauthorized) {
      // https://datatracker.ietf.org/doc/html/rfc6749#section-3.2.1 doesn't specify how exactly client secret is
      // passed to the oauth provider. https://datatracker.ietf.org/doc/html/rfc6749#section-2.3 says that client should
      // NOT has more than one auth methods.
      //
      // To workaround with OAuth provider that uses different auth method, we fallback to header auth if body param
      // auth fails with 401. This is the same behavior in production.
      headers.append('Authorization', `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`);
      oauthResponse = await fetch(tokenUrl, {
        method: 'POST',
        body: formParams,
        headers,
      });
    }

    if (!oauthResponse.ok) {
      new Error(`OAuth provider returns error ${oauthResponse.status} ${oauthResponse.text}`);
    }

    const responseBody = await oauthResponse.json();
    const tokenContainer = nestedResponseKey ? responseBody[nestedResponseKey] : responseBody;
    const {access_token: accessToken, refresh_token: refreshToken, ...data} = tokenContainer;

    return {accessToken, refreshToken, data};
  };
  const serverContainer = new OAuthServerContainer(callback, afterTokenExchange, port);

  const queryParams: {[key: string]: any} = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    ...(additionalParams || {}),
  };
  const scopeKey = scopeParamName || 'scope';
  queryParams[scopeKey] = scope;

  const authorizationUri = withQueryParams(authorizationUrl, queryParams);

  const launchCallback = () => {
    print(
      `OAuth server running at http://localhost:${port}.\n` +
        `Complete the auth flow in your browser. If it does not open automatically, visit ${authorizationUri}`,
    );
    exec(`open "${authorizationUri}"`);
  };

  serverContainer.start(launchCallback);
}

export function makeRedirectUrl(port: number): string {
  return `http://localhost:${port}/oauth`;
}

class OAuthServerContainer {
  private readonly _port: number;
  private readonly _afterTokenExchange: AfterTokenExchangeCallback;
  private _server: http.Server | undefined;
  private _tokenCallback: (code: string) => Promise<TokenCallbackResponse>;

  constructor(
    tokenCallback: (code: string) => Promise<TokenCallbackResponse>,
    afterTokenExchange: AfterTokenExchangeCallback,
    port: number,
  ) {
    this._tokenCallback = tokenCallback;
    this._port = port;
    this._afterTokenExchange = afterTokenExchange;
  }

  start(launchCallback: () => void) {
    const app = express();
    app.get('/oauth', async (req, res) => {
      const code = new URL(req.originalUrl, 'http://localhost').searchParams.get('code');

      setTimeout(() => this.shutDown(), 1000);

      if (code) {
        const tokenData = await this._tokenCallback(code);
        const {accessToken, refreshToken, data} = tokenData;
        const expires = data.expires_in && getExpirationDate(Number(data.expires_in)).toString();
        this._afterTokenExchange({accessToken, refreshToken, expires});
        return res.send('OAuth authentication is complete! You can close this browser tab.');
      }

      return res.send(`Invalid authorization code received: ${code}`);
    });
    this._server = app.listen(this._port, launchCallback);
  }

  shutDown() {
    this._server?.close();
  }
}
