---
title: "ObjectSchemaDefinition"
---
# Interface: ObjectSchemaDefinition<K, L\>

A schema definition for an object value (a value with key-value pairs).

## Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends `string` |
| `L` | extends `string` |

## Hierarchy

- `BaseSchema`

  ↳ **`ObjectSchemaDefinition`**

## Properties

### codaType

• `Optional` **codaType**: [`Person`](../enums/ValueHintType.md#person) \| [`Reference`](../enums/ValueHintType.md#reference)

A hint for how Coda should interpret and render this object value.

For example, an object can represent a person (user) in a Coda doc, with properties for the
email address of the person and their name. Using `ValueHintType.Person` tells Coda to
render such a value as an @-reference to that person, rather than a basic object schip.

#### Defined in

[schema.ts:778](https://github.com/coda/packs-sdk/blob/main/schema.ts#L778)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseSchema.description

#### Defined in

[schema.ts:199](https://github.com/coda/packs-sdk/blob/main/schema.ts#L199)

___

### featured

• `Optional` **featured**: `L`[]

A list of property names from within [properties](ObjectSchemaDefinition.md#properties) for the "featured" properties
of this object, used in sync tables. When a sync table is first added to a document,
columns are created for each of the featured properties. The user can easily add additional
columns for any other properties, as desired.

This distinction exists for cases where a sync table may include dozens of properties,
which would create a very wide table that is difficult to use. Featuring properties
allows a sync table to be created with the most useful columns created by default,
and the user can add additional columns as they find them useful.

Non-featured properties can always be referenced in formulas regardless of whether column
projections have been created for them.

#### Defined in

[schema.ts:793](https://github.com/coda/packs-sdk/blob/main/schema.ts#L793)

___

### id

• `Optional` **id**: `K`

The name of a property within [properties](ObjectSchemaDefinition.md#properties) that represents a unique id for this object.
Sync table schemas must specify an id property, which uniquely identify each synced row.

#### Defined in

[schema.ts:763](https://github.com/coda/packs-sdk/blob/main/schema.ts#L763)

___

### identity

• `Optional` **identity**: [`IdentityDefinition`](IdentityDefinition.md)

An identity for this schema, if this schema is important enough to be named and referenced.
See [IdentityDefinition](IdentityDefinition.md).

#### Defined in

[schema.ts:798](https://github.com/coda/packs-sdk/blob/main/schema.ts#L798)

___

### primary

• `Optional` **primary**: `K`

The name of a property within [properties](ObjectSchemaDefinition.md#properties) that be used to label this object in the UI.
Object values can contain many properties and the Coda UI will display them as a "chip"
with only the value of the "primary" property used as the chip's label. The other properties
can be seen when hovering over the chip.

#### Defined in

[schema.ts:770](https://github.com/coda/packs-sdk/blob/main/schema.ts#L770)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/ObjectSchemaProperties.md)<`K` \| `L`\>

Definintion of the key-value pairs in this object.

#### Defined in

[schema.ts:758](https://github.com/coda/packs-sdk/blob/main/schema.ts#L758)

___

### type

• **type**: [`Object`](../enums/ValueType.md#object)

Identifies this schema as an object schema.

#### Defined in

[schema.ts:756](https://github.com/coda/packs-sdk/blob/main/schema.ts#L756)
