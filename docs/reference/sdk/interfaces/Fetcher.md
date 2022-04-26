---
title: "Fetcher"
---
# Interface: Fetcher

A utility that allows you to make HTTP requests from a pack. The fetcher also
handles applying user authentication credentials to each request, if applicable.

This is only way a pack is able to make HTTP requests, as using other libraries is unsupported.

## Methods

### fetch

▸ **fetch**<`T`\>(`request`): `Promise`<[`FetchResponse`](FetchResponse.md)<`T`\>\>

Makes an HTTP request.

If authentication is used with this pack, the user's secret credentials will be
automatically applied to the request (whether in the HTTP headers, as a URL parameter,
or whatever the authentication type dictates). Your invocation of `fetch()` need not
deal with authentication in any way, Coda will handle that entirely on your behalf.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`FetchRequest`](FetchRequest.md) |

#### Returns

`Promise`<[`FetchResponse`](FetchResponse.md)<`T`\>\>

#### Defined in

[api_types.ts:561](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L561)
