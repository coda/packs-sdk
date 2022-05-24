---
title: "SyncTableOptions"
---
# Interface: SyncTableOptions<K, L, ParamDefsT, SchemaT\>

Input options for defining a sync table. See [makeSyncTable](../functions/makeSyncTable.md).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |
| `ParamDefsT` | extends [`ParamDefs`](../types/ParamDefs.md) |
| `SchemaT` | extends [`ObjectSchemaDefinition`](ObjectSchemaDefinition.md)<`K`, `L`\> |

## Properties

### connectionRequirement

• `Optional` **connectionRequirement**: [`ConnectionRequirement`](../enums/ConnectionRequirement.md)

A [ConnectionRequirement](../enums/ConnectionRequirement.md) that will be used for all formulas contained within
this sync table (including autocomplete formulas).

#### Defined in

[api.ts:1344](https://github.com/coda/packs-sdk/blob/main/api.ts#L1344)

___

### description

• `Optional` **description**: `string`

The description of the sync table. This is shown to users in the Coda UI.
This should describe what the sync table does in more detailed language. For example, the
description for a 'Products' sync table could be: 'Returns products from the e-commerce platform.'

#### Defined in

[api.ts:1313](https://github.com/coda/packs-sdk/blob/main/api.ts#L1313)

___

### dynamicOptions

• `Optional` **dynamicOptions**: [`DynamicOptions`](DynamicOptions.md)

A set of options used internally by [makeDynamicSyncTable](../functions/makeDynamicSyncTable.md), or for static
sync tables that have a dynamic schema.

#### Defined in

[api.ts:1349](https://github.com/coda/packs-sdk/blob/main/api.ts#L1349)

___

### formula

• **formula**: [`SyncFormulaDef`](SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

The definition of the formula that implements this sync. This is a Coda packs formula
that returns an array of objects fitting the given schema and optionally a [Continuation](Continuation.md).
(The [SyncFormulaDef.name](SyncFormulaDef.md#name) is redundant and should be the same as the `name` parameter here.
These will eventually be consolidated.)

#### Defined in

[api.ts:1339](https://github.com/coda/packs-sdk/blob/main/api.ts#L1339)

___

### identityName

• **identityName**: `string`

The "unique identifier" for the entity being synced. This will serve as the unique id for this
table, and must be unique across other sync tables for your pack. This is often the singular
form of the table name, e.g. if your table name was 'Products' you might choose 'Product'
as the identity name.

When returning objects from other syncs or formulas, you may create Coda references to objects
in this table by defining an [Identity](Identity.md) in that schema that refers to this identity name.

For example, if your identity name was 'Product', another formula or sync could return
shell objects that reference rows in this table, so long as they contain the id
of the object, and the schema is declared as `{identity: {name: 'Products'}}`.

#### Defined in

[api.ts:1327](https://github.com/coda/packs-sdk/blob/main/api.ts#L1327)

___

### name

• **name**: `string`

The name of the sync table. This is shown to users in the Coda UI.
This should describe the entities being synced. For example, a sync table that syncs products
from an e-commerce platform should be called 'Products'. This name must not contain spaces.

#### Defined in

[api.ts:1307](https://github.com/coda/packs-sdk/blob/main/api.ts#L1307)

___

### schema

• **schema**: `SchemaT`

The definition of the schema that describes a single response object. For example, the
schema for a single product. The sync formula will return an array of objects that fit this schema.

#### Defined in

[api.ts:1332](https://github.com/coda/packs-sdk/blob/main/api.ts#L1332)
