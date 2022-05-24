---
title: "LinkSchema"
---
# Interface: LinkSchema

A schema representing a return value or object property that is a hyperlink.

The link can be displayed in the UI in multiple ways, as per the above enumeration.

## Hierarchy

- `BaseStringSchema`<[`Url`](../enums/ValueHintType.md#url)\>

  ↳ **`LinkSchema`**

## Properties

### codaType

• **codaType**: [`Url`](../enums/ValueHintType.md#url)

Instructs Coda to render this value as a hyperlink.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:488](https://github.com/coda/packs-sdk/blob/main/schema.ts#L488)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:200](https://github.com/coda/packs-sdk/blob/main/schema.ts#L200)

___

### display

• `Optional` **display**: [`LinkDisplayType`](../enums/LinkDisplayType.md)

How the URL should be displayed in the UI.

#### Defined in

[schema.ts:490](https://github.com/coda/packs-sdk/blob/main/schema.ts#L490)

___

### force

• `Optional` **force**: `boolean`

Whether to force client embedding (only for LinkDisplayType.Embed) - for example, if user login required.

#### Defined in

[schema.ts:492](https://github.com/coda/packs-sdk/blob/main/schema.ts#L492)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:615](https://github.com/coda/packs-sdk/blob/main/schema.ts#L615)
