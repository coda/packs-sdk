---
nav: "ImageSchema"
---
# Interface: ImageSchema

[core](../modules/core.md).ImageSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as an image.

## Hierarchy

- `BaseStringSchema`<[`ImageReference`](../enums/core.ValueHintType.md#imagereference) \| [`ImageAttachment`](../enums/core.ValueHintType.md#imageattachment)\>

  ↳ **`ImageSchema`**

## Properties

### codaType

• **codaType**: [`ImageReference`](../enums/core.ValueHintType.md#imagereference) \| [`ImageAttachment`](../enums/core.ValueHintType.md#imageattachment)

Instructs Coda to render this value as an Image.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:644](https://github.com/coda/packs-sdk/blob/main/schema.ts#L644)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:215](https://github.com/coda/packs-sdk/blob/main/schema.ts#L215)

___

### imageCornerStyle

• `Optional` **imageCornerStyle**: [`ImageCornerStyle`](../enums/core.ImageCornerStyle.md)

ImageCornerStyle type specifying style of corners on images. If unspecified, default is Rounded.

#### Defined in

[schema.ts:648](https://github.com/coda/packs-sdk/blob/main/schema.ts#L648)

___

### imageOutline

• `Optional` **imageOutline**: [`ImageOutline`](../enums/core.ImageOutline.md)

ImageOutline type specifying style of outline on images. If unspecified, default is Solid.

#### Defined in

[schema.ts:646](https://github.com/coda/packs-sdk/blob/main/schema.ts#L646)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:692](https://github.com/coda/packs-sdk/blob/main/schema.ts#L692)
