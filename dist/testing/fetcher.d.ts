import { Authentication } from '../types';
import { Credentials } from './auth_types';
import { ExecutionContext } from '../api';
import { FetchRequest } from '../api_types';
import { FetchResponse } from '../api_types';
import { Fetcher } from '../api_types';
import { TemporaryBlobStorage } from '../api_types';
export declare class AuthenticatingFetcher implements Fetcher {
    private readonly _authDef;
    private readonly _credentials;
    constructor(authDef: Authentication | undefined, credentials: Credentials | undefined);
    fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
    private _applyAuthentication;
}
export declare class DummyBlobStorage implements TemporaryBlobStorage {
    storeUrl(): Promise<string>;
    storeBlob(): Promise<string>;
}
export declare function newFetcherExecutionContext(packName: string, authDef: Authentication | undefined, credentialsFile?: string): ExecutionContext;
