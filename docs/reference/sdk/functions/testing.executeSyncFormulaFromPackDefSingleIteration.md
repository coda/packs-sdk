---
title: "executeSyncFormulaFromPackDefSingleIteration"
---
# Function: executeSyncFormulaFromPackDefSingleIteration

[testing](../modules/testing.md).executeSyncFormulaFromPackDefSingleIteration

▸ **executeSyncFormulaFromPackDefSingleIteration**(`packDef`, `syncFormulaName`, `params`, `context?`, `options?`, `__namedParameters?`): `Promise`<[`GenericSyncFormulaResult`](../types/core.GenericSyncFormulaResult.md)\>

Executes a single sync iteration, and returns the return value from the sync formula
including the continuation, for inspection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `packDef` | [`BasicPackDefinition`](../types/core.BasicPackDefinition.md) |
| `syncFormulaName` | `string` |
| `params` | [`ParamValues`](../types/core.ParamValues.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> |
| `context?` | [`SyncExecutionContext`](../interfaces/core.SyncExecutionContext.md) |
| `options?` | [`ExecuteOptions`](../interfaces/testing.ExecuteOptions.md) |
| `__namedParameters` | [`ContextOptions`](../interfaces/testing.ContextOptions.md) |

#### Returns

`Promise`<[`GenericSyncFormulaResult`](../types/core.GenericSyncFormulaResult.md)\>

#### Defined in

[testing/execution.ts:407](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L407)
