---
title: "makeAttributionNode"
---
# Function: makeAttributionNode

▸ **makeAttributionNode**<`T`\>(`node`): `T`

A helper for constructing attribution text, links, or images that render along with a Pack value.

Many APIs have licensing requirements that ask for specific attribution to be included
when using their data. For example, a stock photo API may require attribution text
and a logo.

Any [IdentityDefinition](../interfaces/IdentityDefinition.md) can include one or more attribution nodes that will be
rendered any time a value with that identity is rendered in a doc.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AttributionNode`](../types/AttributionNode.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:954](https://github.com/coda/packs-sdk/blob/main/schema.ts#L954)
