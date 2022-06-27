---
title: "MissingScopesError"
---
# Class: MissingScopesError

[core](../modules/core.md).MissingScopesError

Throw this error if the user needs to re-authenticate to gain OAuth scopes that have been added
to the pack since their connection was created, or scopes that are specific to a certain formula.
This is useful because Coda will always attempt to execute a formula even if a user has not yet
re-authenticated with all relevant scopes.

You don't *always* need to throw this specific error, as Coda will interpret a 403 (Forbidden)
status code error as a MissingScopesError when the user's connection was made without all
currently relevant scopes. This error exists because that default behavior is insufficient if
the OAuth service does not set a 403 status code (the OAuth spec doesn't specifically require
them to, after all).

## Hierarchy

- `Error`

  ↳ **`MissingScopesError`**

## Constructors

### constructor

• **new MissingScopesError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1034

• **new MissingScopesError**(`message?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:30

## Properties

### name

• **name**: `string` = `'MissingScopesError'`

The name of the error, for identiciation purposes.

#### Overrides

Error.name

#### Defined in

[api.ts:165](https://github.com/coda/packs-sdk/blob/main/api.ts#L165)
