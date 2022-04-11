---
title: "DynamicOptions"
---
# Interface: DynamicOptions

A set of options used internally by [makeDynamicSyncTable](../functions/makeDynamicSyncTable.md), or for static
sync tables that have a dynamic schema.

## Properties

### doNotCreateNewColumnsByDefault

• `Optional` **doNotCreateNewColumnsByDefault**: `boolean`

See [DynamicSyncTableOptions.doNotCreateNewColumnsByDefault](DynamicSyncTableOptions.md#donotcreatenewcolumnsbydefault)

#### Defined in

[api.ts:1256](https://github.com/coda/packs-sdk/blob/main/api.ts#L1256)

___

### entityName

• `Optional` **entityName**: `string`

See [DynamicSyncTableOptions.entityName](DynamicSyncTableOptions.md#entityname)

#### Defined in

[api.ts:1254](https://github.com/coda/packs-sdk/blob/main/api.ts#L1254)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns the schema for this table.

For a dynamic sync table, the value of [DynamicSyncTableOptions.getSchema](DynamicSyncTableOptions.md#getschema)
is passed through here. For a non-dynamic sync table, you may still implement
this if you table has a schema that varies based on the user account, but
does not require a [dynamicUrl](Identity.md#dynamicurl).

#### Defined in

[api.ts:1252](https://github.com/coda/packs-sdk/blob/main/api.ts#L1252)
