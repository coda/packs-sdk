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

[types.ts:872](https://github.com/coda/packs-sdk/blob/main/types.ts#L872)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[defaultAuthentication](PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:817](https://github.com/coda/packs-sdk/blob/main/types.ts#L817)

___

### description

• **description**: `string`

#### Defined in

[types.ts:870](https://github.com/coda/packs-sdk/blob/main/types.ts#L870)

___

### enabledConfigName

• `Optional` **enabledConfigName**: `string`

#### Defined in

[types.ts:874](https://github.com/coda/packs-sdk/blob/main/types.ts#L874)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:875](https://github.com/coda/packs-sdk/blob/main/types.ts#L875)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:876](https://github.com/coda/packs-sdk/blob/main/types.ts#L876)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

Definitions of this pack's column formats. See [Format](Format.md).

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formats](PackVersionDefinition.md#formats)

#### Defined in

[types.ts:853](https://github.com/coda/packs-sdk/blob/main/types.ts#L853)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulaNamespace](PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:839](https://github.com/coda/packs-sdk/blob/main/types.ts#L839)

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

[types.ts:849](https://github.com/coda/packs-sdk/blob/main/types.ts#L849)

___

### id

• **id**: `number`

#### Defined in

[types.ts:867](https://github.com/coda/packs-sdk/blob/main/types.ts#L867)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:883](https://github.com/coda/packs-sdk/blob/main/types.ts#L883)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:873](https://github.com/coda/packs-sdk/blob/main/types.ts#L873)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:877](https://github.com/coda/packs-sdk/blob/main/types.ts#L877)

___

### name

• **name**: `string`

#### Defined in

[types.ts:868](https://github.com/coda/packs-sdk/blob/main/types.ts#L868)

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

[types.ts:832](https://github.com/coda/packs-sdk/blob/main/types.ts#L832)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:871](https://github.com/coda/packs-sdk/blob/main/types.ts#L871)

___

### quotas

• `Optional` **quotas**: `Partial`<`Object`\>

#### Defined in

[types.ts:878](https://github.com/coda/packs-sdk/blob/main/types.ts#L878)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:879](https://github.com/coda/packs-sdk/blob/main/types.ts#L879)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:869](https://github.com/coda/packs-sdk/blob/main/types.ts#L869)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

Definitions of this pack's sync tables. See {@link SyncTable}.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[syncTables](PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:857](https://github.com/coda/packs-sdk/blob/main/types.ts#L857)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[systemConnectionAuthentication](PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:822](https://github.com/coda/packs-sdk/blob/main/types.ts#L822)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[version](PackVersionDefinition.md#version)

#### Defined in

[types.ts:813](https://github.com/coda/packs-sdk/blob/main/types.ts#L813)
