---
title: "ResponseHandlerTemplate"
---
# Interface: ResponseHandlerTemplate<T\>

[core](../modules/core.md).ResponseHandlerTemplate

Configuration for how to handle the response for a code-free formula definition
created using [makeTranslateObjectFormula](../functions/core.makeTranslateObjectFormula.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/core.Schema.md) |

## Properties

### projectKey

• `Optional` **projectKey**: `string`

The key in the response body that indicates the objects of interest.

Sometimes the response body is itself an array of objects, allowing you
to return the body as-is, but more commonly, the response body is
an object where one of its properties is the array of objects of interest,
with other properties containing metadata about the response.

This allows you to specify a response property name to "project" out
the relevant part of the response body.

For example, suppose the response body looks like:
```
{
  items: [{name: "Alice"}, {name: "Bob"}],
  nextPageUrl: "/users?page=2",
}
```

You would set `projectKey: "items"` and the generated formula implementation
will return `response.body.items`.

#### Defined in

[handler_templates.ts:141](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L141)

___

### schema

• `Optional` **schema**: `T`

The schema of the objects being returned.

#### Defined in

[handler_templates.ts:118](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L118)

## Methods

### onError

▸ `Optional` **onError**(`error`): `any`

If specified, will catch HTTP errors and call this function with the error,
instead of letting them throw and the formula failing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Returns

`any`

#### Defined in

[handler_templates.ts:146](https://github.com/coda/packs-sdk/blob/main/handler_templates.ts#L146)
