---
title: "assertCondition"
---
# Function: assertCondition

▸ **assertCondition**(`condition`, `message?`): asserts condition

Helper to apply a TypeScript assertion to subsequent code. TypeScript can infer
type information from many expressions, and this helper applies those inferences
to all code that follows call to this function.

See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

**`example`**
```
function foo(value: string | number) {
  assertCondtion(typeof value === 'string');
  // TypeScript would otherwise compalin, because `value` could have been number,
  // but the above assertion refines the type based on the `typeof` expression.
  return value.toUpperCase();
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |
| `message?` | `string` |

#### Returns

asserts condition

#### Defined in

[helpers/ensure.ts:79](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L79)
