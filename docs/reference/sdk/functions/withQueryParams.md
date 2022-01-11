---
title: "withQueryParams"
---
# Function: withQueryParams

▸ **withQueryParams**(`url`, `params?`): `string`

Helper to create a new URL by appending parameters to a base URL.

The input URL may or may not having existing parameters.

**`example`**
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

#### Defined in

[helpers/url.ts:16](https://github.com/coda/packs-sdk/blob/main/helpers/url.ts#L16)
