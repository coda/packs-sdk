---
title: "ParamDef"
---
# Interface: ParamDef<T\>

[core](../modules/core.md).ParamDef

The definition of a formula parameter.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

## Properties

### autocomplete

• `Optional` **autocomplete**: [`MetadataFormula`](../types/core.MetadataFormula.md)

A [MetadataFormula](../types/core.MetadataFormula.md) that returns valid values for this parameter, optionally matching a search
query. This can be useful both if there are a fixed number of valid values for the parameter,
or if the valid values from the parameter can be looked up from some API.
Use [makeMetadataFormula](../functions/core.makeMetadataFormula.md) to wrap a function that implements your autocomplete logic.
Typically once you have fetched the list of matching values, you'll use
[autocompleteSearchObjects](../functions/core.autocompleteSearchObjects.md) to handle searching over those values.
If you have a hardcoded list of valid values, you would only need to use
[makeSimpleAutocompleteMetadataFormula](../functions/core.makeSimpleAutocompleteMetadataFormula.md).

#### Defined in

[api_types.ts:305](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L305)

___

### defaultValue

• `Optional` **defaultValue**: [`SuggestedValueType`](../types/core.SuggestedValueType.md)<`T`\>

**`deprecated`** This will be removed in a future version of the SDK. Use [ParamDef.suggestedValue](core.ParamDef.md#suggestedvalue) instead.

#### Defined in

[api_types.ts:309](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L309)

___

### description

• **description**: `string`

A brief description of what this parameter is used for, shown to the user when invoking the formula.

#### Defined in

[api_types.ts:287](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L287)

___

### name

• **name**: `string`

The name of the parameter, which will be shown to the user when invoking this formula.

#### Defined in

[api_types.ts:279](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L279)

___

### optional

• `Optional` **optional**: `boolean`

Whether this parameter can be omitted when invoking the formula.
All optional parameters must come after all non-optional parameters.

#### Defined in

[api_types.ts:292](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L292)

___

### suggestedValue

• `Optional` **suggestedValue**: [`SuggestedValueType`](../types/core.SuggestedValueType.md)<`T`\>

The suggested value to be prepopulated for this parameter if it is not specified by the user.

#### Defined in

[api_types.ts:313](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L313)

___

### type

• **type**: `T`

The data type of this parameter (string, number, etc).

#### Defined in

[api_types.ts:283](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L283)
