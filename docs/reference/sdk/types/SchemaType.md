# Type alias: SchemaType<T\>

Ƭ **SchemaType**<`T`\>: `T` extends [`BooleanSchema`](../interfaces/BooleanSchema.md) ? `boolean` : `T` extends [`NumberSchema`](NumberSchema.md) ? `number` : `T` extends [`StringSchema`](StringSchema.md) ? `StringHintTypeToSchemaType`<`T`[``"codaType"``]\> : `T` extends [`ArraySchema`](../interfaces/ArraySchema.md) ? [`SchemaType`](SchemaType.md)<`T`[``"items"``]\>[] : `T` extends [`GenericObjectSchema`](GenericObjectSchema.md) ? `ObjectSchemaType`<`T`\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](Schema.md) |

#### Defined in

[schema.ts:678](https://github.com/coda/packs-sdk/blob/main/schema.ts#L678)
