# Interface: CurrencySchema

## Hierarchy

- `BaseNumberSchema`

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

#### Defined in

[schema.ts:105](https://github.com/coda/packs-sdk/blob/main/schema.ts#L105)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:111](https://github.com/coda/packs-sdk/blob/main/schema.ts#L111)

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

[schema.ts:112](https://github.com/coda/packs-sdk/blob/main/schema.ts#L112)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:106](https://github.com/coda/packs-sdk/blob/main/schema.ts#L106)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:84](https://github.com/coda/packs-sdk/blob/main/schema.ts#L84)
