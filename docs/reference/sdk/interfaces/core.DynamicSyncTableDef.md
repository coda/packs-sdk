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

See [defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[defaultAddDynamicColumns](core.SyncTableDef.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:204](https://github.com/coda/packs-sdk/blob/main/api.ts#L204)

___

### description

• `Optional` **description**: `string`

See [description](core.SyncTableOptions.md#description)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[description](core.SyncTableDef.md#description)

#### Defined in

[api.ts:187](https://github.com/coda/packs-sdk/blob/main/api.ts#L187)

___

### entityName

• `Optional` **entityName**: `string`

See [entityName](core.DynamicOptions.md#entityname)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[entityName](core.SyncTableDef.md#entityname)

#### Defined in

[api.ts:202](https://github.com/coda/packs-sdk/blob/main/api.ts#L202)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getDisplayUrl](core.DynamicSyncTableOptions.md#getdisplayurl)

#### Defined in

[api.ts:224](https://github.com/coda/packs-sdk/blob/main/api.ts#L224)

___

### getName

• **getName**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getName](core.DynamicSyncTableOptions.md#getname)

#### Defined in

[api.ts:222](https://github.com/coda/packs-sdk/blob/main/api.ts#L222)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getSchema](core.DynamicSyncTableOptions.md#getschema)

#### Overrides

[SyncTableDef](core.SyncTableDef.md).[getSchema](core.SyncTableDef.md#getschema)

#### Defined in

[api.ts:220](https://github.com/coda/packs-sdk/blob/main/api.ts#L220)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [formula](core.SyncTableOptions.md#formula)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[getter](core.SyncTableDef.md#getter)

#### Defined in

[api.ts:198](https://github.com/coda/packs-sdk/blob/main/api.ts#L198)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [identityName](core.SyncTableOptions.md#identityname) for more details.

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[identityName](core.SyncTableDef.md#identityname)

#### Defined in

[api.ts:196](https://github.com/coda/packs-sdk/blob/main/api.ts#L196)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

#### Defined in

[api.ts:218](https://github.com/coda/packs-sdk/blob/main/api.ts#L218)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [listDynamicUrls](core.DynamicSyncTableOptions.md#listdynamicurls)

#### Defined in

[api.ts:226](https://github.com/coda/packs-sdk/blob/main/api.ts#L226)

___

### name

• **name**: `string`

See [name](core.SyncTableOptions.md#name)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[name](core.SyncTableDef.md#name)

#### Defined in

[api.ts:185](https://github.com/coda/packs-sdk/blob/main/api.ts#L185)

___

### schema

• **schema**: `SchemaT`

See [schema](core.SyncTableOptions.md#schema)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[schema](core.SyncTableDef.md#schema)

#### Defined in

[api.ts:189](https://github.com/coda/packs-sdk/blob/main/api.ts#L189)
