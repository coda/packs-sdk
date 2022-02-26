---
title: "ValueHintType"
---
# Enumeration: ValueHintType

Synthetic types that instruct Coda how to coerce values from primitives at ingestion time.

## Enumeration members

### Attachment

• **Attachment** = `"attachment"`

Indicates to interpret and render a value as a file attachment. The provided value should be a URL
pointing to a file of a Coda-supported type. Coda will ingest the file and host it from Coda infrastructure.

#### Defined in

[schema.ts:149](https://github.com/coda/packs-sdk/blob/main/schema.ts#L149)

___

### Currency

• **Currency** = `"currency"`

Indicates to interpret and render the value as a currency value.

#### Defined in

[schema.ts:88](https://github.com/coda/packs-sdk/blob/main/schema.ts#L88)

___

### Date

• **Date** = `"date"`

Indicates to interpret the value as a date (e.g. March 3, 2021).

#### Defined in

[schema.ts:44](https://github.com/coda/packs-sdk/blob/main/schema.ts#L44)

___

### DateTime

• **DateTime** = `"datetime"`

Indicates to interpret the value as a datetime (e.g. March 3, 2021 at 5:24pm).

#### Defined in

[schema.ts:52](https://github.com/coda/packs-sdk/blob/main/schema.ts#L52)

___

### Duration

• **Duration** = `"duration"`

Indicates to interpret the value as a duration (e.g. 3 hours).

#### Defined in

[schema.ts:56](https://github.com/coda/packs-sdk/blob/main/schema.ts#L56)

___

### Email

• **Email** = `"email"`

Indicates to interpret the value as an email address (e.g. joe@foo.com).

#### Defined in

[schema.ts:60](https://github.com/coda/packs-sdk/blob/main/schema.ts#L60)

___

### Embed

• **Embed** = `"embed"`

Indicates to interpret and render a value as an embed. The provided value should be a URL pointing
to an embeddable web page.

#### Defined in

[schema.ts:118](https://github.com/coda/packs-sdk/blob/main/schema.ts#L118)

___

### Html

• **Html** = `"html"`

Indicates to interpret a text value as HTML, which will be converted and rendered as Coda rich text.

#### Defined in

[schema.ts:113](https://github.com/coda/packs-sdk/blob/main/schema.ts#L113)

___

### ImageAttachment

• **ImageAttachment** = `"imageAttachment"`

Indicates to interpret and render the value as an image. The provided value should be a URL that
points to an image. Coda will ingest the image and host it from Coda infrastructure.

#### Defined in

[schema.ts:101](https://github.com/coda/packs-sdk/blob/main/schema.ts#L101)

___

### ImageReference

• **ImageReference** = `"image"`

Indicates to interpret and render the value as an image. The provided value should be a URL that
points to an image. Coda will hotlink to the image when rendering it a doc.

Using [ImageAttachment](ValueHintType.md#imageattachment) is recommended instead, so that the image is always accessible
and won't appear as broken if the source image is later deleted.

#### Defined in

[schema.ts:96](https://github.com/coda/packs-sdk/blob/main/schema.ts#L96)

___

### Markdown

• **Markdown** = `"markdown"`

Indicates to interpret a text value as Markdown, which will be converted and rendered as Coda rich text.

#### Defined in

[schema.ts:109](https://github.com/coda/packs-sdk/blob/main/schema.ts#L109)

___

### Percent

• **Percent** = `"percent"`

Indicates to interpret and render the value as a percentage.

#### Defined in

[schema.ts:84](https://github.com/coda/packs-sdk/blob/main/schema.ts#L84)

___

### Person

• **Person** = `"person"`

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

[schema.ts:80](https://github.com/coda/packs-sdk/blob/main/schema.ts#L80)

___

### Reference

• **Reference** = `"reference"`

Indicates to interpret and render the value as a Coda @-reference to a table row. The provided value should
be an object whose `id` value matches the id of some row in a sync table. The schema where this hint type is
used must specify an identity that specifies the desired sync table.

Normally a reference schema is constructed from the schema object being referenced using the helper
[makeReferenceSchemaFromObjectSchema](../functions/makeReferenceSchemaFromObjectSchema.md).

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

[schema.ts:144](https://github.com/coda/packs-sdk/blob/main/schema.ts#L144)

___

### Scale

• **Scale** = `"scale"`

Indicates to render a numeric value as a scale UI component (e.g. a star rating).

#### Defined in

[schema.ts:157](https://github.com/coda/packs-sdk/blob/main/schema.ts#L157)

___

### Slider

• **Slider** = `"slider"`

Indicates to render a numeric value as a slider UI component.

#### Defined in

[schema.ts:153](https://github.com/coda/packs-sdk/blob/main/schema.ts#L153)

___

### Time

• **Time** = `"time"`

Indicates to interpret the value as a time (e.g. 5:24pm).

#### Defined in

[schema.ts:48](https://github.com/coda/packs-sdk/blob/main/schema.ts#L48)

___

### Url

• **Url** = `"url"`

Indicates to interpret and render the value as a URL link.

#### Defined in

[schema.ts:105](https://github.com/coda/packs-sdk/blob/main/schema.ts#L105)
