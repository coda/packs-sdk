---
title: "StatusCodeErrorResponse"
---
# Interface: StatusCodeErrorResponse

[core](../modules/core.md).StatusCodeErrorResponse

The raw HTTP response from a [StatusCodeError](../classes/core.StatusCodeError.md).

## Properties

### body

• `Optional` **body**: `any`

The raw body of the HTTP error response.

#### Defined in

[api.ts:87](https://github.com/coda/packs-sdk/blob/main/api.ts#L87)

___

### headers

• `Optional` **headers**: `Object`

The headers from the HTTP error response. Many header values are redacted by Coda.

#### Index signature

▪ [key: `string`]: `string` \| `string`[] \| `undefined`

#### Defined in

[api.ts:89](https://github.com/coda/packs-sdk/blob/main/api.ts#L89)
