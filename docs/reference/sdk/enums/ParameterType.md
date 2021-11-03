# Enumeration: ParameterType

Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).

## Enumeration members

### Boolean

• **Boolean** = `"boolean"`

Indicates a parameter that is a Coda boolean value.

#### Defined in

[api_types.ts:108](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L108)

___

### BooleanArray

• **BooleanArray** = `"booleanArray"`

Indicates a parameter that is a list of Coda boolean values.

#### Defined in

[api_types.ts:134](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L134)

___

### Date

• **Date** = `"date"`

Indicates a parameter that is a Coda date value (which includes time and datetime values).

#### Defined in

[api_types.ts:112](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L112)

___

### DateArray

• **DateArray** = `"dateArray"`

Indicates a parameter that is a list of Coda date values (which includes time and datetime values).

Currently, when such a parameter is used with a sync table formula or an action formula ([isAction](../interfaces/EmptyFormulaDef.md#isaction)),
which will generate a builder UI for selecting parameters, a date array parameter will always render
as a date range selector. A date range will always be passed to a pack formula as a list of two
elements, the beginning of the range and the end of the range.

#### Defined in

[api_types.ts:143](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L143)

___

### Html

• **Html** = `"html"`

Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:116](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L116)

___

### HtmlArray

• **HtmlArray** = `"htmlArray`"`

Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:147](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L147)

___

### Image

• **Image** = `"image"`

*Not yet supported.* Indicates a parameter that is a Coda image. Eventually, such a parameter will
be passed to the pack as an image URL.

#### Defined in

[api_types.ts:121](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L121)

___

### ImageArray

• **ImageArray** = `"imageArray"`

*Not yet supported.* Indicates a parameter that is a list of Coda image values. Eventually, such a parameter
will be passed to the pack as a list of image URLs.

#### Defined in

[api_types.ts:152](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L152)

___

### Number

• **Number** = `"number"`

Indicates a parameter that is a Coda number value.

#### Defined in

[api_types.ts:104](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L104)

___

### NumberArray

• **NumberArray** = `"numberArray"`

Indicates a parameter that is a list of Coda number values.

#### Defined in

[api_types.ts:130](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L130)

___

### String

• **String** = `"string"`

Indicates a parameter that is a Coda text value.

#### Defined in

[api_types.ts:100](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L100)

___

### StringArray

• **StringArray** = `"stringArray"`

Indicates a parameter that is a list of Coda text values.

#### Defined in

[api_types.ts:126](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L126)
