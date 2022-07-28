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

See [defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:204](https://github.com/coda/packs-sdk/blob/main/api.ts#L204)

___

### description

• `Optional` **description**: `string`

See [description](core.SyncTableOptions.md#description)

#### Defined in

[api.ts:187](https://github.com/coda/packs-sdk/blob/main/api.ts#L187)

___

### entityName

• `Optional` **entityName**: `string`

See [entityName](core.DynamicOptions.md#entityname)

#### Defined in

[api.ts:202](https://github.com/coda/packs-sdk/blob/main/api.ts#L202)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getSchema](core.DynamicOptions.md#getschema)

#### Defined in

[api.ts:200](https://github.com/coda/packs-sdk/blob/main/api.ts#L200)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [formula](core.SyncTableOptions.md#formula)

#### Defined in

[api.ts:198](https://github.com/coda/packs-sdk/blob/main/api.ts#L198)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [identityName](core.SyncTableOptions.md#identityname) for more details.

#### Defined in

[api.ts:196](https://github.com/coda/packs-sdk/blob/main/api.ts#L196)

___

### name

• **name**: `string`

See [name](core.SyncTableOptions.md#name)

#### Defined in

[api.ts:185](https://github.com/coda/packs-sdk/blob/main/api.ts#L185)

___

### schema

• **schema**: `SchemaT`

See [schema](core.SyncTableOptions.md#schema)

#### Defined in

[api.ts:189](https://github.com/coda/packs-sdk/blob/main/api.ts#L189)
