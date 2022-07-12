---
title: "StringTimeSchema"
---
# Interface: StringTimeSchema

[core](../modules/core.md).StringTimeSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as a time.

## Hierarchy

- `BaseStringSchema`<[`Time`](../enums/core.ValueHintType.md#time)\>

  ↳ **`StringTimeSchema`**

## Properties

### codaType

• **codaType**: [`Time`](../enums/core.ValueHintType.md#time)

Instructs Coda to render this value as a date.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:536](https://github.com/coda/packs-sdk/blob/main/schema.ts#L536)

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

### format

• `Optional` **format**: `string`

A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:543](https://github.com/coda/packs-sdk/blob/main/schema.ts#L543)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:632](https://github.com/coda/packs-sdk/blob/main/schema.ts#L632)
