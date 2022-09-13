---
title: "StringDateTimeSchema"
---
# Interface: StringDateTimeSchema

[core](../modules/core.md).StringDateTimeSchema

A schema representing a return value or object property that is provided as a string,
which Coda should interpret as a datetime. Coda is able to flexibly a parse number of formal
and informal string representations of dates. For maximum accuracy, consider using an
ISO 8601 datetime string (e.g. 2021-11-03T19:43:58): https://en.wikipedia.org/wiki/ISO_8601.

## Hierarchy

- `BaseStringSchema`<[`DateTime`](../enums/core.ValueHintType.md#datetime)\>

  ↳ **`StringDateTimeSchema`**

## Properties

### codaType

• **codaType**: [`DateTime`](../enums/core.ValueHintType.md#datetime)

Instructs Coda to render this value as a date.

#### Overrides

BaseStringSchema.codaType

#### Defined in

[schema.ts:600](https://github.com/coda/packs-sdk/blob/main/schema.ts#L600)

___

### dateFormat

• `Optional` **dateFormat**: `string`

A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:607](https://github.com/coda/packs-sdk/blob/main/schema.ts#L607)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:215](https://github.com/coda/packs-sdk/blob/main/schema.ts#L215)

___

### timeFormat

• `Optional` **timeFormat**: `string`

A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:614](https://github.com/coda/packs-sdk/blob/main/schema.ts#L614)

___

### type

• **type**: [`String`](../enums/core.ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:691](https://github.com/coda/packs-sdk/blob/main/schema.ts#L691)
