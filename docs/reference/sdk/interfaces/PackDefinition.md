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

[types.ts:450](https://github.com/coda/packs-sdk/blob/main/types.ts#L450)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[defaultAuthentication](PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:423](https://github.com/coda/packs-sdk/blob/main/types.ts#L423)

___

### description

• **description**: `string`

#### Defined in

[types.ts:448](https://github.com/coda/packs-sdk/blob/main/types.ts#L448)

___

### enabledConfigName

• `Optional` **enabledConfigName**: `string`

#### Defined in

[types.ts:452](https://github.com/coda/packs-sdk/blob/main/types.ts#L452)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:453](https://github.com/coda/packs-sdk/blob/main/types.ts#L453)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:454](https://github.com/coda/packs-sdk/blob/main/types.ts#L454)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formats](PackVersionDefinition.md#formats)

#### Defined in

[types.ts:434](https://github.com/coda/packs-sdk/blob/main/types.ts#L434)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulaNamespace](PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:432](https://github.com/coda/packs-sdk/blob/main/types.ts#L432)

___

### formulas

• `Optional` **formulas**: [`PackFormulas`](PackFormulas.md) \| [`Formula`](../types/Formula.md)<[`ParamDefs`](../types/ParamDefs.md)\>[]

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulas](PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:433](https://github.com/coda/packs-sdk/blob/main/types.ts#L433)

___

### id

• **id**: `number`

#### Defined in

[types.ts:445](https://github.com/coda/packs-sdk/blob/main/types.ts#L445)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:461](https://github.com/coda/packs-sdk/blob/main/types.ts#L461)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:451](https://github.com/coda/packs-sdk/blob/main/types.ts#L451)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:455](https://github.com/coda/packs-sdk/blob/main/types.ts#L455)

___

### name

• **name**: `string`

#### Defined in

[types.ts:446](https://github.com/coda/packs-sdk/blob/main/types.ts#L446)

___

### networkDomains

• `Optional` **networkDomains**: `string`[]

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[networkDomains](PackVersionDefinition.md#networkdomains)

#### Defined in

[types.ts:429](https://github.com/coda/packs-sdk/blob/main/types.ts#L429)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:449](https://github.com/coda/packs-sdk/blob/main/types.ts#L449)

___

### quotas

• `Optional` **quotas**: `Partial`<`Object`\>

#### Defined in

[types.ts:456](https://github.com/coda/packs-sdk/blob/main/types.ts#L456)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:457](https://github.com/coda/packs-sdk/blob/main/types.ts#L457)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:447](https://github.com/coda/packs-sdk/blob/main/types.ts#L447)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[syncTables](PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:435](https://github.com/coda/packs-sdk/blob/main/types.ts#L435)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[systemConnectionAuthentication](PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:428](https://github.com/coda/packs-sdk/blob/main/types.ts#L428)

___

### version

• **version**: `string`

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[version](PackVersionDefinition.md#version)

#### Defined in

[types.ts:419](https://github.com/coda/packs-sdk/blob/main/types.ts#L419)
