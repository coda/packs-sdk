---
title: "ObjectFormulaDef"
---
# Type alias: ObjectFormulaDef<ParamDefsT, SchemaT\>

Ƭ **ObjectFormulaDef**<`ParamDefsT`, `SchemaT`\>: [`BaseFormulaDef`](../interfaces/BaseFormulaDef.md)<`ParamDefsT`, [`SchemaType`](SchemaType.md)<`SchemaT`\>\> & { `resultType`: [`Object`](../enums/ValueType.md#object) ; `schema`: `SchemaT`  }

A definition accepted by [makeFormula](../functions/makeFormula.md) for a formula that returns an object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `SchemaT` | extends [`Schema`](Schema.md) |

#### Defined in

[api.ts:925](https://github.com/coda/packs-sdk/blob/main/api.ts#L925)
