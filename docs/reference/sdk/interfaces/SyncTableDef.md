# Interface: SyncTableDef<K, L, ParamDefsT, SchemaT\>

Type definition for a Sync Table. Should not be necessary to use directly,
instead, define sync tables using [makeSyncTable](../functions/makeSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchema`](ObjectSchema.md)<`K`, `L`\> |

## Hierarchy

- **`SyncTableDef`**

  ↳ [`DynamicSyncTableDef`](DynamicSyncTableDef.md)

## Properties

### entityName

• `Optional` **entityName**: `string`

#### Defined in

[api.ts:117](https://github.com/coda/packs-sdk/blob/main/api.ts#L117)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Defined in

[api.ts:116](https://github.com/coda/packs-sdk/blob/main/api.ts#L116)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Defined in

[api.ts:115](https://github.com/coda/packs-sdk/blob/main/api.ts#L115)

___

### name

• **name**: `string`

#### Defined in

[api.ts:113](https://github.com/coda/packs-sdk/blob/main/api.ts#L113)

___

### schema

• **schema**: `SchemaT`

#### Defined in

[api.ts:114](https://github.com/coda/packs-sdk/blob/main/api.ts#L114)
