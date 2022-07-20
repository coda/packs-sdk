---
title: "NumericDurationSchema"
---
# Interface: NumericDurationSchema

[core](../modules/core.md).NumericDurationSchema

A schema representing a return value or object property that is provided as a number,
which Coda should interpret as a duration. The given number should be in seconds of the duration.

## Hierarchy

- `BaseNumberSchema`<[`Duration`](../enums/core.ValueHintType.md#duration)\>

  ↳ **`NumericDurationSchema`**

## Properties

### codaType

• **codaType**: [`Duration`](../enums/core.ValueHintType.md#duration)

Instructs Coda to render this value as a duration.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:318](https://github.com/coda/packs-sdk/blob/main/schema.ts#L318)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:210](https://github.com/coda/packs-sdk/blob/main/schema.ts#L210)

___

### maxUnit

• `Optional` **maxUnit**: [`DurationUnit`](../enums/core.DurationUnit.md)

The unit to use for rounding the duration when rendering. For example, if using `DurationUnit.Days`,
and a value of 273600 is provided (3 days 4 hours) is provided, it will be rendered as "3 days".

#### Defined in

[schema.ts:328](https://github.com/coda/packs-sdk/blob/main/schema.ts#L328)

___

### precision

• `Optional` **precision**: `number`

A refinement of [maxUnit](core.DurationSchema.md#maxunit) to use for rounding the duration when rendering.
Currently only `1` is supported, which is the same as omitting a value.

#### Defined in

[schema.ts:323](https://github.com/coda/packs-sdk/blob/main/schema.ts#L323)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:239](https://github.com/coda/packs-sdk/blob/main/schema.ts#L239)
