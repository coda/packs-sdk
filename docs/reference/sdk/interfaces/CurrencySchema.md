---
title: "CurrencySchema"
---
# Interface: CurrencySchema

A schema representing a return value or object property that is an amount of currency.

## Hierarchy

- `BaseNumberSchema`<[`Currency`](../enums/ValueHintType.md#currency)\>

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

Instructs Coda to render this value as a currency amount.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:338](https://github.com/coda/packs-sdk/blob/main/schema.ts#L338)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:345](https://github.com/coda/packs-sdk/blob/main/schema.ts#L345)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:207](https://github.com/coda/packs-sdk/blob/main/schema.ts#L207)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

A render format for further refining how the value is rendered.

#### Defined in

[schema.ts:347](https://github.com/coda/packs-sdk/blob/main/schema.ts#L347)

___

### precision

• `Optional` **precision**: `number`

The decimal precision. The value is rounded to this precision when rendered.

#### Defined in

[schema.ts:340](https://github.com/coda/packs-sdk/blob/main/schema.ts#L340)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:234](https://github.com/coda/packs-sdk/blob/main/schema.ts#L234)
