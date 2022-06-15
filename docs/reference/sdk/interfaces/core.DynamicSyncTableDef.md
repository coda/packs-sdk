---
title: "DynamicSyncTableDef"
---
# Interface: DynamicSyncTableDef<K, L, ParamDefsT, SchemaT\>

[core](../modules/core.md).DynamicSyncTableDef

Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
instead, define dynamic sync tables using [makeDynamicSyncTable](../functions/core.makeDynamicSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

## Hierarchy

- [`SyncTableDef`](core.SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

  ↳ **`DynamicSyncTableDef`**

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [DynamicOptions.defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[defaultAddDynamicColumns](core.SyncTableDef.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:179](https://github.com/coda/packs-sdk/blob/main/api.ts#L179)

___

### description

• `Optional` **description**: `string`

See [SyncTableOptions.description](core.SyncTableOptions.md#description)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[description](core.SyncTableDef.md#description)

#### Defined in

[api.ts:162](https://github.com/coda/packs-sdk/blob/main/api.ts#L162)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](core.DynamicOptions.md#entityname)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[entityName](core.SyncTableDef.md#entityname)

#### Defined in

[api.ts:177](https://github.com/coda/packs-sdk/blob/main/api.ts#L177)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [DynamicSyncTableOptions.getDisplayUrl](core.DynamicSyncTableOptions.md#getdisplayurl)

#### Defined in

[api.ts:199](https://github.com/coda/packs-sdk/blob/main/api.ts#L199)

___

### getName

• **getName**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [DynamicSyncTableOptions.getName](core.DynamicSyncTableOptions.md#getname)

#### Defined in

[api.ts:197](https://github.com/coda/packs-sdk/blob/main/api.ts#L197)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [DynamicSyncTableOptions.getSchema](core.DynamicSyncTableOptions.md#getschema)

#### Overrides

[SyncTableDef](core.SyncTableDef.md).[getSchema](core.SyncTableDef.md#getschema)

#### Defined in

[api.ts:195](https://github.com/coda/packs-sdk/blob/main/api.ts#L195)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](core.SyncTableOptions.md#formula)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[getter](core.SyncTableDef.md#getter)

#### Defined in

[api.ts:173](https://github.com/coda/packs-sdk/blob/main/api.ts#L173)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [SyncTableOptions.identityName](core.SyncTableOptions.md#identityname) for more details.

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[identityName](core.SyncTableDef.md#identityname)

#### Defined in

[api.ts:171](https://github.com/coda/packs-sdk/blob/main/api.ts#L171)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

#### Defined in

[api.ts:193](https://github.com/coda/packs-sdk/blob/main/api.ts#L193)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [DynamicSyncTableOptions.listDynamicUrls](core.DynamicSyncTableOptions.md#listdynamicurls)

#### Defined in

[api.ts:201](https://github.com/coda/packs-sdk/blob/main/api.ts#L201)

___

### name

• **name**: `string`

See [SyncTableOptions.name](core.SyncTableOptions.md#name)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[name](core.SyncTableDef.md#name)

#### Defined in

[api.ts:160](https://github.com/coda/packs-sdk/blob/main/api.ts#L160)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](core.SyncTableOptions.md#schema)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[schema](core.SyncTableDef.md#schema)

#### Defined in

[api.ts:164](https://github.com/coda/packs-sdk/blob/main/api.ts#L164)
