---
title: FetchRequest
---
# Interface: FetchRequest

An HTTP request used with the [Fetcher](Fetcher.md).

The structure largely follows https://developer.mozilla.org/en-US/docs/Web/API/Request

## Properties

### body

• `Optional` **body**: `string`

The body of the HTTP request, if any.

If you are sending a JSON payload, make sure to call `JSON.stringify()` on the object payload.

#### Defined in

[api_types.ts:405](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L405)

___

### cacheTtlSecs

• `Optional` **cacheTtlSecs**: `number`

A time in seconds that Coda should cache the result of this HTTP request.

Any time that this pack makes the same FetchRequest, a cached value can be returned
instead of making the HTTP request. If left unspecified, Coda will automatically
cache all GET requests for approximately 5 minutes. To disable the default caching,
set this value to `0`.

#### Defined in

[api_types.ts:422](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L422)

___

### disableAuthentication

• `Optional` **disableAuthentication**: `boolean`

If true, Coda will not apply authentication credentials even if this pack is
configured to use authentication. This is very rare, but sometimes you may
wish to make an unauthenticated supporting request as part of a formula implementation.

#### Defined in

[api_types.ts:435](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L435)

___

### form

• `Optional` **form**: `Object`

Key-value form fields, if submitting to an endpoint expecting a URL-encoded form payload.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[api_types.ts:409](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L409)

___

### headers

• `Optional` **headers**: `Object`

HTTP headers. You should NOT include authentication headers, as Coda will add them for you.

#### Index signature

▪ [header: `string`]: `string`

#### Defined in

[api_types.ts:413](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L413)

___

### isBinaryResponse

• `Optional` **isBinaryResponse**: `boolean`

Indicates that you expect the response to be binary data, instructing Coda
not to attempt to parse the response in any way. Otherwise, Coda may attempt
to parse the response as a JSON object. If true, [FetchResponse.body](FetchResponse.md#body)
will be a NodeJS Buffer.

#### Defined in

[api_types.ts:429](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L429)

___

### method

• **method**: ``"GET"`` \| ``"PATCH"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"``

The HTTP method/verb (e.g. GET or POST).

#### Defined in

[api_types.ts:392](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L392)

___

### url

• **url**: `string`

The URL to connect to. This is typically an absolute URL, but if your
pack uses authentication and [requiresEndpointUrl](AWSAccessKeyAuthentication.md#requiresendpointurl) and so has a unique
endpoint per user account, you may also use a relative URL and Coda will
apply the user's endpoint automatically.

#### Defined in

[api_types.ts:399](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L399)
