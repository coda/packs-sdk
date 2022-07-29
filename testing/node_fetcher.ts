import type {FetchMethodType} from '../api_types';
import {Agent as HttpAgent} from 'http';
import {Agent as HttpsAgent} from 'https';
import type {RequestInit} from 'node-fetch';
import type {Response} from 'node-fetch';
import * as nodeFetch from 'node-fetch';

/**
 * A wrapper for fetch() that allows us to
 * (1) easily stub this out in tests, and
 * (2) includes these requests automatically in distributed tracing (not yet implemented)
 */
export async function fetch(url: nodeFetch.RequestInfo, init?: nodeFetch.RequestInit): Promise<nodeFetch.Response> {
  return nodeFetch.default(url, init);
}

/**
 * Wrapper around node-fetch making it easier to use; based on the deprecated request-promise interface.
 */
export interface BaseFetcherOptions {
  method?: FetchMethodType;
  uri: string;
  qs?: {[key: string]: any};

  followRedirect?: boolean;
  gzip?: boolean;
  json?: boolean;
  /** @deprecated You probably don't need this setting. */
  legacyBlankAcceptHeader?: boolean;

  headers?: {[key: string]: any};
  form?: {[key: string]: any};
  body?: {[key: string]: any} | string;

  timeout?: number;
  forever?: boolean;
  resolveWithFullResponse?: boolean;
  resolveWithRawBody?: boolean;
  simple?: boolean;
  encoding?: string | null;

  ca?: string;

  maxResponseSizeBytes?: number;
}

export type FetcherOptionsWithFullResponse = BaseFetcherOptions & {
  resolveWithFullResponse: true;
};

export type FetcherOptionsWithBodyResponse = BaseFetcherOptions & {
  resolveWithFullResponse?: false;
};

type FetcherBodyResponse = any; // Buffer | string | {[key: string]: any};

export interface FetcherFullResponse {
  statusCode: number;
  statusMessage: string;
  headers: {[key: string]: any};
  body?: FetcherBodyResponse;
}

export function nodeFetcher(options: FetcherOptionsWithFullResponse): Promise<FetcherFullResponse>;
export function nodeFetcher(options: FetcherOptionsWithBodyResponse): Promise<FetcherBodyResponse>;
export async function nodeFetcher(options: BaseFetcherOptions): Promise<FetcherFullResponse | FetcherBodyResponse> {
  const {
    method = 'GET',
    uri,
    qs,
    followRedirect = true,
    gzip = true,
    json,
    headers: rawHeaders = {},
    form,
    body,
    timeout,
    forever,
    resolveWithFullResponse,
    resolveWithRawBody,
    encoding,
    ca,
    maxResponseSizeBytes,
    legacyBlankAcceptHeader,
  } = options;

  const init: RequestInit = {
    method,
    timeout,
    compress: gzip,
    size: maxResponseSizeBytes || 0,
  };

  if (!followRedirect) {
    init.follow = 0;
    init.redirect = 'manual';
  }

  if (forever || ca) {
    init.agent = uri.startsWith('http:')
      ? new HttpAgent({keepAlive: forever})
      : new HttpsAgent({keepAlive: forever, ca});
  }

  const headers = Object.fromEntries(
    Object.entries(rawHeaders)
      .filter(([_key, value]) => {
        return typeof value !== 'undefined';
      })
      .map(([key, value]) => {
        return [key.toLowerCase(), value];
      }),
  );

  if (json && !headers.accept) {
    headers.accept = 'application/json';
  }

  // Mimic request-promise behavior of not sending an Accept header; node-fetch sends */* by default, so we override
  // to empty.
  if (legacyBlankAcceptHeader && !headers.accept) {
    headers.accept = '';
  }

  if (form) {
    const formParams = new URLSearchParams();
    for (const [key, value] of Object.entries(form)) {
      formParams.append(key, value.toString());
    }
    init.body = formParams;
  } else if (body) {
    if (json && !headers['content-type']) {
      headers['content-type'] = 'application/json';
    }
    if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
      init.body = JSON.stringify(body);
    } else {
      init.body = body;
    }
  }

  init.headers = headers;

  const url = new URL(uri);
  if (qs) {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(qs)) {
      queryParams.append(key, value.toString());
    }
    url.search = queryParams.toString();
  }

  const response = await fetch(url.href, init);
  const resultBody = await getResultBody(response, {encoding, resolveWithRawBody, forceJsonResponseBody: json});
  const fullResponse = {
    statusCode: response.status,
    statusMessage: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: resultBody,
  };

  if (resolveWithFullResponse) {
    return fullResponse;
  }

  return resultBody;
}

async function getResultBody(
  response: Response,
  {
    encoding,
    resolveWithRawBody,
    forceJsonResponseBody,
  }: {encoding?: null | string; resolveWithRawBody?: boolean; forceJsonResponseBody?: boolean},
): Promise<FetcherBodyResponse> {
  if (resolveWithRawBody) {
    return response.body;
  }

  if (encoding === null) {
    return response.buffer();
  }

  if (forceJsonResponseBody || response.headers.get('content-type')?.includes('application/json')) {
    const body = await response.text();
    try {
      return JSON.parse(body);
    } catch (_err) {
      return body;
    }
  }

  return response.text();
}
