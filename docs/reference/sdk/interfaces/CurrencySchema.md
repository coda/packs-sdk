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

[schema.ts:320](https://github.com/coda/packs-sdk/blob/main/schema.ts#L320)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:327](https://github.com/coda/packs-sdk/blob/main/schema.ts#L327)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:191](https://github.com/coda/packs-sdk/blob/main/schema.ts#L191)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

A render format for further refining how the value is rendered.

#### Defined in

[schema.ts:329](https://github.com/coda/packs-sdk/blob/main/schema.ts#L329)

___

### precision

• `Optional` **precision**: `number`

The decimal precision. The value is rounded to this precision when rendered.

#### Defined in

[schema.ts:322](https://github.com/coda/packs-sdk/blob/main/schema.ts#L322)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:216](https://github.com/coda/packs-sdk/blob/main/schema.ts#L216)
