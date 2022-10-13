# Interface: RequestHandlerTemplate

[core](../modules/core.md).RequestHandlerTemplate

Configuration for how to construct an HTTP request for a code-free formula definition
created using [makeTranslateObjectFormula](../functions/core.makeTranslateObjectFormula.md).

**`Example`**

```
coda.makeTranslateObjectFormula({
  name: "FetchWidget",
  description: "Fetches a widget.",
  parameters: [
    coda.makeParameter({type: coda.ParameterType.String, name: "id"}),
    coda.makeParameter({type: coda.ParameterType.String, name: "outputFormat"}),
  ],
  request: {
    method: "GET",
    url: "https://example.com/api/widgets/{id}",
    nameMapping: {outputFormat: "format"},
    transforms: {
      format: function(value) {
        return value.toLowerCase();
      },
    },
    queryParams: ["format"],
  },
});
```

If the user calls this formula as `FetchWidget("abc123", "JSON")`, this will make a `GET` request to
`https://example.com/api/widgets/abc123?format=json`.

## Properties

### bodyParams

• `Optional` **bodyParams**: `string`[]

The names of parameters that should be included in the request body, if applicable.

That is, if some of the formula parameters should go into the URL and others should go into the body,
specify the subset of parameters here that should go into the body. If all of the formula parameters
should go into the body, list all of the parameter names here.

These are the mapped names if you are using [nameMapping](core.RequestHandlerTemplate.md#namemapping).

#### Defined in

[handler_templates.ts:109](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L109)

___

### bodyTemplate

• `Optional` **bodyTemplate**: `object`

A base JavaScript object to be used as the body payload. Any parameters named in [bodyParams](core.RequestHandlerTemplate.md#bodyparams)
will be merged into this object, and the resulting object will be stringified and sent as the body.

#### Defined in

[handler_templates.ts:99](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L99)

___

### headers

• `Optional` **headers**: `Object`

Any HTTP headers to include in the request.

#### Index signature

▪ [header: `string`]: `string`

#### Defined in

[handler_templates.ts:63](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L63)

___

### method

• **method**: ``"GET"`` \| ``"PATCH"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"HEAD"``

The HTTP method (verb) to use, e.g. "GET".

If making a POST request or any request that uses a body payload, the body is
assumed to be JSON.

#### Defined in

[handler_templates.ts:61](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L61)

___

### nameMapping

• `Optional` **nameMapping**: `Object`

An optional mapping from the name of a formula parameter to the name of a URL parameter
or template substitution variable in the body or URL path.

Fetcher requests are constructed by inserting the user's parameter values into the URL
or body. You may use the formula parameter names to in your insertion templates or
as URL parameter names, but you may also use this mapping to rename the formula
parameters, if you wish to refer to them differently in your implementation
than how you present them to users.

#### Index signature

▪ [functionParamName: `string`]: `string`

#### Defined in

[handler_templates.ts:74](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L74)

___

### queryParams

• `Optional` **queryParams**: `string`[]

The names of parameters that should be included in the request URL.

That is, if some of the formula parameters should go into the URL and others should go into the body,
specify the subset of parameters here that should go into the URL. If all of the formula parameters
should become URL parameters, list all of the parameter names here.

These are the mapped names if you are using [nameMapping](core.RequestHandlerTemplate.md#namemapping).

#### Defined in

[handler_templates.ts:94](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L94)

___

### transforms

• `Optional` **transforms**: `Object`

Optional transformations to apply to formula parameters. By default formula parameters
are passed through as-is to wherever you indicate in the fetcher request. However, if
you wish to tweak their values before constructing the request, you can apply transformations here.
The key is the name of the field, which is either the name of the formula parameter, or
the mapped name for that parameter if you specified a [nameMapping](core.RequestHandlerTemplate.md#namemapping).
The value is a JavaScript function that takes a user-provided parameter value and returns the value
that should be used in the request.

#### Index signature

▪ [name: `string`]: (`val`: `any`) => `any`

#### Defined in

[handler_templates.ts:84](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L84)

___

### url

• **url**: `string`

The URL to fetch.

The path of the URL can include strong formatting directives that can be replaced with
formula parameters, e.g. "https://example.com/api/{name}".

#### Defined in

[handler_templates.ts:54](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L54)
