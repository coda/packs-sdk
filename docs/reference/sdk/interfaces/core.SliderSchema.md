---
nav: "SliderSchema"
---
# Interface: SliderSchema

[core](../modules/core.md).SliderSchema

A schema representing a return value or object property that is a number that should
be rendered as a slider.

## Hierarchy

- `BaseNumberSchema`<[`Slider`](../enums/core.ValueHintType.md#slider)\>

  ↳ **`SliderSchema`**

## Properties

### codaType

• **codaType**: [`Slider`](../enums/core.ValueHintType.md#slider)

Instructs Coda to render this value as a slider.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:385](https://github.com/coda/packs-sdk/blob/main/schema.ts#L385)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:215](https://github.com/coda/packs-sdk/blob/main/schema.ts#L215)

___

### maximum

• `Optional` **maximum**: `string` \| `number`

The maximum value selectable by this slider.

#### Defined in

[schema.ts:389](https://github.com/coda/packs-sdk/blob/main/schema.ts#L389)

___

### minimum

• `Optional` **minimum**: `string` \| `number`

The minimum value selectable by this slider.

#### Defined in

[schema.ts:387](https://github.com/coda/packs-sdk/blob/main/schema.ts#L387)

___

### showValue

• `Optional` **showValue**: `boolean`

Whether to display the underlying numeric value in addition to the slider.

#### Defined in

[schema.ts:393](https://github.com/coda/packs-sdk/blob/main/schema.ts#L393)

___

### step

• `Optional` **step**: `string` \| `number`

The minimum amount the slider can be moved when dragged.

#### Defined in

[schema.ts:391](https://github.com/coda/packs-sdk/blob/main/schema.ts#L391)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:244](https://github.com/coda/packs-sdk/blob/main/schema.ts#L244)
