---
title: "makeSimpleAutocompleteMetadataFormula"
---
# Function: makeSimpleAutocompleteMetadataFormula

[core](../modules/core.md).makeSimpleAutocompleteMetadataFormula

▸ **makeSimpleAutocompleteMetadataFormula**<`T`\>(`options`): [`MetadataFormula`](../types/core.MetadataFormula.md)

**`Deprecated`**

If you have a hardcoded array of autocomplete options, simply include that array
as the value of the `autocomplete` property in your parameter definition. There is no longer
any needed to wrap a value with this formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AutocompleteParameterTypes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | (`TypeMap`[`AutocompleteParameterTypeMapping`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/core.SimpleAutocompleteOption.md)<`T`\>)[] |

#### Returns

[`MetadataFormula`](../types/core.MetadataFormula.md)

#### Defined in

[api.ts:1269](https://github.com/coda/packs-sdk/blob/main/api.ts#L1269)
