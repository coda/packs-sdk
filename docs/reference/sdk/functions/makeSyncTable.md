---
title: "makeSyncTable"
---
# Function: makeSyncTable

▸ **makeSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaDefT`, `SchemaT`\>(`__namedParameters`): [`SyncTableDef`](../interfaces/SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

Wrapper to produce a sync table definition. All (non-dynamic) sync tables should be created
using this wrapper rather than declaring a sync table definition object directly.

This wrapper does a variety of helpful things, including
* Doing basic validation of the provided definition.
* Normalizing the schema definition to conform to Coda-recommended syntax.
* Wrapping the execute formula to normalize return values to match the normalized schema.

See [Normalization](/index.html#normalization) for more information about schema normalization.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaDefT` | extends [`ObjectSchemaDefinition`](../interfaces/ObjectSchemaDefinition.md)<`K`, `L`, `SchemaDefT`\> |
| `SchemaT` | extends [`ObjectSchemaDefinition`](../interfaces/ObjectSchemaDefinition.md)<`K`, `L`, `SchemaT`\> & { `identity?`: [`Identity`](../interfaces/Identity.md)  } |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SyncTableOptions`](../interfaces/SyncTableOptions.md)<`K`, `L`, `ParamDefsT`, `SchemaDefT`\> |

#### Returns

[`SyncTableDef`](../interfaces/SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Defined in

[api.ts:1452](https://github.com/coda/packs-sdk/blob/main/api.ts#L1452)
