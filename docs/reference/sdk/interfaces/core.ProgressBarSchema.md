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

[schema.ts:408](https://github.com/coda/packs-sdk/blob/main/schema.ts#L408)

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

[schema.ts:412](https://github.com/coda/packs-sdk/blob/main/schema.ts#L412)

___

### minimum

• `Optional` **minimum**: `string` \| `number`

The minimum value selectable by this progress bar.

#### Defined in

[schema.ts:410](https://github.com/coda/packs-sdk/blob/main/schema.ts#L410)

___

### mutable

• `Optional` **mutable**: `boolean`

Whether this object schema property is editable by the user in the UI.

#### Inherited from

BaseNumberSchema.mutable

#### Defined in

[schema.ts:220](https://github.com/coda/packs-sdk/blob/main/schema.ts#L220)

___

### showValue

• `Optional` **showValue**: `boolean`

Whether to display the underlying numeric value in addition to the progress bar.

#### Defined in

[schema.ts:416](https://github.com/coda/packs-sdk/blob/main/schema.ts#L416)

___

### step

• `Optional` **step**: `string` \| `number`

The minimum amount the progress bar can be moved when dragged.

#### Defined in

[schema.ts:414](https://github.com/coda/packs-sdk/blob/main/schema.ts#L414)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:249](https://github.com/coda/packs-sdk/blob/main/schema.ts#L249)
