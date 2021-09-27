# Interface: CurrencySchema

## Hierarchy

- `BaseNumberSchema`

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

#### Defined in

[schema.ts:102](https://github.com/coda/packs-sdk/blob/main/schema.ts#L102)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:108](https://github.com/coda/packs-sdk/blob/main/schema.ts#L108)

___

### description

• `Optional` **description**: `string`

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:72](https://github.com/coda/packs-sdk/blob/main/schema.ts#L72)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

#### Defined in

[schema.ts:109](https://github.com/coda/packs-sdk/blob/main/schema.ts#L109)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:103](https://github.com/coda/packs-sdk/blob/main/schema.ts#L103)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:81](https://github.com/coda/packs-sdk/blob/main/schema.ts#L81)
