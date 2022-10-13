---
nav: "NumericTimeSchema"
---
# Interface: NumericTimeSchema

[core](../modules/core.md).NumericTimeSchema

A schema representing a return value or object property that is provided as a number,
which Coda should interpret as a time. The given number should be in seconds since the Unix epoch.
While this is a full datetime, only the time component will be rendered, so the date used is irrelevant.

## Hierarchy

- `BaseNumberSchema`<[`Time`](../enums/core.ValueHintType.md#time)\>

  ↳ **`NumericTimeSchema`**

## Properties

### codaType

• **codaType**: [`Time`](../enums/core.ValueHintType.md#time)

Instructs Coda to render this value as a time.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:291](https://github.com/coda/packs-sdk/blob/main/schema.ts#L291)

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

### format

• `Optional` **format**: `string`

A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:298](https://github.com/coda/packs-sdk/blob/main/schema.ts#L298)

___

### type

• **type**: [`Number`](../enums/core.ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:250](https://github.com/coda/packs-sdk/blob/main/schema.ts#L250)
