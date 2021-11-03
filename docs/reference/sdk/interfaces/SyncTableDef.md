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

[api.ts:155](https://github.com/coda/packs-sdk/blob/main/api.ts#L155)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

#### Defined in

[api.ts:154](https://github.com/coda/packs-sdk/blob/main/api.ts#L154)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Defined in

[api.ts:153](https://github.com/coda/packs-sdk/blob/main/api.ts#L153)

___

### name

• **name**: `string`

#### Defined in

[api.ts:151](https://github.com/coda/packs-sdk/blob/main/api.ts#L151)

___

### schema

• **schema**: `SchemaT`

#### Defined in

[api.ts:152](https://github.com/coda/packs-sdk/blob/main/api.ts#L152)
