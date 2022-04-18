---
title: "SimpleStringSchema"
---
# Interface: SimpleStringSchema<T\>

A schema whose underlying value is a string, along with an optional hint about how Coda
should interpret that string.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `SimpleStringHintTypes` = `SimpleStringHintTypes` |

## Hierarchy

- `BaseStringSchema`<`T`\>

  ↳ **`SimpleStringSchema`**

## Properties

### codaType

• `Optional` **codaType**: `T`

An optional type hint instructing Coda about how to interpret or render this value.

#### Inherited from

BaseStringSchema.codaType

#### Defined in

[schema.ts:603](https://github.com/coda/packs-sdk/blob/main/schema.ts#L603)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:200](https://github.com/coda/packs-sdk/blob/main/schema.ts#L200)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

Identifies this schema as a string.

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:601](https://github.com/coda/packs-sdk/blob/main/schema.ts#L601)
