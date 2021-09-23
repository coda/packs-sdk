# Function: makeEmptyFormula

▸ **makeEmptyFormula**<`ParamDefsT`\>(`definition`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](../types/PackFormulaValue.md)[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/Type.md#string)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`EmptyFormulaDef`](../interfaces/EmptyFormulaDef.md)<`ParamDefsT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](../types/PackFormulaValue.md)[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/Type.md#string)  }

#### Defined in

[api.ts:1102](https://github.com/coda/packs-sdk/blob/main/api.ts#L1102)
