---
title: "StatusCodeErrorResponse"
---
# Interface: StatusCodeErrorResponse

The raw HTTP response from a [StatusCodeError](../classes/StatusCodeError.md).

## Properties

### body

• `Optional` **body**: `any`

The raw body of the HTTP error response.

#### Defined in

[api.ts:86](https://github.com/coda/packs-sdk/blob/main/api.ts#L86)

___

### headers

• `Optional` **headers**: `Object`

The headers from the HTTP error response. Many header values are redacted by Coda.

#### Index signature

▪ [key: `string`]: `string` \| `string`[] \| `undefined`

#### Defined in

[api.ts:88](https://github.com/coda/packs-sdk/blob/main/api.ts#L88)
