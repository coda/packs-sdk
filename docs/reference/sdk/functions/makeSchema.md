---
title: "makeSchema"
---
# Function: makeSchema

▸ **makeSchema**<`T`\>(`schema`): `T`

A wrapper for creating any schema definition.

If you are creating a schema for an object (as opposed to a scalar or array),
use the more specific [makeObjectSchema](makeObjectSchema.md).

It is always recommended to use wrapper functions for creating top-level schema
objects rather than specifying object literals. Wrappers validate your schemas
at creation time, provide better TypeScript type inference, and can reduce
boilerplate.

At this time, this wrapper provides only better TypeScript type inference,
but it may do validation in a future SDK version.

**`example`**
```
coda.makeSchema({
  type: coda.ValueType.Array,
  items: {type: coda.ValueType.String},
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:1100](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1100)
