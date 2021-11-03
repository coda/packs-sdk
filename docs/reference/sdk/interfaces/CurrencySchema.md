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

[schema.ts:314](https://github.com/coda/packs-sdk/blob/main/schema.ts#L314)

___

### currencyCode

• `Optional` **currencyCode**: `string`

A three-letter ISO 4217 currency code, e.g. USD or EUR.
If the currency code is not supported by Coda, the value will be rendered using USD.

#### Defined in

[schema.ts:320](https://github.com/coda/packs-sdk/blob/main/schema.ts#L320)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### format

• `Optional` **format**: [`CurrencyFormat`](../enums/CurrencyFormat.md)

#### Defined in

[schema.ts:321](https://github.com/coda/packs-sdk/blob/main/schema.ts#L321)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:315](https://github.com/coda/packs-sdk/blob/main/schema.ts#L315)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:217](https://github.com/coda/packs-sdk/blob/main/schema.ts#L217)
