# Interface: OptionalParamDef<T\>

[core](../modules/core.md).OptionalParamDef

Marker type for an optional [ParamDef](core.ParamDef.md), used internally.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

## Hierarchy

- [`ParamDef`](core.ParamDef.md)<`T`\>

  ↳ **`OptionalParamDef`**

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

#### Inherited from

[ParamDef](core.ParamDef.md).[autocomplete](core.ParamDef.md#autocomplete)

#### Defined in

[api_types.ts:305](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L305)

___

### defaultValue

• `Optional` **defaultValue**: [`SuggestedValueType`](../types/core.SuggestedValueType.md)<`T`\>

**`Deprecated`**

This will be removed in a future version of the SDK. Use [suggestedValue](core.ParamDef.md#suggestedvalue) instead.

#### Inherited from

[ParamDef](core.ParamDef.md).[defaultValue](core.ParamDef.md#defaultvalue)

#### Defined in

[api_types.ts:309](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L309)

___

### description

• **description**: `string`

A brief description of what this parameter is used for, shown to the user when invoking the formula.

#### Inherited from

[ParamDef](core.ParamDef.md).[description](core.ParamDef.md#description)

#### Defined in

[api_types.ts:287](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L287)

___

### name

• **name**: `string`

The name of the parameter, which will be shown to the user when invoking this formula.

#### Inherited from

[ParamDef](core.ParamDef.md).[name](core.ParamDef.md#name)

#### Defined in

[api_types.ts:279](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L279)

___

### optional

• **optional**: ``true``

Whether this parameter can be omitted when invoking the formula.
All optional parameters must come after all non-optional parameters.

#### Overrides

[ParamDef](core.ParamDef.md).[optional](core.ParamDef.md#optional)

#### Defined in

[api_types.ts:320](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L320)

___

### suggestedValue

• `Optional` **suggestedValue**: [`SuggestedValueType`](../types/core.SuggestedValueType.md)<`T`\>

The suggested value to be prepopulated for this parameter if it is not specified by the user.

#### Inherited from

[ParamDef](core.ParamDef.md).[suggestedValue](core.ParamDef.md#suggestedvalue)

#### Defined in

[api_types.ts:313](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L313)

___

### type

• **type**: `T`

The data type of this parameter (string, number, etc).

#### Inherited from

[ParamDef](core.ParamDef.md).[type](core.ParamDef.md#type)

#### Defined in

[api_types.ts:283](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L283)
