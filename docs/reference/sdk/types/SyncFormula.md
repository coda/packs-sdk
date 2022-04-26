---
title: "SyncFormula"
---
# Type alias: SyncFormula<K, L, ParamDefsT, SchemaT\>

Ƭ **SyncFormula**<`K`, `L`, `ParamDefsT`, `SchemaT`\>: [`SyncFormulaDef`](../interfaces/SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> & { `isSyncFormula`: ``true`` ; `resultType`: `TypeOf`<[`SchemaType`](SchemaType.md)<`SchemaT`\>\> ; `schema?`: [`ArraySchema`](../interfaces/ArraySchema.md)  }

The result of defining the formula that implements a sync table.

There is no need to use this type directly. You provid a [SyncFormulaDef](../interfaces/SyncFormulaDef.md) as an
input to [makeSyncTable](../functions/makeSyncTable.md) which outputs definitions of this type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

#### Defined in

[api.ts:676](https://github.com/coda/packs-sdk/blob/main/api.ts#L676)
