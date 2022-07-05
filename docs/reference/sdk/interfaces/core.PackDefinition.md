---
title: "PackDefinition"
---
# Interface: PackDefinition

[core](../modules/core.md).PackDefinition

**`Deprecated`**

use `#PackVersionDefinition`

The legacy complete definition of a Pack including un-versioned metadata.
This should only be used by legacy Coda pack implementations.

## Hierarchy

- [`PackVersionDefinition`](core.PackVersionDefinition.md)

  ↳ **`PackDefinition`**

## Properties

### category

• `Optional` **category**: `PackCategory`

#### Defined in

[types.ts:908](https://github.com/coda/packs-sdk/blob/main/types.ts#L908)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/core.Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[defaultAuthentication](core.PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:855](https://github.com/coda/packs-sdk/blob/main/types.ts#L855)

___

### description

• **description**: `string`

#### Defined in

[types.ts:906](https://github.com/coda/packs-sdk/blob/main/types.ts#L906)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:910](https://github.com/coda/packs-sdk/blob/main/types.ts#L910)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:911](https://github.com/coda/packs-sdk/blob/main/types.ts#L911)

___

### formats

• `Optional` **formats**: [`Format`](core.Format.md)[]

Definitions of this pack's column formats. See [Format](core.Format.md).

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formats](core.PackVersionDefinition.md#formats)

#### Defined in

[types.ts:889](https://github.com/coda/packs-sdk/blob/main/types.ts#L889)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`Deprecated`**

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formulaNamespace](core.PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:877](https://github.com/coda/packs-sdk/blob/main/types.ts#L877)

___

### formulas

• `Optional` **formulas**: ([`BooleanPackFormula`](../types/core.BooleanPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`NumericPackFormula`](../types/core.NumericPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`StringPackFormula`](../types/core.StringPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`ArraySchema`](core.ArraySchema.md)<[`Schema`](../types/core.Schema.md)\>\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`Schema`](../types/core.Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/core.Formula.md).

Note that button actions are also defined here. Buttons are simply formulas
with `isAction: true`.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[formulas](core.PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:885](https://github.com/coda/packs-sdk/blob/main/types.ts#L885)

___

### id

• **id**: `number`

#### Defined in

[types.ts:903](https://github.com/coda/packs-sdk/blob/main/types.ts#L903)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:918](https://github.com/coda/packs-sdk/blob/main/types.ts#L918)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:909](https://github.com/coda/packs-sdk/blob/main/types.ts#L909)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:912](https://github.com/coda/packs-sdk/blob/main/types.ts#L912)

___

### name

• **name**: `string`

#### Defined in

[types.ts:904](https://github.com/coda/packs-sdk/blob/main/types.ts#L904)

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

[types.ts:870](https://github.com/coda/packs-sdk/blob/main/types.ts#L870)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:907](https://github.com/coda/packs-sdk/blob/main/types.ts#L907)

___

### quotas

• `Optional` **quotas**: `Partial`<{ `Basic`: `Quota` ; `Enterprise`: `Quota` ; `Pro`: `Quota` ; `Team`: `Quota`  }\>

#### Defined in

[types.ts:913](https://github.com/coda/packs-sdk/blob/main/types.ts#L913)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:914](https://github.com/coda/packs-sdk/blob/main/types.ts#L914)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:905](https://github.com/coda/packs-sdk/blob/main/types.ts#L905)

___

### syncTables

• `Optional` **syncTables**: [`SyncTable`](../types/core.SyncTable.md)[]

Definitions of this pack's sync tables. See [SyncTable](../types/core.SyncTable.md).

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[syncTables](core.PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:893](https://github.com/coda/packs-sdk/blob/main/types.ts#L893)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/core.SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[systemConnectionAuthentication](core.PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:860](https://github.com/coda/packs-sdk/blob/main/types.ts#L860)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](core.PackVersionDefinition.md).[version](core.PackVersionDefinition.md#version)

#### Defined in

[types.ts:851](https://github.com/coda/packs-sdk/blob/main/types.ts#L851)
