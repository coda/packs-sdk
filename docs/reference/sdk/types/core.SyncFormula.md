---
title: "SyncFormula"
---
# Type alias: SyncFormula<K, L, ParamDefsT, SchemaT\>

[core](../modules/core.md).SyncFormula

Ƭ **SyncFormula**<`K`, `L`, `ParamDefsT`, `SchemaT`\>: [`SyncFormulaDef`](../interfaces/core.SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> & { `isSyncFormula`: ``true`` ; `resultType`: `TypeOf`<[`SchemaType`](core.SchemaType.md)<`SchemaT`\>\> ; `schema?`: [`ArraySchema`](../interfaces/core.ArraySchema.md)  }

The result of defining the formula that implements a sync table.

There is no need to use this type directly. You provid a [SyncFormulaDef](../interfaces/core.SyncFormulaDef.md) as an
input to [makeSyncTable](../functions/core.makeSyncTable.md) which outputs definitions of this type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](core.ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

#### Defined in

[api.ts:699](https://github.com/coda/packs-sdk/blob/main/api.ts#L699)
