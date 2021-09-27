# Type alias: SchemaType<T\>

Ƭ **SchemaType**<`T`\>: `T` extends [`BooleanSchema`](../interfaces/BooleanSchema.md) ? `boolean` : `T` extends [`NumberSchema`](NumberSchema.md) ? `number` : `T` extends [`StringSchema`](../interfaces/StringSchema.md) ? `StringHintTypeToSchemaType`<`T`[``"codaType"``]\> : `T` extends [`ArraySchema`](../interfaces/ArraySchema.md) ? [`SchemaType`](SchemaType.md)<`T`[``"items"``]\>[] : `T` extends [`GenericObjectSchema`](GenericObjectSchema.md) ? `ObjectSchemaType`<`T`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](Schema.md) |

#### Defined in

<<<<<<< HEAD
[schema.ts:318](https://github.com/coda/packs-sdk/blob/main/schema.ts#L318)
=======
[schema.ts:278](https://github.com/coda/packs-sdk/blob/main/schema.ts#L278)
>>>>>>> 40f7a22 (Tweak our zod validation to complain when invalid property schemas ar eprovided)
