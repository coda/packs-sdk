---
title: "makeTranslateObjectFormula"
---
# Function: makeTranslateObjectFormula

[core](../modules/core.md).makeTranslateObjectFormula

▸ **makeTranslateObjectFormula**<`ParamDefsT`, `ResultT`\>(`__namedParameters`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/core.Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/core.ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `Promise`<[`SchemaType`](../types/core.SchemaType.md)<`ResultT`\>\> ; `resultType`: [`object`](../enums/core.Type.md#object) ; `schema`: `undefined` \| `ResultT` = response.schema }

Helper to generate a formula that fetches a list of entities from a given URL and returns them.

One of the simplest but most common use cases for a pack formula is to make a request to an API
endpoint that returns a list of objects, and then return those objects either as-is
or with slight transformations. The can be accomplished with an `execute` function that does
exactly that, but alternatively you could use `makeTranslateObjectFormula` and an
`execute` implementation will be generated for you.

**`example`**
```
makeTranslateObjectFormula({
  name: "Users",
  description: "Returns a list of users."
  // This will generate an `execute` function that makes a GET request to the given URL.
  request: {
    method: 'GET',
    url: 'https://api.example.com/users',
  },
  response: {
    // Suppose the response body has the form `{users: [{ ...user1 }, { ...user2 }]}`.
    // This "projection" key tells the `execute` function that the list of results to return
    // can be found in the object property `users`. If omitted, the response body itself
    // should be the list of results.
    projectKey: 'users',
    schema: UserSchema,
  },
});

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `ResultT` | extends [`Schema`](../types/core.Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ObjectArrayFormulaDef`](../interfaces/core.ObjectArrayFormulaDef.md)<`ParamDefsT`, `ResultT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: (`undefined` \| [`PackFormulaValue`](../types/core.PackFormulaValue.md))[] ; `result`: [`PackFormulaResult`](../types/core.PackFormulaResult.md)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](../interfaces/core.Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](../types/core.ParamDefs.md)  } & { `execute`: (`params`: [`ParamValues`](../types/core.ParamValues.md)<`ParamDefsT`\>, `context`: [`ExecutionContext`](../interfaces/core.ExecutionContext.md)) => `Promise`<[`SchemaType`](../types/core.SchemaType.md)<`ResultT`\>\> ; `resultType`: [`object`](../enums/core.Type.md#object) ; `schema`: `undefined` \| `ResultT` = response.schema }

#### Defined in

[api.ts:1677](https://github.com/coda/packs-sdk/blob/main/api.ts#L1677)
