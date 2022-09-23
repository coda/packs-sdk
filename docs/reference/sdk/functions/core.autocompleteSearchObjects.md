---
title: "autocompleteSearchObjects"
---
# Function: autocompleteSearchObjects

[core](../modules/core.md).autocompleteSearchObjects

▸ **autocompleteSearchObjects**<`T`\>(`search`, `objs`, `displayKey`, `valueKey`): `Promise`<[`MetadataFormulaObjectResultType`](../interfaces/core.MetadataFormulaObjectResultType.md)[]\>

A helper to search over a list of objects representing candidate search results,
filtering to only those that match a search string, and converting the matching
objects into the format needed for autocomplete results.

A case-sensitive search is performed over each object's `displayKey` property.

A common pattern for implementing autocomplete for a formula pattern is to
make a request to an API endpoint that returns a list of all entities,
and then to take the user's partial input and search over those entities
for matches. The helper generalizes this use case.

**`Example`**

```
coda.makeParameter({
  type: ParameterType.Number,
  name: "userId",
  description: "The ID of a user.",
  autocomplete: async function(context, search) {
    // Suppose this endpoint returns a list of users that have the form
    // `{name: "Jane Doe", userId: 123, email: "jane@doe.com"}`
    const usersResponse = await context.fetcher.fetch("/api/users");
    // This will search over the name property of each object and filter to only
    // those that match. Then it will transform the matching objects into the form
    // `{display: "Jane Doe", value: 123}` which is what is required to render
    // autocomplete responses.
    return coda.autocompleteSearchObjects(search, usersResponse.body, "name", "userId");
  }
});
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `string` |
| `objs` | `T`[] |
| `displayKey` | keyof `T` |
| `valueKey` | keyof `T` |

#### Returns

`Promise`<[`MetadataFormulaObjectResultType`](../interfaces/core.MetadataFormulaObjectResultType.md)[]\>

#### Defined in

[api.ts:1243](https://github.com/coda/packs-sdk/blob/main/api.ts#L1243)
