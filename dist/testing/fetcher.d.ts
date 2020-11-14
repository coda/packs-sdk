import { Authentication } from '../types';
import { Credentials } from './auth_types';
import { FetchRequest } from '../api_types';
import { FetchResponse } from '../api_types';
import { Fetcher } from '../api_types';
export declare class AuthenticatingFetcher implements Fetcher {
    private readonly _authDef;
    private readonly _credentials;
    constructor(authDef: Authentication, credentials: Credentials | undefined);
    fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>>;
    private _applyAuthentication;
}
