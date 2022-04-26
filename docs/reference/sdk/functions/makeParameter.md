---
title: "makeParameter"
---
# Function: makeParameter

▸ **makeParameter**<`T`\>(`paramDefinition`): [`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>

Create a definition for a parameter for a formula or sync.

**`example`**
```
makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});
```

**`example`**
```
makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](../enums/ParameterType.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramDefinition` | [`ParameterOptions`](../types/ParameterOptions.md)<`T`\> |

#### Returns

[`ParamDef`](../interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>

#### Defined in

[api.ts:335](https://github.com/coda/packs-sdk/blob/main/api.ts#L335)
