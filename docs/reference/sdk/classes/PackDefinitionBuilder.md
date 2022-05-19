---
title: "PackDefinitionBuilder"
---
# Class: PackDefinitionBuilder

A class that assists in constructing a pack definition. Use [newPack](../functions/newPack.md) to create one.

## Implements

- [`BasicPackDefinition`](../types/BasicPackDefinition.md)

## Constructors

### constructor

• **new PackDefinitionBuilder**(`definition?`)

Constructs a [PackDefinitionBuilder](PackDefinitionBuilder.md). However, `coda.newPack()` should be used instead
rather than constructing a builder directly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](../interfaces/PackVersionDefinition.md)\> |

#### Defined in

[builder.ts:86](https://github.com/coda/packs-sdk/blob/main/builder.ts#L86)

## Properties

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

See [PackVersionDefinition.defaultAuthentication](../interfaces/PackVersionDefinition.md#defaultauthentication).

#### Implementation of

BasicPackDefinition.defaultAuthentication

#### Defined in

[builder.ts:67](https://github.com/coda/packs-sdk/blob/main/builder.ts#L67)

___

### formats

• **formats**: [`Format`](../interfaces/Format.md)[]

See [PackVersionDefinition.formats](../interfaces/PackVersionDefinition.md#formats).

#### Implementation of

BasicPackDefinition.formats

#### Defined in

[builder.ts:54](https://github.com/coda/packs-sdk/blob/main/builder.ts#L54)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`deprecated`**

#### Implementation of

BasicPackDefinition.formulaNamespace

#### Defined in

[builder.ts:78](https://github.com/coda/packs-sdk/blob/main/builder.ts#L78)

___

### formulas

• **formulas**: ([`BooleanPackFormula`](../types/BooleanPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`NumericPackFormula`](../types/NumericPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`StringPackFormula`](../types/StringPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md)\> \| [`ObjectPackFormula`](../types/ObjectPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md), [`ArraySchema`](../interfaces/ArraySchema.md)<[`Schema`](../types/Schema.md)\>\> \| [`ObjectPackFormula`](../types/ObjectPackFormula.md)<[`ParamDefs`](../types/ParamDefs.md), [`Schema`](../types/Schema.md)\>)[]

See [PackVersionDefinition.formulas](../interfaces/PackVersionDefinition.md#formulas).

#### Implementation of

BasicPackDefinition.formulas

#### Defined in

[builder.ts:50](https://github.com/coda/packs-sdk/blob/main/builder.ts#L50)

___

### networkDomains

• **networkDomains**: `string`[]

See [PackVersionDefinition.networkDomains](../interfaces/PackVersionDefinition.md#networkdomains).

#### Implementation of

BasicPackDefinition.networkDomains

#### Defined in

[builder.ts:62](https://github.com/coda/packs-sdk/blob/main/builder.ts#L62)

___

### syncTables

• **syncTables**: [`SyncTable`](../types/SyncTable.md)[]

See [PackVersionDefinition.syncTables](../interfaces/PackVersionDefinition.md#synctables).

#### Implementation of

BasicPackDefinition.syncTables

#### Defined in

[builder.ts:58](https://github.com/coda/packs-sdk/blob/main/builder.ts#L58)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

See [PackVersionDefinition.systemConnectionAuthentication](../interfaces/PackVersionDefinition.md#systemconnectionauthentication).

#### Implementation of

BasicPackDefinition.systemConnectionAuthentication

#### Defined in

[builder.ts:71](https://github.com/coda/packs-sdk/blob/main/builder.ts#L71)

___

### version

• `Optional` **version**: `string`

See [PackVersionDefinition.version](../interfaces/PackVersionDefinition.md#version).

#### Defined in

[builder.ts:76](https://github.com/coda/packs-sdk/blob/main/builder.ts#L76)

## Methods

### addColumnFormat

▸ **addColumnFormat**(`format`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a column format definition to this pack.

In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.

**`example`**
```
pack.addColumnFormat({
  name: 'MyColumn',
  formulaName: 'MyFormula',
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `format` | [`Format`](../interfaces/Format.md) |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:233](https://github.com/coda/packs-sdk/blob/main/builder.ts#L233)

___

### addDynamicSyncTable

▸ **addDynamicSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`definition`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a dynamic sync table definition to this pack.

In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.

**`example`**
```
pack.addDynamicSyncTable({
  name: "MySyncTable",
  getName: async funciton (context) => {
    const response = await context.fetcher.fetch({method: "GET", url: context.sync.dynamicUrl});
    return response.body.name;
  },
  getName: async function (context) => {
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
| `definition` | [`DynamicSyncTableOptions`](../interfaces/DynamicSyncTableOptions.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:206](https://github.com/coda/packs-sdk/blob/main/builder.ts#L206)

___

### addFormula

▸ **addFormula**<`ParamDefsT`, `ResultT`, `SchemaT`\>(`definition`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a formula definition to this pack.

In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.

**`example`**
```
pack.addFormula({
  resultType: ValueType.String,
   name: 'MyFormula',
   description: 'My description.',
   parameters: [
     makeParameter({
       type: ParameterType.String,
       name: 'myParam',
       description: 'My param description.',
     }),
   ],
   execute: async ([param]) => {
     return `Hello ${param}`;
   },
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/ValueType.md) |
| `SchemaT` | extends [`Schema`](../types/Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | { `resultType`: `ResultT`  } & [`FormulaDefinition`](../types/FormulaDefinition.md)<`ParamDefsT`, `ResultT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:131](https://github.com/coda/packs-sdk/blob/main/builder.ts#L131)

___

### addNetworkDomain

▸ **addNetworkDomain**(...`domain`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds the domain that this pack makes HTTP requests to.
For example, if your pack makes HTTP requests to "api.example.com",
use "example.com" as your network domain.

If your pack make HTTP requests, it must declare a network domain,
for security purposes. Coda enforces that your pack cannot make requests to
any undeclared domains.

You are allowed one network domain per pack by default. If your pack needs
to connect to multiple domains, contact Coda Support for approval.

**`example`**
```
pack.addNetworkDomain('example.com');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...domain` | `string`[] |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:341](https://github.com/coda/packs-sdk/blob/main/builder.ts#L341)

___

### addSyncTable

▸ **addSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`__namedParameters`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a sync table definition to this pack.

In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.

**`example`**
```
pack.addSyncTable({
  name: 'MySyncTable',
  identityName: 'EntityName',
  schema: coda.makeObjectSchema({
    ...
  }),
  formula: {
    ...
  },
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SyncTableOptions`](../interfaces/SyncTableOptions.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:161](https://github.com/coda/packs-sdk/blob/main/builder.ts#L161)

___

### setSystemAuthentication

▸ **setSystemAuthentication**(`systemAuthentication`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Sets this pack to use authentication provided by you as the maker of this pack.

You will need to register credentials to use with this pack. When users use the
pack, their requests will be authenticated with those system credentials, they need
not register their own account.

In the web editor, the `/SystemAuthentication` shortcut will insert a snippet of a skeleton
authentication definition.

**`example`**
```
pack.setSystemAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemAuthentication` | [`SystemAuthenticationDef`](../types/SystemAuthenticationDef.md) |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:302](https://github.com/coda/packs-sdk/blob/main/builder.ts#L302)

___

### setUserAuthentication

▸ **setUserAuthentication**(`authDef`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Sets this pack to use authentication for individual users, using the
authentication method is the given definition.

Each user will need to register an account in order to use this pack.

In the web editor, the `/UserAuthentication` shortcut will insert a snippet of a skeleton
authentication definition.

By default, this will set a default connection (account) requirement, making a user account
required to invoke all formulas in this pack unless you specify differently on a particular
formula. To change the default, you can pass a `defaultConnectionRequirement` option into
this method.

**`example`**
```
pack.setUserAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `authDef` | [`NoAuthentication`](../interfaces/NoAuthentication.md) & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & [`VariousAuthentication`](../interfaces/VariousAuthentication.md) & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`HeaderBearerTokenAuthentication`](../interfaces/HeaderBearerTokenAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`CodaApiBearerTokenAuthentication`](../interfaces/CodaApiBearerTokenAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`CustomHeaderTokenAuthentication`](../interfaces/CustomHeaderTokenAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`QueryParamTokenAuthentication`](../interfaces/QueryParamTokenAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`MultiQueryParamTokenAuthentication`](../interfaces/MultiQueryParamTokenAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`OAuth2Authentication`](../interfaces/OAuth2Authentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`AWSAccessKeyAuthentication`](../interfaces/AWSAccessKeyAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`AWSAssumeRoleAuthentication`](../interfaces/AWSAssumeRoleAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`CustomAuthentication`](../interfaces/CustomAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"`` \| ``"postSetup"``\> & { `getConnectionName?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `getConnectionUserId?`: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) ; `postSetup?`: [`SetEndpointDef`](../types/SetEndpointDef.md)[]  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:259](https://github.com/coda/packs-sdk/blob/main/builder.ts#L259)

___

### setVersion

▸ **setVersion**(`version`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Sets the semantic version of this pack version, e.g. `'1.2.3'`.

This is optional, and you only need to provide a version if you are manually doing
semantic versioning, or using the CLI. If using the web editor, you can omit this
and the web editor will automatically provide an appropriate semantic version
each time you build a version.

**`example`**
```
pack.setVersion('1.2.3');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:359](https://github.com/coda/packs-sdk/blob/main/builder.ts#L359)
