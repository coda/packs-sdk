---
title: "PackDefinition"
---
# Interface: PackDefinition

[core](../modules/core.md).PackDefinition

**`deprecated`** use `#PackVersionDefinition`

The legacy complete definition of a Pack including un-versioned metadata.
This should only be used by legacy Coda pack implementations.

## Hierarchy

- [`PackVersionDefinition`](core.PackVersionDefinition.md)

  ↳ **`PackDefinition`**

## Properties

### category

• `Optional` **category**: `PackCategory`

#### Defined in

[types.ts:896](https://github.com/coda/packs-sdk/blob/main/types.ts#L896)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/core.Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[defaultAuthentication](core.PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:843](https://github.com/coda/packs-sdk/blob/main/types.ts#L843)

___

### description

• **description**: `string`

#### Defined in

[types.ts:894](https://github.com/coda/packs-sdk/blob/main/types.ts#L894)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:898](https://github.com/coda/packs-sdk/blob/main/types.ts#L898)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:899](https://github.com/coda/packs-sdk/blob/main/types.ts#L899)

___

### formats

• `Optional` **formats**: [`Format`](core.Format.md)[]

Definitions of this pack's column formats. See [Format](core.Format.md).

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formats](core.PackVersionDefinition.md#formats)

#### Defined in

[types.ts:877](https://github.com/coda/packs-sdk/blob/main/types.ts#L877)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formulaNamespace](core.PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:865](https://github.com/coda/packs-sdk/blob/main/types.ts#L865)

___

### formulas

• `Optional` **formulas**: ([`BooleanPackFormula`](../types/core.BooleanPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`NumericPackFormula`](../types/core.NumericPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`StringPackFormula`](../types/core.StringPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`ArraySchema`](core.ArraySchema.md)<[`Schema`](../types/core.Schema.md)\>\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`Schema`](../types/core.Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/core.Formula.md).

Note that button actions are also defined here. Buttons are simply formulas
with `isAction: true`.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formulas](core.PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:873](https://github.com/coda/packs-sdk/blob/main/types.ts#L873)

___

### id

• **id**: `number`

#### Defined in

[types.ts:891](https://github.com/coda/packs-sdk/blob/main/types.ts#L891)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:906](https://github.com/coda/packs-sdk/blob/main/types.ts#L906)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:897](https://github.com/coda/packs-sdk/blob/main/types.ts#L897)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:900](https://github.com/coda/packs-sdk/blob/main/types.ts#L900)

___

### name

• **name**: `string`

#### Defined in

[types.ts:892](https://github.com/coda/packs-sdk/blob/main/types.ts#L892)

___

### networkDomains

• `Optional` **networkDomains**: `string`[]

Any domain(s) to which this pack makes fetcher requests. The domains this pack connects to must be
declared up front here, both to clearly communicate to users what a pack is capable of connecting to,
and for security reasons. These network domains are enforced at execution time: any fetcher request
to a domain not listed here will be rejected.

Only one network domain is allowed by default. If your pack has needs to connect to multiple domains
contact Coda support for approval.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[networkDomains](core.PackVersionDefinition.md#networkdomains)

#### Defined in

[types.ts:858](https://github.com/coda/packs-sdk/blob/main/types.ts#L858)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:895](https://github.com/coda/packs-sdk/blob/main/types.ts#L895)

___

### quotas

• `Optional` **quotas**: `Partial`<{ `Basic`: `Quota` ; `Enterprise`: `Quota` ; `Pro`: `Quota` ; `Team`: `Quota`  }\>

#### Defined in

[types.ts:901](https://github.com/coda/packs-sdk/blob/main/types.ts#L901)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:902](https://github.com/coda/packs-sdk/blob/main/types.ts#L902)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:893](https://github.com/coda/packs-sdk/blob/main/types.ts#L893)

___

### syncTables

• `Optional` **syncTables**: [`SyncTable`](../types/core.SyncTable.md)[]

Definitions of this pack's sync tables. See [SyncTable](../types/core.SyncTable.md).

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[syncTables](core.PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:881](https://github.com/coda/packs-sdk/blob/main/types.ts#L881)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/core.SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[systemConnectionAuthentication](core.PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:848](https://github.com/coda/packs-sdk/blob/main/types.ts#L848)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[version](core.PackVersionDefinition.md#version)

#### Defined in

[types.ts:839](https://github.com/coda/packs-sdk/blob/main/types.ts#L839)
