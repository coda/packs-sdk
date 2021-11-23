# Type alias: MetadataFunction<ResultT\>

Ƭ **MetadataFunction**<`ResultT`\>: (`context`: [`ExecutionContext`](../interfaces/ExecutionContext.md), `search`: `string`, `formulaContext?`: [`MetadataContext`](MetadataContext.md)) => `Promise`<`ResultT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ResultT` | extends [`MetadataFunctionResultType`](MetadataFunctionResultType.md) |

#### Type declaration

▸ (`context`, `search`, `formulaContext?`): `Promise`<`ResultT`\>

A JavaScript function that can implement a [MetadataFormulaDef](MetadataFormulaDef.md).

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`ExecutionContext`](../interfaces/ExecutionContext.md) |
| `search` | `string` |
| `formulaContext?` | [`MetadataContext`](MetadataContext.md) |

##### Returns

`Promise`<`ResultT`\>

#### Defined in

[api.ts:984](https://github.com/coda/packs-sdk/blob/main/api.ts#L984)
