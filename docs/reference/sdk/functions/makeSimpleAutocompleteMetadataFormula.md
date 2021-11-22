# Function: makeSimpleAutocompleteMetadataFormula

<<<<<<< HEAD
▸ **makeSimpleAutocompleteMetadataFormula**<`T`\>(`options`): [`MetadataFormula`](../types/MetadataFormula.md)
=======
▸ **makeSimpleAutocompleteMetadataFormula**<`T`\>(`options`): [`MetadataFormula`](../types/MetadataFormula.md)<`AutocompleteReturnType`<`T`\>\>
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

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
<<<<<<< HEAD
| `options` | (`TypeMap`[`ParameterTypeMap`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/SimpleAutocompleteOption.md)<`T`\>)[] |
=======
| `options` | `AutocompleteReturnType`<`T`\> |
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

#### Returns

[`MetadataFormula`](../types/MetadataFormula.md)<`AutocompleteReturnType`<`T`\>\>

#### Defined in

<<<<<<< HEAD
[api.ts:1136](https://github.com/coda/packs-sdk/blob/main/api.ts#L1136)
=======
<<<<<<< HEAD
[api.ts:1136](https://github.com/coda/packs-sdk/blob/main/api.ts#L1136)
=======
[api.ts:1151](https://github.com/coda/packs-sdk/blob/main/api.ts#L1151)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
