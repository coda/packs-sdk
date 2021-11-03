# Interface: ArraySchema<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Schema`](../types/Schema.md)[`Schema`](../types/Schema.md) |

## Hierarchy

- `BaseSchema`

  ↳ **`ArraySchema`**

## Properties

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has a object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### items

• **items**: `T`

#### Defined in

[schema.ts:443](https://github.com/coda/packs-sdk/blob/main/schema.ts#L443)

___

### type

• **type**: [`Array`](../enums/ValueType.md#array)

#### Defined in

[schema.ts:442](https://github.com/coda/packs-sdk/blob/main/schema.ts#L442)
