---
nav: "BaseFormula"
---
# Type alias: BaseFormula<ParamDefsT, ResultT\>

[core](../modules/core.md).BaseFormula

Ƭ **BaseFormula**<`ParamDefsT`, `ResultT`\>: [`PackFormulaDef`](../interfaces/core.PackFormulaDef.md)<`ParamDefsT`, `ResultT`\> & { `resultType`: `TypeOf`<`ResultT`\>  }

The base class for pack formula descriptors. Subclasses vary based on the return type of the formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `ResultT` | extends [`PackFormulaResult`](core.PackFormulaResult.md) |

#### Defined in

[api.ts:598](https://github.com/coda/packs-sdk/blob/main/api.ts#L598)
