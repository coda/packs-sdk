---
title: "SyncTableDef"
---
# Interface: SyncTableDef<K, L, ParamDefsT, SchemaT\>

[core](../modules/core.md).SyncTableDef

The result of defining a sync table. Should not be necessary to use directly,
instead, define sync tables using [makeSyncTable](../functions/core.makeSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

## Hierarchy

- **`SyncTableDef`**

  ↳ [`DynamicSyncTableDef`](core.DynamicSyncTableDef.md)

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [DynamicOptions.defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:198](https://github.com/coda/packs-sdk/blob/main/api.ts#L198)

___

### description

• `Optional` **description**: `string`

See [SyncTableOptions.description](core.SyncTableOptions.md#description)

#### Defined in

[api.ts:181](https://github.com/coda/packs-sdk/blob/main/api.ts#L181)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](core.DynamicOptions.md#entityname)

#### Defined in

[api.ts:196](https://github.com/coda/packs-sdk/blob/main/api.ts#L196)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [DynamicOptions.getSchema](core.DynamicOptions.md#getschema)

#### Defined in

[api.ts:194](https://github.com/coda/packs-sdk/blob/main/api.ts#L194)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](core.SyncTableOptions.md#formula)

#### Defined in

[api.ts:192](https://github.com/coda/packs-sdk/blob/main/api.ts#L192)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [SyncTableOptions.identityName](core.SyncTableOptions.md#identityname) for more details.

#### Defined in

[api.ts:190](https://github.com/coda/packs-sdk/blob/main/api.ts#L190)

___

### name

• **name**: `string`

See [SyncTableOptions.name](core.SyncTableOptions.md#name)

#### Defined in

[api.ts:179](https://github.com/coda/packs-sdk/blob/main/api.ts#L179)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](core.SyncTableOptions.md#schema)

#### Defined in

[api.ts:183](https://github.com/coda/packs-sdk/blob/main/api.ts#L183)
