import 'cross-fetch/polyfill';
import {HttpStatusCode} from './constants';
import type {OAuth2Authentication} from '../types';
import type {OAuth2ClientCredentialsAuthentication} from '../types';
import type {OAuth2ClientCredentialsRequestAccessTokenParams} from './auth_types';
import type {OAuth2RequestAccessTokenParams} from './auth_types';
import {exec} from 'child_process';
import express from 'express';
import {getExpirationDate} from './helpers';
import type * as http from 'http';
import {print} from './helpers';
import {withQueryParams} from '../helpers/url';

interface AfterTokenOAuthAuthorizationCodeExchangeParams {
  accessToken: string;
  refreshToken?: string;
  expires?: string;
}

interface AuthorizationCodeTokenCallbackResponse {
  accessToken: string;
  refreshToken?: string;
  data: {[key: string]: string};
}

export type AfterAuthorizationCodeTokenExchangeCallback =
    (params: AfterTokenOAuthAuthorizationCodeExchangeParams) => void;

interface AfterTokenOAuthClientCredentialsExchangeParams {
  accessToken: string;
  expires?: string;
}

async function requestOAuthAccessToken(
    params: OAuth2RequestAccessTokenParams
    | OAuth2ClientCredentialsRequestAccessTokenParams,
    {tokenUrl, nestedResponseKey, scopeParamName}:
        {tokenUrl: string; nestedResponseKey?: string, scopeParamName?: string}
) {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    accept: 'application/json',
  });

  const formParams = new URLSearchParams();
  const formParamsWithSecret = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) {
      continue;
    }

    let paramKey = key;
    if (key === 'scope' && scopeParamName) {
      paramKey = scopeParamName;
    }
    if (paramKey !== 'client_secret') {
      formParams.append(paramKey, value.toString());
    }

    formParamsWithSecret.append(paramKey, value.toString());
  }

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
    headers.append('Authorization', `Basic ${Buffer.from(`${params.client_id}:${params.client_secret}`).toString('base64')}`);
    oauthResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: formParams,
      headers,
    });
  }

  if (!oauthResponse.ok) {
    throw new Error(`OAuth provider returns error ${oauthResponse.status} ${await oauthResponse.text()}`);
  }

  const responseBody = await oauthResponse.json();
  const tokenContainer = nestedResponseKey ? responseBody[nestedResponseKey] : responseBody;
  const {access_token: accessToken, refresh_token: refreshToken, ...data} = tokenContainer;

  return {accessToken, refreshToken, data};
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
  afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback;
  scopes?: string[];
}) {
  // TODO: Handle endpointKey.
  const {authorizationUrl, tokenUrl, additionalParams, scopeDelimiter, nestedResponseKey, scopeParamName} = authDef;
  // Use the manifest's scopes as a default.
  const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
  const scope = requestedScopes ? requestedScopes.join(scopeDelimiter || ' ') : requestedScopes;
  const redirectUri = makeRedirectUrl(port);
  const callback = async (code: string): Promise<AuthorizationCodeTokenCallbackResponse> => {
    const params: OAuth2RequestAccessTokenParams = {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    };

    return requestOAuthAccessToken(params, {
      tokenUrl,
      nestedResponseKey,
    });
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

function _getTokenExpiry(data: {[key: string]: string}) {
  return  data.expires_in && getExpirationDate(Number(data.expires_in)).toString();
}

class OAuthServerContainer {
  private readonly _port: number;
  private readonly _afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback;
  private _server: http.Server | undefined;
  private _tokenCallback: (code: string) => Promise<AuthorizationCodeTokenCallbackResponse>;

  constructor(
      tokenCallback: (code: string) => Promise<AuthorizationCodeTokenCallbackResponse>,
      afterTokenExchange: AfterAuthorizationCodeTokenExchangeCallback,
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
        const expires = _getTokenExpiry(data);
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

export async function performOAuthClientCredentialsServerFlow({
  clientId,
  clientSecret,
  authDef,
  scopes,
  afterTokenExchange,
}: {
  clientId: string;
  clientSecret: string;
  authDef: OAuth2ClientCredentialsAuthentication;
  scopes?: string[];
  afterTokenExchange?: (params: AfterTokenOAuthClientCredentialsExchangeParams) => void;
}): Promise<AfterTokenOAuthClientCredentialsExchangeParams> {
  const {tokenUrl, nestedResponseKey, scopeParamName, scopeDelimiter} = authDef;
  // Use the manifest's scopes as a default.
  const requestedScopes = scopes && scopes.length > 0 ? scopes : authDef.scopes;
  const scope = requestedScopes ? requestedScopes.join(scopeDelimiter || ' ') : requestedScopes;
  const params: OAuth2ClientCredentialsRequestAccessTokenParams = {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope,
  };

  const {accessToken, data} = await requestOAuthAccessToken(params, {
    tokenUrl,
    nestedResponseKey,
    scopeParamName,
  });

  const credentials = {accessToken, expires: _getTokenExpiry(data)};
  afterTokenExchange?.(credentials);
  return {accessToken, expires: _getTokenExpiry(data)}
}
