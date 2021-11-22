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

<<<<<<< HEAD
[api.ts:289](https://github.com/coda/packs-sdk/blob/main/api.ts#L289)
=======
[api.ts:297](https://github.com/coda/packs-sdk/blob/main/api.ts#L297)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
