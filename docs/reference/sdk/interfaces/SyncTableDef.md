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

### entityName

• `Optional` **entityName**: `string`

See [DynamicOptions.entityName](DynamicOptions.md#entityname)

#### Defined in

[api.ts:165](https://github.com/coda/packs-sdk/blob/main/api.ts#L165)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/MetadataFormula.md)

See [DynamicOptions.getSchema](DynamicOptions.md#getschema)

#### Defined in

[api.ts:163](https://github.com/coda/packs-sdk/blob/main/api.ts#L163)

___

### getter

• **getter**: [`SyncFormula`](../types/SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [SyncTableOptions.formula](SyncTableOptions.md#formula)

#### Defined in

[api.ts:161](https://github.com/coda/packs-sdk/blob/main/api.ts#L161)

___

### name

• **name**: `string`

See [SyncTableOptions.name](SyncTableOptions.md#name)

#### Defined in

[api.ts:157](https://github.com/coda/packs-sdk/blob/main/api.ts#L157)

___

### schema

• **schema**: `SchemaT`

See [SyncTableOptions.schema](SyncTableOptions.md#schema)

#### Defined in

[api.ts:159](https://github.com/coda/packs-sdk/blob/main/api.ts#L159)
