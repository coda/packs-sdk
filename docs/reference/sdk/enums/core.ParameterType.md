---
nav: "ParameterType"
---
# Enumeration: ParameterType

[core](../modules/core.md).ParameterType

Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).

## Enumeration Members

### Boolean

• **Boolean** = ``"boolean"``

Indicates a parameter that is a Coda boolean value.

#### Defined in

[api_types.ts:187](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L187)

___

### BooleanArray

• **BooleanArray** = ``"booleanArray"``

Indicates a parameter that is a list of Coda boolean values.

#### Defined in

[api_types.ts:224](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L224)

___

### Date

• **Date** = ``"date"``

Indicates a parameter that is a Coda date value (which includes time and datetime values).

#### Defined in

[api_types.ts:191](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L191)

___

### DateArray

• **DateArray** = ``"dateArray"``

Indicates a parameter that is a list of Coda date values (which includes time and datetime values).

Currently, when such a parameter is used with a sync table formula or an action formula
([isAction](../interfaces/core.BaseFormulaDef.md#isaction)), which will generate a builder UI for selecting parameters, a date array
parameter will always render as a date range selector. A date range will always be passed to a pack formula
as a list of two elements, the beginning of the range and the end of the range.

#### Defined in

[api_types.ts:237](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L237)

___

### File

• **File** = ``"file"``

Indicates a parameter that is a Coda file. The pack is passed a file URL.

#### Defined in

[api_types.ts:203](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L203)

___

### FileArray

• **FileArray** = ``"fileArray"``

Indicates a parameter that is a list of Coda file values. The pack is passed a list of file URLs.

#### Defined in

[api_types.ts:261](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L261)

___

### Html

• **Html** = ``"html"``

Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:195](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L195)

___

### HtmlArray

• **HtmlArray** = ``"htmlArray`"``

Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:245](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L245)

___

### Image

• **Image** = ``"image"``

Indicates a parameter that is a Coda image. The pack is passed an image URL.

#### Defined in

[api_types.ts:199](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L199)

___

### ImageArray

• **ImageArray** = ``"imageArray"``

Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.

#### Defined in

[api_types.ts:253](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L253)

___

### Number

• **Number** = ``"number"``

Indicates a parameter that is a Coda number value.

#### Defined in

[api_types.ts:183](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L183)

___

### NumberArray

• **NumberArray** = ``"numberArray"``

Indicates a parameter that is a list of Coda number values.

#### Defined in

[api_types.ts:216](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L216)

___

### SparseBooleanArray

• **SparseBooleanArray** = ``"sparseBooleanArray"``

[BooleanArray](core.ParameterType.md#booleanarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:228](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L228)

___

### SparseDateArray

• **SparseDateArray** = ``"sparseDateArray"``

[DateArray](core.ParameterType.md#datearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:241](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L241)

___

### SparseFileArray

• **SparseFileArray** = ``"sparseFileArray"``

[FileArray](core.ParameterType.md#filearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:265](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L265)

___

### SparseHtmlArray

• **SparseHtmlArray** = ``"sparseHtmlArray"``

[HtmlArray](core.ParameterType.md#htmlarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:249](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L249)

___

### SparseImageArray

• **SparseImageArray** = ``"sparseImageArray"``

[ImageArray](core.ParameterType.md#imagearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:257](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L257)

___

### SparseNumberArray

• **SparseNumberArray** = ``"sparseNumberArray"``

[NumberArray](core.ParameterType.md#numberarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:220](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L220)

___

### SparseStringArray

• **SparseStringArray** = ``"sparseStringArray"``

[StringArray](core.ParameterType.md#stringarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:212](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L212)

___

### String

• **String** = ``"string"``

Indicates a parameter that is a Coda text value.

#### Defined in

[api_types.ts:179](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L179)

___

### StringArray

• **StringArray** = ``"stringArray"``

Indicates a parameter that is a list of Coda text values.

#### Defined in

[api_types.ts:208](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L208)
