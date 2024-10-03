import type { ExecutionContext } from '../api_types';
import type { FetchRequest } from '../api_types';
import type { FetchResponse } from '../api_types';
import type { Sync } from '../api_types';
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
export interface MockSyncExecutionContext extends MockExecutionContext {
    sync: Sync;
}
export declare function newMockSyncExecutionContext(overrides?: Partial<MockSyncExecutionContext>): MockSyncExecutionContext;
export declare function newMockExecutionContext(overrides?: Partial<MockExecutionContext>): MockExecutionContext;
export declare function newJsonFetchResponse<T>(body: T, status?: number, headers?: {
    [header: string]: string | string[] | undefined;
}): FetchResponse<T>;
