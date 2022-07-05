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

[api.ts:203](https://github.com/coda/packs-sdk/blob/main/api.ts#L203)

___

### description

• `Optional` **description**: `string`

See [description](core.SyncTableOptions.md#description)

#### Defined in

[api.ts:186](https://github.com/coda/packs-sdk/blob/main/api.ts#L186)

___

### entityName

• `Optional` **entityName**: `string`

See [entityName](core.DynamicOptions.md#entityname)

#### Defined in

[api.ts:201](https://github.com/coda/packs-sdk/blob/main/api.ts#L201)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getSchema](core.DynamicOptions.md#getschema)

#### Defined in

[api.ts:199](https://github.com/coda/packs-sdk/blob/main/api.ts#L199)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [formula](core.SyncTableOptions.md#formula)

#### Defined in

[api.ts:197](https://github.com/coda/packs-sdk/blob/main/api.ts#L197)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [identityName](core.SyncTableOptions.md#identityname) for more details.

#### Defined in

[api.ts:195](https://github.com/coda/packs-sdk/blob/main/api.ts#L195)

___

### name

• **name**: `string`

See [name](core.SyncTableOptions.md#name)

#### Defined in

[api.ts:184](https://github.com/coda/packs-sdk/blob/main/api.ts#L184)

___

### schema

• **schema**: `SchemaT`

See [schema](core.SyncTableOptions.md#schema)

#### Defined in

[api.ts:188](https://github.com/coda/packs-sdk/blob/main/api.ts#L188)
