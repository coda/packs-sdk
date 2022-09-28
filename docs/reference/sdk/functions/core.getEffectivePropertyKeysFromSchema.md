---
nav: "getEffectivePropertyKeysFromSchema"
---
# Function: getEffectivePropertyKeysFromSchema

[core](../modules/core.md).getEffectivePropertyKeysFromSchema

▸ **getEffectivePropertyKeysFromSchema**(`schema`): `string`[] \| `undefined`

A helper to extract properties fromKeys from a schema object. This is mostly useful
in processing the context.sync.schema in a sync formula, where the schema would only
include a subset of properties which were manually selected by the Pack user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`](../types/core.Schema.md) |

#### Returns

`string`[] \| `undefined`

#### Defined in

[helpers/schema.ts:9](https://github.com/coda/packs-sdk/blob/main/helpers/schema.ts#L9)
