---
title: "NumericSchema"
---
# Interface: NumericSchema

[core](../modules/core.md).NumericSchema

A schema representing a return value or object property that is a numeric value,
i.e. a raw number with an optional decimal precision.

## Hierarchy

- `BaseNumberSchema`

  ↳ **`NumericSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Percent`](../enums/core.ValueHintType.md#percent)

If specified, instructs Coda to render this value as a percentage.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:249](https://github.com/coda/packs-sdk/blob/main/schema.ts#L249)

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

### precision

• `Optional` **precision**: `number`

The decimal precision. The number will be rounded to this precision when rendered.

#### Defined in

[schema.ts:251](https://github.com/coda/packs-sdk/blob/main/schema.ts#L251)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:238](https://github.com/coda/packs-sdk/blob/main/schema.ts#L238)

___

### useThousandsSeparator

• `Optional` **useThousandsSeparator**: `boolean`

If specified, will render thousands separators for large numbers, e.g. `1,234,567.89`.

#### Defined in

[schema.ts:253](https://github.com/coda/packs-sdk/blob/main/schema.ts#L253)
