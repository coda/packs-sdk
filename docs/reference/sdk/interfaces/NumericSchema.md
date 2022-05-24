---
title: "NumericSchema"
---
# Interface: NumericSchema

A schema representing a return value or object property that is a numeric value,
i.e. a raw number with an optional decimal precision.

## Hierarchy

- `BaseNumberSchema`

  ↳ **`NumericSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Percent`](../enums/ValueHintType.md#percent)

If specified, instructs Coda to render this value as a percentage.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:250](https://github.com/coda/packs-sdk/blob/main/schema.ts#L250)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:200](https://github.com/coda/packs-sdk/blob/main/schema.ts#L200)

___

### precision

• `Optional` **precision**: `number`

The decimal precision. The number will be rounded to this precision when rendered.

#### Defined in

[schema.ts:252](https://github.com/coda/packs-sdk/blob/main/schema.ts#L252)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:239](https://github.com/coda/packs-sdk/blob/main/schema.ts#L239)

___

### useThousandsSeparator

• `Optional` **useThousandsSeparator**: `boolean`

If specified, will render thousands separators for large numbers, e.g. `1,234,567.89`.

#### Defined in

[schema.ts:254](https://github.com/coda/packs-sdk/blob/main/schema.ts#L254)
