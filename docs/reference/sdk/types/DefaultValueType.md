# Type alias: DefaultValueType<T\>

Ƭ **DefaultValueType**<`T`\>: `T` extends [`ArrayType`](../interfaces/ArrayType.md)<[`date`](../enums/Type.md#date)\> ? `TypeOfMap`<`T`\> \| [`PrecannedDateRange`](../enums/PrecannedDateRange.md) : `TypeOfMap`<`T`\>

The type of values that are allowable to be used as a [defaultValue](../interfaces/ParamDef.md#defaultvalue) for a parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

#### Defined in

[api_types.ts:273](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L273)
