---
title: "SimpleAutocompleteOption"
---
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

[api.ts:1099](https://github.com/coda/packs-sdk/blob/main/api.ts#L1099)

___

### value

• **value**: `TypeMap`[`ParameterTypeMap`[`T`]]

The actual value that will get used in the formula if this option is selected.

#### Defined in

[api.ts:1101](https://github.com/coda/packs-sdk/blob/main/api.ts#L1101)
