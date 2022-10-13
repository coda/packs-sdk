# Function: makeEmptyFormula

[core](../modules/core.md).makeEmptyFormula

▸ **makeEmptyFormula**<`ParamDefsT`\>(`definition`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/core.Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/core.ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/core.Type.md#string)  }

Creates the definition of an "empty" formula, that is, a formula that uses a [RequestHandlerTemplate](../interfaces/core.RequestHandlerTemplate.md)
to define an implementation for the formula rather than implementing an actual `execute` function
in JavaScript.

**`Example`**

```
coda.makeEmptyFormula({
   name: "GetWidget",
   description: "Gets a widget.",
   request: {
     url: "https://example.com/widgets/{id}",
     method: "GET",
   },
   parameters: [
     coda.makeParameter({type: coda.ParameterType.Number, name: "id", description: "The ID of the widget to get."}),
   ],
 }),
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`EmptyFormulaDef`](../interfaces/core.EmptyFormulaDef.md)<`ParamDefsT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/core.Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/core.ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/core.Type.md#string)  }

#### Defined in

[api.ts:1798](https://github.com/coda/packs-sdk/blob/main/api.ts#L1798)
