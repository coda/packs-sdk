---
title: "getQueryParams"
---
# Function: getQueryParams

[core](../modules/core.md).getQueryParams

▸ **getQueryParams**(`url`): `Object`

Helper to take a URL string and return the parameters (if any) as a JavaScript object.

**`Example`**
```
// Returns `{token: "asdf", limit: "5"}`
let params = getQueryParams("/someApi/someEndpoint?token=asdf&limit=5");
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Object`
