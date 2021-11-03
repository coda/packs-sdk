# Interface: DurationSchema

## Hierarchy

- `BaseStringSchema`<[`Duration`](../enums/ValueHintType.md#duration)\>

  ↳ **`DurationSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Duration`](../enums/ValueHintType.md#duration)

#### Inherited from

BaseStringSchema.codaType

#### Defined in

[schema.ts:414](https://github.com/coda/packs-sdk/blob/main/schema.ts#L414)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseStringSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### maxUnit

• `Optional` **maxUnit**: [`DurationUnit`](../enums/DurationUnit.md)

#### Defined in

[schema.ts:409](https://github.com/coda/packs-sdk/blob/main/schema.ts#L409)

___

### precision

• `Optional` **precision**: `number`

#### Defined in

[schema.ts:408](https://github.com/coda/packs-sdk/blob/main/schema.ts#L408)

___

### type

• **type**: [`String`](../enums/ValueType.md#string)

#### Inherited from

BaseStringSchema.type

#### Defined in

[schema.ts:413](https://github.com/coda/packs-sdk/blob/main/schema.ts#L413)
