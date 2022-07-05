---
title: "withQueryParams"
---
# Function: withQueryParams

[core](../modules/core.md).withQueryParams

▸ **withQueryParams**(`url`, `params?`): `string`

Helper to create a new URL by appending parameters to a base URL.

The input URL may or may not having existing parameters.

**`Example`**

```
// Returns `"/someApi/someEndpoint?token=asdf&limit=5"`
let url = withQueryParams("/someApi/someEndpoint", {token: "asdf", limit: 5});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | `Object` |

#### Returns

`string`
