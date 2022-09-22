---
title: "PackDefinitionBuilder"
---
# Class: PackDefinitionBuilder

[core](../modules/core.md).PackDefinitionBuilder

A class that assists in constructing a pack definition. Use [newPack](../functions/core.newPack.md) to create one.

## Implements

- [`BasicPackDefinition`](../types/core.BasicPackDefinition.md)

## Constructors

### constructor

• **new PackDefinitionBuilder**(`definition?`)

Constructs a [PackDefinitionBuilder](core.PackDefinitionBuilder.md). However, `coda.newPack()` should be used instead
rather than constructing a builder directly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition?` | `Partial`<[`PackVersionDefinition`](../interfaces/core.PackVersionDefinition.md)\> |

#### Defined in

[builder.ts:86](https://github.com/coda/packs-sdk/blob/main/builder.ts#L86)

## Properties

### defaultAuthentication

• `Optional` **defaultAuthentication**: [`Authentication`](../types/core.Authentication.md)

See [defaultAuthentication](../interfaces/core.PackVersionDefinition.md#defaultauthentication).

#### Implementation of

BasicPackDefinition.defaultAuthentication

#### Defined in

[builder.ts:67](https://github.com/coda/packs-sdk/blob/main/builder.ts#L67)

___

### formats

• **formats**: [`Format`](../interfaces/core.Format.md)[]

See [formats](../interfaces/core.PackVersionDefinition.md#formats).

#### Implementation of

BasicPackDefinition.formats

#### Defined in

[builder.ts:54](https://github.com/coda/packs-sdk/blob/main/builder.ts#L54)

___

### formulaNamespace

• `Optional` **formulaNamespace**: `string`

**`Deprecated`**

#### Implementation of

BasicPackDefinition.formulaNamespace

#### Defined in

[builder.ts:78](https://github.com/coda/packs-sdk/blob/main/builder.ts#L78)

___

### formulas

• **formulas**: ([`BooleanPackFormula`](../types/core.BooleanPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`NumericPackFormula`](../types/core.NumericPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`StringPackFormula`](../types/core.StringPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md)\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`ArraySchema`](../interfaces/core.ArraySchema.md)<[`Schema`](../types/core.Schema.md)\>\> \| [`ObjectPackFormula`](../types/core.ObjectPackFormula.md)<[`ParamDefs`](../types/core.ParamDefs.md), [`Schema`](../types/core.Schema.md)\>)[]

See [formulas](../interfaces/core.PackVersionDefinition.md#formulas).

#### Implementation of

BasicPackDefinition.formulas

#### Defined in

[builder.ts:50](https://github.com/coda/packs-sdk/blob/main/builder.ts#L50)

___

### networkDomains

• **networkDomains**: `string`[]

See [networkDomains](../interfaces/core.PackVersionDefinition.md#networkdomains).

#### Implementation of

BasicPackDefinition.networkDomains

#### Defined in

[builder.ts:62](https://github.com/coda/packs-sdk/blob/main/builder.ts#L62)

___

### syncTables

• **syncTables**: [`SyncTable`](../types/core.SyncTable.md)[]

See [syncTables](../interfaces/core.PackVersionDefinition.md#synctables).

#### Implementation of

BasicPackDefinition.syncTables

#### Defined in

[builder.ts:58](https://github.com/coda/packs-sdk/blob/main/builder.ts#L58)

___

### systemConnectionAuthentication

• `Optional` **systemConnectionAuthentication**: [`SystemAuthentication`](../types/core.SystemAuthentication.md)

See [systemConnectionAuthentication](../interfaces/core.PackVersionDefinition.md#systemconnectionauthentication).

#### Implementation of

BasicPackDefinition.systemConnectionAuthentication

#### Defined in

[builder.ts:71](https://github.com/coda/packs-sdk/blob/main/builder.ts#L71)

___

### version

• `Optional` **version**: `string`

See [version](../interfaces/core.PackVersionDefinition.md#version).

#### Defined in

[builder.ts:76](https://github.com/coda/packs-sdk/blob/main/builder.ts#L76)

## Methods

### addColumnFormat

▸ **addColumnFormat**(`format`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Adds a column format definition to this pack.

In the web editor, the `/ColumnFormat` shortcut will insert a snippet of a skeleton format.

**`Example`**

```
pack.addColumnFormat({
  name: 'MyColumn',
  formulaName: 'MyFormula',
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `format` | [`Format`](../interfaces/core.Format.md) |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:232](https://github.com/coda/packs-sdk/blob/main/builder.ts#L232)

___

### addDynamicSyncTable

▸ **addDynamicSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`definition`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Adds a dynamic sync table definition to this pack.

In the web editor, the `/DynamicSyncTable` shortcut will insert a snippet of a skeleton sync table.

**`Example`**

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
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchemaDefinition`](../interfaces/core.ObjectSchemaDefinition.md)<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`DynamicSyncTableOptions`](../interfaces/core.DynamicSyncTableOptions.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:205](https://github.com/coda/packs-sdk/blob/main/builder.ts#L205)

___

### addFormula

▸ **addFormula**<`ParamDefsT`, `ResultT`, `SchemaT`\>(`definition`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Adds a formula definition to this pack.

In the web editor, the `/Formula` shortcut will insert a snippet of a skeleton formula.

**`Example`**

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
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `ResultT` | extends [`ValueType`](../enums/core.ValueType.md) |
| `SchemaT` | extends [`Schema`](../types/core.Schema.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | { `resultType`: `ResultT`  } & [`FormulaDefinition`](../types/core.FormulaDefinition.md)<`ParamDefsT`, `ResultT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:131](https://github.com/coda/packs-sdk/blob/main/builder.ts#L131)

___

### addNetworkDomain

▸ **addNetworkDomain**(...`domain`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Adds the domain that this pack makes HTTP requests to.
For example, if your pack makes HTTP requests to "api.example.com",
use "example.com" as your network domain.

If your pack make HTTP requests, it must declare a network domain,
for security purposes. Coda enforces that your pack cannot make requests to
any undeclared domains.

You are allowed one network domain per pack by default. If your pack needs
to connect to multiple domains, contact Coda Support for approval.

**`Example`**

```
pack.addNetworkDomain('example.com');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...domain` | `string`[] |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:340](https://github.com/coda/packs-sdk/blob/main/builder.ts#L340)

___

### addSyncTable

▸ **addSyncTable**<`K`, `L`, `ParamDefsT`, `SchemaT`\>(`__namedParameters`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Adds a sync table definition to this pack.

In the web editor, the `/SyncTable` shortcut will insert a snippet of a skeleton sync table.

**`Example`**

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
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`, `SchemaT`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SyncTableOptions`](../interfaces/core.SyncTableOptions.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\> |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:161](https://github.com/coda/packs-sdk/blob/main/builder.ts#L161)

___

### setSystemAuthentication

▸ **setSystemAuthentication**(`systemAuthentication`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Sets this pack to use authentication provided by you as the maker of this pack.

You will need to register credentials to use with this pack. When users use the
pack, their requests will be authenticated with those system credentials, they need
not register their own account.

In the web editor, the `/SystemAuthentication` shortcut will insert a snippet of a skeleton
authentication definition.

**`Example`**

```
pack.setSystemAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `systemAuthentication` | [`SystemAuthenticationDef`](../types/core.SystemAuthenticationDef.md) |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:301](https://github.com/coda/packs-sdk/blob/main/builder.ts#L301)

___

### setUserAuthentication

▸ **setUserAuthentication**(`authDef`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Sets this pack to use authentication for individual users, using the
authentication method is the given definition.

Each user will need to register an account in order to use this pack.

In the web editor, the `/UserAuthentication` shortcut will insert a snippet of a skeleton
authentication definition.

By default, this will set a default connection (account) requirement, making a user account
required to invoke all formulas in this pack unless you specify differently on a particular
formula. To change the default, you can pass a `defaultConnectionRequirement` option into
this method.

**`Example`**

```
pack.setUserAuthentication({
  type: AuthenticationType.HeaderBearerToken,
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `authDef` | `Object` |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:258](https://github.com/coda/packs-sdk/blob/main/builder.ts#L258)

___

### setVersion

▸ **setVersion**(`version`): [`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

Sets the semantic version of this pack version, e.g. `'1.2.3'`.

This is optional, and you only need to provide a version if you are manually doing
semantic versioning, or using the CLI. If using the web editor, you can omit this
and the web editor will automatically provide an appropriate semantic version
each time you build a version.

**`Example`**

```
pack.setVersion('1.2.3');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `string` |

#### Returns

[`PackDefinitionBuilder`](core.PackDefinitionBuilder.md)

#### Defined in

[builder.ts:358](https://github.com/coda/packs-sdk/blob/main/builder.ts#L358)
