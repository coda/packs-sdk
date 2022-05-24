---
title: "MetadataFunction"
---
# Type alias: MetadataFunction

Ƭ **MetadataFunction**: (`context`: [`ExecutionContext`](../interfaces/ExecutionContext.md), `search`: `string`, `formulaContext?`: [`MetadataContext`](MetadataContext.md)) => `Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

#### Type declaration

▸ (`context`, `search`, `formulaContext?`): `Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

A JavaScript function that can implement a [MetadataFormulaDef](MetadataFormulaDef.md).

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](../interfaces/ExecutionContext.md) |
| `search` | `string` |
| `formulaContext?` | [`MetadataContext`](MetadataContext.md) |

##### Returns

`Promise`<[`MetadataFormulaResultType`](MetadataFormulaResultType.md) \| [`MetadataFormulaResultType`](MetadataFormulaResultType.md)[] \| [`ArraySchema`](../interfaces/ArraySchema.md) \| `ObjectSchema`<`any`, `any`\>\>

#### Defined in

[api.ts:1041](https://github.com/coda/packs-sdk/blob/main/api.ts#L1041)
