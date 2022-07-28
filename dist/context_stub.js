"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextStub = void 0;
const marshaling_1 = require("./runtime/common/marshaling");
const marshaling_2 = require("./runtime/common/marshaling");
/**
 * @hidden
 */
function rewrapError(err) {
    const marshaledError = (0, marshaling_1.marshalError)(err);
    if (!marshaledError) {
        return err;
    }
    // In the packs runtime, there might be multiple definitions of the same error class.
    // For example, one in the thunk bundle and one in the pack bundle. This method ensures that
    // the error is transformed to the local error class.
    return (0, marshaling_2.unmarshalError)(marshaledError) || err;
}
/**
 * @hidden
 */
class FetcherStub {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }
    async fetch(request) {
        try {
            return await this._fetcher.fetch(request);
        }
        catch (err) {
            throw rewrapError(err);
        }
    }
}
/**
 * @hidden
 */
class TemporaryBlobStorageStub {
    constructor(temporaryBlobStorage) {
        this._temporaryBlobStorage = temporaryBlobStorage;
    }
    async storeUrl(url, opts, fetchOpts) {
        try {
            return await this._temporaryBlobStorage.storeUrl(url, opts, fetchOpts);
        }
        catch (err) {
            throw rewrapError(err);
        }
    }
    async storeBlob(blobData, contentType, opts) {
        try {
            return await this._temporaryBlobStorage.storeBlob(blobData, contentType, opts);
        }
        catch (err) {
            throw rewrapError(err);
        }
    }
}
/**
 * @hidden
 *
 * The context stub is used to transform errors from the thunk to the error class in the pack bundle.
 */
class ContextStub {
    constructor(context) {
        this._context = context;
        this._fetcher = new FetcherStub(context.fetcher);
        this._temporaryBlobStorage = new TemporaryBlobStorageStub(context.temporaryBlobStorage);
    }
    get fetcher() {
        return this._fetcher;
    }
    get temporaryBlobStorage() {
        return this._temporaryBlobStorage;
    }
    get endpoint() {
        return this._context.endpoint;
    }
    get invocationLocation() {
        return this._context.invocationLocation;
    }
    get timezone() {
        return this._context.timezone;
    }
    get invocationToken() {
        return this._context.invocationToken;
    }
    get sync() {
        return this._context.sync;
    }
}
exports.ContextStub = ContextStub;
