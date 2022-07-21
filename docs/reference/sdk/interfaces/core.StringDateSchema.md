---
title: "StringDateSchema"
---
# Interface: StringDateSchema

[core](../modules/core.md).StringDateSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as a date. Coda is able to flexibly parse a number of formal
and informal string representations of dates. For maximum accuracy, consider using an
ISO 8601 date string (e.g. 2021-10-29): https://en.wikipedia.org/wiki/ISO_8601.

## Hierarchy

- `BaseStringSchema`<[`Date`](../enums/core.ValueHintType.md#date)\>

  ↳ **`StringDateSchema`**

## Properties

### codaType

• **codaType**: [`Date`](../enums/core.ValueHintType.md#date)

Instructs Coda to render this value as a date.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:522](https://github.com/coda/packs-sdk/blob/main/schema.ts#L522)

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

### format

• `Optional` **format**: `string`

A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:529](https://github.com/coda/packs-sdk/blob/main/schema.ts#L529)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:668](https://github.com/coda/packs-sdk/blob/main/schema.ts#L668)
