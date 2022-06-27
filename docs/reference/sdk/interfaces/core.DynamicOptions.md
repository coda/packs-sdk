---
title: "DynamicOptions"
---
# Interface: DynamicOptions

[core](../modules/core.md).DynamicOptions

A set of options used internally by [makeDynamicSyncTable](../functions/core.makeDynamicSyncTable.md), or for static
sync tables that have a dynamic schema.

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [DynamicSyncTableOptions.defaultAddDynamicColumns](core.DynamicSyncTableOptions.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:1302](https://github.com/coda/packs-sdk/blob/main/api.ts#L1302)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicSyncTableOptions.entityName](core.DynamicSyncTableOptions.md#entityname)

#### Defined in

[api.ts:1300](https://github.com/coda/packs-sdk/blob/main/api.ts#L1300)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormulaDef`](../types/core.MetadataFormulaDef.md)

A formula that returns the schema for this table.

For a dynamic sync table, the value of [DynamicSyncTableOptions.getSchema](core.DynamicSyncTableOptions.md#getschema)
is passed through here. For a non-dynamic sync table, you may still implement
this if you table has a schema that varies based on the user account, but
does not require a [dynamicUrl](core.Identity.md#dynamicurl).

#### Defined in

[api.ts:1298](https://github.com/coda/packs-sdk/blob/main/api.ts#L1298)
