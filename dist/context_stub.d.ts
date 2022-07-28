import type { ExecutionContext } from './api';
import type { Fetcher } from './api_types';
import type { InvocationLocation } from './api_types';
import type { Sync } from './api_types';
import type { TemporaryBlobStorage } from './api_types';
/**
 * @hidden
 *
 * The context stub is used to transform errors from the thunk to the error class in the pack bundle.
 */
export declare class ContextStub implements ExecutionContext {
    private _context;
    private _fetcher;
    private _temporaryBlobStorage;
    constructor(context: ExecutionContext);
    get fetcher(): Fetcher;
    get temporaryBlobStorage(): TemporaryBlobStorage;
    get endpoint(): string | undefined;
    get invocationLocation(): InvocationLocation;
    get timezone(): string;
    get invocationToken(): string;
    get sync(): Sync | undefined;
}
