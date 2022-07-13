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

[schema.ts:588](https://github.com/coda/packs-sdk/blob/main/schema.ts#L588)

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

• `Optional` **outline**: `ImageState`

#### Defined in

[schema.ts:591](https://github.com/coda/packs-sdk/blob/main/schema.ts#L591)

___

### roundedCorners

• `Optional` **roundedCorners**: `ImageState`

#### Defined in

[schema.ts:593](https://github.com/coda/packs-sdk/blob/main/schema.ts#L593)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:637](https://github.com/coda/packs-sdk/blob/main/schema.ts#L637)
