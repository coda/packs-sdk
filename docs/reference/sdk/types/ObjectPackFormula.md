---
title: "ObjectPackFormula"
---
# Type alias: ObjectPackFormula<ParamDefsT, SchemaT\>

Ƭ **ObjectPackFormula**<`ParamDefsT`, `SchemaT`\>: `Omit`<[`BaseFormula`](BaseFormula.md)<`ParamDefsT`, [`SchemaType`](SchemaType.md)<`SchemaT`\>\>, ``"execute"``\> & { `schema?`: `SchemaT` ; `execute`: (`params`: [`ParamValues`](ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `object` \| `Promise`<`object`\>  }

A pack formula that returns a JavaScript object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `SchemaT` | extends [`Schema`](Schema.md) |

#### Defined in

[api.ts:568](https://github.com/coda/packs-sdk/blob/main/api.ts#L568)
