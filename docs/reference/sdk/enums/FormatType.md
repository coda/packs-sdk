# Enumeration: FormatType

Definition for a custom column type that users can apply to any column in any Coda table.
A column format tells Coda to interpret the value in a cell by executing a formula
using that value, typically looking up data related to that value from a third-party API.
For example, the Weather pack has a column format "Current Weather"; when applied to a column,
if you type a city or address into a cell in that column, that location will be used as the input
to a formula that fetches the current weather at that location, and the resulting object with
weather info will be shown in the cell.

A column format is just a wrapper around a formula defined in the [formulas](../interfaces/PackDefinition.md#formulas) section
of your pack definition. It tells Coda to execute that particular formula using the value
of the cell as input.

The formula referenced by a format must have exactly one required parameter.

You may optionally specify one or more [matchers](../interfaces/Format.md#matchers), which are regular expressions
that can be matched against values that users paste into table cells, to determine if
this Format is applicable to that value. Matchers help users realize that there is a pack
format that may augment their experience of working with such values.

For example, if you're building a Wikipedia pack, you may write a matcher regular expression
that looks for Wikipedia article URLs, if you have a formula that can fetch structured data
given an article URL. This would help users discover that there is a pack that can fetch
structured data given only a url.

At present, matchers will only be run on URLs and not other text values.

## Enumeration members

### ColumnFormatType

• **ColumnFormatType** = `"ColumnFormat"`

#### Defined in

[types.ts:710](https://github.com/coda/packs-sdk/blob/main/types.ts#L710)

___

### ControlFormatType

• **ControlFormatType** = `"ControlFormat"`

#### Defined in

[types.ts:711](https://github.com/coda/packs-sdk/blob/main/types.ts#L711)
