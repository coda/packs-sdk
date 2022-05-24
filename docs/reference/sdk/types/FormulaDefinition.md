---
title: "FormulaDefinition"
---
# Type alias: FormulaDefinition<ParamDefsT, ResultT, SchemaT\>

Ƭ **FormulaDefinition**<`ParamDefsT`, `ResultT`, `SchemaT`\>: `ResultT` extends [`String`](../enums/ValueType.md#string) ? [`StringFormulaDef`](StringFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Number`](../enums/ValueType.md#number) ? [`NumericFormulaDef`](NumericFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Boolean`](../enums/ValueType.md#boolean) ? [`BooleanFormulaDef`](BooleanFormulaDef.md)<`ParamDefsT`\> : `ResultT` extends [`Array`](../enums/ValueType.md#array) ? [`ArrayFormulaDef`](ArrayFormulaDef.md)<`ParamDefsT`, `SchemaT`\> : [`ObjectFormulaDef`](ObjectFormulaDef.md)<`ParamDefsT`, `SchemaT`\>

A formula definition accepted by [makeFormula](../functions/makeFormula.md).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/ValueType.md) |
| `SchemaT` | extends [`Schema`](Schema.md) |

#### Defined in

[api.ts:937](https://github.com/coda/packs-sdk/blob/main/api.ts#L937)
