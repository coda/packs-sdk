---
nav: "BaseFormula"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Type alias: BaseFormula<ParamDefsT, ResultT, ContextT\>

[core](../modules/core.md).BaseFormula

Ƭ **BaseFormula**<`ParamDefsT`, `ResultT`, `ContextT`\>: [`PackFormulaDef`](../interfaces/core.PackFormulaDef.md)<`ParamDefsT`, `ResultT`, `ContextT`\> & { `resultType`: `TypeOf`<`ResultT`\>  }

The base class for pack formula descriptors. Subclasses vary based on the return type of the formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `ResultT` | extends [`PackFormulaResult`](core.PackFormulaResult.md) |
| `ContextT` | extends [`ExecutionContext`](../interfaces/core.ExecutionContext.md) = [`ExecutionContext`](../interfaces/core.ExecutionContext.md) |
