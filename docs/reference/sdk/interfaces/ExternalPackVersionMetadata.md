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

#### Inherited from

BasePackVersionMetadata.formulaNamespace

#### Defined in

[types.ts:432](https://github.com/coda/packs-sdk/blob/main/types.ts#L432)

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

#### Inherited from

BasePackVersionMetadata.networkDomains

#### Defined in

[types.ts:429](https://github.com/coda/packs-sdk/blob/main/types.ts#L429)

___

### syncTables

• `Optional` **syncTables**: [`PackSyncTable`](../types/PackSyncTable.md)[]

#### Defined in

[compiled_types.ts:110](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L110)

___

### version

• **version**: `string`

#### Inherited from

BasePackVersionMetadata.version

#### Defined in

[types.ts:419](https://github.com/coda/packs-sdk/blob/main/types.ts#L419)
