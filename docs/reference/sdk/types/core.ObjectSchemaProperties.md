---
title: "ObjectSchemaProperties"
---
# Type alias: ObjectSchemaProperties<K\>

[core](../modules/core.md).ObjectSchemaProperties

Ƭ **ObjectSchemaProperties**<`K`\>: { [K2 in K \| string]: Schema & ObjectSchemaProperty }

The type of the [properties](../interfaces/core.ObjectSchemaDefinition.md#properties) in the definition of an object schema.
This is essentially a dictionary mapping the name of a property to a schema
definition for that property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` = `never` |

#### Defined in

[schema.ts:744](https://github.com/coda/packs-sdk/blob/main/schema.ts#L744)
