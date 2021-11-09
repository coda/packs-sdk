# Interface: ExternalPackVersionMetadata

Further stripped-down version of `PackVersionMetadata` that contains only what the browser needs.

## Hierarchy

- `BasePackVersionMetadata`

  ↳ **`ExternalPackVersionMetadata`**

## Properties

### authentication

• **authentication**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `deferConnectionSetup?` | `boolean` |
| `endpointDomain?` | `string` |
| `params?` | { `description`: `string` ; `name`: `string`  }[] |
| `postSetup?` | `PostSetupMetadata`[] |
| `requiresEndpointUrl` | `boolean` |
| `shouldAutoAuthSetup?` | `boolean` |
| `type` | [`AuthenticationType`](../enums/AuthenticationType.md) |

#### Defined in

[compiled_types.ts:96](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L96)

___

### formats

• `Optional` **formats**: [`Format`](Format.md)[]

#### Defined in

[compiled_types.ts:109](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L109)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Inherited from

BasePackVersionMetadata.formulaNamespace

#### Defined in

[types.ts:732](https://github.com/coda/packs-sdk/blob/main/types.ts#L732)

___

### formulas

• `Optional` **formulas**: [`ExternalPackFormulas`](../types/ExternalPackFormulas.md)

#### Defined in

[compiled_types.ts:108](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L108)

___

### instructionsUrl

• `Optional` **instructionsUrl**: `string`

#### Defined in

[compiled_types.ts:105](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L105)

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

BasePackVersionMetadata.networkDomains

#### Defined in

[types.ts:725](https://github.com/coda/packs-sdk/blob/main/types.ts#L725)

___

### syncTables

• `Optional` **syncTables**: [`PackSyncTable`](../types/PackSyncTable.md)[]

#### Defined in

[compiled_types.ts:110](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L110)

___

### version

• **version**: `string`

The semantic version of the pack. This must be valid semantic version of the form `1`, `1.2`, or `1.2.3`.
When uploading a pack version, the semantic version must be greater than any previously uploaded version.

#### Inherited from

BasePackVersionMetadata.version

#### Defined in

[types.ts:706](https://github.com/coda/packs-sdk/blob/main/types.ts#L706)
