# Enumeration: CurrencyFormat

Enumeration of formats supported by schemas that use [ValueHintType.Currency](ValueHintType.md#currency).

These affect how a numeric value is rendered in docs.

## Enumeration members

### Accounting

• **Accounting** = `"accounting"`

Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
to allow the numeric values to line up vertically, e.g.

```
$       2.50
$      29.99
```

#### Defined in

[schema.ts:306](https://github.com/coda/packs-sdk/blob/main/schema.ts#L306)

___

### Currency

• **Currency** = `"currency"`

Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.

#### Defined in

[schema.ts:296](https://github.com/coda/packs-sdk/blob/main/schema.ts#L296)

___

### Financial

• **Financial** = `"financial"`

Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.

#### Defined in

[schema.ts:310](https://github.com/coda/packs-sdk/blob/main/schema.ts#L310)
