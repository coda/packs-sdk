---
title: "MockExecutionContext"
---
# Interface: MockExecutionContext

## Hierarchy

- `ExecutionContext`

  ↳ **`MockExecutionContext`**

  ↳↳ [`MockSyncExecutionContext`](MockSyncExecutionContext.md)

## Properties

### endpoint

• `Optional` `Readonly` **endpoint**: `string`

The base endpoint URL for the user's account, only if applicable. See {@link requiresEndpointUrl}.

If the API URLs are variable based on the user account, you will need this endpoint
to construct URLs to use with the fetcher. Alternatively, you can use relative URLs
(e.g. "/api/entity") and Coda will include the endpoint for you automatically.

#### Inherited from

ExecutionContext.endpoint

#### Defined in

[api_types.ts:687](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L687)

___

### fetcher

• **fetcher**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fetch` | `SinonStub`<`any`[], `any`\> |

#### Overrides

ExecutionContext.fetcher

#### Defined in

[testing/mocks.ts:8](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L8)

___

### invocationLocation

• `Readonly` **invocationLocation**: `InvocationLocation`

Information about the Coda environment and doc this formula was invoked from.
This is mostly for Coda internal use and we do not recommend relying on it.

#### Inherited from

ExecutionContext.invocationLocation

#### Defined in

[api_types.ts:692](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L692)

___

### invocationToken

• `Readonly` **invocationToken**: `string`

A random token scoped to only this request invocation.
This is a unique identifier for the invocation, and in particular used with
{@link AuthenticationType.Custom} for naming template parameters that will be
replaced by the fetcher in secure way.

#### Inherited from

ExecutionContext.invocationToken

#### Defined in

[api_types.ts:703](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L703)

___

### sync

• `Optional` `Readonly` **sync**: `Sync`

Information about state of the current sync. Only populated if this is a sync table formula.

#### Inherited from

ExecutionContext.sync

#### Defined in

[api_types.ts:707](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L707)

___

### temporaryBlobStorage

• **temporaryBlobStorage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `storeBlob` | `SinonStub`<`any`[], `any`\> |
| `storeUrl` | `SinonStub`<`any`[], `any`\> |

#### Overrides

ExecutionContext.temporaryBlobStorage

#### Defined in

[testing/mocks.ts:11](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L11)

___

### timezone

• `Readonly` **timezone**: `string`

The timezone of the doc from which this formula was invoked.

#### Inherited from

ExecutionContext.timezone

#### Defined in

[api_types.ts:696](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L696)
