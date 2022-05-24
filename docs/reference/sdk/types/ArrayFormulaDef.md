---
title: "ArrayFormulaDef"
---
# Type alias: ArrayFormulaDef<ParamDefsT, SchemaT\>

Ƭ **ArrayFormulaDef**<`ParamDefsT`, `SchemaT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, [`SchemaType`](SchemaType.md)<[`ArraySchema`](../interfaces/ArraySchema.md)<`SchemaT`\>\>\> & { `items`: `SchemaT` ; `resultType`: [`Array`](../enums/ValueType.md#array)  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns an array.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `SchemaT` | extends [`Schema`](Schema.md) |

#### Defined in

[api.ts:914](https://github.com/coda/packs-sdk/blob/main/api.ts#L914)
