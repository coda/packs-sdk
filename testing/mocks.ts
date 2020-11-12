import type {ExecutionContext, SyncExecutionContext} from '../api_types';
import type {FetchResponse} from '../api_types';
import {v4} from 'uuid';
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

export function newSyncExecutionContext(): SyncExecutionContext {
  return {...newExecutionContext(), sync: {}};
}

export function newMockExecutionContext(): MockExecutionContext {
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
  };
}

export function newJsonFetchResponse<T>(
  body: T,
  status: number = 200,
  headers?: {[header: string]: string | string[] | undefined},
): FetchResponse<T> {
  const allHeaders = {'Content-Type': 'application/json', ...headers};
  return {status, body, headers: allHeaders};
}
