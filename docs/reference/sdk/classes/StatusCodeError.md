---
title: "StatusCodeError"
---
# Class: StatusCodeError

An error that will be thrown by [Fetcher.fetch](../interfaces/Fetcher.md#fetch) when the fetcher response has an
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

[api.ts:116](https://github.com/coda/packs-sdk/blob/main/api.ts#L116)

___

### error

• **error**: `any`

Alias for [body](StatusCodeError.md#body).

#### Defined in

[api.ts:120](https://github.com/coda/packs-sdk/blob/main/api.ts#L120)

___

### name

• **name**: `string` = `'StatusCodeError'`

The name of the error, for identiciation purposes.

#### Overrides

Error.name

#### Defined in

[api.ts:108](https://github.com/coda/packs-sdk/blob/main/api.ts#L108)

___

### options

• **options**: [`FetchRequest`](../interfaces/FetchRequest.md)

The original fetcher request used to make this HTTP request.

#### Defined in

[api.ts:124](https://github.com/coda/packs-sdk/blob/main/api.ts#L124)

___

### response

• **response**: [`StatusCodeErrorResponse`](../interfaces/StatusCodeErrorResponse.md)

The raw HTTP response, including headers.

#### Defined in

[api.ts:128](https://github.com/coda/packs-sdk/blob/main/api.ts#L128)

___

### statusCode

• **statusCode**: `number`

The HTTP status code, e.g. `404`.

#### Defined in

[api.ts:112](https://github.com/coda/packs-sdk/blob/main/api.ts#L112)
