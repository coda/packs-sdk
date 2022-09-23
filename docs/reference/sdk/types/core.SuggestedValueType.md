---
title: "SuggestedValueType"
---
# Type alias: SuggestedValueType<T\>

[core](../modules/core.md).SuggestedValueType

Ƭ **SuggestedValueType**<`T`\>: `T` extends [`ArrayType`](../interfaces/core.ArrayType.md)<[`date`](../enums/core.Type.md#date)\> ? `TypeOfMap`<`T`\> \| [`PrecannedDateRange`](../enums/core.PrecannedDateRange.md) : `TypeOfMap`<`T`\>

The type of values that are allowable to be used as a [suggestedValue](../interfaces/core.ParamDef.md#suggestedvalue) for a parameter.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

#### Defined in

[api_types.ts:359](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L359)
