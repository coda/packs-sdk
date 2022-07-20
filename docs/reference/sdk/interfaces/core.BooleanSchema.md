---
title: "BooleanSchema"
---
# Interface: BooleanSchema

[core](../modules/core.md).BooleanSchema

A schema representing a return value or object property that is a boolean.

## Hierarchy

- `BaseSchema`

  ↳ **`BooleanSchema`**

## Properties

### codaType

• `Optional` **codaType**: [`Toggle`](../enums/core.ValueHintType.md#toggle)

Indicates how to render values in a table. If not specified, renders a checkbox.

#### Defined in

[schema.ts:220](https://github.com/coda/packs-sdk/blob/main/schema.ts#L220)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseSchema.description

#### Defined in

[schema.ts:210](https://github.com/coda/packs-sdk/blob/main/schema.ts#L210)

___

### type

• **type**: [`Boolean`](../enums/core.ValueType.md#boolean)

Identifies this schema as relating to a boolean value.

#### Defined in

[schema.ts:218](https://github.com/coda/packs-sdk/blob/main/schema.ts#L218)
