import {Authentication} from '../types';
import {Credentials} from './auth_types';
import {FetchRequest} from '../api_types';
import {FetchResponse} from '../api_types';
import {Fetcher} from '../api_types';
import type {Response} from 'request';
import requestPromise from 'request-promise-native';
import xml2js from 'xml2js';

const FetcherUserAgent = 'Coda-Server-Fetcher';
const MAX_CONTENT_LENGTH_BYTES = 25 * 1024 * 1024;

export class AuthenticatingFetcher implements Fetcher {
  private readonly _authDef: Authentication;
  private readonly _credentials: Credentials | undefined;

  constructor(authDef: Authentication, credentials: Credentials | undefined) {
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

  private _applyAuthentication(_request: FetchRequest): Pick<FetchRequest, 'url' | 'headers' | 'body' | 'form'> {
    switch (this._authDef.type) {
    }
    if (this._credentials) {
    }
    throw new Error('Not yet implemented');
  }
}
