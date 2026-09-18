import type { Continuation } from '../api';
import type { ExecutionContext } from '../api_types';
import type { FetchRequest } from '../api_types';
import type { FetchResponse } from '../api_types';
import type { Sync } from '../api_types';
import type { SyncExecutionContext } from '../api_types';
import type { SyncStateService } from '../api_types';
import type { TemporaryBlobStorage } from '../api_types';
import sinon from 'sinon';
export type SinonFunctionSpy<T extends (...args: any[]) => any> = T extends (...args: infer ArgsT) => infer RetT ? sinon.SinonSpy<ArgsT, RetT> : never;
export type SinonFunctionStub<T extends (...args: any[]) => any> = T extends (...args: infer ArgsT) => infer RetT ? sinon.SinonStub<ArgsT, RetT> : never;
export interface MockExecutionContext extends ExecutionContext {
    fetcher: {
        fetch: sinon.SinonStub<[request: FetchRequest], Promise<FetchResponse<any>>>;
    };
    temporaryBlobStorage: {
        storeUrl: SinonFunctionStub<TemporaryBlobStorage['storeUrl']>;
        storeBlob: SinonFunctionStub<TemporaryBlobStorage['storeBlob']>;
    };
}
export interface MockSyncExecutionContext<SyncContinuationT = Continuation, IncrementalCheckpointContinuationT = SyncContinuationT, IncrementalSyncContinuationT = SyncContinuationT> extends MockExecutionContext {
    sync: Sync<SyncContinuationT, IncrementalCheckpointContinuationT, IncrementalSyncContinuationT>;
    syncStateService: {
        getLatestRowVersions: SinonFunctionStub<SyncStateService['getLatestRowVersions']>;
    };
}
/** Mock type of the specified `SyncExecutionContext`. */
export type SyncExecutionContextAsMock<T extends SyncExecutionContext> = T extends SyncExecutionContext<infer ContinuationT, infer IncrementalContinuationT, infer IncrementalSyncContinuationT> ? MockSyncExecutionContext<ContinuationT, IncrementalContinuationT, IncrementalSyncContinuationT> : never;
export declare function newMockSyncExecutionContext<T extends SyncExecutionContext<any>>(overrides?: Partial<T>): SyncExecutionContextAsMock<T>;
export declare function newMockExecutionContext(overrides?: Partial<MockExecutionContext>): MockExecutionContext;
export declare function newJsonFetchResponse<T>(body: T, status?: number, headers?: {
    [header: string]: string | string[] | undefined;
}): FetchResponse<T>;
