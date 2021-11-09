# Interface: PackDefinition

**`deprecated`** use `#PackVersionDefinition`

The legacy complete definition of a Pack including un-versioned metadata.
This should only be used by legacy Coda pack implementations.

## Hierarchy

- [`PackVersionDefinition`](PackVersionDefinition.md)

  ↳ **`PackDefinition`**

## Properties

### category

• `Optional` **category**: [`PackCategory`](../enums/PackCategory.md)

#### Defined in

[types.ts:765](https://github.com/coda/packs-sdk/blob/main/types.ts#L765)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[defaultAuthentication](PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:710](https://github.com/coda/packs-sdk/blob/main/types.ts#L710)

___

### description

• **description**: `string`

#### Defined in

[types.ts:763](https://github.com/coda/packs-sdk/blob/main/types.ts#L763)

___

### enabledConfigName

• `Optional` **enabledConfigName**: `string`

#### Defined in

[types.ts:767](https://github.com/coda/packs-sdk/blob/main/types.ts#L767)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:768](https://github.com/coda/packs-sdk/blob/main/types.ts#L768)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:769](https://github.com/coda/packs-sdk/blob/main/types.ts#L769)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

Definitions of this pack's column formats. See [Format](Format.md).

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formats](PackVersionDefinition.md#formats)

#### Defined in

[types.ts:746](https://github.com/coda/packs-sdk/blob/main/types.ts#L746)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulaNamespace](PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:732](https://github.com/coda/packs-sdk/blob/main/types.ts#L732)

___

### formulas

• `Optional` **formulas**: [`PackFormulas`](PackFormulas.md) \| (`BooleanPackFormula`<[`ParamDefs`](../types/ParamDefs.md)\> \| `NumericPackFormula`<[`ParamDefs`](../types/ParamDefs.md)\> \| `StringPackFormula`<[`ParamDefs`](../types/ParamDefs.md)\> \| `ObjectPackFormula`<[`ParamDefs`](../types/ParamDefs.md), [`ArraySchema`](ArraySchema.md)<[`Schema`](../types/Schema.md)\>\> \| `ObjectPackFormula`<[`ParamDefs`](../types/ParamDefs.md), [`Schema`](../types/Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/Formula.md).

Note that button actions are also defind here. Buttons are simply formulas
with `isAction: true`.

Note also, this should always be an array of Formulas. The PackFormulas object structure is deprecated
and will be removed shortly.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulas](PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:742](https://github.com/coda/packs-sdk/blob/main/types.ts#L742)

___

### id

• **id**: `number`

#### Defined in

[types.ts:760](https://github.com/coda/packs-sdk/blob/main/types.ts#L760)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:776](https://github.com/coda/packs-sdk/blob/main/types.ts#L776)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:766](https://github.com/coda/packs-sdk/blob/main/types.ts#L766)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:770](https://github.com/coda/packs-sdk/blob/main/types.ts#L770)

___

### name

• **name**: `string`

#### Defined in

[types.ts:761](https://github.com/coda/packs-sdk/blob/main/types.ts#L761)

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

[types.ts:725](https://github.com/coda/packs-sdk/blob/main/types.ts#L725)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:764](https://github.com/coda/packs-sdk/blob/main/types.ts#L764)

___

### quotas

• `Optional` **quotas**: `Partial`<`Object`\>

#### Defined in

[types.ts:771](https://github.com/coda/packs-sdk/blob/main/types.ts#L771)

___

### rateLimits

• `Optional` **rateLimits**: [`RateLimits`](RateLimits.md)

#### Defined in

[types.ts:772](https://github.com/coda/packs-sdk/blob/main/types.ts#L772)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:762](https://github.com/coda/packs-sdk/blob/main/types.ts#L762)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

Definitions of this pack's sync tables. See {@link SyncTable}.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[syncTables](PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:750](https://github.com/coda/packs-sdk/blob/main/types.ts#L750)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[systemConnectionAuthentication](PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:715](https://github.com/coda/packs-sdk/blob/main/types.ts#L715)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[version](PackVersionDefinition.md#version)

#### Defined in

[types.ts:706](https://github.com/coda/packs-sdk/blob/main/types.ts#L706)
