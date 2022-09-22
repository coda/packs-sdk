---
nav: "MockSyncExecutionContext"
---
# Interface: MockSyncExecutionContext

[testing](../modules/testing.md).MockSyncExecutionContext

An object passed to the `execute` function of every formula invocation
with information and utilities for handling the invocation. In particular,
this contains the [Fetcher](core.Fetcher.md), which is used for making HTTP requests.

## Hierarchy

- [`MockExecutionContext`](testing.MockExecutionContext.md)

  ↳ **`MockSyncExecutionContext`**

## Properties

### endpoint

• `Optional` `Readonly` **endpoint**: `string`

The base endpoint URL for the user's account, only if applicable. See
[requiresEndpointUrl](core.BaseAuthentication.md#requiresendpointurl).

If the API URLs are variable based on the user account, you will need this endpoint
to construct URLs to use with the fetcher. Alternatively, you can use relative URLs
(e.g. "/api/entity") and Coda will include the endpoint for you automatically.

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[endpoint](testing.MockExecutionContext.md#endpoint)

#### Defined in

[api_types.ts:692](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L692)

___

### fetcher

• **fetcher**: `Object`

The [Fetcher](core.Fetcher.md) used for making HTTP requests.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fetch` | `SinonStub`<`any`[], `any`\> |

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[fetcher](testing.MockExecutionContext.md#fetcher)

#### Defined in

[testing/mocks.ts:8](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L8)

___

### invocationLocation

• `Readonly` **invocationLocation**: [`InvocationLocation`](core.InvocationLocation.md)

Information about the Coda environment and doc this formula was invoked from.
This is mostly for Coda internal use and we do not recommend relying on it.

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[invocationLocation](testing.MockExecutionContext.md#invocationlocation)

#### Defined in

[api_types.ts:697](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L697)

___

### invocationToken

• `Readonly` **invocationToken**: `string`

A random token scoped to only this request invocation.
This is a unique identifier for the invocation, and in particular used with
[Custom](../enums/core.AuthenticationType.md#custom) for naming template parameters that will be
replaced by the fetcher in secure way.

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[invocationToken](testing.MockExecutionContext.md#invocationtoken)

#### Defined in

[api_types.ts:708](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L708)

___

### sync

• `Readonly` **sync**: [`Sync`](core.Sync.md)

Information about state of the current sync. Only populated if this is a sync table formula.

#### Overrides

[MockExecutionContext](testing.MockExecutionContext.md).[sync](testing.MockExecutionContext.md#sync)

#### Defined in

[testing/mocks.ts:18](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L18)

___

### temporaryBlobStorage

• **temporaryBlobStorage**: `Object`

A utility to fetch and store files and images that either require the pack user's authentication
or are too large to return inline. See [TemporaryBlobStorage](core.TemporaryBlobStorage.md).

#### Type declaration

| Name | Type |
| :------ | :------ |
| `storeBlob` | `SinonStub`<`any`[], `any`\> |
| `storeUrl` | `SinonStub`<`any`[], `any`\> |

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[temporaryBlobStorage](testing.MockExecutionContext.md#temporaryblobstorage)

#### Defined in

[testing/mocks.ts:11](https://github.com/coda/packs-sdk/blob/main/testing/mocks.ts#L11)

___

### timezone

• `Readonly` **timezone**: `string`

The timezone of the doc from which this formula was invoked.

#### Inherited from

[MockExecutionContext](testing.MockExecutionContext.md).[timezone](testing.MockExecutionContext.md#timezone)

#### Defined in

[api_types.ts:701](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L701)
