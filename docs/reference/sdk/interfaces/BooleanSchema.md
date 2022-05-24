---
title: "BooleanSchema"
---
# Interface: BooleanSchema

A schema representing a return value or object property that is a boolean.

## Hierarchy

- `BaseSchema`

  ↳ **`BooleanSchema`**

## Properties

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

### displayType

• `Optional` **displayType**: [`BooleanDisplayType`](../enums/BooleanDisplayType.md)

Indicates how to render values in a table. If not specified, renders a checkbox.

#### Defined in

[schema.ts:222](https://github.com/coda/packs-sdk/blob/main/schema.ts#L222)

___

### type

• **type**: [`Boolean`](../enums/ValueType.md#boolean)

Identifies this schema as relating to a boolean value.

#### Defined in

[schema.ts:220](https://github.com/coda/packs-sdk/blob/main/schema.ts#L220)
