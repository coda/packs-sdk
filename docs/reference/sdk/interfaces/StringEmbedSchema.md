---
title: "StringEmbedSchema"
---
# Interface: StringEmbedSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as an embed value (e.g. a URL). Coda uses an external provider (iframely)
to handle all embeds by default. If there is no support for a given embed that you want to use,
you will need to use the `force` option which falls back to a generic iframe.

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

[schema.ts:521](https://github.com/coda/packs-sdk/blob/main/schema.ts#L521)

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

### force

• `Optional` **force**: `boolean`

Toggle whether to try to force embed the content in Coda. Should be kept to false for most cases.

By default, we use an external provider (iframely) that supports and normalizes embeds for different sites.
If you are trying to embed an uncommon site or one that is not supported by them,
you can set this to `true` to tell Coda to force render the embed. This renders a sandboxed iframe for the embed
but requires user consent per-domain to actually display the embed.

#### Defined in

[schema.ts:530](https://github.com/coda/packs-sdk/blob/main/schema.ts#L530)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:615](https://github.com/coda/packs-sdk/blob/main/schema.ts#L615)
