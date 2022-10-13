# Enumeration: ParameterType

[core](../modules/core.md).ParameterType

Enumeration of types of formula parameters. These describe Coda value types (as opposed to JavaScript value types).

## Enumeration Members

### Boolean

• **Boolean** = ``"boolean"``

Indicates a parameter that is a Coda boolean value.

#### Defined in

[api_types.ts:139](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L139)

___

### BooleanArray

• **BooleanArray** = ``"booleanArray"``

Indicates a parameter that is a list of Coda boolean values.

#### Defined in

[api_types.ts:176](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L176)

___

### Date

• **Date** = ``"date"``

Indicates a parameter that is a Coda date value (which includes time and datetime values).

#### Defined in

[api_types.ts:143](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L143)

___

### DateArray

• **DateArray** = ``"dateArray"``

Indicates a parameter that is a list of Coda date values (which includes time and datetime values).

Currently, when such a parameter is used with a sync table formula or an action formula
([isAction](../interfaces/core.BaseFormulaDef.md#isaction)), which will generate a builder UI for selecting parameters, a date array
parameter will always render as a date range selector. A date range will always be passed to a pack formula
as a list of two elements, the beginning of the range and the end of the range.

#### Defined in

[api_types.ts:189](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L189)

___

### File

• **File** = ``"file"``

Indicates a parameter that is a Coda file. The pack is passed a file URL.

#### Defined in

[api_types.ts:155](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L155)

___

### FileArray

• **FileArray** = ``"fileArray"``

Indicates a parameter that is a list of Coda file values. The pack is passed a list of file URLs.

#### Defined in

[api_types.ts:213](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L213)

___

### Html

• **Html** = ``"html"``

Indicates a parameter that is a Coda rich text value that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:147](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L147)

___

### HtmlArray

• **HtmlArray** = ``"htmlArray`"``

Indicates a parameter that is a list of Coda rich text values that should be passed to the pack as HTML.

#### Defined in

[api_types.ts:197](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L197)

___

### Image

• **Image** = ``"image"``

Indicates a parameter that is a Coda image. The pack is passed an image URL.

#### Defined in

[api_types.ts:151](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L151)

___

### ImageArray

• **ImageArray** = ``"imageArray"``

Indicates a parameter that is a list of Coda image values. The pack is passed a list of image URLs.

#### Defined in

[api_types.ts:205](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L205)

___

### Number

• **Number** = ``"number"``

Indicates a parameter that is a Coda number value.

#### Defined in

[api_types.ts:135](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L135)

___

### NumberArray

• **NumberArray** = ``"numberArray"``

Indicates a parameter that is a list of Coda number values.

#### Defined in

[api_types.ts:168](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L168)

___

### SparseBooleanArray

• **SparseBooleanArray** = ``"sparseBooleanArray"``

[BooleanArray](core.ParameterType.md#booleanarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:180](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L180)

___

### SparseDateArray

• **SparseDateArray** = ``"sparseDateArray"``

[DateArray](core.ParameterType.md#datearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:193](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L193)

___

### SparseFileArray

• **SparseFileArray** = ``"sparseFileArray"``

[FileArray](core.ParameterType.md#filearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:217](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L217)

___

### SparseHtmlArray

• **SparseHtmlArray** = ``"sparseHtmlArray"``

[HtmlArray](core.ParameterType.md#htmlarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:201](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L201)

___

### SparseImageArray

• **SparseImageArray** = ``"sparseImageArray"``

[ImageArray](core.ParameterType.md#imagearray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:209](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L209)

___

### SparseNumberArray

• **SparseNumberArray** = ``"sparseNumberArray"``

[NumberArray](core.ParameterType.md#numberarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:172](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L172)

___

### SparseStringArray

• **SparseStringArray** = ``"sparseStringArray"``

[StringArray](core.ParameterType.md#stringarray) that accepts unparsable values as `undefined`.

#### Defined in

[api_types.ts:164](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L164)

___

### String

• **String** = ``"string"``

Indicates a parameter that is a Coda text value.

#### Defined in

[api_types.ts:131](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L131)

___

### StringArray

• **StringArray** = ``"stringArray"``

Indicates a parameter that is a list of Coda text values.

#### Defined in

[api_types.ts:160](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L160)
