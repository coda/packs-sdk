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

<<<<<<< HEAD
[api.ts:1323](https://github.com/coda/packs-sdk/blob/main/api.ts#L1323)
=======
<<<<<<< HEAD
[api.ts:1323](https://github.com/coda/packs-sdk/blob/main/api.ts#L1323)
=======
[api.ts:1331](https://github.com/coda/packs-sdk/blob/main/api.ts#L1331)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### entityName

• `Optional` **entityName**: `string`

A label for the kind of entities that you are syncing. This label is used in a doc to identify
the column in this table that contains the synced data. If you don't provide an `entityName`, the value
of `identity.name` from your schema will be used instead, so in most cases you don't need to provide this.

#### Defined in

<<<<<<< HEAD
[api.ts:1318](https://github.com/coda/packs-sdk/blob/main/api.ts#L1318)
=======
<<<<<<< HEAD
[api.ts:1318](https://github.com/coda/packs-sdk/blob/main/api.ts#L1318)
=======
[api.ts:1326](https://github.com/coda/packs-sdk/blob/main/api.ts#L1326)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### formula

• **formula**: [`SyncFormulaDef`](SyncFormulaDef.md)<`K`, `L`, `ParamDefsT`, `SchemaT`\>

The definition of the formula that implements this sync. This is a Coda packs formula
that returns an array of objects fitting the given schema and optionally a [Continuation](Continuation.md).
(The [SyncFormulaDef.name](SyncFormulaDef.md#name) is redundant and should be the same as the `name` parameter here.
These will eventually be consolidated.)

#### Defined in

<<<<<<< HEAD
[api.ts:1312](https://github.com/coda/packs-sdk/blob/main/api.ts#L1312)
=======
<<<<<<< HEAD
[api.ts:1312](https://github.com/coda/packs-sdk/blob/main/api.ts#L1312)
=======
[api.ts:1320](https://github.com/coda/packs-sdk/blob/main/api.ts#L1320)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### getDisplayUrl

• **getDisplayUrl**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that that returns a browser-friendly url representing the
resource being synced. The Coda UI links to this url as the source
of the table data. This is typically a browser-friendly form of the
`dynamicUrl`, which is typically an API url.

#### Defined in

<<<<<<< HEAD
[api.ts:1300](https://github.com/coda/packs-sdk/blob/main/api.ts#L1300)
=======
<<<<<<< HEAD
[api.ts:1300](https://github.com/coda/packs-sdk/blob/main/api.ts#L1300)
=======
[api.ts:1308](https://github.com/coda/packs-sdk/blob/main/api.ts#L1308)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### getName

• **getName**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns the name of this table.

#### Defined in

<<<<<<< HEAD
[api.ts:1289](https://github.com/coda/packs-sdk/blob/main/api.ts#L1289)
=======
<<<<<<< HEAD
[api.ts:1289](https://github.com/coda/packs-sdk/blob/main/api.ts#L1289)
=======
[api.ts:1297](https://github.com/coda/packs-sdk/blob/main/api.ts#L1297)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### getSchema

• **getSchema**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns the schema for this table.

#### Defined in

<<<<<<< HEAD
[api.ts:1293](https://github.com/coda/packs-sdk/blob/main/api.ts#L1293)
=======
<<<<<<< HEAD
[api.ts:1293](https://github.com/coda/packs-sdk/blob/main/api.ts#L1293)
=======
[api.ts:1301](https://github.com/coda/packs-sdk/blob/main/api.ts#L1301)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### listDynamicUrls

• `Optional` **listDynamicUrls**: [`MetadataFormulaDef`](../types/MetadataFormulaDef.md)

A formula that returns a list of available dynamic urls that can be
used to create an instance of this dynamic sync table.

#### Defined in

<<<<<<< HEAD
[api.ts:1305](https://github.com/coda/packs-sdk/blob/main/api.ts#L1305)
=======
<<<<<<< HEAD
[api.ts:1305](https://github.com/coda/packs-sdk/blob/main/api.ts#L1305)
=======
[api.ts:1313](https://github.com/coda/packs-sdk/blob/main/api.ts#L1313)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))

___

### name

• **name**: `string`

The name of the dynamic sync table. This is shown to users in the Coda UI
when listing what build blocks are contained within this pack.
This should describe the category of entities being synced. The actual
table name once added to the doc will be dynamic, it will be whatever value
is returned by the `getName` formula.

#### Defined in

<<<<<<< HEAD
[api.ts:1285](https://github.com/coda/packs-sdk/blob/main/api.ts#L1285)
=======
<<<<<<< HEAD
[api.ts:1285](https://github.com/coda/packs-sdk/blob/main/api.ts#L1285)
=======
[api.ts:1293](https://github.com/coda/packs-sdk/blob/main/api.ts#L1293)
>>>>>>> cb191bf0 (tmp)
>>>>>>> 33154897 (restrict param autocomplete to only string & number, and respect param type in autocomplete shape (#1572))
