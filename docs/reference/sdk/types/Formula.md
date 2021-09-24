# Type alias: Formula<ParamDefsT, ResultT, SchemaT\>

Ƭ **Formula**<`ParamDefsT`, `ResultT`, `SchemaT`\>: `ResultT` extends [`String`](../enums/ValueType.md#string) ? `StringPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Number`](../enums/ValueType.md#number) ? `NumericPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Boolean`](../enums/ValueType.md#boolean) ? `BooleanPackFormula`<`ParamDefsT`\> : `ResultT` extends [`Array`](../enums/ValueType.md#array) ? `ObjectPackFormula`<`ParamDefsT`, [`ArraySchema`](../interfaces/ArraySchema.md)<`SchemaT`\>\> : `ObjectPackFormula`<`ParamDefsT`, `SchemaT`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md)[`ParamDefs`](ParamDefs.md) |
| `ResultT` | extends `FormulaResultValueType``FormulaResultValueType` |
| `SchemaT` | extends [`Schema`](Schema.md)[`Schema`](Schema.md) |

#### Defined in

[api.ts:419](https://github.com/coda/packs-sdk/blob/main/api.ts#L419)
