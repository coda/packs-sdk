---
title: "makeMetadataFormula"
---
# Function: makeMetadataFormula

▸ **makeMetadataFormula**(`execute`, `options?`): [`MetadataFormula`](../types/MetadataFormula.md)

A wrapper that generates a formula definition from the function that implements a metadata formula.
It is uncommon to ever need to call this directly, normally you would just define the JavaScript
function implementation, and Coda will wrap it with this to generate a full metadata formula
definition.

All function-like behavior in a pack is ultimately implemented using formulas, like you would
define using [makeFormula](makeFormula.md). That is, a formula with a name, description, parameter list,
and an `execute` function body. This includes supporting utilities like paramter autocomplete functions.
This wrapper simply adds the surrounding boilerplate for a given JavaScript function so that
it is shaped like a Coda formula to be used at runtime.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execute` | [`MetadataFunction`](../types/MetadataFunction.md) |
| `options?` | `Object` |
| `options.connectionRequirement?` | [`ConnectionRequirement`](../enums/ConnectionRequirement.md) |

#### Returns

[`MetadataFormula`](../types/MetadataFormula.md)

#### Defined in

[api.ts:1059](https://github.com/coda/packs-sdk/blob/main/api.ts#L1059)
