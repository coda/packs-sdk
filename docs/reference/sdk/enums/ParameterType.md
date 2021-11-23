# Enumeration: ParameterType

Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).

## Enumeration members

### Boolean

• **Boolean** = `"boolean"`

Indicates a parameter that is a Coda boolean value.

#### Defined in

[api_types.ts:120](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L120)

___

### BooleanArray

• **BooleanArray** = `"booleanArray"`

Indicates a parameter that is a list of Coda boolean values.

#### Defined in

[api_types.ts:145](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L145)

___

### Date

• **Date** = `"date"`

Indicates a parameter that is a Coda date value (which includes time and datetime values).

#### Defined in

[api_types.ts:124](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L124)

___

### DateArray

• **DateArray** = `"dateArray"`

Indicates a parameter that is a list of Coda date values (which includes time and datetime values).

Currently, when such a parameter is used with a sync table formula or an action formula ([isAction](../interfaces/EmptyFormulaDef.md#isaction)),
which will generate a builder UI for selecting parameters, a date array parameter will always render
as a date range selector. A date range will always be passed to a pack formula as a list of two
elements, the beginning of the range and the end of the range.

#### Defined in

[api_types.ts:154](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L154)

___

### Html

• **Html** = `"html"`

Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:128](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L128)

___

### HtmlArray

• **HtmlArray** = `"htmlArray`"`

Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:158](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L158)

___

### Image

• **Image** = `"image"`

Indicates a parameter that is a Coda image. The pack is passed an image URL.

#### Defined in

[api_types.ts:132](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L132)

___

### ImageArray

• **ImageArray** = `"imageArray"`

Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.

#### Defined in

[api_types.ts:162](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L162)

___

### Number

• **Number** = `"number"`

Indicates a parameter that is a Coda number value.

#### Defined in

[api_types.ts:116](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L116)

___

### NumberArray

• **NumberArray** = `"numberArray"`

Indicates a parameter that is a list of Coda number values.

#### Defined in

[api_types.ts:141](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L141)

___

### String

• **String** = `"string"`

Indicates a parameter that is a Coda text value.

#### Defined in

[api_types.ts:112](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L112)

___

### StringArray

• **StringArray** = `"stringArray"`

Indicates a parameter that is a list of Coda text values.

#### Defined in

[api_types.ts:137](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L137)
