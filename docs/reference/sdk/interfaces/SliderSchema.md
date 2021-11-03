# Interface: SliderSchema

## Hierarchy

- `BaseNumberSchema`<[`Slider`](../enums/ValueHintType.md#slider)\>

  ↳ **`SliderSchema`**

## Properties

### codaType

• **codaType**: [`Slider`](../enums/ValueHintType.md#slider)

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:325](https://github.com/coda/packs-sdk/blob/main/schema.ts#L325)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### maximum

• `Optional` **maximum**: `string` \| `number`

#### Defined in

[schema.ts:327](https://github.com/coda/packs-sdk/blob/main/schema.ts#L327)

___

### minimum

• `Optional` **minimum**: `string` \| `number`

#### Defined in

[schema.ts:326](https://github.com/coda/packs-sdk/blob/main/schema.ts#L326)

___

### step

• `Optional` **step**: `string` \| `number`

#### Defined in

[schema.ts:328](https://github.com/coda/packs-sdk/blob/main/schema.ts#L328)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:217](https://github.com/coda/packs-sdk/blob/main/schema.ts#L217)
