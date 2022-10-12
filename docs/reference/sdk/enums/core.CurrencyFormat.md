---
nav: "CurrencyFormat"
---
# Enumeration: CurrencyFormat

[core](../modules/core.md).CurrencyFormat

Enumeration of formats supported by schemas that use [Currency](core.ValueHintType.md#currency).

These affect how a numeric value is rendered in docs.

## Enumeration Members

### Accounting

• **Accounting** = ``"accounting"``

Indicates the value should be rendered as a number with a currency symbol as a prefix, but padded
to allow the numeric values to line up vertically, e.g.

```
$       2.50
$      29.99
```

#### Defined in

[schema.ts:361](https://github.com/coda/packs-sdk/blob/main/schema.ts#L361)

___

### Currency

• **Currency** = ``"currency"``

Indicates the value should be rendered as a number with a currency symbol as a prefix, e.g. `$2.50`.

#### Defined in

[schema.ts:351](https://github.com/coda/packs-sdk/blob/main/schema.ts#L351)

___

### Financial

• **Financial** = ``"financial"``

Indicates the value should be rendered as a number without a currency symbol, e.g. `2.50`.

#### Defined in

[schema.ts:365](https://github.com/coda/packs-sdk/blob/main/schema.ts#L365)
