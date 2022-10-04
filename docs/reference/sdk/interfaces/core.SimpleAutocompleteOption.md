---
nav: "SimpleAutocompleteOption"
---
# Interface: SimpleAutocompleteOption<T\>

[core](../modules/core.md).SimpleAutocompleteOption

A result from a parameter autocomplete function that pairs a UI display value with
the underlying option that will be used in the formula when selected.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AutocompleteParameterTypes` |

## Properties

### display

• **display**: `string`

Text that will be displayed to the user in UI for this option.

#### Defined in

[api.ts:1180](https://github.com/coda/packs-sdk/blob/main/api.ts#L1180)

___

### value

• **value**: `TypeMap`[`AutocompleteParameterTypeMapping`[`T`]]

The actual value that will get used in the formula if this option is selected.

#### Defined in

[api.ts:1182](https://github.com/coda/packs-sdk/blob/main/api.ts#L1182)
