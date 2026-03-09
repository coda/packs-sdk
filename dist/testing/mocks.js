"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMockSyncExecutionContext = newMockSyncExecutionContext;
exports.newMockExecutionContext = newMockExecutionContext;
exports.newJsonFetchResponse = newJsonFetchResponse;
const sinon_1 = __importDefault(require("sinon"));
const uuid_1 = require("uuid");
function newMockSyncExecutionContext(overrides) {
    return {
        ...newMockExecutionContext(),
        sync: {},
        syncStateService: { getLatestRowVersions: sinon_1.default.stub() },
        ...overrides,
    };
}
function newMockExecutionContext(overrides) {
    return {
        invocationLocation: {
            protocolAndHost: 'https://coda.io',
        },
        timezone: 'America/Los_Angeles',
        invocationToken: (0, uuid_1.v4)(),
        fetcher: {
            fetch: sinon_1.default.stub().callsFake(async (r) => {
                throw new Error(`Unhandled fetch: ${r.method} ${r.url}`);
            }),
        },
        temporaryBlobStorage: {
            storeUrl: sinon_1.default.stub(),
            storeBlob: sinon_1.default.stub(),
        },
        ...overrides,
    };
}
function newJsonFetchResponse(body, status = 200, headers) {
    const allHeaders = { 'Content-Type': 'application/json', ...headers };
    return { status, body, headers: allHeaders };
}
