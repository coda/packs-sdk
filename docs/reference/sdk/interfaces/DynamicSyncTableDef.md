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

### entityName

• `Optional` **entityName**: `string`

See {@link SyncTableOptions.dynamicOptions.entityName}

#### Inherited from

[SyncTableDef](SyncTableDef.md).[entityName](SyncTableDef.md#entityname)

#### Defined in

[api.ts:160](https://github.com/coda/packs-sdk/blob/main/api.ts#L160)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getDisplayUrl}

#### Defined in

[api.ts:180](https://github.com/coda/packs-sdk/blob/main/api.ts#L180)

___

### getName

• **getName**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getName}

#### Defined in

[api.ts:178](https://github.com/coda/packs-sdk/blob/main/api.ts#L178)

___

### getSchema

• **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.getSchema}

#### Overrides

[SyncTableDef](SyncTableDef.md).[getSchema](SyncTableDef.md#getschema)

#### Defined in

[api.ts:176](https://github.com/coda/packs-sdk/blob/main/api.ts#L176)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See {@link SyncTableOptions.formula}

#### Inherited from

[SyncTableDef](SyncTableDef.md).[getter](SyncTableDef.md#getter)

#### Defined in

[api.ts:156](https://github.com/coda/packs-sdk/blob/main/api.ts#L156)

___

### isDynamic

• **isDynamic**: ``true``

Identifies this sync table as dynamic.

#### Defined in

[api.ts:174](https://github.com/coda/packs-sdk/blob/main/api.ts#L174)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link DynamicSyncTableOptions.listDynamicUrls}

#### Defined in

[api.ts:182](https://github.com/coda/packs-sdk/blob/main/api.ts#L182)

___

### name

• **name**: `string`

See {@link SyncTableOptions.name}

#### Inherited from

[SyncTableDef](SyncTableDef.md).[name](SyncTableDef.md#name)

#### Defined in

[api.ts:152](https://github.com/coda/packs-sdk/blob/main/api.ts#L152)

___

### schema

• **schema**: `SchemaT`

See {@link SyncTableOptions.schema}

#### Inherited from

[SyncTableDef](SyncTableDef.md).[schema](SyncTableDef.md#schema)

#### Defined in

[api.ts:154](https://github.com/coda/packs-sdk/blob/main/api.ts#L154)
