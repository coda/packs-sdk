# Function: makeReferenceSchemaFromObjectSchema

▸ **makeReferenceSchemaFromObjectSchema**(`schema`, `identityName?`): [`GenericObjectSchema`](../types/GenericObjectSchema.md)

Convenience for creating a reference object schema from an existing schema for the
object. Copies over the identity, id, and primary from the schema, and the subset of
properties indicated by the id and primary.
A reference schema can always be defined directly, but if you already have an object
schema it provides better code reuse to derive a reference schema instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`GenericObjectSchema`](../types/GenericObjectSchema.md) |
| `identityName?` | `string` |

#### Returns

[`GenericObjectSchema`](../types/GenericObjectSchema.md)

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[schema.ts:468](https://github.com/coda/packs-sdk/blob/main/schema.ts#L468)
=======
[schema.ts:430](https://github.com/coda/packs-sdk/blob/main/schema.ts#L430)
>>>>>>> 40f7a22 (Tweak our zod validation to complain when invalid property schemas ar eprovided)
=======
[schema.ts:450](https://github.com/coda/packs-sdk/blob/main/schema.ts#L450)
>>>>>>> 46bf97b (fix typing)
