# Interface: SimpleStringSchema<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `SimpleStringHintTypes``SimpleStringHintTypes` |

## Hierarchy

- `BaseStringSchema`<`T`\>

  ↳ **`SimpleStringSchema`**

## Properties

### codaType

• `Optional` **codaType**: `T`

#### Inherited from

BaseStringSchema.codaType

#### Defined in

[schema.ts:414](https://github.com/coda/packs-sdk/blob/main/schema.ts#L414)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has a object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:413](https://github.com/coda/packs-sdk/blob/main/schema.ts#L413)
