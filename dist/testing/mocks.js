import sinon from 'sinon';
import { v4 } from 'uuid';
export function newMockSyncExecutionContext(overrides) {
    return { ...newMockExecutionContext(), sync: {}, ...overrides };
}
export function newMockExecutionContext(overrides) {
    return {
        invocationLocation: {
            protocolAndHost: 'https://coda.io',
        },
        timezone: 'America/Los_Angeles',
        invocationToken: v4(),
        fetcher: {
            fetch: sinon.stub(),
        },
        temporaryBlobStorage: {
            storeUrl: sinon.stub(),
            storeBlob: sinon.stub(),
        },
        ...overrides,
    };
}
export function newJsonFetchResponse(body, status = 200, headers) {
    const allHeaders = { 'Content-Type': 'application/json', ...headers };
    return { status, body, headers: allHeaders };
}
