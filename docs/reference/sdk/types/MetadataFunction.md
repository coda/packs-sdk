# Type alias: MetadataFunction<K, L, ResultT\>

Ƭ **MetadataFunction**<`K`, `L`, `ResultT`\>: (`context`: [`ExecutionContext`](../interfaces/ExecutionContext.md), `search`: `string`, `formulaContext?`: [`MetadataContext`](MetadataContext.md)) => `Promise`<`ResultT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` = `string` |
| `L` | extends `string` = `string` |
| `ResultT` | extends `MetadataFunctionReturnType`<`K`, `L`\> = `MetadataFunctionReturnType`<`K`, `L`\> |

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

<<<<<<< HEAD
[api.ts:971](https://github.com/coda/packs-sdk/blob/main/api.ts#L971)
=======
[api.ts:988](https://github.com/coda/packs-sdk/blob/main/api.ts#L988)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
