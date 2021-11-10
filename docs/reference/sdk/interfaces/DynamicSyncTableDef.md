# Interface: DynamicSyncTableDef<K, L, ParamDefsT, SchemaT\>

Type definition for a Dynamic Sync Table. Should not be necessary to use directly,
instead, define dynamic sync tables using [makeDynamicSyncTable](../functions/makeDynamicSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchema`](ObjectSchema.md)<`K`, `L`\> |

## Hierarchy

- [`SyncTableDef`](SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

  ↳ **`DynamicSyncTableDef`**

## Properties

### entityName

• `Optional` **entityName**: `string`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[entityName](SyncTableDef.md#entityname)

#### Defined in

[api.ts:155](https://github.com/coda/packs-sdk/blob/main/api.ts#L155)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getDisplayUrl}

#### Defined in

[api.ts:175](https://github.com/coda/packs-sdk/blob/main/api.ts#L175)

___

### getName

• **getName**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getName}

#### Defined in

[api.ts:173](https://github.com/coda/packs-sdk/blob/main/api.ts#L173)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getSchema}

#### Overrides

[SyncTableDef](SyncTableDef.md).[getSchema](SyncTableDef.md#getschema)

#### Defined in

[api.ts:171](https://github.com/coda/packs-sdk/blob/main/api.ts#L171)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Inherited from

[SyncTableDef](SyncTableDef.md).[getter](SyncTableDef.md#getter)

#### Defined in

[api.ts:153](https://github.com/coda/packs-sdk/blob/main/api.ts#L153)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

#### Defined in

[api.ts:169](https://github.com/coda/packs-sdk/blob/main/api.ts#L169)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.listDynamicUrls}

#### Defined in

[api.ts:177](https://github.com/coda/packs-sdk/blob/main/api.ts#L177)

___

### name

• **name**: `string`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[name](SyncTableDef.md#name)

#### Defined in

[api.ts:151](https://github.com/coda/packs-sdk/blob/main/api.ts#L151)

___

### schema

• **schema**: `SchemaT`

#### Inherited from

[SyncTableDef](SyncTableDef.md).[schema](SyncTableDef.md#schema)

#### Defined in

[api.ts:152](https://github.com/coda/packs-sdk/blob/main/api.ts#L152)
