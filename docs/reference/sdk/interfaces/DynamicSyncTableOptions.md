---
title: "DynamicSyncTableOptions"
---
# Interface: DynamicSyncTableOptions<K, L, ParamDefsT, SchemaT\>

Options provided when defining a dynamic sync table.

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

[api.ts:1372](https://github.com/coda/packs-sdk/blob/main/api.ts#L1372)

___

### defaultAddDynamicColumns

• `Optional` **defaultAddDynamicColumns**: `boolean`

Default is true.

If false, when subsequent syncs discover new schema properties, these properties will not automatically be
added as new columns on the table. The user can still manually add columns for these new properties.
This only applies to tables that use dynamic schemas.

When tables with dynamic schemas are synced, the [getSchema](DynamicSyncTableOptions.md#getschema) formula is run each time,
which may return a schema that is different than that from the last sync. The default behavior
is that any schema properties that are new in this sync are automatically added as new columns,
so they are apparent to the user. However, in rare cases when schemas change frequently,
this can cause the number of columns to grow quickly and become overwhelming. Setting this
value to false leaves the columns unchanged and puts the choice of what columns to display
into the hands of the user.

#### Defined in

[api.ts:1388](https://github.com/coda/packs-sdk/blob/main/api.ts#L1388)

___

### description

• `Optional` **description**: `string`

The description of the dynamic sync table. This is shown to users in the Coda UI
when listing what build blocks are contained within this pack.
This should describe what the dynamic sync table does in a more detailed language.

#### Defined in

[api.ts:1334](https://github.com/coda/packs-sdk/blob/main/api.ts#L1334)

___

### entityName

• `Optional` **entityName**: `string`

A label for the kind of entities that you are syncing. This label is used in a doc to identify
the column in this table that contains the synced data. If you don't provide an `entityName`, the value
of `identity.name` from your schema will be used instead, so in most cases you don't need to provide this.

#### Defined in

[api.ts:1367](https://github.com/coda/packs-sdk/blob/main/api.ts#L1367)

___

### formula

• **formula**: [`SyncFormulaDef`](SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

The definition of the formula that implements this sync. This is a Coda packs formula
that returns an array of objects fitting the given schema and optionally a [Continuation](Continuation.md).
(The [SyncFormulaDef.name](SyncFormulaDef.md#name) is redundant and should be the same as the `name` parameter here.
These will eventually be consolidated.)

#### Defined in

[api.ts:1361](https://github.com/coda/packs-sdk/blob/main/api.ts#L1361)

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that that returns a browser-friendly url representing the
resource being synced. The Coda UI links to this url as the source
of the table data. This is typically a browser-friendly form of the
`dynamicUrl`, which is typically an API url.

#### Defined in

[api.ts:1349](https://github.com/coda/packs-sdk/blob/main/api.ts#L1349)

___

### getName

• **getName**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns the name of this table.

#### Defined in

[api.ts:1338](https://github.com/coda/packs-sdk/blob/main/api.ts#L1338)

___

### getSchema

• **getSchema**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns the schema for this table.

#### Defined in

[api.ts:1342](https://github.com/coda/packs-sdk/blob/main/api.ts#L1342)

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns a list of available dynamic urls that can be
used to create an instance of this dynamic sync table.

#### Defined in

[api.ts:1354](https://github.com/coda/packs-sdk/blob/main/api.ts#L1354)

___

### name

• **name**: `string`

The name of the dynamic sync table. This is shown to users in the Coda UI
when listing what build blocks are contained within this pack.
This should describe the category of entities being synced. The actual
table name once added to the doc will be dynamic, it will be whatever value
is returned by the `getName` formula.

#### Defined in

[api.ts:1328](https://github.com/coda/packs-sdk/blob/main/api.ts#L1328)

___

### placeholderSchema

• `Optional` **placeholderSchema**: `SchemaT`

Optional placeholder schema before the dynamic schema is retrieved.

If `defaultAddDynamicColumns` is false, only featured columns
in placeholderSchema will be rendered by default after the sync.

#### Defined in

[api.ts:1395](https://github.com/coda/packs-sdk/blob/main/api.ts#L1395)
