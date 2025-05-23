---
nav: "MetadataFormulaDef"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Type alias: MetadataFormulaDef<ContextT, ReturnT\>

[core](../modules/core.md).MetadataFormulaDef

Ƭ **MetadataFormulaDef**<`ContextT`, `ReturnT`\>: [`MetadataFormula`](core.MetadataFormula.md)<`ContextT`, `ReturnT`\> \| [`MetadataFunction`](core.MetadataFunction.md)<`ContextT`, `ReturnT`\>

The type of values that will be accepted as a metadata formula definition. This can either
be the JavaScript function that implements a metadata formula (strongly recommended)
or a full metadata formula definition (mostly supported for legacy code).

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ContextT` | extends [`ExecutionContext`](../interfaces/core.ExecutionContext.md) = [`ExecutionContext`](../interfaces/core.ExecutionContext.md) |
| `ReturnT` | extends [`PackFormulaResult`](core.PackFormulaResult.md) = [`LegacyDefaultMetadataReturnType`](core.LegacyDefaultMetadataReturnType.md) |
