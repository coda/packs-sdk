# Interface: NumericDateSchema

A schema representing a return value or object property that is provided as a number,
which Coda should interpret as a date. The given number should be in seconds since the Unix epoch.

## Hierarchy

- `BaseNumberSchema`<[`Date`](../enums/ValueHintType.md#date)\>

  ↳ **`NumericDateSchema`**

## Properties

### codaType

• **codaType**: [`Date`](../enums/ValueHintType.md#date)

Instructs Coda to render this value as a date.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:241](https://github.com/coda/packs-sdk/blob/main/schema.ts#L241)

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

### format

• `Optional` **format**: `string`

A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:247](https://github.com/coda/packs-sdk/blob/main/schema.ts#L247)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:217](https://github.com/coda/packs-sdk/blob/main/schema.ts#L217)
