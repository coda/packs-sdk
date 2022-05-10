---
title: "Format"
---
# Interface: Format

[core](../modules/core.md).Format

Definition for a custom column type that users can apply to any column in any Coda table.
A column format tells Coda to interpret the value in a cell by executing a formula
using that value, typically looking up data related to that value from a third-party API.
For example, the Weather pack has a column format "Current Weather"; when applied to a column,
if you type a city or address into a cell in that column, that location will be used as the input
to a formula that fetches the current weather at that location, and the resulting object with
weather info will be shown in the cell.

A column format is just a wrapper around a formula defined in the [formulas](core.PackDefinition.md#formulas) section
of your pack definition. It tells Coda to execute that particular formula using the value
of the cell as input.

The formula referenced by a format must have exactly one required parameter.

You may optionally specify one or more [matchers](core.Format.md#matchers), which are regular expressions
that can be matched against values that users paste into table cells, to determine if
this Format is applicable to that value. Matchers help users realize that there is a pack
format that may augment their experience of working with such values.

For example, if you're building a Wikipedia pack, you may write a matcher regular expression
that looks for Wikipedia article URLs, if you have a formula that can fetch structured data
given an article URL. This would help users discover that there is a pack that can fetch
structured data given only a url.

At present, matchers will only be run on URLs and not other text values.

## Properties

### formulaName

• **formulaName**: `string`

The name of the formula to invoke for values in columns using this format.
This must correspond to the name of a regular, public formula defined in this pack.

#### Defined in

[types.ts:736](https://github.com/coda/packs-sdk/blob/main/types.ts#L736)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`** Namespaces are being removed from the product.

#### Defined in

[types.ts:731](https://github.com/coda/packs-sdk/blob/main/types.ts#L731)

___

### hasNoConnection

• `Optional` **hasNoConnection**: `boolean`

**`deprecated`** No longer needed, will be inferred from the referenced formula.

#### Defined in

[types.ts:738](https://github.com/coda/packs-sdk/blob/main/types.ts#L738)

___

### instructions

• `Optional` **instructions**: `string`

A brief, optional explanation of how users should use this format, for example, what kinds
of values they should put in columns using this format.

#### Defined in

[types.ts:743](https://github.com/coda/packs-sdk/blob/main/types.ts#L743)

___

### matchers

• `Optional` **matchers**: `RegExp`[]

A list of regular expressions that match URLs that the formula implementing this format
is capable of handling. As described in [Format](core.Format.md), this is a discovery mechanism.

#### Defined in

[types.ts:748](https://github.com/coda/packs-sdk/blob/main/types.ts#L748)

___

### name

• **name**: `string`

The name of this column format. This will show to users in the column type chooser.

#### Defined in

[types.ts:729](https://github.com/coda/packs-sdk/blob/main/types.ts#L729)

___

### placeholder

• `Optional` **placeholder**: `string`

**`deprecated`** Currently unused.

#### Defined in

[types.ts:752](https://github.com/coda/packs-sdk/blob/main/types.ts#L752)
