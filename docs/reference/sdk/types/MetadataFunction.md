# Type alias: MetadataFunction

Ƭ **MetadataFunction**: <K, L\>(`context`: [`ExecutionContext`](../interfaces/ExecutionContext.md), `search`: `string`, `formulaContext?`: [`MetadataContext`](MetadataContext.md)) => `Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`K`, `L`\>\>

#### Type declaration

▸ <`K`, `L`\>(`context`, `search`, `formulaContext?`): `Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`K`, `L`\>\>

A JavaScript function that can implement a [MetadataFormulaDef](MetadataFormulaDef.md).

##### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](../interfaces/ExecutionContext.md) |
| `search` | `string` |
| `formulaContext?` | [`MetadataContext`](MetadataContext.md) |

##### Returns

`Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`K`, `L`\>\>

#### Defined in

[api.ts:961](https://github.com/coda/packs-sdk/blob/main/api.ts#L961)
