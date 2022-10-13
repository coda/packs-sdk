# Function: executeFormulaOrSyncWithVM

[testing](../modules/testing.md).executeFormulaOrSyncWithVM

▸ **executeFormulaOrSyncWithVM**<`T`\>(`__namedParameters`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PackFormulaResult`](../types/core.PackFormulaResult.md) \| [`GenericSyncFormulaResult`](../types/core.GenericSyncFormulaResult.md) = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.bundlePath` | `string` |
| `__namedParameters.executionContext?` | [`ExecutionContext`](../interfaces/core.ExecutionContext.md) |
| `__namedParameters.formulaName` | `string` |
| `__namedParameters.params` | [`ParamValues`](../types/core.ParamValues.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> |

#### Returns

`Promise`<`T`\>

#### Defined in

[testing/execution.ts:238](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L238)
