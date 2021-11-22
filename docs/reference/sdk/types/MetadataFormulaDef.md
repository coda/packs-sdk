# Type alias: MetadataFormulaDef<ResultT\>

Ƭ **MetadataFormulaDef**<`ResultT`\>: [`MetadataFormula`](MetadataFormula.md)<`MetadataFunctionReturnTypeFromDef`<`ResultT`\>\> \| [`MetadataFunction`](MetadataFunction.md)<`MetadataFunctionReturnTypeFromDef`<`ResultT`\>\>

The type of values that will be accepted as a metadata formula definition. This can either
be the JavaScript function that implements a metadata formula (strongly recommended)
or a full metadata formula definition (mostly supported for legacy code).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ResultT` | extends `MetadataFunctionReturnTypeDef`<`any`, `any`\> |

#### Defined in

[api.ts:1050](https://github.com/coda/packs-sdk/blob/main/api.ts#L1050)
