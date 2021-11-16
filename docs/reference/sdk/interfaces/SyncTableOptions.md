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

[api.ts:1205](https://github.com/coda/packs-sdk/blob/main/api.ts#L1205)

___

### dynamicOptions

• `Optional` **dynamicOptions**: `Object`

A set of options used internally by [makeDynamicSyncTable](../functions/makeDynamicSyncTable.md)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `entityName?` | `string` | See [DynamicSyncTableOptions.entityName](DynamicSyncTableOptions.md#entityname) |
| `getSchema?` | [`MetadataFormulaDef`](../types/MetadataFormulaDef.md) | A formula that returns the schema for this table.  For a dynamic sync table, the value of [DynamicSyncTableOptions.getSchema](DynamicSyncTableOptions.md#getschema) is passed through here. For a non-dynamic sync table, you may still implement this if you table has a schema that varies based on the user account, but does not require a [dynamicUrl](Identity.md#dynamicurl). |

#### Defined in

[api.ts:1209](https://github.com/coda/packs-sdk/blob/main/api.ts#L1209)

___

### formula

• **formula**: [`SyncFormulaDef`](SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

The definition of the formula that implements this sync. This is a Coda packs formula
that returns an array of objects fitting the given schema and optionally a [Continuation](Continuation.md).
(The [SyncFormulaDef.name](SyncFormulaDef.md#name) is redundant and should be the same as the `name` parameter here.
These will eventually be consolidated.)

#### Defined in

[api.ts:1200](https://github.com/coda/packs-sdk/blob/main/api.ts#L1200)

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

[api.ts:1188](https://github.com/coda/packs-sdk/blob/main/api.ts#L1188)

___

### name

• **name**: `string`

The name of the sync table. This is shown to users in the Coda UI.
This should describe the entities being synced. For example, a sync table that syncs products
from an e-commerce platform should be called 'Products'. This name must not contain spaces.

#### Defined in

[api.ts:1174](https://github.com/coda/packs-sdk/blob/main/api.ts#L1174)

___

### schema

• **schema**: `SchemaT`

The definition of the schema that describes a single response object. For example, the
schema for a single product. The sync formula will return an array of objects that fit this schema.

#### Defined in

[api.ts:1193](https://github.com/coda/packs-sdk/blob/main/api.ts#L1193)
