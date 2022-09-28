---
nav: "newPack"
---
# Function: newPack

[core](../modules/core.md).newPack

▸ **newPack**(`definition?`): [`PackDefinitionBuilder`](../classes/core.PackDefinitionBuilder.md)

Creates a new skeleton pack definition that can be added to.

**`Example`**

```
export const pack = newPack();
pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
pack.addSyncTable('MyTable', ...);
pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](../interfaces/core.PackVersionDefinition.md)\> |

#### Returns

[`PackDefinitionBuilder`](../classes/core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:39](https://github.com/coda/packs-sdk/blob/main/builder.ts#L39)
