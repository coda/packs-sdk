# @codahq/packs-sdk

## Enumerations

- [AttributionNodeType](enums/AttributionNodeType.md)
- [AuthenticationType](enums/AuthenticationType.md)
- [ConnectionRequirement](enums/ConnectionRequirement.md)
- [CurrencyFormat](enums/CurrencyFormat.md)
- [DefaultConnectionType](enums/DefaultConnectionType.md)
- [DurationUnit](enums/DurationUnit.md)
- [NetworkConnection](enums/NetworkConnection.md)
- [ParameterType](enums/ParameterType.md)
- [PostSetupType](enums/PostSetupType.md)
- [PrecannedDateRange](enums/PrecannedDateRange.md)
- [Type](enums/Type.md)
- [ValueHintType](enums/ValueHintType.md)
- [ValueType](enums/ValueType.md)

## Classes

- [PackDefinitionBuilder](classes/PackDefinitionBuilder.md)
- [StatusCodeError](classes/StatusCodeError.md)
- [UserVisibleError](classes/UserVisibleError.md)

## Interfaces

- [ArraySchema](interfaces/ArraySchema.md)
- [ArrayType](interfaces/ArrayType.md)
- [BooleanSchema](interfaces/BooleanSchema.md)
- [Continuation](interfaces/Continuation.md)
- [CurrencySchema](interfaces/CurrencySchema.md)
- [DateSchema](interfaces/DateSchema.md)
- [DateTimeSchema](interfaces/DateTimeSchema.md)
- [DurationSchema](interfaces/DurationSchema.md)
- [DynamicSyncTableDef](interfaces/DynamicSyncTableDef.md)
- [EmptyFormulaDef](interfaces/EmptyFormulaDef.md)
- [ExecutionContext](interfaces/ExecutionContext.md)
- [ExternalPackVersionMetadata](interfaces/ExternalPackVersionMetadata.md)
- [FetchRequest](interfaces/FetchRequest.md)
- [FetchResponse](interfaces/FetchResponse.md)
- [Fetcher](interfaces/Fetcher.md)
- [Format](interfaces/Format.md)
- [Identity](interfaces/Identity.md)
- [IdentityDefinition](interfaces/IdentityDefinition.md)
- [MetadataFormulaObjectResultType](interfaces/MetadataFormulaObjectResultType.md)
- [Network](interfaces/Network.md)
- [NumberSchema](interfaces/NumberSchema.md)
- [NumericSchema](interfaces/NumericSchema.md)
- [OAuth2Authentication](interfaces/OAuth2Authentication.md)
- [ObjectSchema](interfaces/ObjectSchema.md)
- [ObjectSchemaProperty](interfaces/ObjectSchemaProperty.md)
- [PackDefinition](interfaces/PackDefinition.md)
- [PackFormatMetadata](interfaces/PackFormatMetadata.md)
- [PackFormulaDef](interfaces/PackFormulaDef.md)
- [PackFormulas](interfaces/PackFormulas.md)
- [PackFormulasMetadata](interfaces/PackFormulasMetadata.md)
- [PackVersionDefinition](interfaces/PackVersionDefinition.md)
- [ParamDef](interfaces/ParamDef.md)
- [ScaleSchema](interfaces/ScaleSchema.md)
- [SimpleAutocompleteOption](interfaces/SimpleAutocompleteOption.md)
- [SliderSchema](interfaces/SliderSchema.md)
- [StringSchema](interfaces/StringSchema.md)
- [SyncExecutionContext](interfaces/SyncExecutionContext.md)
- [SyncFormulaResult](interfaces/SyncFormulaResult.md)
- [SyncTableDef](interfaces/SyncTableDef.md)
- [TemporaryBlobStorage](interfaces/TemporaryBlobStorage.md)
- [TimeSchema](interfaces/TimeSchema.md)
- [WebBasicAuthentication](interfaces/WebBasicAuthentication.md)

## Type aliases

### Authentication

Ƭ **Authentication**: `NoAuthentication` \| `VariousAuthentication` \| `HeaderBearerTokenAuthentication` \| `CodaApiBearerTokenAuthentication` \| `CustomHeaderTokenAuthentication` \| `QueryParamTokenAuthentication` \| `MultiQueryParamTokenAuthentication` \| [`OAuth2Authentication`](interfaces/OAuth2Authentication.md) \| [`WebBasicAuthentication`](interfaces/WebBasicAuthentication.md) \| `AWSSignature4Authentication`

