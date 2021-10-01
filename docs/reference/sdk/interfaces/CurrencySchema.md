# Interface: CurrencySchema

## Hierarchy

- `BaseNumberSchema`<[`Currency`](../enums/ValueHintType.md#currency)\>

  ↳ **`CurrencySchema`**

## Properties

### codaType

• **codaType**: [`Currency`](../enums/ValueHintType.md#currency)

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:129](https://github.com/coda/packs-sdk/blob/main/schema.ts#L129)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:135](https://github.com/coda/packs-sdk/blob/main/schema.ts#L135)

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

[schema.ts:136](https://github.com/coda/packs-sdk/blob/main/schema.ts#L136)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:130](https://github.com/coda/packs-sdk/blob/main/schema.ts#L130)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:92](https://github.com/coda/packs-sdk/blob/main/schema.ts#L92)
