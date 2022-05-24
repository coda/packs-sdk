---
title: "EmailSchema"
---
# Interface: EmailSchema

A schema representing a return value or object property that is an email address.

An email address can be represented visually as an icon, an icon plus the email address, or
the just the email address.  Autocomplete against previously typed domain names is
also an option in the user interface.

## Hierarchy

- `BaseStringSchema`<[`Email`](../enums/ValueHintType.md#email)\>

  ↳ **`EmailSchema`**

## Properties

### autocomplete

• `Optional` **autocomplete**: `boolean`

Whether to auto-complete the email domain during user input.

#### Defined in

[schema.ts:455](https://github.com/coda/packs-sdk/blob/main/schema.ts#L455)

___

### codaType

• **codaType**: [`Email`](../enums/ValueHintType.md#email)

Instructs Coda to render this value as an email address.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:451](https://github.com/coda/packs-sdk/blob/main/schema.ts#L451)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:207](https://github.com/coda/packs-sdk/blob/main/schema.ts#L207)

___

### display

• `Optional` **display**: [`EmailDisplayType`](../enums/EmailDisplayType.md)

How the email should be displayed in the UI.

#### Defined in

[schema.ts:453](https://github.com/coda/packs-sdk/blob/main/schema.ts#L453)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:622](https://github.com/coda/packs-sdk/blob/main/schema.ts#L622)
