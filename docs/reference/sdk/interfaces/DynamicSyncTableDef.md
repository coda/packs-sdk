# Interface: DynamicSyncTableDef<K, L, ParamDefsT, SchemaT\>

Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
instead, define dynamic sync tables using [makeDynamicSyncTable](../README.md#makedynamicsynctable).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../README.md#paramdefs) |
| `SchemaT` | extends [`ObjectSchema`](ObjectSchema.md)<`K`, `L`\> |

## Hierarchy

- [`SyncTableDef`](SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

  ↳ **`DynamicSyncTableDef`**

## Properties

### entityName

• `Optional` **entityName**: `string`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[entityName](SyncTableDef.md#entityname)

#### Defined in

[api.ts:117](https://github.com/coda/packs-sdk/blob/main/api.ts#L117)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../README.md#metadataformula)

#### Defined in

[api.ts:133](https://github.com/coda/packs-sdk/blob/main/api.ts#L133)

___

### getName

• **getName**: [`MetadataFormula`](../README.md#metadataformula)

#### Defined in

[api.ts:132](https://github.com/coda/packs-sdk/blob/main/api.ts#L132)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../README.md#metadataformula)

#### Overrides

[SyncTableDef](SyncTableDef.md).[getSchema](SyncTableDef.md#getschema)

#### Defined in

[api.ts:131](https://github.com/coda/packs-sdk/blob/main/api.ts#L131)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Inherited from

[SyncTableDef](SyncTableDef.md).[getter](SyncTableDef.md#getter)

#### Defined in

[api.ts:115](https://github.com/coda/packs-sdk/blob/main/api.ts#L115)

___

### isDynamic

• **isDynamic**: ``true``

#### Defined in

[api.ts:130](https://github.com/coda/packs-sdk/blob/main/api.ts#L130)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../README.md#metadataformula)

#### Defined in

[api.ts:134](https://github.com/coda/packs-sdk/blob/main/api.ts#L134)

___

### name

• **name**: `string`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[name](SyncTableDef.md#name)

#### Defined in

[api.ts:113](https://github.com/coda/packs-sdk/blob/main/api.ts#L113)

___

### schema

• **schema**: `SchemaT`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[schema](SyncTableDef.md#schema)

#### Defined in

[api.ts:114](https://github.com/coda/packs-sdk/blob/main/api.ts#L114)
