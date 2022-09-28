---
nav: "FetchRequest"
---
# Interface: FetchRequest

[core](../modules/core.md).FetchRequest

An HTTP request used with the [Fetcher](core.Fetcher.md).

The structure largely follows https://developer.mozilla.org/en-US/docs/Web/API/Request

## Properties

### body

• `Optional` **body**: `string` \| `Buffer`

The body of the HTTP request, if any.

If you are sending a JSON payload, make sure to call `JSON.stringify()` on the object payload.

#### Defined in

[api_types.ts:498](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L498)

___

### cacheTtlSecs

• `Optional` **cacheTtlSecs**: `number`

A time in seconds that Coda should cache the result of this HTTP request.

Any time that this pack makes the same FetchRequest, a cached value can be returned
instead of making the HTTP request. If left unspecified, Coda will automatically
cache all GET requests for approximately 5 minutes. To disable the default caching,
set this value to `0`.

#### Defined in

[api_types.ts:515](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L515)

___

### disableAuthentication

• `Optional` **disableAuthentication**: `boolean`

If true, Coda will not apply authentication credentials even if this pack is
configured to use authentication. This is very rare, but sometimes you may
wish to make an unauthenticated supporting request as part of a formula implementation.

#### Defined in

[api_types.ts:528](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L528)

___

### form

• `Optional` **form**: `Object`

Key-value form fields, if submitting to an endpoint expecting a URL-encoded form payload.

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[api_types.ts:502](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L502)

___

### headers

• `Optional` **headers**: `Object`

HTTP headers. You should NOT include authentication headers, as Coda will add them for you.

#### Index signature

▪ [header: `string`]: `string`

#### Defined in

[api_types.ts:506](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L506)

___

### isBinaryResponse

• `Optional` **isBinaryResponse**: `boolean`

Indicates that you expect the response to be binary data, instructing Coda
not to attempt to parse the response in any way. Otherwise, Coda may attempt
to parse the response as a JSON object. If true, [body](core.FetchResponse.md#body)
will be a NodeJS Buffer.

#### Defined in

[api_types.ts:522](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L522)

___

### method

• **method**: ``"GET"`` \| ``"PATCH"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"HEAD"``

The HTTP method/verb (e.g. GET or POST).

#### Defined in

[api_types.ts:485](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L485)

___

### url

• **url**: `string`

The URL to connect to. This is typically an absolute URL, but if your
pack uses authentication and [requiresEndpointUrl](core.BaseAuthentication.md#requiresendpointurl) and so has a unique
endpoint per user account, you may also use a relative URL and Coda will
apply the user's endpoint automatically.

#### Defined in

[api_types.ts:492](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L492)
