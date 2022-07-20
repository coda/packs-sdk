---
title: "LinkSchema"
---
# Interface: LinkSchema

[core](../modules/core.md).LinkSchema

A schema representing a return value or object property that is a hyperlink.

The link can be displayed in the UI in multiple ways, as per the above enumeration.

## Hierarchy

- `BaseStringSchema`<[`Url`](../enums/core.ValueHintType.md#url)\>

  ↳ **`LinkSchema`**

## Properties

### codaType

• **codaType**: [`Url`](../enums/core.ValueHintType.md#url)

Instructs Coda to render this value as a hyperlink.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:507](https://github.com/coda/packs-sdk/blob/main/schema.ts#L507)

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

### display

• `Optional` **display**: [`LinkDisplayType`](../enums/core.LinkDisplayType.md)

How the URL should be displayed in the UI.

#### Defined in

[schema.ts:509](https://github.com/coda/packs-sdk/blob/main/schema.ts#L509)

___

### force

• `Optional` **force**: `boolean`

Whether to force client embedding (only for LinkDisplayType.Embed) - for example, if user login required.

#### Defined in

[schema.ts:511](https://github.com/coda/packs-sdk/blob/main/schema.ts#L511)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:668](https://github.com/coda/packs-sdk/blob/main/schema.ts#L668)
