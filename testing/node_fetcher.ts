import type {FetchMethodType} from '../api_types';
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
  /**
   * With `simple: true` all non "ok" responses including 301/302 will throw
   * StatusCodeErrors. If you want 301/302s to return instead of throwing, set
   * this to false.
   */
  // NOTE(jonathan): It might be reasonable to just always change the behavior
  // to not throw here, but unclear what is relying on this.
  throwOnRedirect?: boolean;
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
  trustedSource?: boolean;

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
  url: string;
  statusCode: number;
  statusMessage: string;
  headers: {[key: string]: any};
  body?: FetcherBodyResponse;
}

export class StatusCodeError extends Error {
  statusCode: number;
  options: BaseFetcherOptions;
  response: FetcherFullResponse;

  constructor(statusCode: number, body: any, options: BaseFetcherOptions, response: FetcherFullResponse) {
    super(`${statusCode} - ${JSON.stringify(body)}`);
    this.name = 'StatusCodeError';
    this.statusCode = statusCode;
    this.options = options;
    this.response = response;
  }
}

export function isStatusCodeError(err: any): err is StatusCodeError {
  return typeof err === 'object' && err.name === StatusCodeError.name;
}

export function nodeFetcher(options: FetcherOptionsWithFullResponse): Promise<FetcherFullResponse>;
export function nodeFetcher(options: FetcherOptionsWithBodyResponse): Promise<FetcherBodyResponse>;
export async function nodeFetcher(options: BaseFetcherOptions): Promise<FetcherFullResponse | FetcherBodyResponse> {
  const {
    method = 'GET',
    uri,
    qs,
    followRedirect = true,
    throwOnRedirect = true,
    gzip = true,
    json,
    headers: rawHeaders = {},
    form,
    body,
    timeout,
    resolveWithFullResponse,
    resolveWithRawBody,
    simple = true,
    encoding,
    maxResponseSizeBytes,
    legacyBlankAcceptHeader,
  } = options;

  // https://github.com/node-fetch/node-fetch#options
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
    url: response.url,
    statusCode: response.status,
    statusMessage: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: resultBody,
  };

  if (simple) {
    const isRedirect = [301, 302].includes(response.status);
    const isNonThrowingRedirect = isRedirect && !throwOnRedirect;
    const treatAsError = !response.ok && !isNonThrowingRedirect;
    if (treatAsError) {
      throw new StatusCodeError(response.status, resultBody, options, fullResponse);
    }
  }

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
