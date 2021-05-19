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
import {ensureNonEmptyString} from '../helpers/ensure';
import {ensureUnreachable} from '../helpers/ensure';
import {getExpirationDate} from './helpers';
import path from 'path';
import {print} from './helpers';
import requestPromise from 'request-promise-native';
import {storeCredential} from './auth';
import urlParse from 'url-parse';
import {v4} from 'uuid';
import xml2js from 'xml2js';

const FetcherUserAgent = 'Coda-Test-Server-Fetcher';
const MaxContentLengthBytes = 25 * 1024 * 1024;
const HeadersToStrip = ['authorization'];

// It seems there isn't a proper type on the error callback, and
// the request library is deprecated.
interface RequestError {
  name?: string;
  statusCode?: number;
  error?: string;
}

export class AuthenticatingFetcher implements Fetcher {
  private readonly _manifestPath: string | undefined;
  private readonly _authDef: Authentication | undefined;
  private readonly _networkDomains: string[] | undefined;
  private readonly _credentials: Credentials | undefined;

  constructor(
    manifestPath: string | undefined,
    authDef: Authentication | undefined,
    networkDomains: string[] | undefined,
    credentials: Credentials | undefined,
  ) {
    this._manifestPath = manifestPath;
    this._authDef = authDef;
    this._networkDomains = networkDomains;
    this._credentials = credentials;
  }

  async fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>> {
    const {url, headers, body, form} = this._applyAuthentication(request);
    this._validateHost(url);

    return requestHelper
      .makeRequest({
        url,
        method: request.method,
        headers: {
          ...headers,
          'User-Agent': FetcherUserAgent,
        },
        body,
        form,
      })
      .then((response: Response): Promise<FetchResponse<any>> => this._handleFetchResponse(response))
      .catch((error: RequestError): Promise<FetchResponse<any>> => this._handleFetchError(request, error));
  }

  private async _handleFetchResponse(response: Response): Promise<FetchResponse<any>> {
    let responseBody = response.body;
    if (responseBody && responseBody.length >= MaxContentLengthBytes) {
      throw new Error(`Response body is too large for Coda. Body is ${responseBody.length} bytes.`);
    }

    try {
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('text/xml')) {
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

  private async _handleFetchError(request: FetchRequest, error: RequestError): Promise<FetchResponse<any>> {
    // Check for errors that we can retry.
    if (!this._authDef) {
      throw error;
    }

    // If OAuth had a 401 error, that should mean invalid token (RFC 6750), which could be
    // an expired token. Let's assume that it is and retry the request after
    // trying to refresh the auth token.
    if (error.statusCode !== 401 || this._authDef.type !== AuthenticationType.OAuth2) {
      throw error;
    }

    print('Got a 401 error on an OAuth request.');
    const {authorizationUrl, tokenUrl, scopes, additionalParams} = this._authDef;
    const {clientId, clientSecret, accessToken, refreshToken} = this._credentials as OAuth2Credentials;
    if (!accessToken || !refreshToken) {
      throw error;
    }

    print('Attempting oauth token refresh...');
    const oauth2Client = new ClientOAuth2({
      clientId,
      clientSecret,
      authorizationUri: authorizationUrl,
      accessTokenUri: tokenUrl,
      scopes,
      query: additionalParams,
    });
    const oauthToken = oauth2Client.createToken(accessToken, refreshToken, {});
    return oauthToken
      .refresh()
      .then(token => {
        print('OAuth token refresh successful!');
        (this._credentials as OAuth2Credentials).accessToken = token.accessToken;
        (this._credentials as OAuth2Credentials).refreshToken = token.refreshToken;
        (this._credentials as OAuth2Credentials).expires = getExpirationDate(Number(token.data.expires_in)).toString();
        // If we have gotten to this point, we know these are defined.
        storeCredential(path.dirname(this._manifestPath!), this._credentials!);
        return this.fetch(request);
      })
      .catch(oauthFailure => {
        print('Attempt to refresh oauth token failed.');
        throw oauthFailure;
      });
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
        return {url, body, form, headers: {...headers, Authorization: `Basic ${encodedAuth}`}};
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
        print('Fetcher._applyAuthentication using credentials: ');
        print(this._credentials);
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
  manifestPath: string | undefined,
  authDef: Authentication | undefined,
  networkDomains: string[] | undefined,
  credentials?: Credentials,
): ExecutionContext {
  const fetcher = new AuthenticatingFetcher(manifestPath, authDef, networkDomains, credentials);
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken: v4(),
    endpoint: credentials?.endpointUrl,
    fetcher,
    temporaryBlobStorage: new AuthenticatingBlobStorage(fetcher),
    logger: new ConsoleLogger(),
  };
}

export function newFetcherSyncExecutionContext(
  manifestPath: string | undefined,
  authDef: Authentication | undefined,
  networkDomains: string[] | undefined,
  credentials?: Credentials,
): SyncExecutionContext {
  const context = newFetcherExecutionContext(manifestPath, authDef, networkDomains, credentials);
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
