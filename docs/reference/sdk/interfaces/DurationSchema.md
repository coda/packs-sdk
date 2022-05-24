---
title: "DurationSchema"
---
# Interface: DurationSchema

A schema representing a return value or object property that represents a duration. The value
should be provided as a string like "3 days" or "40 minutes 30 seconds".

## Hierarchy

- `BaseStringSchema`<[`Duration`](../enums/ValueHintType.md#duration)\>

  ↳ **`DurationSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Duration`](../enums/ValueHintType.md#duration)

An optional type hint instructing Coda about how to interpret or render this value.

#### Inherited from

BaseStringSchema.codaType

#### Defined in

[schema.ts:624](https://github.com/coda/packs-sdk/blob/main/schema.ts#L624)

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

### maxUnit

• `Optional` **maxUnit**: [`DurationUnit`](../enums/DurationUnit.md)

The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
and a value of "3 days 4 hours" is provided, it will be rendered as "3 days".

#### Defined in

[schema.ts:617](https://github.com/coda/packs-sdk/blob/main/schema.ts#L617)

___

### precision

• `Optional` **precision**: `number`

A refinement of [maxUnit](DurationSchema.md#maxunit) to use for rounding the duration when rendering.
Currently only `1` is supported, which is the same as omitting a value.

#### Defined in

[schema.ts:612](https://github.com/coda/packs-sdk/blob/main/schema.ts#L612)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:622](https://github.com/coda/packs-sdk/blob/main/schema.ts#L622)
