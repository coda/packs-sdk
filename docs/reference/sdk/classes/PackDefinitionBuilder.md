# Class: PackDefinitionBuilder

## Implements

- [`BasicPackDefinition`](../types/BasicPackDefinition.md)

## Constructors

### constructor

• **new PackDefinitionBuilder**(`definition?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](../interfaces/PackVersionDefinition.md)\> |

#### Defined in

[builder.ts:51](https://github.com/coda/packs-sdk/blob/main/builder.ts#L51)

## Properties

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/Authentication.md)

#### Implementation of

BasicPackDefinition.defaultAuthentication

#### Defined in

[builder.ts:43](https://github.com/coda/packs-sdk/blob/main/builder.ts#L43)

___

### formats

• **formats**: [`Format`](../interfaces/Format.md)[]

#### Implementation of

BasicPackDefinition.formats

#### Defined in

[builder.ts:39](https://github.com/coda/packs-sdk/blob/main/builder.ts#L39)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

#### Implementation of

BasicPackDefinition.formulaNamespace

#### Defined in

[builder.ts:47](https://github.com/coda/packs-sdk/blob/main/builder.ts#L47)

___

### formulas

• **formulas**: [`Formula`](../types/Formula.md)<[`ParamDefs`](../types/ParamDefs.md)\>[]

#### Implementation of

BasicPackDefinition.formulas

#### Defined in

[builder.ts:38](https://github.com/coda/packs-sdk/blob/main/builder.ts#L38)

___

### networkDomains

• **networkDomains**: `string`[]

#### Implementation of

BasicPackDefinition.networkDomains

#### Defined in

[builder.ts:41](https://github.com/coda/packs-sdk/blob/main/builder.ts#L41)

___

### syncTables

• **syncTables**: `SyncTable`[]

#### Implementation of

BasicPackDefinition.syncTables

#### Defined in

[builder.ts:40](https://github.com/coda/packs-sdk/blob/main/builder.ts#L40)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/SystemAuthentication.md)

#### Implementation of

BasicPackDefinition.systemConnectionAuthentication

#### Defined in

[builder.ts:44](https://github.com/coda/packs-sdk/blob/main/builder.ts#L44)

___

### version

• `Optional` **version**: `string`

#### Defined in

[builder.ts:46](https://github.com/coda/packs-sdk/blob/main/builder.ts#L46)

## Methods

### addColumnFormat

▸ **addColumnFormat**(`format`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a column format definition to this pack.

In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.

**`example`**
pack.addColumnFormat({
  name: 'MyColumn',
  formulaName: 'MyFormula',
});

#### Parameters

| Name | Type |
| :------ | :------ |
| `format` | [`Format`](../interfaces/Format.md) |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:180](https://github.com/coda/packs-sdk/blob/main/builder.ts#L180)

___

### addDynamicSyncTable

▸ **addDynamicSyncTable**<`ParamDefsT`\>(`definition`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a dynamic sync table definition to this pack.

In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.

**`example`**
pack.addDynamicSyncTable({
  name: 'MySyncTable',
  getName: async (context) => {
    const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
    return response.body.name;
  },
  getName: async (context) => {
    const response = await context.fetcher.fetch({method: 'GET', url: context.sync.dynamicUrl});
    return response.body.browserLink;
  },
  ...
});

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `DynamicSyncTableOptions`<`ParamDefsT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:160](https://github.com/coda/packs-sdk/blob/main/builder.ts#L160)

___

### addFormula

▸ **addFormula**<`ParamDefsT`\>(`definition`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a formula definition to this pack.

In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `FormulaDefinitionV2`<`ParamDefsT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:94](https://github.com/coda/packs-sdk/blob/main/builder.ts#L94)

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
pack.addNetworkDomain('example.com');

#### Parameters

| Name | Type |
| :------ | :------ |
| `...domain` | `string`[] |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:269](https://github.com/coda/packs-sdk/blob/main/builder.ts#L269)

___

### addSyncTable

▸ **addSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`__namedParameters`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Adds a sync table definition to this pack.

In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchema`](../interfaces/ObjectSchema.md)<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `SyncTableOptions`<`K`, `L`, `ParamDefsT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:120](https://github.com/coda/packs-sdk/blob/main/builder.ts#L120)

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
pack.setSystemAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemAuthentication` | `SystemAuthenticationDef` |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:241](https://github.com/coda/packs-sdk/blob/main/builder.ts#L241)

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
pack.setUserAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});

#### Parameters

| Name | Type |
| :------ | :------ |
| `authDef` | `NoAuthentication` & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `VariousAuthentication` & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`HeaderBearerTokenAuthentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`CodaApiBearerTokenAuthentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`CustomHeaderTokenAuthentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`QueryParamTokenAuthentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`MultiQueryParamTokenAuthentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`OAuth2Authentication`](../interfaces/OAuth2Authentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<[`WebBasicAuthentication`](../interfaces/WebBasicAuthentication.md), ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } & `Omit`<`AWSSignature4Authentication`, ``"getConnectionName"`` \| ``"getConnectionUserId"``\> & { `getConnectionName?`: `MetadataFormulaDef`  } & { `defaultConnectionRequirement?`: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)  } |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:204](https://github.com/coda/packs-sdk/blob/main/builder.ts#L204)

___

### setVersion

▸ **setVersion**(`version`): [`PackDefinitionBuilder`](PackDefinitionBuilder.md)

Sets the semantic version of this pack version, e.g. `'1.2.3'`.

This is optional, and you only need to provide a version if you are manually doing
semantic versioning, or using the CLI. If using the web editor, you can omit this
and the web editor will automatically provide an appropriate semantic version
each time you build a version.

**`example`**
pack.setVersion('1.2.3');

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |

#### Returns

[`PackDefinitionBuilder`](PackDefinitionBuilder.md)

#### Defined in

[builder.ts:285](https://github.com/coda/packs-sdk/blob/main/builder.ts#L285)
