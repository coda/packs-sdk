---
title: "ObjectPackFormula"
---
# Type alias: ObjectPackFormula<ParamDefsT, SchemaT\>

[core](../modules/core.md).ObjectPackFormula

Ƭ **ObjectPackFormula**<`ParamDefsT`, `SchemaT`\>: `Omit`<[`BaseFormula`](core.BaseFormula.md)<`ParamDefsT`, [`SchemaType`](core.SchemaType.md)<`SchemaT`\>\>, ``"execute"``\> & { `schema?`: `SchemaT` ; `execute`: (`params`: [`ParamValues`](core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `object` \| `Promise`<`object`\>  }

A pack formula that returns a JavaScript object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `SchemaT` | extends [`Schema`](core.Schema.md) |

#### Defined in

[api.ts:621](https://github.com/coda/packs-sdk/blob/main/api.ts#L621)
