---
title: "StringImageSchema"
---
# Interface: StringImageSchema

[core](../modules/core.md).StringImageSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as an image.

## Hierarchy

- `BaseStringSchema`<[`ImageReference`](../enums/core.ValueHintType.md#imagereference) \| [`ImageAttachment`](../enums/core.ValueHintType.md#imageattachment)\>

  ↳ **`StringImageSchema`**

## Properties

### codaType

• **codaType**: [`ImageReference`](../enums/core.ValueHintType.md#imagereference) \| [`ImageAttachment`](../enums/core.ValueHintType.md#imageattachment)

Instructs Coda to render this value as a Image with proper beautifulImage properties.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:578](https://github.com/coda/packs-sdk/blob/main/schema.ts#L578)

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

• `Optional` **outline**: `boolean`

Boolean specifying whether or not to add outline to rendered images. Defaults to true.

#### Defined in

[schema.ts:583](https://github.com/coda/packs-sdk/blob/main/schema.ts#L583)

___

### round

• `Optional` **round**: `boolean`

Boolean specifying whether or not to add rounded corners to rendered images. Defaults to true.

#### Defined in

[schema.ts:588](https://github.com/coda/packs-sdk/blob/main/schema.ts#L588)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:632](https://github.com/coda/packs-sdk/blob/main/schema.ts#L632)
