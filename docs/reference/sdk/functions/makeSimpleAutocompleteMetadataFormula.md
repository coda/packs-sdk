# Function: makeSimpleAutocompleteMetadataFormula

▸ **makeSimpleAutocompleteMetadataFormula**<`AutoCompleteResultT`\>(`options`): [`MetadataFormula`](../types/MetadataFormula.md)<`AutoCompleteResultT`\>

**`deprecated`** If you have a hardcoded array of autocomplete options, simply include that array
as the value of the `autocomplete` property in your parameter definition. There is no longer
any needed to wrap a value with this formula.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `AutoCompleteResultT` | extends (`string` \| `number` \| [`SimpleAutocompleteOption`](../types/SimpleAutocompleteOption.md)<[`String`](../enums/ParameterType.md#string) \| [`Number`](../enums/ParameterType.md#number)\>)[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `AutoCompleteResultT` |

#### Returns

[`MetadataFormula`](../types/MetadataFormula.md)<`AutoCompleteResultT`\>

#### Defined in

[api.ts:1210](https://github.com/coda/packs-sdk/blob/main/api.ts#L1210)
