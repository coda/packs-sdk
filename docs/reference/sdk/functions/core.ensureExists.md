---
title: "ensureExists"
---
# Function: ensureExists

[core](../modules/core.md).ensureExists

▸ **ensureExists**<`T`\>(`value`, `message?`): `T`

Helper to check that a given value is defined, that is, is neither `undefined` nor `null`.
If the value is `undefined` or `null`, an error will be raised at runtime.

This is typically used to inform TypeScript that you expect a given value to always exist.
Calling this function refines a type that can otherwise be null or undefined.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `undefined` \| ``null`` \| `T` |
| `message?` | `string` |

#### Returns

`T`
