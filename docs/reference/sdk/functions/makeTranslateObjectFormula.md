▸ **makeTranslateObjectFormula**<`ParamDefsT`, `ResultT`\>(`__namedParameters`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](../types/PackFormulaValue.md)[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `request`: `RequestHandlerTemplate` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<[`SchemaType`](../types/SchemaType.md)<`ResultT`\>\> ; `resultType`: [`object`](../enums/Type.md#object) ; `schema`: `undefined` \| `ResultT`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `ResultT` | extends [`Schema`](../types/Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ObjectArrayFormulaDef`<`ParamDefsT`, `ResultT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](../types/PackFormulaValue.md)[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `request`: `RequestHandlerTemplate` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<[`SchemaType`](../types/SchemaType.md)<`ResultT`\>\> ; `resultType`: [`object`](../enums/Type.md#object) ; `schema`: `undefined` \| `ResultT`  }

#### Defined in

[api.ts:1059](https://github.com/coda/packs-sdk/blob/main/api.ts#L1059)
