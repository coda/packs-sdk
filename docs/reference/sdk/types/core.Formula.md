---
nav: "Formula"
---
# Type alias: Formula<ParamDefsT, ResultT, SchemaT\>

[core](../modules/core.md).Formula

Ƭ **Formula**<`ParamDefsT`, `ResultT`, `SchemaT`\>: `ResultT` extends [`String`](../enums/core.ValueType.md#string) ? [`StringPackFormula`](core.StringPackFormula.md)<`ParamDefsT`\> : `ResultT` extends [`Number`](../enums/core.ValueType.md#number) ? [`NumericPackFormula`](core.NumericPackFormula.md)<`ParamDefsT`\> : `ResultT` extends [`Boolean`](../enums/core.ValueType.md#boolean) ? [`BooleanPackFormula`](core.BooleanPackFormula.md)<`ParamDefsT`\> : `ResultT` extends [`Array`](../enums/core.ValueType.md#array) ? [`ObjectPackFormula`](core.ObjectPackFormula.md)<`ParamDefsT`, [`ArraySchema`](../interfaces/core.ArraySchema.md)<`SchemaT`\>\> : [`ObjectPackFormula`](core.ObjectPackFormula.md)<`ParamDefsT`, `SchemaT`\>

A pack formula, complete with metadata about the formula like its name, description, and parameters,
as well as the implementation of that formula.

This is the type for an actual user-facing formula, rather than other formula-shaped resources within a
pack, like an autocomplete metadata formula or a sync getter formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) = [`ParamDefs`](core.ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/core.ValueType.md) = [`ValueType`](../enums/core.ValueType.md) |
| `SchemaT` | extends [`Schema`](core.Schema.md) = [`Schema`](core.Schema.md) |

#### Defined in

[api.ts:639](https://github.com/coda/packs-sdk/blob/main/api.ts#L639)
