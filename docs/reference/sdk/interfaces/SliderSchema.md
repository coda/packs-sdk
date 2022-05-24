---
title: "SliderSchema"
---
# Interface: SliderSchema

A schema representing a return value or object property that is a number that should
be rendered as a slider.

## Hierarchy

- `BaseNumberSchema`<[`Slider`](../enums/ValueHintType.md#slider)\>

  ↳ **`SliderSchema`**

## Properties

### codaType

• **codaType**: [`Slider`](../enums/ValueHintType.md#slider)

Instructs Coda to render this value as a slider.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:356](https://github.com/coda/packs-sdk/blob/main/schema.ts#L356)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:207](https://github.com/coda/packs-sdk/blob/main/schema.ts#L207)

___

### maximum

• `Optional` **maximum**: `string` \| `number`

The maximum value selectable by this slider.

#### Defined in

[schema.ts:360](https://github.com/coda/packs-sdk/blob/main/schema.ts#L360)

___

### minimum

• `Optional` **minimum**: `string` \| `number`

The minimum value selectable by this slider.

#### Defined in

[schema.ts:358](https://github.com/coda/packs-sdk/blob/main/schema.ts#L358)

___

### step

• `Optional` **step**: `string` \| `number`

The minimum amount the slider can be moved when dragged.

#### Defined in

[schema.ts:362](https://github.com/coda/packs-sdk/blob/main/schema.ts#L362)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:234](https://github.com/coda/packs-sdk/blob/main/schema.ts#L234)
