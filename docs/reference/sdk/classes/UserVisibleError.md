# Class: UserVisibleError

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `internalError?` | `Error` |

#### Overrides

Error.constructor

#### Defined in

[api.ts:59](https://github.com/coda/packs-sdk/blob/main/api.ts#L59)

## Properties

### internalError

• `Readonly` **internalError**: `undefined` \| `Error`

#### Defined in

[api.ts:57](https://github.com/coda/packs-sdk/blob/main/api.ts#L57)

___

### isUserVisible

• `Readonly` **isUserVisible**: ``true``

#### Defined in

[api.ts:56](https://github.com/coda/packs-sdk/blob/main/api.ts#L56)
