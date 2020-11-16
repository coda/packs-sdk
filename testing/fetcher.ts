import {Authentication} from '../types';
import {AuthenticationType} from '../types';
import {Credentials} from './auth_types';
import {ExecutionContext} from '../api';
import {FetchRequest} from '../api_types';
import {FetchResponse} from '../api_types';
import {Fetcher} from '../api_types';
import {MultiQueryParamCredentials} from './auth_types';
import {QueryParamCredentials} from './auth_types';
import type {Response} from 'request';
import {TemporaryBlobStorage} from '../api_types';
import {TokenCredentials} from './auth_types';
import {URL} from 'url';
import {WebBasicCredentials} from './auth_types';
import {ensureUnreachable} from 'helpers/ensure';
import {readCredentialsFile} from './auth';
import requestPromise from 'request-promise-native';
import {v4} from 'uuid';
import xml2js from 'xml2js';

const FetcherUserAgent = 'Coda-Server-Fetcher';
const MAX_CONTENT_LENGTH_BYTES = 25 * 1024 * 1024;

export class AuthenticatingFetcher implements Fetcher {
  private readonly _authDef: Authentication | undefined;
  private readonly _credentials: Credentials | undefined;

  constructor(authDef: Authentication | undefined, credentials: Credentials | undefined) {
    this._authDef = authDef;
    this._credentials = credentials;
  }

  async fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>> {
    const {url, headers, body, form} = this._applyAuthentication(request);

    const response: Response = await requestPromise({
      url,
      method: request.method,
      headers: {
        ...headers,
        'User-Agent': FetcherUserAgent,
      },
      body,
      form,
      encoding: request.isBinaryResponse ? null : undefined,
      resolveWithFullResponse: true,
      timeout: 60000, // msec
      forever: true, // keep alive connections as long as possible.
    });

    let responseBody = response.body;
    if (responseBody && responseBody.length >= MAX_CONTENT_LENGTH_BYTES) {
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
      if (key.toLocaleLowerCase() === 'authorization') {
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
    url,
    headers,
    body,
    form,
  }: FetchRequest): Pick<FetchRequest, 'url' | 'headers' | 'body' | 'form'> {
    if (!this._authDef) {
      return {url, headers, body, form};
    }
    if (!this._credentials) {
      throw new Error(
        `${this._authDef.type} authentication is required for this pack, but no local credentials were found. ` +
          'Run "coda auth path/to/pack/manifest to set up credentials."',
      );
    }
    switch (this._authDef.type) {
      case AuthenticationType.None:
        return {url, headers, body, form};
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
        const paramDict = this._credentials as MultiQueryParamCredentials;
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
      case AuthenticationType.OAuth2:
        throw new Error('Not yet implemented');
      default:
        return ensureUnreachable(this._authDef);
    }
  }
}

export class DummyBlobStorage implements TemporaryBlobStorage {
  async storeUrl(): Promise<string> {
    return `https://example.com/temporaryBlob/${v4()}`;
  }

  async storeBlob(): Promise<string> {
    return `https://example.com/temporaryBlob/${v4()}`;
  }
}

export function newFetcherExecutionContext(
  packName: string,
  authDef: Authentication | undefined,
  credentialsFile?: string,
): ExecutionContext {
  const allCredentials = readCredentialsFile(credentialsFile);
  const credentials = allCredentials?.[packName];
  return {
    invocationLocation: {
      protocolAndHost: 'https://coda.io',
    },
    timezone: 'America/Los_Angeles',
    invocationToken: v4(),
    fetcher: new AuthenticatingFetcher(authDef, credentials),
    temporaryBlobStorage: new DummyBlobStorage(),
  };
}
