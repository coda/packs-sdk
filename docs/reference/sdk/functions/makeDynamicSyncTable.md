# Function: makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`\>(`__namedParameters`): [`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](../enums/ConnectionRequirement.md) |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | `SyncFormulaDef`<`ParamDefsT`\> |
| `__namedParameters.getDisplayUrl` | `MetadataFormulaDef` |
| `__namedParameters.getName` | `MetadataFormulaDef` |
| `__namedParameters.getSchema` | `MetadataFormulaDef` |
| `__namedParameters.listDynamicUrls?` | `MetadataFormulaDef` |
| `__namedParameters.name` | `string` |

#### Returns

[`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Defined in

[api.ts:1022](https://github.com/coda/packs-sdk/blob/main/api.ts#L1022)
