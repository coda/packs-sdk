---
title: "BaseFormula"
---
# Type alias: BaseFormula<ParamDefsT, ResultT\>

Ƭ **BaseFormula**<`ParamDefsT`, `ResultT`\>: [`PackFormulaDef`](../interfaces/PackFormulaDef.md)<`ParamDefsT`, `ResultT`\> & { `resultType`: `TypeOf`<`ResultT`\>  }

The base class for pack formula descriptors. Subclasses vary based on the return type of the formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `ResultT` | extends [`PackFormulaResult`](PackFormulaResult.md) |

#### Defined in

[api.ts:545](https://github.com/coda/packs-sdk/blob/main/api.ts#L545)
