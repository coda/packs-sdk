---
title: "UserVisibleError"
---
# Class: UserVisibleError

[core](../modules/core.md).UserVisibleError

An error whose message will be shown to the end user in the UI when it occurs.
If an error is encountered in a formula and you want to describe the error
to the end user, throw a UserVisibleError with a user-friendly message
and the Coda UI will display the message.

## Hierarchy

- `Error`

  ↳ **`UserVisibleError`**

## Constructors

### constructor

• **new UserVisibleError**(`message?`, `internalError?`)

Use to construct a user-visible error.

**`example`**
```
if (!url.startsWith("http")) {
  throw new coda.UserVisibleError("Please provide a valid url.");
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `internalError?` | `Error` |

#### Overrides

Error.constructor

#### Defined in

[api.ts:75](https://github.com/coda/packs-sdk/blob/main/api.ts#L75)
