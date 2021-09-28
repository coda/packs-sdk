# Interface: CurrencySchema

## Hierarchy

- `BaseNumberSchema`

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

#### Defined in

[schema.ts:122](https://github.com/coda/packs-sdk/blob/main/schema.ts#L122)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:128](https://github.com/coda/packs-sdk/blob/main/schema.ts#L128)

___

### description

• `Optional` **description**: `string`

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:75](https://github.com/coda/packs-sdk/blob/main/schema.ts#L75)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

#### Defined in

[schema.ts:129](https://github.com/coda/packs-sdk/blob/main/schema.ts#L129)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:123](https://github.com/coda/packs-sdk/blob/main/schema.ts#L123)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:85](https://github.com/coda/packs-sdk/blob/main/schema.ts#L85)
