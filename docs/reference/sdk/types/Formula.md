# Type alias: Formula<ParamDefsT, ResultT, SchemaT\>

Ƭ **Formula**<`ParamDefsT`, `ResultT`, `SchemaT`\>: `ResultT` extends [`String`](../enums/ValueType.md#string) ? `StringPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Number`](../enums/ValueType.md#number) ? `NumericPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Boolean`](../enums/ValueType.md#boolean) ? `BooleanPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Array`](../enums/ValueType.md#array) ? `ObjectPackFormula`<`ParamDefsT`, [`ArraySchema`](../interfaces/ArraySchema.md)<`SchemaT`\>\> : `ObjectPackFormula`<`ParamDefsT`, `SchemaT`\>

A pack formula, complete with metadata about the formula like its name, description, and parameters,
as well as the implementation of that formula.

This is the type for an actual user-facing formula, rather than other formula-shaped resources within a
pack, like an autocomplete metadata formula or a sync getter formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md)[`ParamDefs`](ParamDefs.md) |
| `ResultT` | extends `FormulaResultValueType``FormulaResultValueType` |
| `SchemaT` | extends [`Schema`](Schema.md)[`Schema`](Schema.md) |

#### Defined in

[api.ts:482](https://github.com/coda/packs-sdk/blob/main/api.ts#L482)
