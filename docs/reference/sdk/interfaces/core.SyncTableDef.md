---
nav: "SyncTableDef"
---
# Interface: SyncTableDef<K, L, ParamDefsT, SchemaT\>

[core](../modules/core.md).SyncTableDef

The result of defining a sync table. Should not be necessary to use directly,
instead, define sync tables using [makeSyncTable](../functions/core.makeSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/core.ParamDefs.md) |
| `SchemaT` | extends `ObjectSchema`<`K`, `L`\> |

## Hierarchy

- **`SyncTableDef`**

  ↳ [`DynamicSyncTableDef`](core.DynamicSyncTableDef.md)

## Properties

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

See [defaultAddDynamicColumns](core.DynamicOptions.md#defaultadddynamiccolumns)

#### Defined in

[api.ts:221](https://github.com/coda/packs-sdk/blob/main/api.ts#L221)

___

### description

• `Optional` **description**: [`DescriptionTokensOrString`](../types/core.DescriptionTokensOrString.md)

See [description](core.SyncTableOptions.md#description)

#### Defined in

[api.ts:204](https://github.com/coda/packs-sdk/blob/main/api.ts#L204)

___

### entityName

• `Optional` **entityName**: `string`

See [entityName](core.DynamicOptions.md#entityname)

#### Defined in

[api.ts:219](https://github.com/coda/packs-sdk/blob/main/api.ts#L219)

___

### getSchema

• `Optional` **getSchema**: [`MetadataFormula`](../types/core.MetadataFormula.md)

See [getSchema](core.DynamicOptions.md#getschema)

#### Defined in

[api.ts:217](https://github.com/coda/packs-sdk/blob/main/api.ts#L217)

___

### getter

• **getter**: [`SyncFormula`](../types/core.SyncFormula.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

See [formula](core.SyncTableOptions.md#formula)

#### Defined in

[api.ts:215](https://github.com/coda/packs-sdk/blob/main/api.ts#L215)

___

### identityName

• **identityName**: `string`

The `identityName` is persisted for all sync tables so that a dynamic schema
can be annotated with an identity automatically.

See [identityName](core.SyncTableOptions.md#identityname) for more details.

#### Defined in

[api.ts:213](https://github.com/coda/packs-sdk/blob/main/api.ts#L213)

___

### name

• **name**: `string`

See [name](core.SyncTableOptions.md#name)

#### Defined in

[api.ts:202](https://github.com/coda/packs-sdk/blob/main/api.ts#L202)

___

### schema

• **schema**: `SchemaT`

See [schema](core.SyncTableOptions.md#schema)

#### Defined in

[api.ts:206](https://github.com/coda/packs-sdk/blob/main/api.ts#L206)
