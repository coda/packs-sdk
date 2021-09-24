# Interface: CurrencySchema

## Hierarchy

- [`NumberSchema`](NumberSchema.md)

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

#### Overrides

[NumberSchema](NumberSchema.md).[codaType](NumberSchema.md#codatype)

#### Defined in

[schema.ts:100](https://github.com/coda/packs-sdk/blob/main/schema.ts#L100)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:106](https://github.com/coda/packs-sdk/blob/main/schema.ts#L106)

___

### description

• `Optional` **description**: `string`

#### Inherited from

[NumberSchema](NumberSchema.md).[description](NumberSchema.md#description)

#### Defined in

[schema.ts:75](https://github.com/coda/packs-sdk/blob/main/schema.ts#L75)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

#### Defined in

[schema.ts:107](https://github.com/coda/packs-sdk/blob/main/schema.ts#L107)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:101](https://github.com/coda/packs-sdk/blob/main/schema.ts#L101)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

[NumberSchema](NumberSchema.md).[type](NumberSchema.md#type)

#### Defined in

[schema.ts:83](https://github.com/coda/packs-sdk/blob/main/schema.ts#L83)
