import type {ExecutionContext} from './api';
import type {FetchRequest} from './api_types';
import type {FetchResponse} from './api_types';
import type {Fetcher} from './api_types';
import type {InvocationLocation} from './api_types';
import type {Sync} from './api_types';
import type {TemporaryBlobStorage} from './api_types';
import {marshalError} from './runtime/common/marshaling';
import {unmarshalError} from './runtime/common/marshaling';

/**
 * @hidden
 */
function rewrapError(err: any): Error {
  const marshaledError = marshalError(err);
  if (!marshaledError) {
    return err;
  }

  // In the packs runtime, there might be multiple definitions of the same error class.
  // For example, one in the thunk bundle and one in the pack bundle. This method ensures that
  // the error is transformed to the local error class.
  return unmarshalError(marshaledError) || err;
}

/**
 * @hidden
 */
class FetcherStub implements Fetcher {
  private _fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this._fetcher = fetcher;
  }

  async fetch<T = any>(request: FetchRequest): Promise<FetchResponse<T>> {
    try {
      return await this._fetcher.fetch(request);
    } catch (err: any) {
      throw rewrapError(err);
    }
  }
}

/**
 * @hidden
 */
class TemporaryBlobStorageStub implements TemporaryBlobStorage {
  private _temporaryBlobStorage: TemporaryBlobStorage;

  constructor(temporaryBlobStorage: TemporaryBlobStorage) {
    this._temporaryBlobStorage = temporaryBlobStorage;
  }

  async storeUrl(
    url: string,
    opts?: {expiryMs?: number | undefined; downloadFilename?: string | undefined} | undefined,
    fetchOpts?: Pick<FetchRequest, 'disableAuthentication'> | undefined,
  ): Promise<string> {
    try {
      return await this._temporaryBlobStorage.storeUrl(url, opts, fetchOpts);
    } catch (err: any) {
      throw rewrapError(err);
    }
  }

  async storeBlob(
    blobData: Buffer,
    contentType: string,
    opts?: {expiryMs?: number | undefined; downloadFilename?: string | undefined} | undefined,
  ): Promise<string> {
    try {
      return await this._temporaryBlobStorage.storeBlob(blobData, contentType, opts);
    } catch (err: any) {
      throw rewrapError(err);
    }
  }
}

/**
 * @hidden
 *
 * The context stub is used to transform errors from the thunk to the error class in the pack bundle.
 */
export class ContextStub implements ExecutionContext {
  private _context: ExecutionContext;
  private _fetcher: Fetcher;
  private _temporaryBlobStorage: TemporaryBlobStorage;

  constructor(context: ExecutionContext) {
    this._context = context;
    this._fetcher = new FetcherStub(context.fetcher);
    this._temporaryBlobStorage = new TemporaryBlobStorageStub(context.temporaryBlobStorage);
  }

  get fetcher(): Fetcher {
    return this._fetcher;
  }

  get temporaryBlobStorage(): TemporaryBlobStorage {
    return this._temporaryBlobStorage;
  }

  get endpoint(): string | undefined {
    return this._context.endpoint;
  }

  get invocationLocation(): InvocationLocation {
    return this._context.invocationLocation;
  }

  get timezone(): string {
    return this._context.timezone;
  }

  get invocationToken(): string {
    return this._context.invocationToken;
  }

  get sync(): Sync | undefined {
    return this._context.sync;
  }
}
