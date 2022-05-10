---
title: "ObjectSchemaDefinition"
---
# Interface: ObjectSchemaDefinition<K, L\>

[core](../modules/core.md).ObjectSchemaDefinition

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

### attribution

• `Optional` **attribution**: [`AttributionNode`](../types/core.AttributionNode.md)[]

Attribution text, images, and/or links that should be rendered along with this value.

See [makeAttributionNode](../functions/core.makeAttributionNode.md).

#### Defined in

[schema.ts:809](https://github.com/coda/packs-sdk/blob/main/schema.ts#L809)

___

### codaType

• `Optional` **codaType**: [`Person`](../enums/core.ValueHintType.md#person) \| [`Reference`](../enums/core.ValueHintType.md#reference)

A hint for how Coda should interpret and render this object value.

For example, an object can represent a person (user) in a Coda doc, with properties for the
email address of the person and their name. Using `ValueHintType.Person` tells Coda to
render such a value as an @-reference to that person, rather than a basic object schip.

#### Defined in

[schema.ts:781](https://github.com/coda/packs-sdk/blob/main/schema.ts#L781)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseSchema.description

#### Defined in

[schema.ts:200](https://github.com/coda/packs-sdk/blob/main/schema.ts#L200)

___

### displayProperty

• `Optional` **displayProperty**: `K`

The name of a property within [properties](core.ObjectSchemaDefinition.md#properties) that be used to label this object in the UI.
Object values can contain many properties and the Coda UI will display them as a "chip"
with only the value of the "displayProperty" property used as the chip's display label.
The other properties can be seen when hovering over the chip.

#### Defined in

[schema.ts:773](https://github.com/coda/packs-sdk/blob/main/schema.ts#L773)

___

### featured

• `Optional` **featured**: `L`[]

**`deprecated`** Use [featuredProperties](core.ObjectSchemaDefinition.md#featuredproperties)

#### Defined in

[schema.ts:783](https://github.com/coda/packs-sdk/blob/main/schema.ts#L783)

___

### featuredProperties

• `Optional` **featuredProperties**: `L`[]

A list of property names from within [properties](core.ObjectSchemaDefinition.md#properties) for the "featured" properties
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

[schema.ts:798](https://github.com/coda/packs-sdk/blob/main/schema.ts#L798)

___

### id

• `Optional` **id**: `K`

**`deprecated`** Use [idProperty](core.ObjectSchemaDefinition.md#idproperty)

#### Defined in

[schema.ts:759](https://github.com/coda/packs-sdk/blob/main/schema.ts#L759)

___

### idProperty

• `Optional` **idProperty**: `K`

The name of a property within [properties](core.ObjectSchemaDefinition.md#properties) that represents a unique id for this object.
Sync table schemas must specify an id property, which uniquely identify each synced row.

#### Defined in

[schema.ts:764](https://github.com/coda/packs-sdk/blob/main/schema.ts#L764)

___

### identity

• `Optional` **identity**: [`IdentityDefinition`](core.IdentityDefinition.md)

An identity for this schema, if this schema is important enough to be named and referenced.
See [IdentityDefinition](core.IdentityDefinition.md).

#### Defined in

[schema.ts:803](https://github.com/coda/packs-sdk/blob/main/schema.ts#L803)

___

### includeUnknownProperties

• `Optional` **includeUnknownProperties**: `boolean`

Specifies that object instances with this schema can contain additional properties not defined
in the schema, and that the packs infrastructure should retain these unknown properties
rather than stripping them.

Properties not declared in the schema will not work properly in Coda: they cannot be
used natively in the formula language and will not have correct types in Coda. But, in certain
scenarios they can be useful.

#### Defined in

[schema.ts:819](https://github.com/coda/packs-sdk/blob/main/schema.ts#L819)

___

### primary

• `Optional` **primary**: `K`

**`deprecated`** Use [displayProperty](core.ObjectSchemaDefinition.md#displayproperty)

#### Defined in

[schema.ts:766](https://github.com/coda/packs-sdk/blob/main/schema.ts#L766)

___

### properties

• **properties**: [`ObjectSchemaProperties`](../types/core.ObjectSchemaProperties.md)<`K` \| `L`\>

Definintion of the key-value pairs in this object.

#### Defined in

[schema.ts:757](https://github.com/coda/packs-sdk/blob/main/schema.ts#L757)

___

### type

• **type**: [`Object`](../enums/core.ValueType.md#object)

Identifies this schema as an object schema.

#### Defined in

[schema.ts:755](https://github.com/coda/packs-sdk/blob/main/schema.ts#L755)
