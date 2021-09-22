# Interface: ParamDef<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

## Properties

### autocomplete

• `Optional` **autocomplete**: [`MetadataFormula`](../README.md#metadataformula)

A [MetadataFormula](../README.md#metadataformula) that returns valid values for this parameter, optionally matching a search
query. This can be useful both if there are a fixed number of valid values for the parameter,
or if the valid values from the parameter can be looked up from some API.
Use [makeMetadataFormula](../README.md#makemetadataformula) to wrap a function that implements your autocomplete logic.
Typically once you have fetched the list of matching values, you'll use
[autocompleteSearchObjects](../README.md#autocompletesearchobjects) to handle searching over those values.
If you have a hardcoded list of valid values, you would only need to use
[makeSimpleAutocompleteMetadataFormula](../README.md#makesimpleautocompletemetadataformula).

#### Defined in

[api_types.ts:164](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L164)

___

### defaultValue

• `Optional` **defaultValue**: [`DefaultValueType`](../README.md#defaultvaluetype)<`T`\>

The default value to be used for this parameter if it is not specified by the user.

#### Defined in

[api_types.ts:168](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L168)

___

### description

• **description**: `string`

A brief description of what this parameter is used for, shown to the user when invoking the formula.

#### Defined in

[api_types.ts:145](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L145)

___

### hidden

• `Optional` **hidden**: `boolean`

#### Defined in

[api_types.ts:151](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L151)

___

### name

• **name**: `string`

The name of the parameter, which will be shown to the user when invoking this formula.

#### Defined in

[api_types.ts:137](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L137)

___

### optional

• `Optional` **optional**: `boolean`

Whether this parameter can be omitted when invoking the formula.
All optional parameters must come after all non-optional parameters.

#### Defined in

[api_types.ts:150](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L150)

___

### type

• **type**: `T`

The data type of this parameter (string, number, etc).

#### Defined in

[api_types.ts:141](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L141)
