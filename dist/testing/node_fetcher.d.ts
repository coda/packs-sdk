import type { FetchMethodType } from '../api_types';
import * as nodeFetch from 'node-fetch';
/**
 * A wrapper for fetch() that allows us to
 * (1) easily stub this out in tests, and
 * (2) includes these requests automatically in distributed tracing (not yet implemented)
 */
export declare function fetch(url: nodeFetch.RequestInfo, init?: nodeFetch.RequestInit): Promise<nodeFetch.Response>;
/**
 * Wrapper around node-fetch making it easier to use; based on the deprecated request-promise interface.
 */
export interface BaseFetcherOptions {
    method?: FetchMethodType;
    uri: string;
    qs?: {
        [key: string]: any;
    };
    followRedirect?: boolean;
    /**
     * With `simple: true` all non "ok" responses including 301/302 will throw
     * StatusCodeErrors. If you want 301/302s to return instead of throwing, set
     * this to false.
     */
    throwOnRedirect?: boolean;
    gzip?: boolean;
    json?: boolean;
    /** @deprecated You probably don't need this setting. */
    legacyBlankAcceptHeader?: boolean;
    headers?: {
        [key: string]: any;
    };
    form?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    } | string;
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
type FetcherBodyResponse = any;
export interface FetcherFullResponse {
    url: string;
    statusCode: number;
    statusMessage: string;
    headers: {
        [key: string]: any;
    };
    body?: FetcherBodyResponse;
}
export declare class StatusCodeError extends Error {
    statusCode: number;
    options: BaseFetcherOptions;
    response: FetcherFullResponse;
    constructor(statusCode: number, body: any, options: BaseFetcherOptions, response: FetcherFullResponse);
}
export declare function isStatusCodeError(err: any): err is StatusCodeError;
export declare function nodeFetcher(options: FetcherOptionsWithFullResponse): Promise<FetcherFullResponse>;
export declare function nodeFetcher(options: FetcherOptionsWithBodyResponse): Promise<FetcherBodyResponse>;
export {};
