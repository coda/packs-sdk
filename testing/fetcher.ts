import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
import ClientOAuth2 from 'client-oauth2';
import {ConsoleLogger} from '../helpers/logging';
import type {Credentials} from './auth_types';
import type {ExecutionContext} from '../api';
import type {FetchRequest} from '../api_types';
import type {FetchResponse} from '../api_types';
import type {Fetcher} from '../api_types';
import type {MultiQueryParamCredentials} from './auth_types';
import type {OAuth2Credentials} from './auth_types';
import type {QueryParamCredentials} from './auth_types';
import type {Response} from 'request';
import type {SyncExecutionContext} from '../api_types';
import type {TemporaryBlobStorage} from '../api_types';
import type {TokenCredentials} from './auth_types';
import {URL} from 'url';
import type {WebBasicCredentials} from './auth_types';
import {assertCondition} from '../helpers/ensure';
import {ensureExists} from '../helpers/ensure';
import {ensureNonEmptyString} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {getExpirationDate} from './helpers';
import {print} from './helpers';
import requestPromise from 'request-promise-native';
import urlParse from 'url-parse';
import {v4} from 'uuid';
import xml2js from 'xml2js';

const FetcherUserAgent = 'Coda-Test-Server-Fetcher';
const MaxContentLengthBytes = 25 * 1024 * 1024;
const HeadersToStrip = ['authorization'];

// It seems there isn't a proper type on the error callback, and
// the request library is deprecated.
// TODO: Remove this when we replace the deprecated request lib, matching coda repo
interface RequestError {
  name?: string;
  statusCode?: number;
  error?: string;
}

export class AuthenticatingFetcher implements Fetcher {
  private readonly _updateCredentialsCallback: (newCredentials: Credentials) => void | undefined;
  private readonly _authDef: Authentication | undefined;
  private readonly _networkDomains: string[] | undefined;
  private _credentials: Credentials | undefined;
  private readonly _invocationToken: string;

  constructor(
    updateCredentialsCallback: (newCredentials: Credentials) => void | undefined,
    authDef: Authentication | undefined,
    networkDomains: string[] | undefined,
    credentials: Credentials | undefined,
    invocationToken: string,
  ) {
    this._updateCredentialsCallback = updateCredentialsCallback;
    this._authDef = authDef;
    this._networkDomains = networkDomains;
    this._credentials = credentials;
    this._invocationToken = invocationToken;
  }

  async fetch<T = any>(request: FetchRequest, isRetry?: boolean): Promise<FetchResponse<T>> {
    const {url, headers, body, form} = this._applyAuthentication(request);
    this._validateHost(url);

    let response: Response | undefined;

    try {
      response = await requestHelper.makeRequest({
        url,
        method: request.method,
        isBinaryResponse: request.isBinaryResponse,
        headers: {
          ...headers,
          'User-Agent': FetcherUserAgent,
        },
        body,
        form,
      });
    } catch (requestFailure) {
      // Only attempt 1 retry
      if (isRetry) {
        throw requestFailure;
      }
      // If OAuth had a 401 error, that should mean invalid token (RFC 6750), which could be
      // an expired token. Let's assume that it is and retry the request after
      // refreshing the auth token.
      if (!this._isOAuth401(requestFailure)) {
        throw requestFailure;
      }
      print('The request error was a 401 code on an OAuth request, we will refresh credentials and retry.');
      try {
        await this._refreshOAuthCredentials();
      } catch (oauthFailure) {
        print(requestFailure);
        // Now we have both an OAuth failure and an original request error.
        // We throw the one that is most likely the one the user should try to fix first.
        throw oauthFailure;
      }
      // We have successfully refreshed OAuth credentials, now retry query.
      // If this retry fails, it's good that we will throw this new error
      // instead of the original error.
      return this.fetch(request, true);
    }

    let responseBody = response.body;

    if (responseBody && responseBody.length >= MaxContentLengthBytes) {
      throw new Error(`Response body is too large for Coda. Body is ${responseBody.length} bytes.`);
    }

    try {
      const contentType = response.headers['content-type'];
      if (contentType && (contentType.includes('text/xml') || contentType.includes('application/xml'))) {
        responseBody = await xml2js.parseStringPromise(responseBody, {explicitRoot: false});
      } else {
        responseBody = JSON.parse(responseBody);
      }

      // Do not inadvertently parse non-objects.
      if (typeof responseBody !== 'object') {
        responseBody = response.body;
      }
    } catch (e) {
      // Ignore if we cannot parse.
    }

    const responseHeaders = {...response.headers};
    for (const key of Object.keys(responseHeaders)) {
      if (HeadersToStrip.includes(key.toLocaleLowerCase())) {
        // In case any services echo back sensitive headers, remove them so pack code can't see them.
        delete responseHeaders[key];
      }
    }

    return {
      status: response.statusCode,
      headers: responseHeaders,
      body: responseBody,
    };
  }

