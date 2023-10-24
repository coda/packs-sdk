import {HttpStatusCode} from './constants';
import type {OAuth2ClientCredentialsAuthentication} from '../types';
import type {OAuth2ClientCredentialsRequestAccessTokenParams} from './auth_types';
import type {OAuth2RequestAccessTokenParams} from './auth_types';
import {getExpirationDate} from './helpers';

export async function requestOAuthAccessToken(
    params: OAuth2RequestAccessTokenParams
        | OAuth2ClientCredentialsRequestAccessTokenParams,
    {tokenUrl, nestedResponseKey, scopeParamName}:
        { tokenUrl: string; nestedResponseKey?: string, scopeParamName?: string }
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

export async function performOAuthClientCredentialsServerFlow({
  clientId,
  clientSecret,
  authDef,
  scopes,
}: {
    clientId: string;
    clientSecret: string;
    authDef: OAuth2ClientCredentialsAuthentication;
    scopes?: string[];
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

    return {accessToken, expires: getTokenExpiry(data)}
}

interface AfterTokenOAuthClientCredentialsExchangeParams {
    accessToken: string;
    expires?: string;
}

export function getTokenExpiry(data: { [key: string]: string }) {
    return data.expires_in && getExpirationDate(Number(data.expires_in)).toString();
}