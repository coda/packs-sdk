---
title: "PackVersionDefinition"
---
# Interface: PackVersionDefinition

[core](../modules/core.md).PackVersionDefinition

The definition of the contents of a Pack at a specific version. This is the
heart of the implementation of a Pack.

## Hierarchy

- **`PackVersionDefinition`**

  ↳ [`PackDefinition`](core.PackDefinition.md)

## Properties

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/core.Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Defined in

[types.ts:855](https://github.com/coda/packs-sdk/blob/main/types.ts#L855)

___

### formats

• `Optional` **formats**: [`Format`](core.Format.md)[]

Definitions of this pack's column formats. See [Format](core.Format.md).

#### Defined in

[types.ts:889](https://github.com/coda/packs-sdk/blob/main/types.ts#L889)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Defined in

[types.ts:877](https://github.com/coda/packs-sdk/blob/main/types.ts#L877)

___

### formulas

• `Optional` **formulas**: ([`BooleanPackFormula`](../types/core.BooleanPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`NumericPackFormula`](../types/core.NumericPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`StringPackFormula`](../types/core.StringPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`ArraySchema`](core.ArraySchema.md)<[`Schema`](../types/core.Schema.md)\>\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`Schema`](../types/core.Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/core.Formula.md).

Note that button actions are also defined here. Buttons are simply formulas
with `isAction: true`.

#### Defined in

[types.ts:885](https://github.com/coda/packs-sdk/blob/main/types.ts#L885)

___

### networkDomains

• `Optional` **networkDomains**: `string`[]

Any domain(s) to which this pack makes fetcher requests. The domains this pack connects to must be
declared up front here, both to clearly communicate to users what a pack is capable of connecting to,
and for security reasons. These network domains are enforced at execution time: any fetcher request
to a domain not listed here will be rejected.

Only one network domain is allowed by default. If your pack has needs to connect to multiple domains
contact Coda support for approval.

#### Defined in

[types.ts:870](https://github.com/coda/packs-sdk/blob/main/types.ts#L870)

___

### syncTables

• `Optional` **syncTables**: [`SyncTable`](../types/core.SyncTable.md)[]

Definitions of this pack's sync tables. See [SyncTable](../types/core.SyncTable.md).

#### Defined in

[types.ts:893](https://github.com/coda/packs-sdk/blob/main/types.ts#L893)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/core.SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Defined in

[types.ts:860](https://github.com/coda/packs-sdk/blob/main/types.ts#L860)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Defined in

[types.ts:851](https://github.com/coda/packs-sdk/blob/main/types.ts#L851)
