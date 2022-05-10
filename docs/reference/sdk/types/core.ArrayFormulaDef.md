---
title: "ArrayFormulaDef"
---
# Type alias: ArrayFormulaDef<ParamDefsT, SchemaT\>

[core](../modules/core.md).ArrayFormulaDef

Ƭ **ArrayFormulaDef**<`ParamDefsT`, `SchemaT`\>: [`BaseFormulaDef`](../interfaces/core.BaseFormulaDef.md)<`ParamDefsT`, [`SchemaType`](core.SchemaType.md)<[`ArraySchema`](../interfaces/core.ArraySchema.md)<`SchemaT`\>\>\> & { `items`: `SchemaT` ; `resultType`: [`Array`](../enums/core.ValueType.md#array)  }

A definition accepted by [makeFormula](../functions/core.makeFormula.md) for a formula that returns an array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `SchemaT` | extends [`Schema`](core.Schema.md) |

#### Defined in

[api.ts:907](https://github.com/coda/packs-sdk/blob/main/api.ts#L907)
