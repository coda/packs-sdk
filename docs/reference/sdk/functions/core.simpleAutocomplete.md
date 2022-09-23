---
title: "simpleAutocomplete"
---
# Function: simpleAutocomplete

[core](../modules/core.md).simpleAutocomplete

▸ **simpleAutocomplete**<`T`\>(`search`, `options`): `Promise`<[`MetadataFormulaObjectResultType`](../interfaces/core.MetadataFormulaObjectResultType.md)[]\>

Utility to search over an array of autocomplete results and return only those that
match the given search string.

You can do this yourself but this function helps simplify many common scenarios.
Note that if you have a hardcoded list of autocomplete options, you can simply specify
them directly as a list, you need not actually implement an autocomplete function.

The primary use case here is fetching a list of all possible results from an API
and then refining them using the user's current search string.

**`Example`**

```
autocomplete: async function(context, search) {
  const response = await context.fetcher.fetch({method: "GET", url: "/api/entities"});
  const allOptions = response.body.entities.map(entity => entity.name);
  return coda.simpleAutocomplete(search, allOptions);
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AutocompleteParameterTypes` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `undefined` \| `string` |
| `options` | (`TypeMap`[`AutocompleteParameterTypeMapping`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/core.SimpleAutocompleteOption.md)<`T`\>)[] |

#### Returns

`Promise`<[`MetadataFormulaObjectResultType`](../interfaces/core.MetadataFormulaObjectResultType.md)[]\>

#### Defined in

[api.ts:1179](https://github.com/coda/packs-sdk/blob/main/api.ts#L1179)
