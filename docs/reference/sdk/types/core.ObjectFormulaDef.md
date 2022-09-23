---
title: "ObjectFormulaDef"
---
# Type alias: ObjectFormulaDef<ParamDefsT, SchemaT\>

[core](../modules/core.md).ObjectFormulaDef

Ƭ **ObjectFormulaDef**<`ParamDefsT`, `SchemaT`\>: [`BaseFormulaDef`](../interfaces/core.BaseFormulaDef.md)<`ParamDefsT`, [`SchemaType`](core.SchemaType.md)<`SchemaT`\>\> & { `resultType`: [`Object`](../enums/core.ValueType.md#object) ; `schema`: `SchemaT`  }

A definition accepted by [makeFormula](../functions/core.makeFormula.md) for a formula that returns an object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `SchemaT` | extends [`Schema`](core.Schema.md) |

#### Defined in

[api.ts:998](https://github.com/coda/packs-sdk/blob/main/api.ts#L998)
