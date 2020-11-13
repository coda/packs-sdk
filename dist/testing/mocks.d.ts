import { ExecutionContext } from '../api_types';
import type { FetchResponse } from '../api_types';
import { SyncExecutionContext } from '../api_types';
import sinon from 'sinon';
export interface MockExecutionContext extends ExecutionContext {
    fetcher: {
        fetch: sinon.SinonStub;
    };
    temporaryBlobStorage: {
        storeUrl: sinon.SinonStub;
        storeBlob: sinon.SinonStub;
    };
}
export declare function newSyncExecutionContext(): SyncExecutionContext;
export declare function newMockExecutionContext(): MockExecutionContext;
export declare function newJsonFetchResponse<T>(body: T, status?: number, headers?: {
    [header: string]: string | string[] | undefined;
}): FetchResponse<T>;
