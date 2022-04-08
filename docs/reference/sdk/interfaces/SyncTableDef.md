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

### description

• `Optional` **description**: `string`

See [SyncTableOptions.description](SyncTableOptions.md#description)

#### Defined in

[api.ts:162](https://github.com/coda/packs-sdk/blob/main/api.ts#L162)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](DynamicOptions.md#entityname)

#### Defined in

[api.ts:170](https://github.com/coda/packs-sdk/blob/main/api.ts#L170)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicOptions.getSchema](DynamicOptions.md#getschema)

#### Defined in

[api.ts:168](https://github.com/coda/packs-sdk/blob/main/api.ts#L168)

___

### getter

• **getter**: [`SyncFormula`](../types/SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](SyncTableOptions.md#formula)

#### Defined in

[api.ts:166](https://github.com/coda/packs-sdk/blob/main/api.ts#L166)

___

### hideNewColumnsByDefault

• `Optional` **hideNewColumnsByDefault**: `boolean`

See [DynamicOptions.hideNewColumnsByDefault](DynamicOptions.md#hidenewcolumnsbydefault)

#### Defined in

[api.ts:172](https://github.com/coda/packs-sdk/blob/main/api.ts#L172)

___

### name

• **name**: `string`

See [SyncTableOptions.name](SyncTableOptions.md#name)

#### Defined in

[api.ts:160](https://github.com/coda/packs-sdk/blob/main/api.ts#L160)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](SyncTableOptions.md#schema)

#### Defined in

[api.ts:164](https://github.com/coda/packs-sdk/blob/main/api.ts#L164)
