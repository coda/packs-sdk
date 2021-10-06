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

[types.ts:739](https://github.com/coda/packs-sdk/blob/main/types.ts#L739)

___

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[defaultAuthentication](PackVersionDefinition.md#defaultauthentication)

#### Defined in

[types.ts:684](https://github.com/coda/packs-sdk/blob/main/types.ts#L684)

___

### description

• **description**: `string`

#### Defined in

[types.ts:737](https://github.com/coda/packs-sdk/blob/main/types.ts#L737)

___

### enabledConfigName

• `Optional` **enabledConfigName**: `string`

#### Defined in

[types.ts:741](https://github.com/coda/packs-sdk/blob/main/types.ts#L741)

___

### exampleImages

• `Optional` **exampleImages**: `string`[]

#### Defined in

[types.ts:742](https://github.com/coda/packs-sdk/blob/main/types.ts#L742)

___

### exampleVideoIds

• `Optional` **exampleVideoIds**: `string`[]

#### Defined in

[types.ts:743](https://github.com/coda/packs-sdk/blob/main/types.ts#L743)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

Definitions of this pack's column formats. See [Format](Format.md).

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formats](PackVersionDefinition.md#formats)

#### Defined in

[types.ts:720](https://github.com/coda/packs-sdk/blob/main/types.ts#L720)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulaNamespace](PackVersionDefinition.md#formulanamespace)

#### Defined in

[types.ts:706](https://github.com/coda/packs-sdk/blob/main/types.ts#L706)

___

### formulas

• `Optional` **formulas**: [`PackFormulas`](PackFormulas.md) \| (`BooleanPackFormula`<[`ParamDefs`](../types/ParamDefs.md)\> \| `NumericPackFormula`<[`ParamDefs`](../types/ParamDefs.md)\> \| `StringPackFormula`<[`ParamDefs`](../types/ParamDefs.md), [`Date`](../enums/ValueHintType.md#date) \| [`Time`](../enums/ValueHintType.md#time) \| [`DateTime`](../enums/ValueHintType.md#datetime) \| [`Duration`](../enums/ValueHintType.md#duration) \| [`ImageReference`](../enums/ValueHintType.md#imagereference) \| [`ImageAttachment`](../enums/ValueHintType.md#imageattachment) \| [`Url`](../enums/ValueHintType.md#url) \| [`Markdown`](../enums/ValueHintType.md#markdown) \| [`Html`](../enums/ValueHintType.md#html) \| [`Embed`](../enums/ValueHintType.md#embed) \| [`Attachment`](../enums/ValueHintType.md#attachment)\> \| `ObjectPackFormula`<[`ParamDefs`](../types/ParamDefs.md), [`ArraySchema`](ArraySchema.md)<[`Schema`](../types/Schema.md)\>\> \| `ObjectPackFormula`<[`ParamDefs`](../types/ParamDefs.md), [`Schema`](../types/Schema.md)\>)[]

Definitions of this pack's formulas. See [Formula](../types/Formula.md).

Note that button actions are also defind here. Buttons are simply formulas
with `isAction: true`.

Note also, this should always be an array of Formulas. The PackFormulas object structure is deprecated
and will be removed shortly.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[formulas](PackVersionDefinition.md#formulas)

#### Defined in

[types.ts:716](https://github.com/coda/packs-sdk/blob/main/types.ts#L716)

___

### id

• **id**: `number`

#### Defined in

[types.ts:734](https://github.com/coda/packs-sdk/blob/main/types.ts#L734)

___

### isSystem

• `Optional` **isSystem**: `boolean`

Whether this is a pack that will be used by Coda internally and not exposed directly to users.

#### Defined in

[types.ts:750](https://github.com/coda/packs-sdk/blob/main/types.ts#L750)

___

### logoPath

• **logoPath**: `string`

#### Defined in

[types.ts:740](https://github.com/coda/packs-sdk/blob/main/types.ts#L740)

___

### minimumFeatureSet

• `Optional` **minimumFeatureSet**: `FeatureSet`

#### Defined in

[types.ts:744](https://github.com/coda/packs-sdk/blob/main/types.ts#L744)

___

### name

• **name**: `string`

#### Defined in

[types.ts:735](https://github.com/coda/packs-sdk/blob/main/types.ts#L735)

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

[types.ts:699](https://github.com/coda/packs-sdk/blob/main/types.ts#L699)

___

### permissionsDescription

• `Optional` **permissionsDescription**: `string`

#### Defined in

[types.ts:738](https://github.com/coda/packs-sdk/blob/main/types.ts#L738)

___

### quotas

• `Optional` **quotas**: `Partial`<`Object`\>

#### Defined in

[types.ts:745](https://github.com/coda/packs-sdk/blob/main/types.ts#L745)

___

### rateLimits

• `Optional` **rateLimits**: `RateLimits`

#### Defined in

[types.ts:746](https://github.com/coda/packs-sdk/blob/main/types.ts#L746)

___

### shortDescription

• **shortDescription**: `string`

#### Defined in

[types.ts:736](https://github.com/coda/packs-sdk/blob/main/types.ts#L736)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

Definitions of this pack's sync tables. See {@link SyncTable}.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[syncTables](PackVersionDefinition.md#synctables)

#### Defined in

[types.ts:724](https://github.com/coda/packs-sdk/blob/main/types.ts#L724)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[systemConnectionAuthentication](PackVersionDefinition.md#systemconnectionauthentication)

#### Defined in

[types.ts:689](https://github.com/coda/packs-sdk/blob/main/types.ts#L689)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

[PackVersionDefinition](PackVersionDefinition.md).[version](PackVersionDefinition.md#version)

#### Defined in

[types.ts:680](https://github.com/coda/packs-sdk/blob/main/types.ts#L680)
