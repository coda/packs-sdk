# Type alias: MetadataFunction

[core](../modules/core.md).MetadataFunction

Ƭ **MetadataFunction**: (`context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md), `search`: `string`, `formulaContext?`: [`MetadataContext`](core.MetadataContext.md)) => `Promise`<[`MetadataFormulaResultType`](core.MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](core.MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/core.ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

#### Type declaration

▸ (`context`, `search`, `formulaContext?`): `Promise`<[`MetadataFormulaResultType`](core.MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](core.MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/core.ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

A JavaScript function that can implement a [MetadataFormulaDef](core.MetadataFormulaDef.md).

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](../interfaces/core.ExecutionContext.md) |
| `search` | `string` |
| `formulaContext?` | [`MetadataContext`](core.MetadataContext.md) |

##### Returns

`Promise`<[`MetadataFormulaResultType`](core.MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](core.MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/core.ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

#### Defined in

[api.ts:1100](https://github.com/coda/packs-sdk/blob/main/api.ts#L1100)
