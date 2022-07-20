---
title: "ImageSchema"
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

[schema.ts:620](https://github.com/coda/packs-sdk/blob/main/schema.ts#L620)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:210](https://github.com/coda/packs-sdk/blob/main/schema.ts#L210)

___

### imageCornerStyle

• `Optional` **imageCornerStyle**: [`ImageCornerStyle`](../enums/core.ImageCornerStyle.md)

ImageCornerStyle type specifying style of corners on images. If unspecified, default is Rounded.

#### Defined in

[schema.ts:624](https://github.com/coda/packs-sdk/blob/main/schema.ts#L624)

___

### imageOutline

• `Optional` **imageOutline**: [`ImageOutline`](../enums/core.ImageOutline.md)

ImageOutline type specifying style of outline on images. If unspecified, default is Solid.

#### Defined in

[schema.ts:622](https://github.com/coda/packs-sdk/blob/main/schema.ts#L622)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:668](https://github.com/coda/packs-sdk/blob/main/schema.ts#L668)
