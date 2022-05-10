---
title: "executeFormulaFromPackDef"
---
# Function: executeFormulaFromPackDef

[testing](../modules/testing.md).executeFormulaFromPackDef

▸ **executeFormulaFromPackDef**<`T`\>(`packDef`, `formulaNameWithNamespace`, `params`, `context?`, `options?`, `__namedParameters?`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`PackFormulaResult`](../types/core.PackFormulaResult.md) \| [`GenericSyncFormulaResult`](../types/core.GenericSyncFormulaResult.md) = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `packDef` | [`BasicPackDefinition`](../types/core.BasicPackDefinition.md) |
| `formulaNameWithNamespace` | `string` |
| `params` | [`ParamValues`](../types/core.ParamValues.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> |
| `context?` | [`ExecutionContext`](../interfaces/core.ExecutionContext.md) |
| `options?` | [`ExecuteOptions`](../interfaces/testing.ExecuteOptions.md) |
| `__namedParameters` | [`ContextOptions`](../interfaces/testing.ContextOptions.md) |

#### Returns

`Promise`<`T`\>

#### Defined in

[testing/execution.ts:120](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L120)
