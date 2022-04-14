---
title: "newPack"
---
# Function: newPack

▸ **newPack**(`definition?`): [`PackDefinitionBuilder`](../classes/PackDefinitionBuilder.md)

Creates a new skeleton pack definition that can be added to.

**`example`**
```
export const pack = newPack();
pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
pack.addSyncTable('MyTable', ...);
pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](../interfaces/PackVersionDefinition.md)\> |

#### Returns

[`PackDefinitionBuilder`](../classes/PackDefinitionBuilder.md)

#### Defined in

[builder.ts:39](https://github.com/coda/packs-sdk/blob/main/builder.ts#L39)
