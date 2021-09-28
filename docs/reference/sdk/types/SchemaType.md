# Type alias: SchemaType<T\>

Ƭ **SchemaType**<`T`\>: `T` extends [`BooleanSchema`](../interfaces/BooleanSchema.md) ? `boolean` : `T` extends [`NumberSchema`](../interfaces/NumberSchema.md) ? `number` : `T` extends [`StringSchema`](../interfaces/StringSchema.md) ? `StringHintTypeToSchemaType`<`T`[``"codaType"``]\> : `T` extends [`ArraySchema`](../interfaces/ArraySchema.md) ? [`SchemaType`](SchemaType.md)<`T`[``"items"``]\>[] : `T` extends [`GenericObjectSchema`](GenericObjectSchema.md) ? `PickOptional`<{ [K in keyof T["properties"]]: SchemaType<T["properties"][K]\> }, `$Values`<{ [K in keyof T["properties"]]: T["properties"][K] extends Object ? K : never }\>\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](Schema.md) |

#### Defined in

[schema.ts:276](https://github.com/coda/packs-sdk/blob/main/schema.ts#L276)
