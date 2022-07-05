---
title: "makeParameter"
---
# Function: makeParameter

[core](../modules/core.md).makeParameter

▸ **makeParameter**<`T`\>(`paramDefinition`): [`ParamDef`](../interfaces/core.ParamDef.md)<`ParameterTypeMap`[`T`]\>

Create a definition for a parameter for a formula or sync.

**`Example`**

 ```
makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});
```

**`Example`**

 ```
makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/core.ParameterType.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramDefinition` | [`ParameterOptions`](../types/core.ParameterOptions.md)<`T`\> |

#### Returns

[`ParamDef`](../interfaces/core.ParamDef.md)<`ParameterTypeMap`[`T`]\>
