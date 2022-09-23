---
title: "makeParameter"
---
# Function: makeParameter

[core](../modules/core.md).makeParameter

▸ **makeParameter**<`T`\>(`paramDefinition`): `ParamDefFromOptionsUnion`<`T`\>

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
| `T` | extends `UnionParameterOptions` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramDefinition` | `T` |

#### Returns

`ParamDefFromOptionsUnion`<`T`\>

#### Defined in

[api.ts:416](https://github.com/coda/packs-sdk/blob/main/api.ts#L416)
