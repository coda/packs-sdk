---
nav: "DynamicSyncTableDef"
note: "This file is autogenerated from TypeScript definitions. Make edits to the comments in the TypeScript file and then run `make docs` to regenerate this file."
search:
  boost: 0.1
---
# Interface: DynamicSyncTableDef<K, L, ParamDefsT, SchemaT, ContextT, PermissionsContextT\>

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
| `ContextT` | extends [`SyncExecutionContext`](core.SyncExecutionContext.md)<`any`, `any`\> |
| `PermissionsContextT` | extends `SyncPassthroughData` |

## Hierarchy

- [`SyncTableDef`](core.SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`, `ContextT`, `PermissionsContextT`\>

  ↳ **`DynamicSyncTableDef`**

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[defaultAddDynamicColumns](core.SyncTableDef.md#defaultadddynamiccolumns)

___

### description

• `Optional` **description**: `string`

See [description](core.SyncTableOptions.md#description)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[description](core.SyncTableDef.md#description)

___

### displayName

• `Optional` **displayName**: `string`

See [displayName](core.SyncTableOptions.md#displayname)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[displayName](core.SyncTableDef.md#displayname)

___

### entityName

• `Optional` **entityName**: `string`

See [entityName](core.DynamicOptions.md#entityname)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[entityName](core.SyncTableDef.md#entityname)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/core.MetadataFormula.md)<`ContextT`, [`LegacyDefaultMetadataReturnType`](../types/core.LegacyDefaultMetadataReturnType.md)\>

See [getDisplayUrl](core.DynamicSyncTableOptions.md#getdisplayurl)

___

### getName

• **getName**: [`MetadataFormula`](../types/core.MetadataFormula.md)<`ContextT`, [`LegacyDefaultMetadataReturnType`](../types/core.LegacyDefaultMetadataReturnType.md)\>

See [getName](core.DynamicSyncTableOptions.md#getname)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)<`ContextT`, [`LegacyDefaultMetadataReturnType`](../types/core.LegacyDefaultMetadataReturnType.md)\>

See [getSchema](core.DynamicSyncTableOptions.md#getschema)

#### Overrides

[SyncTableDef](core.SyncTableDef.md).[getSchema](core.SyncTableDef.md#getschema)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`, `ContextT`, `PermissionsContextT`\>

See [formula](core.SyncTableOptions.md#formula)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[getter](core.SyncTableDef.md#getter)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [identityName](core.SyncTableOptions.md#identityname) for more details.

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[identityName](core.SyncTableDef.md#identityname)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/core.MetadataFormula.md)<[`ExecutionContext`](core.ExecutionContext.md), [`LegacyDefaultMetadataReturnType`](../types/core.LegacyDefaultMetadataReturnType.md)\>

See [listDynamicUrls](core.DynamicSyncTableOptions.md#listdynamicurls)

___

### name

• **name**: `string`

See [name](core.SyncTableOptions.md#name)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[name](core.SyncTableDef.md#name)

___

### propertyOptions

• `Optional` **propertyOptions**: `PropertyOptionsMetadataFormula`<`any`\>

See [propertyOptions](core.DynamicSyncTableOptions.md#propertyoptions)

___

### schema

• **schema**: `SchemaT`

See [schema](core.SyncTableOptions.md#schema)

#### Inherited from

[SyncTableDef](core.SyncTableDef.md).[schema](core.SyncTableDef.md#schema)

___

### searchDynamicUrls

• `Optional` **searchDynamicUrls**: [`MetadataFormula`](../types/core.MetadataFormula.md)<[`ExecutionContext`](core.ExecutionContext.md), [`LegacyDefaultMetadataReturnType`](../types/core.LegacyDefaultMetadataReturnType.md)\>

See [searchDynamicUrls](core.DynamicSyncTableOptions.md#searchdynamicurls)
