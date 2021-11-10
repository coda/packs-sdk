# Interface: SyncTableDef<K, L, ParamDefsT, SchemaT\>

Type definition for a Sync Table. Should not be necessary to use directly,
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

### entityName

• `Optional` **entityName**: `string`

See {@link SyncTableOptions.dynamicOptions.entityName}

#### Defined in

[api.ts:160](https://github.com/coda/packs-sdk/blob/main/api.ts#L160)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See {@link SyncTableOptions.dynamicOptions.getSchema}

#### Defined in

[api.ts:158](https://github.com/coda/packs-sdk/blob/main/api.ts#L158)

___

### getter

• **getter**: `SyncFormula`<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See {@link SyncTableOptions.formula}

#### Defined in

[api.ts:156](https://github.com/coda/packs-sdk/blob/main/api.ts#L156)

___

### name

• **name**: `string`

See {@link SyncTableOptions.name}

#### Defined in

[api.ts:152](https://github.com/coda/packs-sdk/blob/main/api.ts#L152)

___

### schema

• **schema**: `SchemaT`

See {@link SyncTableOptions.schema}

#### Defined in

[api.ts:154](https://github.com/coda/packs-sdk/blob/main/api.ts#L154)
