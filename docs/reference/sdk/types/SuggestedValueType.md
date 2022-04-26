---
title: "SuggestedValueType"
---
# Type alias: SuggestedValueType<T\>

Ƭ **SuggestedValueType**<`T`\>: `T` extends [`ArrayType`](../interfaces/ArrayType.md)<[`date`](../enums/Type.md#date)\> ? `TypeOfMap`<`T`\> \| [`PrecannedDateRange`](../enums/PrecannedDateRange.md) : `TypeOfMap`<`T`\>

The type of values that are allowable to be used as a [suggestedValue](../interfaces/ParamDef.md#suggestedvalue) for a parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

#### Defined in

[api_types.ts:348](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L348)
