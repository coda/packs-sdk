---
nav: "ArraySchema"
---
# Interface: ArraySchema<T\>

[core](../modules/core.md).ArraySchema

A schema representing a return value or object property that is an array (list) of items.
The items are themselves schema definitions, which may refer to scalars or other objects.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/core.Schema.md) = [`Schema`](../types/core.Schema.md) |

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

[schema.ts:215](https://github.com/coda/packs-sdk/blob/main/schema.ts#L215)

___

### items

• **items**: `T`

A schema for the items of this array.

#### Defined in

[schema.ts:738](https://github.com/coda/packs-sdk/blob/main/schema.ts#L738)

___

### type

• **type**: [`Array`](../enums/core.ValueType.md#array)

Identifies this schema as an array.

#### Defined in

[schema.ts:736](https://github.com/coda/packs-sdk/blob/main/schema.ts#L736)
