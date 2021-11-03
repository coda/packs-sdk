# Interface: ScaleSchema

## Hierarchy

- `BaseNumberSchema`<[`Scale`](../enums/ValueHintType.md#scale)\>

  ↳ **`ScaleSchema`**

## Properties

### codaType

• **codaType**: [`Scale`](../enums/ValueHintType.md#scale)

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:360](https://github.com/coda/packs-sdk/blob/main/schema.ts#L360)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has a object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:192](https://github.com/coda/packs-sdk/blob/main/schema.ts#L192)

___

### icon

• `Optional` **icon**: [`ScaleIconSet`](../enums/ScaleIconSet.md)

#### Defined in

[schema.ts:362](https://github.com/coda/packs-sdk/blob/main/schema.ts#L362)

___

### maximum

• `Optional` **maximum**: `number`

#### Defined in

[schema.ts:361](https://github.com/coda/packs-sdk/blob/main/schema.ts#L361)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:217](https://github.com/coda/packs-sdk/blob/main/schema.ts#L217)
