---
nav: "PropertyIdentifierDetails"
---
# Interface: PropertyIdentifierDetails

[core](../modules/core.md).PropertyIdentifierDetails

An identifer for a schema property for specifying labels along with the reference to the property.
This is useful for specifying a label for a property reference that uses a json path, where the
label of the underlying property might not be descriptive enough at the top-level object.

## Properties

### label

• `Optional` **label**: `string`

An optional label for the property. This will be used in locations where the label appears with the property.

#### Defined in

[schema.ts:858](https://github.com/coda/packs-sdk/blob/main/schema.ts#L858)

___

### property

• **property**: `string`

The value of the property to reference. Can be either an exact property name or a json path.

#### Defined in

[schema.ts:862](https://github.com/coda/packs-sdk/blob/main/schema.ts#L862)
