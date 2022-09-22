---
nav: "Identity"
---
# Interface: Identity

[core](../modules/core.md).Identity

The runtime version of [IdentityDefinition](core.IdentityDefinition.md) with the current Pack ID injected if a different
one isn't set by the maker.

## Hierarchy

- [`IdentityDefinition`](core.IdentityDefinition.md)

  ↳ **`Identity`**

## Properties

### attribution

• `Optional` **attribution**: [`AttributionNode`](../types/core.AttributionNode.md)[]

**`Deprecated`**

See [attribution](core.ObjectSchemaDefinition.md#attribution)

#### Inherited from

[IdentityDefinition](core.IdentityDefinition.md).[attribution](core.IdentityDefinition.md#attribution)

#### Defined in

[schema.ts:831](https://github.com/coda/packs-sdk/blob/main/schema.ts#L831)

___

### dynamicUrl

• `Optional` **dynamicUrl**: `string`

The dynamic URL, if this is a schema for a dynamic sync table. When returning a schema from the
[getSchema](core.DynamicSyncTableOptions.md#getschema) formula of a dynamic sync table, you must include
the dynamic URL of that table, so that rows
in this table may be distinguished from rows in another dynamic instance of the same table.

When creating a reference to a dynamic sync table, you must include the dynamic URL of the table
you wish to reference, again to distinguish which table instance you are trying to reference.

#### Inherited from

[IdentityDefinition](core.IdentityDefinition.md).[dynamicUrl](core.IdentityDefinition.md#dynamicurl)

#### Defined in

[schema.ts:827](https://github.com/coda/packs-sdk/blob/main/schema.ts#L827)

___

### name

• **name**: `string`

The name of this entity. This is an arbitrary name but should be unique within your pack.
For example, if you are defining a schema that represents a user object, "User" would be a good identity name.

#### Inherited from

[IdentityDefinition](core.IdentityDefinition.md).[name](core.IdentityDefinition.md#name)

#### Defined in

[schema.ts:815](https://github.com/coda/packs-sdk/blob/main/schema.ts#L815)

___

### packId

• **packId**: `number`

The ID of another pack, if you are trying to reference a value from different pack.

#### Overrides

[IdentityDefinition](core.IdentityDefinition.md).[packId](core.IdentityDefinition.md#packid)

#### Defined in

[schema.ts:839](https://github.com/coda/packs-sdk/blob/main/schema.ts#L839)
