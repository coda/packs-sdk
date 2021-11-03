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

The body of the HTTP response, parsed as a JavaScript object if the contents were JSON data.

#### Defined in

[api.ts:107](https://github.com/coda/packs-sdk/blob/main/api.ts#L107)

___

### error

• **error**: `any`

Alias for [body](../interfaces/FetchRequest.md#body).

#### Defined in

[api.ts:111](https://github.com/coda/packs-sdk/blob/main/api.ts#L111)

___

### name

• **name**: `string` = `'StatusCodeError'`

The name of the error, for identiciation purposes.

#### Overrides

Error.name

#### Defined in

[api.ts:99](https://github.com/coda/packs-sdk/blob/main/api.ts#L99)

___

### options

• **options**: [`FetchRequest`](../interfaces/FetchRequest.md)

The original fetcher request used to make this HTTP request.

#### Defined in

[api.ts:115](https://github.com/coda/packs-sdk/blob/main/api.ts#L115)

___

### response

• **response**: `StatusCodeErrorResponse`

The raw HTTP response, including headers.

#### Defined in

[api.ts:119](https://github.com/coda/packs-sdk/blob/main/api.ts#L119)

___

### statusCode

• **statusCode**: `number`

The HTTP status code, e.g. `404`.

#### Defined in

[api.ts:103](https://github.com/coda/packs-sdk/blob/main/api.ts#L103)
