---
title: "CurrencyFormat"
---
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

[schema.ts:331](https://github.com/coda/packs-sdk/blob/main/schema.ts#L331)

___

### Currency

• **Currency** = `"currency"`

Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.

#### Defined in

[schema.ts:321](https://github.com/coda/packs-sdk/blob/main/schema.ts#L321)

___

### Financial

• **Financial** = `"financial"`

Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.

#### Defined in

[schema.ts:335](https://github.com/coda/packs-sdk/blob/main/schema.ts#L335)
