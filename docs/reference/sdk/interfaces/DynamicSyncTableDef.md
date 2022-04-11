---
title: "DynamicSyncTableDef"
---
# Interface: DynamicSyncTableDef<K, L, ParamDefsT, SchemaT\>

Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
instead, define dynamic sync tables using [makeDynamicSyncTable](../functions/makeDynamicSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

## Hierarchy

- [`SyncTableDef`](SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

  ↳ **`DynamicSyncTableDef`**

## Properties

### description

• `Optional` **description**: `string`

See [SyncTableOptions.description](SyncTableOptions.md#description)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[description](SyncTableDef.md#description)

#### Defined in

[api.ts:162](https://github.com/coda/packs-sdk/blob/main/api.ts#L162)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](DynamicOptions.md#entityname)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[entityName](SyncTableDef.md#entityname)

#### Defined in

[api.ts:170](https://github.com/coda/packs-sdk/blob/main/api.ts#L170)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicSyncTableOptions.getDisplayUrl](DynamicSyncTableOptions.md#getdisplayurl)

#### Defined in

[api.ts:192](https://github.com/coda/packs-sdk/blob/main/api.ts#L192)

___

### getName

• **getName**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicSyncTableOptions.getName](DynamicSyncTableOptions.md#getname)

#### Defined in

[api.ts:190](https://github.com/coda/packs-sdk/blob/main/api.ts#L190)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicSyncTableOptions.getSchema](DynamicSyncTableOptions.md#getschema)

#### Overrides

[SyncTableDef](SyncTableDef.md).[getSchema](SyncTableDef.md#getschema)

#### Defined in

[api.ts:188](https://github.com/coda/packs-sdk/blob/main/api.ts#L188)

___

### getter

• **getter**: [`SyncFormula`](../types/SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](SyncTableOptions.md#formula)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[getter](SyncTableDef.md#getter)

#### Defined in

[api.ts:166](https://github.com/coda/packs-sdk/blob/main/api.ts#L166)

___

### hideNewColumnsByDefault

• `Optional` **hideNewColumnsByDefault**: `boolean`

See [DynamicOptions.hideNewColumnsByDefault](DynamicOptions.md#hidenewcolumnsbydefault)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[hideNewColumnsByDefault](SyncTableDef.md#hidenewcolumnsbydefault)

#### Defined in

[api.ts:172](https://github.com/coda/packs-sdk/blob/main/api.ts#L172)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

#### Defined in

[api.ts:186](https://github.com/coda/packs-sdk/blob/main/api.ts#L186)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicSyncTableOptions.listDynamicUrls](DynamicSyncTableOptions.md#listdynamicurls)

#### Defined in

[api.ts:194](https://github.com/coda/packs-sdk/blob/main/api.ts#L194)

___

### name

• **name**: `string`

See [SyncTableOptions.name](SyncTableOptions.md#name)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[name](SyncTableDef.md#name)

#### Defined in

[api.ts:160](https://github.com/coda/packs-sdk/blob/main/api.ts#L160)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](SyncTableOptions.md#schema)

#### Inherited from

[SyncTableDef](SyncTableDef.md).[schema](SyncTableDef.md#schema)

#### Defined in

[api.ts:164](https://github.com/coda/packs-sdk/blob/main/api.ts#L164)
