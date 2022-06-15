---
title: "makeReferenceSchemaFromObjectSchema"
---
# Function: makeReferenceSchemaFromObjectSchema

[core](../modules/core.md).makeReferenceSchemaFromObjectSchema

▸ **makeReferenceSchemaFromObjectSchema**(`schema`, `identityName?`): `GenericObjectSchema`

Convenience for creating a reference object schema from an existing schema for the
object. Copies over the identity, idProperty, and displayProperty from the schema,
 and the subset of properties indicated by the idProperty and displayProperty.
A reference schema can always be defined directly, but if you already have an object
schema it provides better code reuse to derive a reference schema instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `GenericObjectSchema` |
| `identityName?` | `string` |

#### Returns

`GenericObjectSchema`

#### Defined in

[schema.ts:1245](https://github.com/coda/packs-sdk/blob/main/schema.ts#L1245)
