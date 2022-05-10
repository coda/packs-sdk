---
title: "executeFormulaFromPackDef"
---
# Function: executeFormulaFromPackDef

▸ **executeFormulaFromPackDef**<`T`\>(`packDef`, `formulaNameWithNamespace`, `params`, `context?`, `options?`, `__namedParameters?`): `Promise`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `PackFormulaResult` \| `GenericSyncFormulaResult` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `packDef` | `BasicPackDefinition` |
| `formulaNameWithNamespace` | `string` |
| `params` | `ParamValues`<`ParamDefs`\> |
| `context?` | `ExecutionContext` |
| `options?` | [`ExecuteOptions`](../interfaces/ExecuteOptions.md) |
| `__namedParameters` | [`ContextOptions`](../interfaces/ContextOptions.md) |

#### Returns

`Promise`<`T`\>

#### Defined in

[testing/execution.ts:120](https://github.com/coda/packs-sdk/blob/main/testing/execution.ts#L120)
