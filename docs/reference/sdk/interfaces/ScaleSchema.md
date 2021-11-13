# Interface: ScaleSchema

A schema representing a return value or object property that is a number that should
be rendered as a scale.

A scale is a widget with a repeated set of icons, where the number of shaded represents
a numeric value. The canonical example of a scale is a star rating, which might show
5 star icons, with 3 of them shaded, indicating a value of 3.

## Hierarchy

- `BaseNumberSchema`<[`Scale`](../enums/ValueHintType.md#scale)\>

  ↳ **`ScaleSchema`**

## Properties

### codaType

• **codaType**: [`Scale`](../enums/ValueHintType.md#scale)

Instructs Coda to render this value as a scale.

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

[schema.ts:191](https://github.com/coda/packs-sdk/blob/main/schema.ts#L191)

___

### icon

• `Optional` **icon**: [`ScaleIconSet`](../enums/ScaleIconSet.md)

The icon to render.

#### Defined in

[schema.ts:389](https://github.com/coda/packs-sdk/blob/main/schema.ts#L389)

___

### maximum

• `Optional` **maximum**: `number`

The number of icons to render.

#### Defined in

[schema.ts:387](https://github.com/coda/packs-sdk/blob/main/schema.ts#L387)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:216](https://github.com/coda/packs-sdk/blob/main/schema.ts#L216)
