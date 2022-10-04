---
nav: "MetadataFormula"
---
# Type alias: MetadataFormula

[core](../modules/core.md).MetadataFormula

Ƭ **MetadataFormula**: [`BaseFormula`](core.BaseFormula.md)<[[`ParamDef`](../interfaces/core.ParamDef.md)<[`string`](../enums/core.Type.md#string)\>, [`ParamDef`](../interfaces/core.ParamDef.md)<[`string`](../enums/core.Type.md#string)\>], `any`\> & { `schema?`: `any`  }

A formula that returns metadata relating to a core pack building block, like a sync table,
a formula parameter, or a user account. Examples include [getSchema](../interfaces/core.DynamicOptions.md#getschema),
[getConnectionName](../interfaces/core.BaseAuthentication.md#getconnectionname), and [autocomplete](../interfaces/core.ParamDef.md#autocomplete).

Many pack building blocks make use of supporting features that often require JavaScript
or an API request to implement. For example, fetching the list of available autocomplete
options for a formula parameter often requires making an API call. The logic to implement this
and the context required, like a [Fetcher](../interfaces/core.Fetcher.md) is very similar to that of a pack formula itself,
so metadata formulas intentionally resemble regular formulas.

A variety of tasks like those mentioned above can all be accomplished with formulas that
share the same structure, so all of these supporting features are defined as `MetadataFormulas`.
You typically do not need to define a `MetadataFormula` explicitly, but rather can simply define
the JavaScript function that implements the formula. Coda will wrap this function with the necessary
formula boilerplate to make it look like a complete Coda formula.

All metadata functions are passed an [ExecutionContext](../interfaces/core.ExecutionContext.md) as the first parameter,
and the optional second parameter is a string whose purpose and value varies depending on
the use case. For example, a metadata formula that implements parameter autocomplete will
be passed the user's current search if the user has started typing to search for a result.
Not all metadata formulas make use of this second parameter.

Autocomplete metadata functions are also passed a third parameter, which is a dictionary
that has the values the user has specified for each of the other parameters in the formula
(if any), so that the autocomplete options for one parameter can depend on the current
values of the others. This is dictionary mapping the names of each parameter to its
current value.

#### Defined in

[api.ts:1113](https://github.com/coda/packs-sdk/blob/main/api.ts#L1113)
