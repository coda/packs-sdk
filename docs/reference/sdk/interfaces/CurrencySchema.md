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

[schema.ts:260](https://github.com/coda/packs-sdk/blob/main/schema.ts#L260)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:266](https://github.com/coda/packs-sdk/blob/main/schema.ts#L266)

___

### description

• `Optional` **description**: `string`

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:186](https://github.com/coda/packs-sdk/blob/main/schema.ts#L186)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

#### Defined in

[schema.ts:267](https://github.com/coda/packs-sdk/blob/main/schema.ts#L267)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:261](https://github.com/coda/packs-sdk/blob/main/schema.ts#L261)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:203](https://github.com/coda/packs-sdk/blob/main/schema.ts#L203)
