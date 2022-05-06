---
title: "PackDefinition"
---
# Interface: PackDefinition

**`deprecated`** use `#PackVersionDefinition`

The legacy complete definition of a Pack including un-versioned metadata.
This should only be used by legacy Coda pack implementations.

## Hierarchy

- [`PackVersionDefinition`](PackVersionDefinition.md)

  ↳ **`PackDefinition`**

## Properties

### category

• `Optional` **category**: `PackCategory`

#### Defined in

[types.ts:884](https://github.com/coda/packs-sdk/blob/main/types.ts#L884)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[defaultAuthentication](PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:831](https://github.com/coda/packs-sdk/blob/main/types.ts#L831)

___

### description

• **description**: `string`

#### Defined in

[types.ts:882](https://github.com/coda/packs-sdk/blob/main/types.ts#L882)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:886](https://github.com/coda/packs-sdk/blob/main/types.ts#L886)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:887](https://github.com/coda/packs-sdk/blob/main/types.ts#L887)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

Definitions of this pack's column formats. See [Format](Format.md).

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formats](PackVersionDefinition.md#formats)

#### Defined in

[types.ts:865](https://github.com/coda/packs-sdk/blob/main/types.ts#L865)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulaNamespace](PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:853](https://github.com/coda/packs-sdk/blob/main/types.ts#L853)

___

### formulas

• `Optional` **formulas**: ([`BooleanPackFormula`](../types/BooleanPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`NumericPackFormula`](../types/NumericPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`StringPackFormula`](../types/StringPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`ObjectPackFormula`](../types/ObjectPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md), [`ArraySchema`](ArraySchema.md)<[`Schema`](../types/Schema.md)\>\> \| [`ObjectPackFormula`](../types/ObjectPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md), [`Schema`](../types/Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/Formula.md).

Note that button actions are also defined here. Buttons are simply formulas
with `isAction: true`.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulas](PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:861](https://github.com/coda/packs-sdk/blob/main/types.ts#L861)

___

### id

• **id**: `number`

#### Defined in

[types.ts:879](https://github.com/coda/packs-sdk/blob/main/types.ts#L879)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:894](https://github.com/coda/packs-sdk/blob/main/types.ts#L894)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:885](https://github.com/coda/packs-sdk/blob/main/types.ts#L885)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:888](https://github.com/coda/packs-sdk/blob/main/types.ts#L888)

___

### name

• **name**: `string`

#### Defined in

[types.ts:880](https://github.com/coda/packs-sdk/blob/main/types.ts#L880)

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

[PackVersionDefinition](PackVersionDefinition.md).[networkDomains](PackVersionDefinition.md#networkdomains)

#### Defined in

[types.ts:846](https://github.com/coda/packs-sdk/blob/main/types.ts#L846)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:883](https://github.com/coda/packs-sdk/blob/main/types.ts#L883)

___

### quotas

• `Optional` **quotas**: `Partial`<{ `Basic`: `Quota` ; `Enterprise`: `Quota` ; `Pro`: `Quota` ; `Team`: `Quota`  }\>

#### Defined in

[types.ts:889](https://github.com/coda/packs-sdk/blob/main/types.ts#L889)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:890](https://github.com/coda/packs-sdk/blob/main/types.ts#L890)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:881](https://github.com/coda/packs-sdk/blob/main/types.ts#L881)

___

### syncTables

• `Optional` **syncTables**: [`SyncTable`](../types/SyncTable.md)[]

Definitions of this pack's sync tables. See [SyncTable](../types/SyncTable.md).

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[syncTables](PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:869](https://github.com/coda/packs-sdk/blob/main/types.ts#L869)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[systemConnectionAuthentication](PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:836](https://github.com/coda/packs-sdk/blob/main/types.ts#L836)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[version](PackVersionDefinition.md#version)

#### Defined in

[types.ts:827](https://github.com/coda/packs-sdk/blob/main/types.ts#L827)
