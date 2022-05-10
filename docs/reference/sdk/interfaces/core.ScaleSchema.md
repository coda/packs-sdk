---
title: "ScaleSchema"
---
# Interface: ScaleSchema

[core](../modules/core.md).ScaleSchema

A schema representing a return value or object property that is a number that should
be rendered as a scale.

A scale is a widget with a repeated set of icons, where the number of shaded represents
a numeric value. The canonical example of a scale is a star rating, which might show
5 star icons, with 3 of them shaded, indicating a value of 3.

## Hierarchy

- `BaseNumberSchema`<[`Scale`](../enums/core.ValueHintType.md#scale)\>

  ↳ **`ScaleSchema`**

## Properties

### codaType

• **codaType**: [`Scale`](../enums/core.ValueHintType.md#scale)

Instructs Coda to render this value as a scale.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:394](https://github.com/coda/packs-sdk/blob/main/schema.ts#L394)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:200](https://github.com/coda/packs-sdk/blob/main/schema.ts#L200)

___

### icon

• `Optional` **icon**: [`ScaleIconSet`](../enums/core.ScaleIconSet.md)

The icon to render.

#### Defined in

[schema.ts:398](https://github.com/coda/packs-sdk/blob/main/schema.ts#L398)

___

### maximum

• `Optional` **maximum**: `number`

The number of icons to render.

#### Defined in

[schema.ts:396](https://github.com/coda/packs-sdk/blob/main/schema.ts#L396)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:225](https://github.com/coda/packs-sdk/blob/main/schema.ts#L225)
