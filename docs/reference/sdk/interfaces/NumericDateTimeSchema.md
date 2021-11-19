# Interface: NumericDateTimeSchema

A schema representing a return value or object property that is provided as a number,
which Coda should interpret as a datetime. The given number should be in seconds since the Unix epoch.

## Hierarchy

- `BaseNumberSchema`<[`DateTime`](../enums/ValueHintType.md#datetime)\>

  ↳ **`NumericDateTimeSchema`**

## Properties

### codaType

• **codaType**: [`DateTime`](../enums/ValueHintType.md#datetime)

Instructs Coda to render this value as a datetime.

#### Overrides

BaseNumberSchema.codaType

#### Defined in

[schema.ts:276](https://github.com/coda/packs-sdk/blob/main/schema.ts#L276)

___

### dateFormat

• `Optional` **dateFormat**: `string`

A Moment date format string, such as 'MMM D, YYYY', that corresponds to a supported Coda date column format.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:282](https://github.com/coda/packs-sdk/blob/main/schema.ts#L282)

___

### description

• `Optional` **description**: `string`

A explanation of this object schema property shown to the user in the UI.

If your pack has an object schema with many properties, it may be useful to
explain the purpose or contents of any property that is not self-evident.

#### Inherited from

BaseNumberSchema.description

#### Defined in

[schema.ts:194](https://github.com/coda/packs-sdk/blob/main/schema.ts#L194)

___

### timeFormat

• `Optional` **timeFormat**: `string`

A Moment time format string, such as 'HH:mm:ss', that corresponds to a supported Coda time column format,
used when rendering the value.

Only applies when this is used as a sync table property.

#### Defined in

[schema.ts:289](https://github.com/coda/packs-sdk/blob/main/schema.ts#L289)

___

### type

• **type**: [`Number`](../enums/ValueType.md#number)

Identifies this schema as relating to a number value.

#### Inherited from

BaseNumberSchema.type

#### Defined in

[schema.ts:219](https://github.com/coda/packs-sdk/blob/main/schema.ts#L219)
