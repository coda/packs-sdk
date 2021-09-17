StatusCodeError is a simple version of StatusCodeError in request-promise to keep backwards compatibility.
This tries to replicate its exact structure, massaging as necessary to handle the various transforms
in our stack.

https://github.com/request/promise-core/blob/master/lib/errors.js#L22

## Hierarchy

- `Error`

  ↳ **`StatusCodeError`**

## Constructors

### constructor

• **new StatusCodeError**(`statusCode`, `body`, `options`, `response`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `statusCode` | `number` |
| `body` | `any` |
| `options` | [`FetchRequest`](../interfaces/FetchRequest.md) |
| `response` | `StatusCodeErrorResponse` |

#### Overrides

Error.constructor

#### Defined in

[api.ts:84](https://github.com/coda/packs-sdk/blob/main/api.ts#L84)

## Properties

### body

• **body**: `any`

#### Defined in

[api.ts:79](https://github.com/coda/packs-sdk/blob/main/api.ts#L79)

___

### error

• **error**: `any`

#### Defined in

[api.ts:80](https://github.com/coda/packs-sdk/blob/main/api.ts#L80)

___

### name

• **name**: `string` = `'StatusCodeError'`

#### Overrides

Error.name

#### Defined in

[api.ts:77](https://github.com/coda/packs-sdk/blob/main/api.ts#L77)

___

### options

• **options**: [`FetchRequest`](../interfaces/FetchRequest.md)

#### Defined in

[api.ts:81](https://github.com/coda/packs-sdk/blob/main/api.ts#L81)

___

### response

• **response**: `StatusCodeErrorResponse`

#### Defined in

[api.ts:82](https://github.com/coda/packs-sdk/blob/main/api.ts#L82)

___

### statusCode

• **statusCode**: `number`

#### Defined in

[api.ts:78](https://github.com/coda/packs-sdk/blob/main/api.ts#L78)
