# Function: ensureUnreachable

[core](../modules/core.md).ensureUnreachable

▸ **ensureUnreachable**(`value`, `message?`): `never`

Helper for TypeScript to make sure that handling of code forks is exhaustive,
most commonly with a `switch` statement.

**`Example`**

```
enum MyEnum {
  Foo = 'Foo',
  Bar = 'Bar',
}

function handleEnum(value: MyEnum) {
  switch(value) {
    case MyEnum.Foo:
      return 'foo';
    case MyEnum.Bar:
      return 'bar';
    default:
      // This code is unreachable since the two cases above are exhaustive.
      // However, if a third value were added to MyEnum, TypeScript would flag
      // an error at this line, informing you that you need to update this piece of code.
      return ensureUnreachable(value);
  }
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `never` |
| `message?` | `string` |

#### Returns

`never`

#### Defined in

[helpers/ensure.ts:29](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L29)
