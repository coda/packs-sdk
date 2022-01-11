---
title: "ParameterType"
---
# Enumeration: ParameterType

Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).

## Enumeration members

### Boolean

• **Boolean** = `"boolean"`

Indicates a parameter that is a Coda boolean value.

#### Defined in

[api_types.ts:119](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L119)

___

### BooleanArray

• **BooleanArray** = `"booleanArray"`

Indicates a parameter that is a list of Coda boolean values.

#### Defined in

[api_types.ts:144](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L144)

___

### Date

• **Date** = `"date"`

Indicates a parameter that is a Coda date value (which includes time and datetime values).

#### Defined in

[api_types.ts:123](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L123)

___

### DateArray

• **DateArray** = `"dateArray"`

Indicates a parameter that is a list of Coda date values (which includes time and datetime values).

Currently, when such a parameter is used with a sync table formula or an action formula ([isAction](../interfaces/EmptyFormulaDef.md#isaction)),
which will generate a builder UI for selecting parameters, a date array parameter will always render
as a date range selector. A date range will always be passed to a pack formula as a list of two
elements, the beginning of the range and the end of the range.

#### Defined in

[api_types.ts:153](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L153)

___

### Html

• **Html** = `"html"`

Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:127](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L127)

___

### HtmlArray

• **HtmlArray** = `"htmlArray`"`

Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:157](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L157)

___

### Image

• **Image** = `"image"`

Indicates a parameter that is a Coda image. The pack is passed an image URL.

#### Defined in

[api_types.ts:131](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L131)

___

### ImageArray

• **ImageArray** = `"imageArray"`

Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.

#### Defined in

[api_types.ts:161](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L161)

___

### Number

• **Number** = `"number"`

Indicates a parameter that is a Coda number value.

#### Defined in

[api_types.ts:115](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L115)

___

### NumberArray

• **NumberArray** = `"numberArray"`

Indicates a parameter that is a list of Coda number values.

#### Defined in

[api_types.ts:140](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L140)

___

### String

• **String** = `"string"`

Indicates a parameter that is a Coda text value.

#### Defined in

[api_types.ts:111](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L111)

___

### StringArray

• **StringArray** = `"stringArray"`

Indicates a parameter that is a list of Coda text values.

#### Defined in

[api_types.ts:136](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L136)
