# Function: makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaDefT`, `SchemaT`\>(`__namedParameters`): [`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

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
| `SchemaDefT` | extends [`ObjectSchemaDefinition`](../interfaces/ObjectSchemaDefinition.md)<`K`, `L`, `SchemaDefT`\> |
| `SchemaT` | extends `SchemaTFromDef`<`SchemaDefT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](../enums/ConnectionRequirement.md) |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | [`SyncFormulaDef`](../interfaces/SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `any`\> |
| `__namedParameters.getDisplayUrl` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`string`\> |
| `__namedParameters.getName` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`string`\> |
| `__namedParameters.getSchema` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<`any`\> |
| `__namedParameters.listDynamicUrls?` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)<[`MetadataFormulaResultType`](../types/MetadataFormulaResultType.md)[]\> |
| `__namedParameters.name` | `string` |

#### Returns

[`DynamicSyncTableDef`](../interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Defined in

[api.ts:1512](https://github.com/coda/packs-sdk/blob/main/api.ts#L1512)
