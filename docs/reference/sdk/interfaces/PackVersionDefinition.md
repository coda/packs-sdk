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

[types.ts:423](https://github.com/coda/packs-sdk/blob/main/types.ts#L423)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

#### Defined in

[types.ts:434](https://github.com/coda/packs-sdk/blob/main/types.ts#L434)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

#### Defined in

[types.ts:432](https://github.com/coda/packs-sdk/blob/main/types.ts#L432)

___

### formulas

• `Optional` **formulas**: [`PackFormulas`](PackFormulas.md) \| [`Formula`](../types/Formula.md)<[`ParamDefs`](../types/ParamDefs.md)\>[]

#### Defined in

[types.ts:433](https://github.com/coda/packs-sdk/blob/main/types.ts#L433)

___

### networkDomains

• `Optional` **networkDomains**: `string`[]

#### Defined in

[types.ts:429](https://github.com/coda/packs-sdk/blob/main/types.ts#L429)

___

### syncTables

• `Optional` **syncTables**: `SyncTable`[]

#### Defined in

[types.ts:435](https://github.com/coda/packs-sdk/blob/main/types.ts#L435)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

If specified, this pack requires system credentials to be set up via Coda's admin console in order to work when no
explicit connection is specified by the user.

#### Defined in

[types.ts:428](https://github.com/coda/packs-sdk/blob/main/types.ts#L428)

___

### version

• **version**: `string`

#### Defined in

[types.ts:419](https://github.com/coda/packs-sdk/blob/main/types.ts#L419)
