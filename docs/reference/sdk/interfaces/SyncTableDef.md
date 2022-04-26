---
title: "SyncTableDef"
---
# Interface: SyncTableDef<K, L, ParamDefsT, SchemaT\>

The result of defining a sync table. Should not be necessary to use directly,
instead, define sync tables using [makeSyncTable](../functions/makeSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

## Hierarchy

- **`SyncTableDef`**

  ↳ [`DynamicSyncTableDef`](DynamicSyncTableDef.md)

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [DynamicOptions.defaultAddDynamicColumns](DynamicOptions.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:180](https://github.com/coda/packs-sdk/blob/main/api.ts#L180)

___

### description

• `Optional` **description**: `string`

See [SyncTableOptions.description](SyncTableOptions.md#description)

#### Defined in

[api.ts:163](https://github.com/coda/packs-sdk/blob/main/api.ts#L163)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](DynamicOptions.md#entityname)

#### Defined in

[api.ts:178](https://github.com/coda/packs-sdk/blob/main/api.ts#L178)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicOptions.getSchema](DynamicOptions.md#getschema)

#### Defined in

[api.ts:176](https://github.com/coda/packs-sdk/blob/main/api.ts#L176)

___

### getter

• **getter**: [`SyncFormula`](../types/SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](SyncTableOptions.md#formula)

#### Defined in

[api.ts:174](https://github.com/coda/packs-sdk/blob/main/api.ts#L174)

___

### identityName

• `Optional` **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [SyncTableOptions.identityName](SyncTableOptions.md#identityname) for more details.

#### Defined in

[api.ts:172](https://github.com/coda/packs-sdk/blob/main/api.ts#L172)

___

### name

• **name**: `string`

See [SyncTableOptions.name](SyncTableOptions.md#name)

#### Defined in

[api.ts:161](https://github.com/coda/packs-sdk/blob/main/api.ts#L161)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](SyncTableOptions.md#schema)

#### Defined in

[api.ts:165](https://github.com/coda/packs-sdk/blob/main/api.ts#L165)