  private _isOAuth401(requestFailure: RequestError) {
    // All these conditions will be checked again in _refreshOAuthCredentials, but those
    // checks will throw errors, so this function is used to avoid tripping those errors.
    if (!this._authDef || !this._credentials || !this._updateCredentialsCallback) {
      return false;
    }
    if (requestFailure.statusCode !== 401 || this._authDef.type !== AuthenticationType.OAuth2) {
      return false;
    }
    const {accessToken, refreshToken} = this._credentials as OAuth2Credentials;
    if (!accessToken || !refreshToken) {
      return false;
    }
    return true;
  }

  private async _refreshOAuthCredentials() {
    assertCondition(this._authDef?.type === AuthenticationType.OAuth2);
    assertCondition(this._credentials);
    // Reauth with the scopes from the original auth call, not what is currently defined in the manifest.
    const {clientId, clientSecret, accessToken, refreshToken, scopes} = this._credentials as OAuth2Credentials;
    assertCondition(accessToken);
    assertCondition(refreshToken);
    const {authorizationUrl, tokenUrl, additionalParams} = this._authDef;
    const oauth2Client = new ClientOAuth2({
      clientId,
      clientSecret,
      authorizationUri: authorizationUrl,
      accessTokenUri: tokenUrl,
      scopes,
      query: additionalParams,
    });
    const oauthToken = oauth2Client.createToken(accessToken, refreshToken, {});
    const refreshedToken = await oauthToken.refresh();
    const newCredentials: Credentials = {
      ...this._credentials,
      accessToken: refreshedToken.accessToken,
      refreshToken: refreshedToken.refreshToken,
      expires: getExpirationDate(Number(refreshedToken.data.expires_in)).toString(),
      scopes,
    };
    this._credentials = newCredentials;
    this._updateCredentialsCallback(this._credentials);
  }

  private _applyAuthentication({
    url: rawUrl,
    headers,
    body,
    form,
    disableAuthentication,
  }: FetchRequest): Pick<FetchRequest, 'url' | 'headers' | 'body' | 'form'> {
    if (!this._authDef || this._authDef.type === AuthenticationType.None || disableAuthentication) {
      return {url: rawUrl, headers, body, form};
    }
    if (!this._credentials) {
      throw new Error(
        `${this._authDef.type} authentication is required for this pack, but no local credentials were found. ` +
          'Run "coda auth path/to/pack/manifest to set up credentials."',
      );
    }

    const url = this._applyAndValidateEndpoint(rawUrl);

    switch (this._authDef.type) {
      case AuthenticationType.WebBasic: {
        const {username, password} = this._credentials as WebBasicCredentials;
        const encodedAuth = Buffer.from(`${username}:${password}`).toString('base64');

        let bodyWithTemplateSubstitutions = body;
        if (bodyWithTemplateSubstitutions) {
          // For awful APIs that require auth parameters in the request body, we have
          // this scheme where we do template substitution of the body using an unguessable
          // random token as part of the template key.
          Object.entries(this._credentials).forEach(([key, value]) => {
            bodyWithTemplateSubstitutions = ensureExists(bodyWithTemplateSubstitutions).replace(
              `{{${key}-${this._invocationToken}}}`,
              value,
            );
          });
        }

        return {
          url,
          body: bodyWithTemplateSubstitutions,
          form,
          headers: {...headers, Authorization: `Basic ${encodedAuth}`},
        };
      }
      case AuthenticationType.QueryParamToken: {
        const {paramValue} = this._credentials as QueryParamCredentials;
        return {headers, body, form, url: addQueryParam(url, this._authDef.paramName, paramValue)};
      }
      case AuthenticationType.MultiQueryParamToken: {
        const {params: paramDict} = this._credentials as MultiQueryParamCredentials;
        const parsedUrl = new URL(url);
        for (const [paramName, paramValue] of Object.entries(paramDict)) {
          if (!paramValue) {
            throw new Error(
              `Param value for ${paramName} is empty. Please provide a value for this parameter or omit it.`,
            );
          }
          parsedUrl.searchParams.set(paramName, paramValue);
        }
        return {headers, body, form, url: parsedUrl.href};
      }
      case AuthenticationType.HeaderBearerToken:
      case AuthenticationType.CodaApiHeaderBearerToken: {
        const {token} = this._credentials as TokenCredentials;
        return {url, body, form, headers: {...headers, Authorization: `Bearer ${token}`}};
      }
      case AuthenticationType.CustomHeaderToken: {
        const {token} = this._credentials as TokenCredentials;
        const valuePrefix = this._authDef.tokenPrefix ? `${this._authDef.tokenPrefix} ` : '';
        return {url, body, form, headers: {...headers, [this._authDef.headerName]: `${valuePrefix}${token}`}};
      }
      case AuthenticationType.OAuth2: {
        const {accessToken} = this._credentials as OAuth2Credentials;
        const prefix = this._authDef.tokenPrefix || 'Bearer';
        const requestHeaders: {[header: string]: string} = headers || {};
        let requestUrl = url;
        if (this._authDef.tokenQueryParam) {
          requestUrl = addQueryParam(url, this._authDef.tokenQueryParam, ensureNonEmptyString(accessToken));
        } else {
          requestHeaders.Authorization = `${prefix} ${ensureNonEmptyString(accessToken)}`;
        }
        return {
          url: requestUrl,
          body,
          form,
          headers: requestHeaders,
        };
      }
      case AuthenticationType.AWSSignature4:
      case AuthenticationType.Various:
        throw new Error('Not yet implemented');

      default:
        return ensureUnreachable(this._authDef);
    }
  }

