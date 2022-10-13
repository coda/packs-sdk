# Function: joinUrl

[core](../modules/core.md).joinUrl

▸ **joinUrl**(...`tokens`): `string`

Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tokens` | `string`[] | Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator |

#### Returns

`string`

#### Defined in

[helpers/url.ts:47](https://github.com/coda/packs-sdk/blob/main/helpers/url.ts#L47)
