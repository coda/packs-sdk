---
title: "executeFormulaOrSyncWithVM"
---
# Function: executeFormulaOrSyncWithVM

▸ **executeFormulaOrSyncWithVM**<`T`\>(`__namedParameters`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `PackFormulaResult` \| `GenericSyncFormulaResult` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.bundlePath` | `string` |
| `__namedParameters.executionContext?` | `ExecutionContext` |
| `__namedParameters.formulaName` | `string` |
| `__namedParameters.params` | `ParamValues`<`ParamDefs`\> |

#### Returns

`Promise`<`T`\>

#### Defined in

[testing/execution.ts:238](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L238)
