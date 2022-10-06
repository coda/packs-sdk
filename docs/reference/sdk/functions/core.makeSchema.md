---
nav: "makeSchema"
---
# Function: makeSchema

[core](../modules/core.md).makeSchema

▸ **makeSchema**<`T`\>(`schema`): `T`

A wrapper for creating any schema definition.

If you are creating a schema for an object (as opposed to a scalar or array),
use the more specific [makeObjectSchema](core.makeObjectSchema.md).

It is always recommended to use wrapper functions for creating top-level schema
objects rather than specifying object literals. Wrappers validate your schemas
at creation time, provide better TypeScript type inference, and can reduce
boilerplate.

At this time, this wrapper provides only better TypeScript type inference,
but it may do validation in a future SDK version.

**`Example`**

```
coda.makeSchema({
  type: coda.ValueType.Array,
  items: {type: coda.ValueType.String},
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/core.Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:1265](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1265)
