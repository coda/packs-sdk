---
nav: "makeDynamicSyncTable"
---
# Function: makeDynamicSyncTable

[core](../modules/core.md).makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`__namedParameters`): [`DynamicSyncTableDef`](../interfaces/core.DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

Creates a dynamic sync table definition.

**`Example`**

```
coda.makeDynamicSyncTable({
  name: "MySyncTable",
  getName: async function(context) => {
    const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
    return response.body.name;
  },
  getName: async function(context) => {
    const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
    return response.body.browserLink;
  },
  ...
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchemaDefinition`](../interfaces/core.ObjectSchemaDefinition.md)<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](../enums/core.ConnectionRequirement.md) |
| `__namedParameters.defaultAddDynamicColumns?` | `boolean` |
| `__namedParameters.description?` | `string` |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | [`SyncFormulaDef`](../interfaces/core.SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `any`\> |
| `__namedParameters.getDisplayUrl` | [`MetadataFormulaDef`](../types/core.MetadataFormulaDef.md) |
| `__namedParameters.getName` | [`MetadataFormulaDef`](../types/core.MetadataFormulaDef.md) |
| `__namedParameters.getSchema` | [`MetadataFormulaDef`](../types/core.MetadataFormulaDef.md) |
| `__namedParameters.identityName` | `string` |
| `__namedParameters.listDynamicUrls?` | [`MetadataFormulaDef`](../types/core.MetadataFormulaDef.md) |
| `__namedParameters.maxUpdateBatchSize?` | `number` |
| `__namedParameters.name` | `string` |
| `__namedParameters.placeholderSchema?` | `SchemaT` |

#### Returns

[`DynamicSyncTableDef`](../interfaces/core.DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Defined in

[api.ts:1668](https://github.com/coda/packs-sdk/blob/main/api.ts#L1668)
