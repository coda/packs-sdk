# Function: simpleAutocomplete

<<<<<<< HEAD
▸ **simpleAutocomplete**<`T`\>(`search`, `options`): `Promise`<[`MetadataFormulaObjectResultType`](../interfaces/MetadataFormulaObjectResultType.md)[]\>
=======
▸ **simpleAutocomplete**<`T`\>(`search`, `options`): `Promise`<[`MetadataFormulaObjectResultType`](../interfaces/MetadataFormulaObjectResultType.md)<`TypeMap`[`ParameterTypeMap`[`T`]]\>[]\>
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

Utility to search over an array of autocomplete results and return only those that
match the given search string.

You can do this yourself but this function helps simplify many common scenarios.
Note that if you have a hardcoded list of autocomplete options, you can simply specify
them directly as a list, you need not actually implement an autocomplete function.

The primary use case here is fetching a list of all possible results from an API
and then refining them using the user's current search string.

**`example`**
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
| `T` | extends [`String`](../enums/ParameterType.md#string) \| [`Number`](../enums/ParameterType.md#number) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `undefined` \| `string` |
<<<<<<< HEAD
| `options` | (`TypeMap`[`ParameterTypeMap`[`T`]] \| [`SimpleAutocompleteOption`](../interfaces/SimpleAutocompleteOption.md)<`T`\>)[] |
=======
| `options` | `AutocompleteReturnType`<`T`\> |
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

#### Returns

`Promise`<[`MetadataFormulaObjectResultType`](../interfaces/MetadataFormulaObjectResultType.md)<`TypeMap`[`ParameterTypeMap`[`T`]]\>[]\>

#### Defined in

<<<<<<< HEAD
[api.ts:1054](https://github.com/coda/packs-sdk/blob/main/api.ts#L1054)
=======
[api.ts:1071](https://github.com/coda/packs-sdk/blob/main/api.ts#L1071)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
