---
title: "StatusCodeError"
---
# Class: StatusCodeError

[core](../modules/core.md).StatusCodeError

An error that will be thrown by [Fetcher.fetch](../interfaces/core.Fetcher.md#fetch) when the fetcher response has an
HTTP status code of 400 or greater.

This class largely models the `StatusCodeError` from the (now deprecated) `request-promise` library,
which has a quirky structure.

## Hierarchy

- `Error`

  ↳ **`StatusCodeError`**

## Properties

### body

• **body**: `any`

The parsed body of the HTTP response.

#### Defined in

[api.ts:115](https://github.com/coda/packs-sdk/blob/main/api.ts#L115)

___

### error

• **error**: `any`

Alias for [body](core.StatusCodeError.md#body).

#### Defined in

[api.ts:119](https://github.com/coda/packs-sdk/blob/main/api.ts#L119)

___

### name

• **name**: `string` = `'StatusCodeError'`

The name of the error, for identiciation purposes.

#### Overrides

Error.name

#### Defined in

[api.ts:107](https://github.com/coda/packs-sdk/blob/main/api.ts#L107)

___

### options

• **options**: [`FetchRequest`](../interfaces/core.FetchRequest.md)

The original fetcher request used to make this HTTP request.

#### Defined in

[api.ts:123](https://github.com/coda/packs-sdk/blob/main/api.ts#L123)

___

### response

• **response**: [`StatusCodeErrorResponse`](../interfaces/core.StatusCodeErrorResponse.md)

The raw HTTP response, including headers.

#### Defined in

[api.ts:127](https://github.com/coda/packs-sdk/blob/main/api.ts#L127)

___

### statusCode

• **statusCode**: `number`

The HTTP status code, e.g. `404`.

#### Defined in

[api.ts:111](https://github.com/coda/packs-sdk/blob/main/api.ts#L111)
