# Type alias: BaseFormula<ParamDefsT, ResultT\>

Ƭ **BaseFormula**<`ParamDefsT`, `ResultT`\>: [`PackFormulaDef`](../interfaces/PackFormulaDef.md)<`ParamDefsT`, `ResultT`\> & { `resultType`: `TypeOf`<`ResultT`\>  }

The base class for pack formula descriptors. Subclasses vary based on the return type of the formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `ResultT` | extends [`PackFormulaResult`](PackFormulaResult.md) |

#### Defined in

<<<<<<< HEAD
[api.ts:474](https://github.com/coda/packs-sdk/blob/main/api.ts#L474)
=======
[api.ts:482](https://github.com/coda/packs-sdk/blob/main/api.ts#L482)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
