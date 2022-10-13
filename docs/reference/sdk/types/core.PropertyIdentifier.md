---
nav: "PropertyIdentifier"
---
# Type alias: PropertyIdentifier<K\>

[core](../modules/core.md).PropertyIdentifier

Ƭ **PropertyIdentifier**<`K`\>: `K` \| `string` \| [`PropertyIdentifierDetails`](../interfaces/core.PropertyIdentifierDetails.md)

An identifier for an object schema property that is comprised of either an exact property match with the top-level
`properties or a json path (https://github.com/json-path/JsonPath) to a nested property.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` = `string` |

#### Defined in

[schema.ts:869](https://github.com/coda/packs-sdk/blob/main/schema.ts#L869)
