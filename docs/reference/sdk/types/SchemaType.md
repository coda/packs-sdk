---
title: "SchemaType"
---
# Type alias: SchemaType<T\>

Ƭ **SchemaType**<`T`\>: `T` extends [`BooleanSchema`](../interfaces/BooleanSchema.md) ? `boolean` : `T` extends [`NumberSchema`](NumberSchema.md) ? `number` : `T` extends [`StringSchema`](StringSchema.md) ? `StringHintTypeToSchemaType`<`T`[``"codaType"``]\> : `T` extends [`ArraySchema`](../interfaces/ArraySchema.md) ? [`SchemaType`](SchemaType.md)<`T`[``"items"``]\>[] : `T` extends `GenericObjectSchema` ? `ObjectSchemaType`<`T`\> : `never`

A TypeScript helper that parses the expected `execute` function return type from a given schema.
That is, given a schema, this utility will produce the type that an `execute` function should return
in order to fulfill the schema.

For example, `SchemaType<NumberSchema>` produces the type `number`.

For an object schema, this will for the most part return an object matching the schema
but if the schema uses [fromKey](../interfaces/ObjectSchemaProperty.md#fromkey) then this utility will be unable to infer
that the return value type should use the property names given in the `fromKey`
attribute, and will simply relax any property name type-checking in such a case.

This utility is very optional and only useful for advanced cases of strong typing.
It can be helpful for adding type-checking for the return value of an `execute` function
to ensure that it matches the schema you have declared for that formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](Schema.md) |

#### Defined in

[schema.ts:1027](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1027)
