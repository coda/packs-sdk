---
title: "StringEmbedSchema"
---
# Interface: StringEmbedSchema

## Hierarchy

- `BaseStringSchema`<[`Embed`](../enums/ValueHintType.md#embed)\>

  ↳ **`StringEmbedSchema`**

## Properties

### codaType

• **codaType**: [`Embed`](../enums/ValueHintType.md#embed)

Instructs Coda to render this value as an embed.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:415](https://github.com/coda/packs-sdk/blob/main/schema.ts#L415)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:194](https://github.com/coda/packs-sdk/blob/main/schema.ts#L194)

___

### force

• `Optional` **force**: `boolean`

Toggle whether to try to force embed the content in Coda. Should be kept to false for most cases.

By default, we use an external provider that supports and normalizes embeds for different sites. If you are trying
to embed a non-common site or one that is not supported by this provider,
you can set this to `true` to tell Coda to force render the embed. This renders a sandboxed iframe for the embed
but requires user consent to actually display the embed.

#### Defined in

[schema.ts:424](https://github.com/coda/packs-sdk/blob/main/schema.ts#L424)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:509](https://github.com/coda/packs-sdk/blob/main/schema.ts#L509)
