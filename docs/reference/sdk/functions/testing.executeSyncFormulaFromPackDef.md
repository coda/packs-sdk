---
title: "executeSyncFormulaFromPackDef"
---
# Function: executeSyncFormulaFromPackDef

[testing](../modules/testing.md).executeSyncFormulaFromPackDef

▸ **executeSyncFormulaFromPackDef**<`T`\>(`packDef`, `syncFormulaName`, `params`, `context?`, `__namedParameters?`, `__namedParameters?`): `Promise`<`T`[]\>

Executes multiple iterations of a sync formula in a loop until there is no longer
a `continuation` returned, aggregating each page of results and returning an array
with results of all iterations combined and flattened.

NOTE: This currently runs all the iterations in a simple loop, which does not
adequately simulate the fact that in a real execution environment each iteration
will be run in a completely isolated environment, with absolutely no sharing
of state or global variables between iterations.

For now, use `coda execute --vm` to simulate that level of isolation.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `packDef` | [`BasicPackDefinition`](../types/core.BasicPackDefinition.md) |
| `syncFormulaName` | `string` |
| `params` | [`ParamValues`](../types/core.ParamValues.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> |
| `context?` | [`SyncExecutionContext`](../interfaces/core.SyncExecutionContext.md) |
| `__namedParameters` | [`ExecuteOptions`](../interfaces/testing.ExecuteOptions.md) |
| `__namedParameters` | [`ContextOptions`](../interfaces/testing.ContextOptions.md) |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[testing/execution.ts:344](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L344)
