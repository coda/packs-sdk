---
title: "BooleanSchema"
---
# Interface: BooleanSchema

[core](../modules/core.md).BooleanSchema

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

### type

• **type**: [`Boolean`](../enums/core.ValueType.md#boolean)

Identifies this schema as relating to a boolean value.

#### Defined in

[schema.ts:208](https://github.com/coda/packs-sdk/blob/main/schema.ts#L208)
