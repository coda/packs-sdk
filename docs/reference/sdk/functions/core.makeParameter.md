---
nav: "makeParameter"
---
# Function: makeParameter

[core](../modules/core.md).makeParameter

▸ **makeParameter**<`T`, `O`\>(`paramDefinition`): [`ParamDefFromOptionsUnion`](../types/core.ParamDefFromOptionsUnion.md)<`T`, `O`\>

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
| `O` | extends [`ParameterOptions`](../types/core.ParameterOptions.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramDefinition` | `O` |

#### Returns

[`ParamDefFromOptionsUnion`](../types/core.ParamDefFromOptionsUnion.md)<`T`, `O`\>

#### Defined in

[api.ts:403](https://github.com/coda/packs-sdk/blob/main/api.ts#L403)
