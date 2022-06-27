---
title: "FormulaDefinition"
---
# Type alias: FormulaDefinition<ParamDefsT, ResultT, SchemaT\>

[core](../modules/core.md).FormulaDefinition

Ƭ **FormulaDefinition**<`ParamDefsT`, `ResultT`, `SchemaT`\>: `ResultT` extends [`String`](../enums/core.ValueType.md#string) ? [`StringFormulaDef`](core.StringFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Number`](../enums/core.ValueType.md#number) ? [`NumericFormulaDef`](core.NumericFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Boolean`](../enums/core.ValueType.md#boolean) ? [`BooleanFormulaDef`](core.BooleanFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Array`](../enums/core.ValueType.md#array) ? [`ArrayFormulaDef`](core.ArrayFormulaDef.md)<`ParamDefsT`, `SchemaT`\> : [`ObjectFormulaDef`](core.ObjectFormulaDef.md)<`ParamDefsT`, `SchemaT`\>

A formula definition accepted by [makeFormula](../functions/core.makeFormula.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/core.ValueType.md) |
| `SchemaT` | extends [`Schema`](core.Schema.md) |

#### Defined in

[api.ts:949](https://github.com/coda/packs-sdk/blob/main/api.ts#L949)
