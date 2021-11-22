# Type alias: ObjectPackFormula<ParamDefsT, SchemaT\>

Ƭ **ObjectPackFormula**<`ParamDefsT`, `SchemaT`\>: `Omit`<[`BaseFormula`](BaseFormula.md)<`ParamDefsT`, [`SchemaType`](SchemaType.md)<`SchemaT`\>\>, ``"execute"``\> & { `schema?`: `SchemaT` ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `object` \| `Promise`<`object`\>  }

A pack formula that returns a JavaScript object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `SchemaT` | extends [`Schema`](Schema.md) |

#### Defined in

<<<<<<< HEAD
[api.ts:497](https://github.com/coda/packs-sdk/blob/main/api.ts#L497)
=======
[api.ts:505](https://github.com/coda/packs-sdk/blob/main/api.ts#L505)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
