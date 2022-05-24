---
title: "makeSimpleAutocompleteMetadataFormula"
---
# Function: makeSimpleAutocompleteMetadataFormula

▸ **makeSimpleAutocompleteMetadataFormula**<`T`\>(`options`): [`MetadataFormula`](../types/MetadataFormula.md)

**`deprecated`** If you have a hardcoded array of autocomplete options, simply include that array
as the value of the `autocomplete` property in your parameter definition. There is no longer
any needed to wrap a value with this formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`String`](../enums/ParameterType.md#string) \| [`Number`](../enums/ParameterType.md#number) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | (`TypeMap`[`ParameterTypeMap`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/SimpleAutocompleteOption.md)<`T`\>)[] |

#### Returns

[`MetadataFormula`](../types/MetadataFormula.md)

#### Defined in

[api.ts:1210](https://github.com/coda/packs-sdk/blob/main/api.ts#L1210)
