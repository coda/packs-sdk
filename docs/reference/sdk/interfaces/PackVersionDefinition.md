# Interface: PackVersionDefinition

The definition of the contents of a Pack at a specific version. This is the
heart of the implementation of a Pack.

## Hierarchy

- **`PackVersionDefinition`**

  ↳ [`PackDefinition`](PackDefinition.md)

## Properties

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

If specified, the user must provide personal authentication credentials before using the pack.

#### Defined in

[types.ts:817](https://github.com/coda/packs-sdk/blob/main/types.ts#L817)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

Definitions of this pack's column formats. See [Format](Format.md).

#### Defined in

[types.ts:853](https://github.com/coda/packs-sdk/blob/main/types.ts#L853)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

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

#### Defined in

[types.ts:849](https://github.com/coda/packs-sdk/blob/main/types.ts#L849)

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

[types.ts:832](https://github.com/coda/packs-sdk/blob/main/types.ts#L832)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

Definitions of this pack's sync tables. See {@link SyncTable}.

#### Defined in

[types.ts:857](https://github.com/coda/packs-sdk/blob/main/types.ts#L857)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Defined in

[types.ts:822](https://github.com/coda/packs-sdk/blob/main/types.ts#L822)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Defined in

[types.ts:813](https://github.com/coda/packs-sdk/blob/main/types.ts#L813)
