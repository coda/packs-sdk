---
title: "CurrencyFormat"
---
# Enumeration: CurrencyFormat

Enumeration of formats supported by schemas that use [ValueHintType.Currency](ValueHintType.md#currency).

These affect how a numeric value is rendered in docs.

## Enumeration Members

### Accounting

• **Accounting**

Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
to allow the numeric values to line up vertically, e.g.

```
$       2.50
$      29.99
```

#### Defined in

[schema.ts:326](https://github.com/coda/packs-sdk/blob/main/schema.ts#L326)

___

### Currency

• **Currency**

Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.

#### Defined in

[schema.ts:316](https://github.com/coda/packs-sdk/blob/main/schema.ts#L316)

___

### Financial

• **Financial**

Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.

#### Defined in

[schema.ts:330](https://github.com/coda/packs-sdk/blob/main/schema.ts#L330)
