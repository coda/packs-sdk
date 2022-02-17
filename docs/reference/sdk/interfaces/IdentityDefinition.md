---
title: "IdentityDefinition"
---
# Interface: IdentityDefinition

An identifier for a schema, allowing other schemas to reference it.

You may optionally specify an [ObjectSchemaDefinition.identity](ObjectSchemaDefinition.md#identity) when defining an object schema.
This signals that this schema represents an important named entity in the context of your pack.
Schemas with identities may be referenced by other schemas, in which case Coda
will render such values as @-references in the doc, allowing you to create relationships
between entities.

Every sync table's top-level schema is required to have an identity. However, an identity
will be created on your behalf using the [SyncTableOptions.identityName](SyncTableOptions.md#identityname) that you provide in the sync
table definition, so you needn't explicitly create on unless desired.

## Hierarchy

- **`IdentityDefinition`**

  ↳ [`Identity`](Identity.md)

## Properties

### attribution

• `Optional` **attribution**: [`AttributionNode`](../types/AttributionNode.md)[]

Attribution text, images, and/or links that should be rendered along with this value.

See [makeAttributionNode](../functions/makeAttributionNode.md).

#### Defined in

[schema.ts:655](https://github.com/coda/packs-sdk/blob/main/schema.ts#L655)

___

### dynamicUrl

• `Optional` **dynamicUrl**: `string`

The dynamic URL, if this is a schema for a dynamic sync table. When returning a schema from the
[DynamicSyncTableOptions.getSchema](DynamicSyncTableOptions.md#getschema) formula of a dynamic sync table, you must include
the dynamic URL of that table, so that rows
in this table may be distinguished from rows in another dynamic instance of the same table.

When creating a reference to a dynamic sync table, you must include the dynamic URL of the table
you wish to reference, again to distinguish which table instance you are trying to reference.

#### Defined in

[schema.ts:649](https://github.com/coda/packs-sdk/blob/main/schema.ts#L649)

___

### name

• **name**: `string`

The name of this entity. This is an arbitrary name but should be unique within your pack.
For example, if you are defining a schema that represents a user object, "User" would be a good identity name.

#### Defined in

[schema.ts:637](https://github.com/coda/packs-sdk/blob/main/schema.ts#L637)

___

### packId

• `Optional` **packId**: `number`

The ID of another pack, if you are trying to reference a value from different pack.

#### Defined in

[schema.ts:657](https://github.com/coda/packs-sdk/blob/main/schema.ts#L657)
