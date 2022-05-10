---
title: "makeAttributionNode"
---
# Function: makeAttributionNode

[core](../modules/core.md).makeAttributionNode

▸ **makeAttributionNode**<`T`\>(`node`): `T`

A helper for constructing attribution text, links, or images that render along with a Pack value.

Many APIs have licensing requirements that ask for specific attribution to be included
when using their data. For example, a stock photo API may require attribution text
and a logo.

Any [IdentityDefinition](../interfaces/core.IdentityDefinition.md) can include one or more attribution nodes that will be
rendered any time a value with that identity is rendered in a doc.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`AttributionNode`](../types/core.AttributionNode.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:940](https://github.com/coda/packs-sdk/blob/main/schema.ts#L940)
