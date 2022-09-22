---
nav: "ProgressBarSchema"
---
# Interface: ProgressBarSchema

[core](../modules/core.md).ProgressBarSchema

A schema representing a return value or object property that is a number that should
be rendered as a progress bar.

## Hierarchy

- `BaseNumberSchema`<[`ProgressBar`](../enums/core.ValueHintType.md#progressbar)\>

  ↳ **`ProgressBarSchema`**

## Properties

### codaType

• **codaType**: [`ProgressBar`](../enums/core.ValueHintType.md#progressbar)

Instructs Coda to render this value as a progress bar.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:402](https://github.com/coda/packs-sdk/blob/main/schema.ts#L402)

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

The maximum value selectable by this progress bar.

#### Defined in

[schema.ts:406](https://github.com/coda/packs-sdk/blob/main/schema.ts#L406)

___

### minimum

• `Optional` **minimum**: `string` \| `number`

The minimum value selectable by this progress bar.

#### Defined in

[schema.ts:404](https://github.com/coda/packs-sdk/blob/main/schema.ts#L404)

___

### showValue

• `Optional` **showValue**: `boolean`

Whether to display the underlying numeric value in addition to the progress bar.

#### Defined in

[schema.ts:410](https://github.com/coda/packs-sdk/blob/main/schema.ts#L410)

___

### step

• `Optional` **step**: `string` \| `number`

The minimum amount the progress bar can be moved when dragged.

#### Defined in

[schema.ts:408](https://github.com/coda/packs-sdk/blob/main/schema.ts#L408)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:244](https://github.com/coda/packs-sdk/blob/main/schema.ts#L244)
