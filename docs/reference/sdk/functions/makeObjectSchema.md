---
title: "makeObjectSchema"
---
# Function: makeObjectSchema

▸ **makeObjectSchema**<`K`, `L`, `T`\>(`schemaDef`): `T` & { `identity?`: [`Identity`](../interfaces/Identity.md) ; `type`: [`Object`](../enums/ValueType.md#object)  }

A wrapper for creating a schema definition for an object value.

It is always recommended to use wrapper functions for creating top-level schema
objects rather than specifying object literals. Wrappers validate your schemas
at creation time, provide better TypeScript type inference, and can reduce
boilerplate.

**`example`**
```
coda.makeObjectSchema({
  id: "email",
  primary: "name",
  properties: {
    email: {type: coda.ValueType.String, required: true},
    name: {type: coda.ValueType.String, required: true},
  },
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `T` | extends `Omit`<[`ObjectSchemaDefinition`](../interfaces/ObjectSchemaDefinition.md)<`K`, `L`\>, ``"type"``\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schemaDef` | `T` & { `type?`: [`Object`](../enums/ValueType.md#object)  } |

#### Returns

`T` & { `identity?`: [`Identity`](../interfaces/Identity.md) ; `type`: [`Object`](../enums/ValueType.md#object)  }

#### Defined in

[schema.ts:1121](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1121)
