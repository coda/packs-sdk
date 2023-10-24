import type { Authentication } from '../types';
import type { Credentials } from './auth_types';
import type { ExecutionContext } from '../api';
import type { FetchRequest } from '../api_types';
import type { FetchResponse } from '../api_types';
import type { Fetcher } from '../api_types';
import type { FetcherFullResponse } from './node_fetcher';
import type { FetcherOptionsWithFullResponse } from './node_fetcher';
import type { SyncExecutionContext } from '../api_types';
export declare class AuthenticatingFetcher implements Fetcher {
    private readonly _updateCredentialsCallback;
    private readonly _authDef;
    private readonly _networkDomains;
    private _credentials;
    private readonly _invocationToken;
    constructor(updateCredentialsCallback: (newCredentials: Credentials) => void | undefined, authDef: Authentication | undefined, networkDomains: string[] | undefined, credentials: Credentials | undefined, invocationToken: string);
    fetch<T = any>(request: FetchRequest, isRetry?: boolean): Promise<FetchResponse<T>>;
    private _isOAuth401;
    private _refreshOAuthWithRefreshToken;
    private _refreshOAuthClientCredentials;
    private _refreshOAuthCredentials;
    private _applyAuthentication;
    private _signAwsRequest;
    private _getAwsRegion;
    private _applyAndValidateEndpoint;
    private _validateHost;
}
export declare const requestHelper: {
    makeRequest: (request: FetcherOptionsWithFullResponse) => Promise<FetcherFullResponse>;
};
export declare function newFetcherExecutionContext(updateCredentialsCallback: (newCreds: Credentials) => void | undefined, authDef: Authentication | undefined, networkDomains: string[] | undefined, credentials?: Credentials): ExecutionContext;
export declare function newFetcherSyncExecutionContext(updateCredentialsCallback: (newCreds: Credentials) => void | undefined, authDef: Authentication | undefined, networkDomains: string[] | undefined, credentials?: Credentials): SyncExecutionContext;
