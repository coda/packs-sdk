# Function: makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`\>(`__namedParameters`): [`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`\>

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](../enums/ConnectionRequirement.md) |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | [`SyncFormulaDef`](../interfaces/SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `any`\> |
| `__namedParameters.getDisplayUrl` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`string`\> |
| `__namedParameters.getName` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`string`\> |
| `__namedParameters.getSchema` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<[`ArraySchema`](../interfaces/ArraySchema.md)<[`Schema`](../types/Schema.md)\>\> |
| `__namedParameters.listDynamicUrls?` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`string`[] \| [`MetadataFormulaResultType`](../types/MetadataFormulaResultType.md)<`string`\>[]\> |
| `__namedParameters.name` | `string` |

#### Returns

[`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`\>

#### Defined in

[api.ts:1467](https://github.com/coda/packs-sdk/blob/main/api.ts#L1467)
