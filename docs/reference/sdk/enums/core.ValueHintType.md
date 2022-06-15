---
title: "ValueHintType"
---
# Enumeration: ValueHintType

[core](../modules/core.md).ValueHintType

Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.

## Enumeration Members

### Attachment

• **Attachment**

Indicates to interpret and render a value as a file attachment. The provided value should be a URL
pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.

#### Defined in

[schema.ts:150](https://github.com/coda/packs-sdk/blob/main/schema.ts#L150)

___

### Currency

• **Currency**

Indicates to interpret and render the value as a currency value.

#### Defined in

[schema.ts:89](https://github.com/coda/packs-sdk/blob/main/schema.ts#L89)

___

### Date

• **Date**

Indicates to interpret the value as a date (e.g. March 3, 2021).

#### Defined in

[schema.ts:45](https://github.com/coda/packs-sdk/blob/main/schema.ts#L45)

___

### DateTime

• **DateTime**

Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).

#### Defined in

[schema.ts:53](https://github.com/coda/packs-sdk/blob/main/schema.ts#L53)

___

### Duration

• **Duration**

Indicates to interpret the value as a duration (e.g. 3 hours).

#### Defined in

[schema.ts:57](https://github.com/coda/packs-sdk/blob/main/schema.ts#L57)

___

### Email

• **Email**

Indicates to interpret the value as an email address (e.g. joe@foo.com).

#### Defined in

[schema.ts:61](https://github.com/coda/packs-sdk/blob/main/schema.ts#L61)

___

### Embed

• **Embed**

Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
to an embeddable web page.

#### Defined in

[schema.ts:119](https://github.com/coda/packs-sdk/blob/main/schema.ts#L119)

___

### Html

• **Html**

Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.

#### Defined in

[schema.ts:114](https://github.com/coda/packs-sdk/blob/main/schema.ts#L114)

___

### ImageAttachment

• **ImageAttachment**

Indicates to interpret and render the value as an image. The provided value should be a URL that
points to an image. Coda will ingest the image and host it from Coda infrastructure.

#### Defined in

[schema.ts:102](https://github.com/coda/packs-sdk/blob/main/schema.ts#L102)

___

### ImageReference

• **ImageReference**

Indicates to interpret and render the value as an image. The provided value should be a URL that
points to an image. Coda will hotlink to the image when rendering it a doc.

Using [ImageAttachment](core.ValueHintType.md#imageattachment) is recommended instead, so that the image is always accessible
and won't appear as broken if the source image is later deleted.

#### Defined in

[schema.ts:97](https://github.com/coda/packs-sdk/blob/main/schema.ts#L97)

___

### Markdown

• **Markdown**

Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.

#### Defined in

[schema.ts:110](https://github.com/coda/packs-sdk/blob/main/schema.ts#L110)

___

### Percent

• **Percent**

Indicates to interpret and render the value as a percentage.

#### Defined in

[schema.ts:85](https://github.com/coda/packs-sdk/blob/main/schema.ts#L85)

___

### Person

• **Person**

Indicates to interpret and render the value as a Coda person reference. The provided value should be
an object whose `id` property is an email address, which Coda will try to resolve to a user
and render an @-reference to the user.

**`example`**
```
makeObjectSchema({
  type: ValueType.Object,
  codaType: ValueHintType.Person,
  id: 'email',
  primary: 'name',
  properties: {
    email: {type: ValueType.String, required: true},
    name: {type: ValueType.String, required: true},
  },
});
```

#### Defined in

[schema.ts:81](https://github.com/coda/packs-sdk/blob/main/schema.ts#L81)

___

### Reference

• **Reference**

Indicates to interpret and render the value as a Coda @-reference to a table row. The provided value should
be an object whose `id` value matches the id of some row in a sync table. The schema where this hint type is
used must specify an identity that specifies the desired sync table.

Normally a reference schema is constructed from the schema object being referenced using the helper
[makeReferenceSchemaFromObjectSchema](../functions/core.makeReferenceSchemaFromObjectSchema.md).

**`example`**
```
makeObjectSchema({
  type: ValueType.Object,
  codaType: ValueHintType.Reference,
  identity: {
    name: "SomeSyncTableIdentity"
  },
  id: 'identifier',
  primary: 'name',
  properties: {
    identifier: {type: ValueType.Number, required: true},
    name: {type: ValueType.String, required: true},
  },
});
```

#### Defined in

[schema.ts:145](https://github.com/coda/packs-sdk/blob/main/schema.ts#L145)

___

### Scale

• **Scale**

Indicates to render a numeric value as a scale UI component (e.g. a star rating).

#### Defined in

[schema.ts:158](https://github.com/coda/packs-sdk/blob/main/schema.ts#L158)

___

### Slider

• **Slider**

Indicates to render a numeric value as a slider UI component.

#### Defined in

[schema.ts:154](https://github.com/coda/packs-sdk/blob/main/schema.ts#L154)

___

### Time

• **Time**

Indicates to interpret the value as a time (e.g. 5:24pm).

#### Defined in

[schema.ts:49](https://github.com/coda/packs-sdk/blob/main/schema.ts#L49)

___

### Toggle

• **Toggle**

Indicates to render a boolean value as a toggle.

#### Defined in

[schema.ts:162](https://github.com/coda/packs-sdk/blob/main/schema.ts#L162)

___

### Url

• **Url**

Indicates to interpret and render the value as a URL link.

#### Defined in

[schema.ts:106](https://github.com/coda/packs-sdk/blob/main/schema.ts#L106)
