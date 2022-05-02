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

[api.ts:114](https://github.com/coda/packs-sdk/blob/main/api.ts#L114)

___

### error

• **error**: `any`

Alias for [body](StatusCodeError.md#body).

#### Defined in

[api.ts:118](https://github.com/coda/packs-sdk/blob/main/api.ts#L118)

___

### name

• **name**: `string` = `'StatusCodeError'`

The name of the error, for identiciation purposes.

#### Overrides

Error.name

#### Defined in

[api.ts:106](https://github.com/coda/packs-sdk/blob/main/api.ts#L106)

___

### options

• **options**: [`FetchRequest`](../interfaces/FetchRequest.md)

The original fetcher request used to make this HTTP request.

#### Defined in

[api.ts:122](https://github.com/coda/packs-sdk/blob/main/api.ts#L122)

___

### response

• **response**: [`StatusCodeErrorResponse`](../interfaces/StatusCodeErrorResponse.md)

The raw HTTP response, including headers.

#### Defined in

[api.ts:126](https://github.com/coda/packs-sdk/blob/main/api.ts#L126)

___

### statusCode

• **statusCode**: `number`

The HTTP status code, e.g. `404`.

#### Defined in

[api.ts:110](https://github.com/coda/packs-sdk/blob/main/api.ts#L110)
