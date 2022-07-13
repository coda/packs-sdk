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

[schema.ts:598](https://github.com/coda/packs-sdk/blob/main/schema.ts#L598)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:209](https://github.com/coda/packs-sdk/blob/main/schema.ts#L209)

___

### outline

• `Optional` **outline**: [`Outline`](../enums/core.Outline.md)

Outline type specifying whether or not to add outline to rendered images. Defaults to true.

#### Defined in

[schema.ts:600](https://github.com/coda/packs-sdk/blob/main/schema.ts#L600)

___

### roundedCorners

• `Optional` **roundedCorners**: [`RoundedCorners`](../enums/core.RoundedCorners.md)

roundedCorners type specifying whether or not to add rounded corners to rendered images. Defaults to true.

#### Defined in

[schema.ts:602](https://github.com/coda/packs-sdk/blob/main/schema.ts#L602)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:646](https://github.com/coda/packs-sdk/blob/main/schema.ts#L646)
