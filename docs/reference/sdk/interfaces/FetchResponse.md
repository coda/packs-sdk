---
title: "FetchResponse"
---
# Interface: FetchResponse<T\>

The response of a call to [Fetcher.fetch](Fetcher.md#fetch).

The structure largely follows https://developer.mozilla.org/en-US/docs/Web/API/Response

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any` = `any` |

## Properties

### body

• `Optional` **body**: `T`

The body of the response.

If the response contains JSON data, either because the Content-Type header is application/json
or if the data is JSON-parseable, this will be a parsed JavaScript object.
Similarly, if the response headers are text/xml or application/xml, this will be a parsed
JavaScript object using the `xml2js` library.

If implicit parsing is undesirable, you may consider using [isBinaryResponse](FetchRequest.md#isbinaryresponse) on the request
to disable any parsing. Note however that this will result in the body being a NodeJS Buffer.

#### Defined in

[api_types.ts:539](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L539)

___

### headers

• **headers**: `Object`

HTTP response headers. The contents of many headers will be redacted for security reasons.

#### Index signature

▪ [header: `string`]: `string` \| `string`[] \| `undefined`

#### Defined in

[api_types.ts:543](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L543)

___

### status

• **status**: `number`

The HTTP status code, e.g. `200`.

#### Defined in

[api_types.ts:527](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L527)
