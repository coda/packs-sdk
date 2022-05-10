---
title: "MockSyncExecutionContext"
---
# Interface: MockSyncExecutionContext

## Hierarchy

- [`MockExecutionContext`](MockExecutionContext.md)

  ↳ **`MockSyncExecutionContext`**

## Properties

### endpoint

• `Optional` `Readonly` **endpoint**: `string`

The base endpoint URL for the user's account, only if applicable. See {@link requiresEndpointUrl}.

If the API URLs are variable based on the user account, you will need this endpoint
to construct URLs to use with the fetcher. Alternatively, you can use relative URLs
(e.g. "/api/entity") and Coda will include the endpoint for you automatically.

#### Inherited from

[MockExecutionContext](MockExecutionContext.md).[endpoint](MockExecutionContext.md#endpoint)

#### Defined in

[api_types.ts:687](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L687)

___

### fetcher

• **fetcher**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fetch` | `SinonStub`<`any`[], `any`\> |

#### Inherited from

[MockExecutionContext](MockExecutionContext.md).[fetcher](MockExecutionContext.md#fetcher)

#### Defined in

[testing/mocks.ts:8](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L8)

___

### invocationLocation

• `Readonly` **invocationLocation**: `InvocationLocation`

Information about the Coda environment and doc this formula was invoked from.
This is mostly for Coda internal use and we do not recommend relying on it.

#### Inherited from

[MockExecutionContext](MockExecutionContext.md).[invocationLocation](MockExecutionContext.md#invocationlocation)

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

[MockExecutionContext](MockExecutionContext.md).[invocationToken](MockExecutionContext.md#invocationtoken)

#### Defined in

[api_types.ts:703](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L703)

___

### sync

• `Readonly` **sync**: `Sync`

Information about state of the current sync. Only populated if this is a sync table formula.

#### Overrides

[MockExecutionContext](MockExecutionContext.md).[sync](MockExecutionContext.md#sync)

#### Defined in

[testing/mocks.ts:18](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L18)

___

### temporaryBlobStorage

• **temporaryBlobStorage**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `storeBlob` | `SinonStub`<`any`[], `any`\> |
| `storeUrl` | `SinonStub`<`any`[], `any`\> |

#### Inherited from

[MockExecutionContext](MockExecutionContext.md).[temporaryBlobStorage](MockExecutionContext.md#temporaryblobstorage)

#### Defined in

[testing/mocks.ts:11](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L11)

___

### timezone

• `Readonly` **timezone**: `string`

The timezone of the doc from which this formula was invoked.

#### Inherited from

[MockExecutionContext](MockExecutionContext.md).[timezone](MockExecutionContext.md#timezone)

#### Defined in

[api_types.ts:696](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L696)
