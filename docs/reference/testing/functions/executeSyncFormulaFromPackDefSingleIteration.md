---
title: "executeSyncFormulaFromPackDefSingleIteration"
---
# Function: executeSyncFormulaFromPackDefSingleIteration

▸ **executeSyncFormulaFromPackDefSingleIteration**(`packDef`, `syncFormulaName`, `params`, `context?`, `options?`, `__namedParameters?`): `Promise`<`GenericSyncFormulaResult`\>

Executes a single sync iteration, and returns the return value from the sync formula
including the continuation, for inspection.

#### Parameters

| Name | Type |
| :------ | :------ |
| `packDef` | `BasicPackDefinition` |
| `syncFormulaName` | `string` |
| `params` | `ParamValues`<`ParamDefs`\> |
| `context?` | `SyncExecutionContext` |
| `options?` | [`ExecuteOptions`](../interfaces/ExecuteOptions.md) |
| `__namedParameters` | [`ContextOptions`](../interfaces/ContextOptions.md) |

#### Returns

`Promise`<`GenericSyncFormulaResult`\>

#### Defined in

[testing/execution.ts:407](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L407)
