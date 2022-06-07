---
title: "makeEmptyFormula"
---
# Function: makeEmptyFormula

▸ **makeEmptyFormula**<`ParamDefsT`\>(`definition`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/Type.md#string)  }

Creates the definition of an "empty" formula, that is, a formula that uses a [RequestHandlerTemplate](../interfaces/RequestHandlerTemplate.md)
to define an implementation for the formula rather than implementing an actual `execute` function
in JavaScript.

**`example`**
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
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`EmptyFormulaDef`](../interfaces/EmptyFormulaDef.md)<`ParamDefsT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](../enums/Type.md#string)  }

#### Defined in

[api.ts:1729](https://github.com/coda/packs-sdk/blob/main/api.ts#L1729)
