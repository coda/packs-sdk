# Interface: SimpleAutocompleteOption<T\>

A result from a parameter autocomplete function that pairs a UI display value with
the underlying option that will be used in the formula when selected.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `number` \| `string` |

## Properties

### display

• **display**: `string`

Text that will be displayed to the user in UI for this option.

#### Defined in

[api.ts:1059](https://github.com/coda/packs-sdk/blob/main/api.ts#L1059)

___

### value

• **value**: `T`

The actual value that will get used in the formula if this option is selected.

#### Defined in

[api.ts:1061](https://github.com/coda/packs-sdk/blob/main/api.ts#L1061)
