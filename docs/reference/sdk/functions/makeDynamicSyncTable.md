---
title: "makeDynamicSyncTable"
---
# Function: makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`__namedParameters`): [`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

Creates a dynamic sync table definition.

**`example`**
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
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchemaDefinition`](../interfaces/ObjectSchemaDefinition.md)<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](../enums/ConnectionRequirement.md) |
| `__namedParameters.defaultAddDynamicColumns?` | `boolean` |
| `__namedParameters.description?` | `string` |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | [`SyncFormulaDef`](../interfaces/SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `any`\> |
| `__namedParameters.getDisplayUrl` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) |
| `__namedParameters.getName` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) |
| `__namedParameters.getSchema` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) |
| `__namedParameters.identityName?` | `string` |
| `__namedParameters.listDynamicUrls?` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) |
| `__namedParameters.name` | `string` |
| `__namedParameters.placeholderSchema?` | `SchemaT` |

#### Returns

[`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Defined in

[api.ts:1581](https://github.com/coda/packs-sdk/blob/main/api.ts#L1581)
