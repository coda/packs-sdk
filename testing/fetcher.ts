import type {Authentication} from '../types';
import {AuthenticationType} from '../types';
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
import {readCredentialsFile} from './auth';
import requestPromise from 'request-promise-native';
import urlParse from 'url-parse';
import {v4} from 'uuid';
import xml2js from 'xml2js';

const FetcherUserAgent = 'Coda-Test-Server-Fetcher';
const MaxContentLengthBytes = 25 * 1024 * 1024;
const HeadersToStrip = ['authorization'];

export class AuthenticatingFetcher implements Fetcher {
  private readonly _authDef: Authentication | undefined;
  private readonly _credentials: Credentials | undefined;

  constructor(authDef: Authentication | undefined, credentials: Credentials | undefined) {
    this._authDef = authDef;
    this._credentials = credentials;
  }

  async fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>> {
    const {url, headers, body, form} = this._applyAuthentication(request);

    const response: Response = await requestHelper.makeRequest({
      url,
      method: request.method,
      headers: {
        ...headers,
        'User-Agent': FetcherUserAgent,
      },
      body,
      form,
    });

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
        const parsedUrl = new URL(url);
        // Put the key at the beginning, as some APIs expect it at the beginning.
        const entries = [...parsedUrl.searchParams.entries()];
        parsedUrl.searchParams.set(this._authDef.paramName, paramValue);
        for (const [key, value] of entries) {
          parsedUrl.searchParams.delete(key);
          parsedUrl.searchParams.set(key, value);
        }
        return {headers, body, form, url: parsedUrl.href};
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
      case AuthenticationType.AWSSignature4:
        throw new Error('Not yet implemented');
      case AuthenticationType.OAuth2: {
        const {accessToken} = this._credentials as OAuth2Credentials;
        const prefix = this._authDef.tokenPrefix || 'Bearer';
        return {
          url,
          body,
          form,
          headers: {...headers, Authorization: `${prefix} ${ensureNonEmptyString(accessToken)}`},
        };
      }

      default:
        return ensureUnreachable(this._authDef);
    }
  }

  private _applyAndValidateEndpoint(rawUrl: string): string {
    if (!this._authDef || this._authDef.type === AuthenticationType.None) {
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

export class DummyBlobStorage implements TemporaryBlobStorage {
  async storeUrl(): Promise<string> {
    return `https://example.com/temporaryBlob/${v4()}`;
  }

  async storeBlob(): Promise<string> {
    return `https://example.com/temporaryBlob/${v4()}`;
  }
}

class AuthenticatingBlobStorage implements TemporaryBlobStorage {
  private readonly _fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this._fetcher = fetcher;
  }

  async storeUrl(url: string, _opts?: {expiryMs?: number}): Promise<string> {
    await this._fetcher.fetch({method: 'GET', url});
    return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${v4()}`;
  }

  async storeBlob(_blobData: Buffer, _contentType: string, _opts?: {expiryMs?: number}): Promise<string> {
    return `https://not-a-real-url.s3.amazonaws.com/tempBlob/${v4()}`;
  }
}

export function newFetcherExecutionContext(
  packName: string,
  authDef: Authentication | undefined,
  credentialsFile?: string,
): ExecutionContext {
  const allCredentials = readCredentialsFile(credentialsFile);
  const credentials = allCredentials?.[packName];
  const fetcher = new AuthenticatingFetcher(authDef, credentials);
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken: v4(),
    endpoint: credentials?.endpointUrl,
    fetcher,
    temporaryBlobStorage: new AuthenticatingBlobStorage(fetcher),
  };
}

export function newFetcherSyncExecutionContext(
  packName: string,
  authDef: Authentication | undefined,
  credentialsFile?: string,
): SyncExecutionContext {
  const context = newFetcherExecutionContext(packName, authDef, credentialsFile);
  return {...context, sync: {}};
}
