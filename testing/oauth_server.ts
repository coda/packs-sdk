import 'cross-fetch/polyfill';
import type {OAuth2Authentication} from '../types';
import type {OAuth2RequestAccessTokenParams} from './auth_types';
import {exec} from 'child_process';
import express from 'express';
import {getTokenExpiry} from './oauth_helpers';
import type * as http from 'http';
import {print} from './helpers';
import {requestOAuthAccessToken} from './oauth_helpers';
import {withQueryParams} from '../helpers/url';

interface AfterTokenOAuthAuthorizationCodeExchangeParams {
  accessToken: string;
  refreshToken?: string;
  expires?: string;
  data?: {[key: string]: string};
}

interface AuthorizationCodeTokenCallbackResponse {
  accessToken: string;
  refreshToken?: string;
  data: {[key: string]: string};
}

export type AfterAuthorizationCodeTokenExchangeCallback = (
  params: AfterTokenOAuthAuthorizationCodeExchangeParams,
) => void;

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
  // TODO: Handle PKCE.
  const {authorizationUrl, tokenUrl, additionalParams, scopeDelimiter, nestedResponseKey, scopeParamName, resource} =
    authDef;
  if (!authorizationUrl || !tokenUrl) {
    throw new Error('Dynamic Client Registration (DCR) is not supported when testing locally');
  }
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
      resource,
    };

    return requestOAuthAccessToken(params, {
      tokenUrl,
      nestedResponseKey,
    });
  };
  const serverContainer = new OAuthServerContainer(callback, afterTokenExchange, port);

  const authorizationUri = makeAuthorizationUrl({
    authorizationUrl,
    clientId,
    redirectUri,
    scope,
    scopeParamName,
    additionalParams,
    resource,
    // Some OAuth providers require a state parameter, so we add one with an arbitrary value.
    state: new Date().getTime(),
  });

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

/**
 * Builds the authorization URL the user is redirected to in order to begin the OAuth handshake.
 */
export function makeAuthorizationUrl({
  authorizationUrl,
  clientId,
  redirectUri,
  scope,
  scopeParamName,
  additionalParams,
  resource,
  state,
}: {
  authorizationUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  scopeParamName?: string;
  additionalParams?: {[key: string]: any};
  resource?: string | string[];
  state: string | number;
}): string {
  const queryParams: {[key: string]: any} = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
    ...(additionalParams || {}),
  };
  const scopeKey = scopeParamName || 'scope';
  queryParams[scopeKey] = scope;

  let authorizationUri = withQueryParams(authorizationUrl, queryParams);
  // `resource` (per RFC 8707) may have multiple values, which are passed as repeated query parameters.
  // qs (used by withQueryParams) would instead encode arrays using indexed keys, so append them here directly.
  if (resource !== undefined) {
    const parsedUri = new URL(authorizationUri);
    for (const singleResource of Array.isArray(resource) ? resource : [resource]) {
      parsedUri.searchParams.append('resource', singleResource);
    }
    authorizationUri = parsedUri.toString();
  }
  return authorizationUri;
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
        const expires = getTokenExpiry(data);
        this._afterTokenExchange({accessToken, refreshToken, expires, data});
        res.send('OAuth authentication is complete! You can close this browser tab.');
        return;
      }

      res.send(`Invalid authorization code received: ${code}`);
    });
    this._server = app.listen(this._port, launchCallback);
  }

  shutDown() {
    this._server?.close();
  }
}
