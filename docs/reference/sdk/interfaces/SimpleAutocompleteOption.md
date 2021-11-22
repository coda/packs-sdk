# Interface: SimpleAutocompleteOption<T\>

A result from a parameter autocomplete function that pairs a UI display value with
the underlying option that will be used in the formula when selected.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Number`](../enums/ParameterType.md#number) \| [`String`](../enums/ParameterType.md#string) |

## Properties

### display

• **display**: `string`

Text that will be displayed to the user in UI for this option.

#### Defined in

<<<<<<< HEAD
[api.ts:1029](https://github.com/coda/packs-sdk/blob/main/api.ts#L1029)
=======
[api.ts:1046](https://github.com/coda/packs-sdk/blob/main/api.ts#L1046)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### value

• **value**: `TypeMap`[`ParameterTypeMap`[`T`]]

The actual value that will get used in the formula if this option is selected.

#### Defined in

<<<<<<< HEAD
[api.ts:1031](https://github.com/coda/packs-sdk/blob/main/api.ts#L1031)
=======
[api.ts:1048](https://github.com/coda/packs-sdk/blob/main/api.ts#L1048)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