  private _applyAndValidateEndpoint(rawUrl: string): string {
    if (
      !this._authDef ||
      this._authDef.type === AuthenticationType.None ||
      this._authDef.type === AuthenticationType.Various
    ) {
      return rawUrl;
    }

    const endpointUrl = this._credentials?.endpointUrl;
    if (!endpointUrl) {
      return rawUrl;
    }

    const parsedEndpointUrl = new URL(endpointUrl);
    const {endpointDomain} = this._authDef;
    if (endpointUrl) {
      if (parsedEndpointUrl.protocol !== 'https:') {
        throw new Error(`Only https urls are supported, but pack is configured to use ${endpointUrl}.`);
      }
      if (
        endpointDomain &&
        !(parsedEndpointUrl.hostname === endpointDomain || parsedEndpointUrl.hostname.endsWith(`.${endpointDomain}`))
      ) {
        throw new Error(
          `The endpoint ${endpointUrl} is not authorized. The domain must match the domain ${endpointDomain} provided in the pack definition.`,
        );
      }
    }

    const parsedUrl = urlParse(rawUrl, {});
    if (parsedUrl.hostname) {
      if (parsedUrl.hostname !== parsedEndpointUrl.hostname) {
        throw new Error(
          `The url ${rawUrl} is not authorized. The host must match the host ${parsedEndpointUrl.hostname} that was specified with the auth credentials. ` +
            'Or leave the host blank and the host will be filled in automatically from the credentials.',
        );
      }
      return rawUrl;
    } else {
      const prefixUrl = endpointUrl.endsWith('/') ? endpointUrl : endpointUrl + '/';
      const path = rawUrl.startsWith('/') ? rawUrl.slice(1) : rawUrl;
      return prefixUrl + path;
    }
  }

  private _validateHost(url: string): void {
    const parsed = new URL(url);
    const host = parsed.host.toLowerCase();
    const allowedDomains = this._networkDomains || [];
    if (
      !allowedDomains.map(domain => domain.toLowerCase()).some(domain => host === domain || host.endsWith(`.${domain}`))
    ) {
      throw new Error(`Attempted to connect to undeclared host '${host}'`);
    }
  }
}

// Namespaced object that can be mocked for testing.
export const requestHelper = {
  makeRequest: async (request: FetchRequest): Promise<Response> => {
    return requestPromise({
      ...request,
      encoding: request.isBinaryResponse ? null : undefined,
      resolveWithFullResponse: true,
      timeout: 60000, // msec
      forever: true, // keep alive connections as long as possible.
    });
  },
};

class AuthenticatingBlobStorage implements TemporaryBlobStorage {
  private readonly _fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this._fetcher = fetcher;
  }

  async storeUrl(url: string, _opts?: {expiryMs?: number}): Promise<string> {
    await this._fetcher.fetch({method: 'GET', url, isBinaryResponse: true});
    return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${v4()}`;
  }

  async storeBlob(_blobData: Buffer, _contentType: string, _opts?: {expiryMs?: number}): Promise<string> {
    return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${v4()}`;
  }
}

export function newFetcherExecutionContext(
  updateCredentialsCallback: (newCreds: Credentials) => void | undefined,
  authDef: Authentication | undefined,
  networkDomains: string[] | undefined,
  credentials?: Credentials,
): ExecutionContext {
  const invocationToken = v4();
  const fetcher = new AuthenticatingFetcher(
    updateCredentialsCallback,
    authDef,
    networkDomains,
    credentials,
    invocationToken,
  );
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken,
    endpoint: credentials?.endpointUrl,
    fetcher,
    temporaryBlobStorage: new AuthenticatingBlobStorage(fetcher),
    logger: new ConsoleLogger(),
  };
}

export function newFetcherSyncExecutionContext(
  updateCredentialsCallback: (newCreds: Credentials) => void | undefined,
  authDef: Authentication | undefined,
  networkDomains: string[] | undefined,
  credentials?: Credentials,
): SyncExecutionContext {
  const context = newFetcherExecutionContext(updateCredentialsCallback, authDef, networkDomains, credentials);
  return {...context, sync: {}};
}

function addQueryParam(url: string, param: string, value: string): string {
  const parsedUrl = new URL(url);
  // Put the key at the beginning, as some APIs expect it at the beginning.
  const entries = [...parsedUrl.searchParams.entries()];
  parsedUrl.searchParams.set(param, value);
  for (const [key, entryValue] of entries) {
    parsedUrl.searchParams.delete(key);
    parsedUrl.searchParams.set(key, entryValue);
  }
  return parsedUrl.href;
}
