---
title: "ArraySchema"
---
# Interface: ArraySchema<T\>

A schema representing a return value or object property that is an array (list) of items.
The items are themselves schema definitions, which may refer to scalars or other objects.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/Schema.md) = [`Schema`](../types/Schema.md) |

## Hierarchy

- `BaseSchema`

  ↳ **`ArraySchema`**

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

### items

• **items**: `T`

A schema for the items of this array.

#### Defined in

[schema.ts:662](https://github.com/coda/packs-sdk/blob/main/schema.ts#L662)

___

### type

• **type**: [`Array`](../enums/ValueType.md#array)

Identifies this schema as an array.

#### Defined in

[schema.ts:660](https://github.com/coda/packs-sdk/blob/main/schema.ts#L660)