The union of supported authentication methods.

#### Defined in

[types.ts:441](https://github.com/coda/packs-sdk/blob/main/types.ts#L441)

___

### BasicPackDefinition

Ƭ **BasicPackDefinition**: `Omit`<[`PackVersionDefinition`](interfaces/PackVersionDefinition.md), ``"version"``\>

A pack definition without an author-defined semantic version, for use in the web
editor where Coda will manage versioning on behalf of the pack author.

#### Defined in

[types.ts:669](https://github.com/coda/packs-sdk/blob/main/types.ts#L669)

___

### DefaultValueType

Ƭ **DefaultValueType**<`T`\>: `T` extends [`ArrayType`](interfaces/ArrayType.md)<[`date`](enums/Type.md#date)\> ? `TypeOfMap`<`T`\> \| [`PrecannedDateRange`](enums/PrecannedDateRange.md) : `TypeOfMap`<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnionType` |

#### Defined in

[api_types.ts:188](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L188)

___

### ExternalObjectPackFormula

Ƭ **ExternalObjectPackFormula**: `ObjectPackFormulaMetadata`

#### Defined in

[compiled_types.ts:83](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L83)

___

### ExternalPackFormat

Ƭ **ExternalPackFormat**: [`Format`](interfaces/Format.md)

#### Defined in

[compiled_types.ts:85](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L85)

___

### ExternalPackFormatMetadata

Ƭ **ExternalPackFormatMetadata**: [`PackFormatMetadata`](interfaces/PackFormatMetadata.md)

#### Defined in

[compiled_types.ts:86](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L86)

___

### ExternalPackFormula

Ƭ **ExternalPackFormula**: [`PackFormulaMetadata`](README.md#packformulametadata)

#### Defined in

[compiled_types.ts:84](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L84)

___

### ExternalPackFormulas

Ƭ **ExternalPackFormulas**: [`PackFormulasMetadata`](interfaces/PackFormulasMetadata.md) \| [`PackFormulaMetadata`](README.md#packformulametadata)[]

#### Defined in

[compiled_types.ts:82](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L82)

___

### ExternalPackMetadata

Ƭ **ExternalPackMetadata**: [`ExternalPackVersionMetadata`](interfaces/ExternalPackVersionMetadata.md) & `Pick`<[`PackMetadata`](README.md#packmetadata), ``"id"`` \| ``"name"`` \| ``"shortDescription"`` \| ``"description"`` \| ``"permissionsDescription"`` \| ``"category"`` \| ``"logoPath"`` \| ``"exampleImages"`` \| ``"exampleVideoIds"`` \| ``"minimumFeatureSet"`` \| ``"quotas"`` \| ``"rateLimits"`` \| ``"isSystem"``\>

Further stripped-down version of `PackMetadata` that contains only what the browser needs.

#### Defined in

[compiled_types.ts:114](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L114)

___

### ExternalSyncTable

Ƭ **ExternalSyncTable**: [`PackSyncTable`](README.md#packsynctable)

#### Defined in

[compiled_types.ts:87](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L87)

___

### FetchMethodType

Ƭ **FetchMethodType**: typeof `ValidFetchMethods`[`number`]

#### Defined in

[api_types.ts:282](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L282)

___

### Formula

Ƭ **Formula**<`ParamDefsT`\>: `NumericPackFormula`<`ParamDefsT`\> \| `StringPackFormula`<`ParamDefsT`, `any`\> \| `BooleanPackFormula`<`ParamDefsT`\> \| `ObjectPackFormula`<`ParamDefsT`, [`Schema`](README.md#schema)\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs)[`ParamDefs`](README.md#paramdefs) |

#### Defined in

[api.ts:410](https://github.com/coda/packs-sdk/blob/main/api.ts#L410)

___

### GenericDynamicSyncTable

Ƭ **GenericDynamicSyncTable**: [`DynamicSyncTableDef`](interfaces/DynamicSyncTableDef.md)<`any`, `any`, [`ParamDefs`](README.md#paramdefs), `any`\>

Type definition for a dynamic sync table.
Should not be necessary to use directly, see [makeDynamicSyncTable](README.md#makedynamicsynctable)
for defining a sync table.

#### Defined in

[api.ts:187](https://github.com/coda/packs-sdk/blob/main/api.ts#L187)

___

### GenericObjectSchema

Ƭ **GenericObjectSchema**: [`ObjectSchema`](interfaces/ObjectSchema.md)<`string`, `string`\>

#### Defined in

[schema.ts:174](https://github.com/coda/packs-sdk/blob/main/schema.ts#L174)

___

### GenericSyncFormula

Ƭ **GenericSyncFormula**: `SyncFormula`<`any`, `any`, [`ParamDefs`](README.md#paramdefs), `any`\>

Type definition for the formula that implements a sync table.
Should not be necessary to use directly, see [makeSyncTable](README.md#makesynctable)
for defining a sync table.

#### Defined in

[api.ts:169](https://github.com/coda/packs-sdk/blob/main/api.ts#L169)

___

### GenericSyncFormulaResult

Ƭ **GenericSyncFormulaResult**: [`SyncFormulaResult`](interfaces/SyncFormulaResult.md)<`any`\>

Type definition for the return value of a sync table.
Should not be necessary to use directly, see [makeSyncTable](README.md#makesynctable)
for defining a sync table.

#### Defined in

[api.ts:175](https://github.com/coda/packs-sdk/blob/main/api.ts#L175)

___

### GenericSyncTable

Ƭ **GenericSyncTable**: [`SyncTableDef`](interfaces/SyncTableDef.md)<`any`, `any`, [`ParamDefs`](README.md#paramdefs), `any`\>

Type definition for a static (non-dynamic) sync table.
Should not be necessary to use directly, see [makeSyncTable](README.md#makesynctable)
for defining a sync table.

#### Defined in

[api.ts:181](https://github.com/coda/packs-sdk/blob/main/api.ts#L181)

___

### MetadataContext

Ƭ **MetadataContext**: `Record`<`string`, `any`\>

A context object that is provided to a metadata formula at execution time.
For example, an autocomplete metadata formula for a parameter value may need
to know the value of parameters that have already been selected. Those parameter
values are provided in this context object.

#### Defined in

[api.ts:671](https://github.com/coda/packs-sdk/blob/main/api.ts#L671)

___

### MetadataFormula

Ƭ **MetadataFormula**: `ObjectPackFormula`<[[`ParamDef`](interfaces/ParamDef.md)<[`string`](enums/Type.md#string)\>, [`ParamDef`](interfaces/ParamDef.md)<[`string`](enums/Type.md#string)\>], `any`\>

#### Defined in

[api.ts:674](https://github.com/coda/packs-sdk/blob/main/api.ts#L674)

___

### MetadataFormulaResultType

Ƭ **MetadataFormulaResultType**: `string` \| `number` \| [`MetadataFormulaObjectResultType`](interfaces/MetadataFormulaObjectResultType.md)

#### Defined in

[api.ts:673](https://github.com/coda/packs-sdk/blob/main/api.ts#L673)

___

### ObjectSchemaProperties

Ƭ **ObjectSchemaProperties**<`K`\>: { [K2 in K \| string]: Schema & ObjectSchemaProperty }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string``never` |

#### Defined in

[schema.ts:170](https://github.com/coda/packs-sdk/blob/main/schema.ts#L170)

___

### PackFormulaMetadata

Ƭ **PackFormulaMetadata**: `Omit`<[`TypedPackFormula`](README.md#typedpackformula), ``"execute"``\>

#### Defined in

[api.ts:419](https://github.com/coda/packs-sdk/blob/main/api.ts#L419)

___

### PackFormulaResult

Ƭ **PackFormulaResult**: `$Values`<`TypeMap`\> \| [`PackFormulaResult`](README.md#packformularesult)[]

#### Defined in

[api_types.ts:71](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L71)

___

### PackFormulaValue

Ƭ **PackFormulaValue**: `$Values`<`Omit`<`TypeMap`, [`object`](enums/Type.md#object)\>\> \| [`PackFormulaValue`](README.md#packformulavalue)[]

#### Defined in

[api_types.ts:70](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L70)

___

### PackId

Ƭ **PackId**: `number`

**`deprecated`** Use `number` in new code.

#### Defined in

[types.ts:11](https://github.com/coda/packs-sdk/blob/main/types.ts#L11)

___

### PackMetadata

Ƭ **PackMetadata**: [`PackVersionMetadata`](README.md#packversionmetadata) & `Pick`<[`PackDefinition`](interfaces/PackDefinition.md), ``"id"`` \| ``"name"`` \| ``"shortDescription"`` \| ``"description"`` \| ``"permissionsDescription"`` \| ``"category"`` \| ``"logoPath"`` \| ``"exampleImages"`` \| ``"exampleVideoIds"`` \| ``"minimumFeatureSet"`` \| ``"quotas"`` \| ``"rateLimits"`` \| ``"enabledConfigName"`` \| ``"isSystem"``\>

Stripped-down version of `PackDefinition` that doesn't contain formula definitions.

#### Defined in

[compiled_types.ts:60](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L60)

___

### PackSyncTable

Ƭ **PackSyncTable**: `Omit`<`SyncTable`, ``"getter"`` \| ``"getName"`` \| ``"getSchema"`` \| ``"listDynamicUrls"`` \| ``"getDisplayUrl"``\> & { `getDisplayUrl?`: `MetadataFormulaMetadata` ; `getName?`: `MetadataFormulaMetadata` ; `getSchema?`: `MetadataFormulaMetadata` ; `getter`: [`PackFormulaMetadata`](README.md#packformulametadata) ; `hasDynamicSchema?`: `boolean` ; `isDynamic?`: `boolean` ; `listDynamicUrls?`: `MetadataFormulaMetadata`  }

#### Defined in

[compiled_types.ts:13](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L13)

___

### PackVersionMetadata

Ƭ **PackVersionMetadata**: `Omit`<[`PackVersionDefinition`](interfaces/PackVersionDefinition.md), ``"formulas"`` \| ``"formats"`` \| ``"defaultAuthentication"`` \| ``"syncTables"``\> & { `defaultAuthentication?`: `AuthenticationMetadata` ; `formats`: [`PackFormatMetadata`](interfaces/PackFormatMetadata.md)[] ; `formulas`: [`PackFormulasMetadata`](interfaces/PackFormulasMetadata.md) \| [`PackFormulaMetadata`](README.md#packformulametadata)[] ; `syncTables`: [`PackSyncTable`](README.md#packsynctable)[]  }

Stripped-down version of `PackVersionDefinition` that doesn't contain formula definitions.

#### Defined in

[compiled_types.ts:48](https://github.com/coda/packs-sdk/blob/main/compiled_types.ts#L48)

___

### ParamDefs

Ƭ **ParamDefs**: [[`ParamDef`](interfaces/ParamDef.md)<`UnionType`\>, ...ParamDef<UnionType\>[]] \| []

#### Defined in

[api_types.ts:173](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L173)

___

### ParamValues

Ƭ **ParamValues**<`ParamDefsT`\>: { [K in keyof ParamDefsT]: ParamDefsT[K] extends ParamDef<infer T\> ? TypeOfMap<T\> : never } & `any`[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |

#### Defined in

[api_types.ts:183](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L183)

___

### ParamsList

Ƭ **ParamsList**: [`ParamDef`](interfaces/ParamDef.md)<`UnionType`\>[]

#### Defined in

[api_types.ts:175](https://github.com/coda/packs-sdk/blob/main/api_types.ts#L175)

___

### Schema

Ƭ **Schema**: [`BooleanSchema`](interfaces/BooleanSchema.md) \| [`NumberSchema`](interfaces/NumberSchema.md) \| [`StringSchema`](interfaces/StringSchema.md) \| [`ArraySchema`](interfaces/ArraySchema.md) \| [`GenericObjectSchema`](README.md#genericobjectschema)

#### Defined in

[schema.ts:230](https://github.com/coda/packs-sdk/blob/main/schema.ts#L230)

___

### SchemaType

Ƭ **SchemaType**<`T`\>: `T` extends [`BooleanSchema`](interfaces/BooleanSchema.md) ? `boolean` : `T` extends [`NumberSchema`](interfaces/NumberSchema.md) ? `number` : `T` extends [`StringSchema`](interfaces/StringSchema.md) ? `StringHintTypeToSchemaType`<`T`[``"codaType"``]\> : `T` extends [`ArraySchema`](interfaces/ArraySchema.md) ? [`SchemaType`](README.md#schematype)<`T`[``"items"``]\>[] : `T` extends [`GenericObjectSchema`](README.md#genericobjectschema) ? `PickOptional`<{ [K in keyof T["properties"]]: SchemaType<T["properties"][K]\> }, `$Values`<{ [K in keyof T["properties"]]: T["properties"][K] extends Object ? K : never }\>\> : `never`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](README.md#schema) |

#### Defined in

[schema.ts:249](https://github.com/coda/packs-sdk/blob/main/schema.ts#L249)

___

### SystemAuthentication

Ƭ **SystemAuthentication**: `HeaderBearerTokenAuthentication` \| `CustomHeaderTokenAuthentication` \| `QueryParamTokenAuthentication` \| `MultiQueryParamTokenAuthentication` \| [`WebBasicAuthentication`](interfaces/WebBasicAuthentication.md) \| `AWSSignature4Authentication`

The union of authentication methods that are supported for system authentication,
where the pack author provides credentials used in HTTP requests rather than the user.

#### Defined in

[types.ts:498](https://github.com/coda/packs-sdk/blob/main/types.ts#L498)

___

### TypedPackFormula

Ƭ **TypedPackFormula**: [`Formula`](README.md#formula) \| [`GenericSyncFormula`](README.md#genericsyncformula)

#### Defined in

[api.ts:416](https://github.com/coda/packs-sdk/blob/main/api.ts#L416)

## Functions

### assertCondition

▸ **assertCondition**(`condition`, `message?`): asserts condition

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `any` |
| `message?` | `string` |

#### Returns

asserts condition

#### Defined in

[helpers/ensure.ts:25](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L25)

___

### autocompleteSearchObjects

▸ **autocompleteSearchObjects**<`T`\>(`search`, `objs`, `displayKey`, `valueKey`): `Promise`<[`MetadataFormulaObjectResultType`](interfaces/MetadataFormulaObjectResultType.md)[]\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `string` |
| `objs` | `T`[] |
| `displayKey` | keyof `T` |
| `valueKey` | keyof `T` |

#### Returns

`Promise`<[`MetadataFormulaObjectResultType`](interfaces/MetadataFormulaObjectResultType.md)[]\>

#### Defined in

[api.ts:736](https://github.com/coda/packs-sdk/blob/main/api.ts#L736)

___

### ensureExists

▸ **ensureExists**<`T`\>(`value`, `message?`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `undefined` \| ``null`` \| `T` |
| `message?` | `string` |

#### Returns

`T`

#### Defined in

[helpers/ensure.ts:14](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L14)

___

### ensureNonEmptyString

▸ **ensureNonEmptyString**(`value`, `message?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `undefined` \| ``null`` \| `string` |
| `message?` | `string` |

#### Returns

`string`

#### Defined in

[helpers/ensure.ts:7](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L7)

___

### ensureUnreachable

▸ **ensureUnreachable**(`value`, `message?`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `never` |
| `message?` | `string` |

#### Returns

`never`

#### Defined in

[helpers/ensure.ts:3](https://github.com/coda/packs-sdk/blob/main/helpers/ensure.ts#L3)

___

### generateSchema

▸ **generateSchema**(`obj`): [`Schema`](README.md#schema)

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `ValidTypes` |

#### Returns

[`Schema`](README.md#schema)

#### Defined in

[schema.ts:266](https://github.com/coda/packs-sdk/blob/main/schema.ts#L266)

___

### getQueryParams

▸ **getQueryParams**(`url`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Object`

#### Defined in

[helpers/url.ts:17](https://github.com/coda/packs-sdk/blob/main/helpers/url.ts#L17)

___

### joinUrl

▸ **joinUrl**(...`tokens`): `string`

Joins all the tokens into a single URL string separated by '/'. Zero length tokens cause errors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...tokens` | `string`[] | Zero or more tokens to be combined. If token doesn't end with '/', one will be added as the separator |

#### Returns

`string`

#### Defined in

[helpers/url.ts:27](https://github.com/coda/packs-sdk/blob/main/helpers/url.ts#L27)

___

### makeAttributionNode

▸ **makeAttributionNode**<`T`\>(`node`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `AttributionNode` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:226](https://github.com/coda/packs-sdk/blob/main/schema.ts#L226)

___

### makeDynamicSyncTable

▸ **makeDynamicSyncTable**<`K`, `L`, `ParamDefsT`\>(`__namedParameters`): [`DynamicSyncTableDef`](interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.connectionRequirement?` | [`ConnectionRequirement`](enums/ConnectionRequirement.md) |
| `__namedParameters.entityName?` | `string` |
| `__namedParameters.formula` | `SyncFormulaDef`<`ParamDefsT`\> |
| `__namedParameters.getDisplayUrl` | `MetadataFormulaDef` |
| `__namedParameters.getName` | `MetadataFormulaDef` |
| `__namedParameters.getSchema` | `MetadataFormulaDef` |
| `__namedParameters.listDynamicUrls?` | `MetadataFormulaDef` |
| `__namedParameters.name` | `string` |

#### Returns

[`DynamicSyncTableDef`](interfaces/DynamicSyncTableDef.md)<`K`, `L`, `ParamDefsT`, `any`\>

#### Defined in

[api.ts:1008](https://github.com/coda/packs-sdk/blob/main/api.ts#L1008)

___

### makeEmptyFormula

▸ **makeEmptyFormula**<`ParamDefsT`\>(`definition`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](README.md#packformulavalue)[] ; `result`: [`PackFormulaResult`](README.md#packformularesult)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](README.md#paramdefs)  } & { `execute`: (`params`: [`ParamValues`](README.md#paramvalues)<`ParamDefsT`\>, `context`: [`ExecutionContext`](interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](enums/Type.md#string)  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`EmptyFormulaDef`](interfaces/EmptyFormulaDef.md)<`ParamDefsT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](README.md#packformulavalue)[] ; `result`: [`PackFormulaResult`](README.md#packformularesult)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `varargParameters?`: [`ParamDefs`](README.md#paramdefs)  } & { `execute`: (`params`: [`ParamValues`](README.md#paramvalues)<`ParamDefsT`\>, `context`: [`ExecutionContext`](interfaces/ExecutionContext.md)) => `Promise`<`string`\> ; `resultType`: [`string`](enums/Type.md#string)  }

#### Defined in

[api.ts:1088](https://github.com/coda/packs-sdk/blob/main/api.ts#L1088)

___

### makeFormula

▸ **makeFormula**<`ParamDefsT`\>(`fullDefinition`): [`Formula`](README.md#formula)<`ParamDefsT`\>

Creates a formula definition.

You must indicate the kind of value that this formula returns (string, number, boolean, array, or object)
using the `resultType` field.

Formulas always return basic types, but you may optionally give a type hint using
`codaType` to tell Coda how to interpret a given value. For example, you can return
a string that represents a date, but use `codaType: ValueType.Date` to tell Coda
to interpret as a date in a document.

If your formula returns an object, you must provide a `schema` property that describes
the structure of the object. See [makeObjectSchema](README.md#makeobjectschema) for how to construct an object schema.

If your formula returns a list (array), you must provide an `items` property that describes
what the elements of the array are. This could be a simple schema like `{type: ValueType.String}`
indicating that the array elements are all just strings, or it could be an object schema
created using [makeObjectSchema](README.md#makeobjectschema) if the elements are objects.

**`example`**
makeFormula({resultType: ValueType.String, name: 'Hello', ...});

**`example`**
makeFormula({resultType: ValueType.String, codaType: ValueType.Html, name: 'HelloHtml', ...});

**`example`**
makeFormula({resultType: ValueType.Array, items: {type: ValueType.String}, name: 'HelloStringArray', ...});

**`example`**
makeFormula({
  resultType: ValueType.Object,
  schema: makeObjectSchema({type: ValueType.Object, properties: {...}}),
  name: 'HelloObject',
  ...
});

**`example`**
makeFormula({
  resultType: ValueType.Array,
  items: makeObjectSchema({type: ValueType.Object, properties: {...}}),
  name: 'HelloObjectArray',
  ...
});

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fullDefinition` | `FormulaDefinitionV2`<`ParamDefsT`\> |

#### Returns

[`Formula`](README.md#formula)<`ParamDefsT`\>

#### Defined in

[api.ts:529](https://github.com/coda/packs-sdk/blob/main/api.ts#L529)

___

### makeMetadataFormula

▸ **makeMetadataFormula**(`execute`, `options?`): [`MetadataFormula`](README.md#metadataformula)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execute` | `MetadataFunction` |
| `options?` | `Object` |
| `options.connectionRequirement?` | [`ConnectionRequirement`](enums/ConnectionRequirement.md) |

#### Returns

[`MetadataFormula`](README.md#metadataformula)

#### Defined in

[api.ts:683](https://github.com/coda/packs-sdk/blob/main/api.ts#L683)

___

### makeObjectSchema

▸ **makeObjectSchema**<`K`, `L`, `T`\>(`schemaDef`): [`ObjectSchema`](interfaces/ObjectSchema.md)<`K`, `L`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `T` | extends `ObjectSchemaDefinition`<`K`, `L`, `T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schemaDef` | `T` |

#### Returns

[`ObjectSchema`](interfaces/ObjectSchema.md)<`K`, `L`\>

#### Defined in

[schema.ts:302](https://github.com/coda/packs-sdk/blob/main/schema.ts#L302)

___

### makeParameter

▸ **makeParameter**<`T`\>(`paramDefinition`): [`ParamDef`](interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>

Create a definition for a parameter for a formula or sync.

**`example`**
makeParameter({type: ParameterType.String, name: 'myParam', description: 'My description'});

**`example`**
makeParameter({type: ParameterType.StringArray, name: 'myArrayParam', description: 'My description'});

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ParameterType`](enums/ParameterType.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `paramDefinition` | `ParameterOptions`<`T`\> |

#### Returns

[`ParamDef`](interfaces/ParamDef.md)<`ParameterTypeMap`[`T`]\>

#### Defined in

[api.ts:228](https://github.com/coda/packs-sdk/blob/main/api.ts#L228)

___

### makeReferenceSchemaFromObjectSchema

▸ **makeReferenceSchemaFromObjectSchema**(`schema`, `identityName?`): [`GenericObjectSchema`](README.md#genericobjectschema)

Convenience for creating a reference object schema from an existing schema for the
object. Copies over the identity, id, and primary from the schema, and the subset of
properties indicated by the id and primary.
A reference schema can always be defined directly, but if you already have an object
schema it provides better code reuse to derive a reference schema instead.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`GenericObjectSchema`](README.md#genericobjectschema) |
| `identityName?` | `string` |

#### Returns

[`GenericObjectSchema`](README.md#genericobjectschema)

#### Defined in

[schema.ts:401](https://github.com/coda/packs-sdk/blob/main/schema.ts#L401)

___

### makeSchema

▸ **makeSchema**<`T`\>(`schema`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](README.md#schema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `T` |

#### Returns

`T`

#### Defined in

[schema.ts:296](https://github.com/coda/packs-sdk/blob/main/schema.ts#L296)

___

### makeSimpleAutocompleteMetadataFormula

▸ **makeSimpleAutocompleteMetadataFormula**(`options`): [`MetadataFormula`](README.md#metadataformula)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | (`string` \| [`SimpleAutocompleteOption`](interfaces/SimpleAutocompleteOption.md))[] |

#### Returns

[`MetadataFormula`](README.md#metadataformula)

#### Defined in

[api.ts:753](https://github.com/coda/packs-sdk/blob/main/api.ts#L753)

___

### makeSyncTable

▸ **makeSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaDefT`, `SchemaT`\>(`__namedParameters`): [`SyncTableDef`](interfaces/SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

Wrapper to produce a sync table definition. All (non-dynamic) sync tables should be created
using this wrapper rather than declaring a sync table definition object directly.

This wrapper does a variety of helpful things, including
* Doing basic validation of the provided definition.
* Normalizing the schema definition to conform to Coda-recommended syntax.
* Wrapping the execute formula to normalize return values to match the normalized schema.

See [Normalization](/index.html#normalization) for more information about schema normalization.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |
| `SchemaDefT` | extends `ObjectSchemaDefinition`<`K`, `L`, `SchemaDefT`\> |
| `SchemaT` | extends [`ObjectSchema`](interfaces/ObjectSchema.md)<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `SyncTableOptions`<`K`, `L`, `ParamDefsT`, `SchemaDefT`\> |

#### Returns

[`SyncTableDef`](interfaces/SyncTableDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

#### Defined in

[api.ts:927](https://github.com/coda/packs-sdk/blob/main/api.ts#L927)

___

### makeTranslateObjectFormula

▸ **makeTranslateObjectFormula**<`ParamDefsT`, `ResultT`\>(`__namedParameters`): { `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](README.md#packformulavalue)[] ; `result`: [`PackFormulaResult`](README.md#packformularesult)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `request`: `RequestHandlerTemplate` ; `varargParameters?`: [`ParamDefs`](README.md#paramdefs)  } & { `execute`: (`params`: [`ParamValues`](README.md#paramvalues)<`ParamDefsT`\>, `context`: [`ExecutionContext`](interfaces/ExecutionContext.md)) => `Promise`<[`SchemaType`](README.md#schematype)<`ResultT`\>\> ; `resultType`: [`object`](enums/Type.md#object) ; `schema`: `undefined` \| `ResultT`  }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](README.md#paramdefs) |
| `ResultT` | extends [`Schema`](README.md#schema) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `ObjectArrayFormulaDef`<`ParamDefsT`, `ResultT`\> |

#### Returns

{ `cacheTtlSecs?`: `number` ; `connectionRequirement?`: [`ConnectionRequirement`](enums/ConnectionRequirement.md) ; `description`: `string` ; `examples?`: { `params`: [`PackFormulaValue`](README.md#packformulavalue)[] ; `result`: [`PackFormulaResult`](README.md#packformularesult)  }[] ; `extraOAuthScopes?`: `string`[] ; `isAction?`: `boolean` ; `isExperimental?`: `boolean` ; `isSystem?`: `boolean` ; `name`: `string` ; `network?`: [`Network`](interfaces/Network.md) ; `parameters`: `ParamDefsT` ; `request`: `RequestHandlerTemplate` ; `varargParameters?`: [`ParamDefs`](README.md#paramdefs)  } & { `execute`: (`params`: [`ParamValues`](README.md#paramvalues)<`ParamDefsT`\>, `context`: [`ExecutionContext`](interfaces/ExecutionContext.md)) => `Promise`<[`SchemaType`](README.md#schematype)<`ResultT`\>\> ; `resultType`: [`object`](enums/Type.md#object) ; `schema`: `undefined` \| `ResultT`  }

#### Defined in

[api.ts:1059](https://github.com/coda/packs-sdk/blob/main/api.ts#L1059)

___

### newPack

▸ **newPack**(`definition?`): [`PackDefinitionBuilder`](classes/PackDefinitionBuilder.md)

Creates a new skeleton pack definition that can be added to.

**`example`**
export const pack = newPack();
pack.addFormula({resultType: ValueType.String, name: 'MyFormula', ...});
pack.addSyncTable('MyTable', ...);
pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](interfaces/PackVersionDefinition.md)\> |

#### Returns

[`PackDefinitionBuilder`](classes/PackDefinitionBuilder.md)

#### Defined in

[builder.ts:33](https://github.com/coda/packs-sdk/blob/main/builder.ts#L33)

___

### simpleAutocomplete

▸ **simpleAutocomplete**(`search`, `options`): `Promise`<[`MetadataFormulaObjectResultType`](interfaces/MetadataFormulaObjectResultType.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `search` | `undefined` \| `string` |
| `options` | (`string` \| [`SimpleAutocompleteOption`](interfaces/SimpleAutocompleteOption.md))[] |

#### Returns

`Promise`<[`MetadataFormulaObjectResultType`](interfaces/MetadataFormulaObjectResultType.md)[]\>

#### Defined in

[api.ts:715](https://github.com/coda/packs-sdk/blob/main/api.ts#L715)

___

### withQueryParams

▸ **withQueryParams**(`url`, `params?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `params?` | `Object` |

#### Returns

`string`

#### Defined in

[helpers/url.ts:5](https://github.com/coda/packs-sdk/blob/main/helpers/url.ts#L5)
