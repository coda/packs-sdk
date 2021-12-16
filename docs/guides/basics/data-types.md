---
title: Data types
---

# Return data with meaningful types

Pack formulas are written in JavaScript and can return standard JavaScript data types. Coda however supports a wider array of semantic types that change how the data is displayed to the user. When defining a [formula][formulas] or [schema][schemas] you must specify the type of the data being returned.

[View Sample Code][samples]{ .md-button }


## Value types

The core, underlying type of a value is referred to as its value type. The enumeration [`ValueType`][ValueType] defines the set of supported types, and they correspond to basic data types in JavaScript.

For a formula the value type is specified in the `resultType` property, and for schemas it's specified in the `type` property. The type specified must match the type of the value returned by your code.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.String,
  execute: async function ([], context) {
    return "This is a string";
  },
});
```

[View all types][ValueType]{ .md-button }


### Arrays

Lists of data can be returned using the [`Array`][Array] value type. You must also specify the value type of the items in the array, using the `items` property.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.Array,
  items: { type: coda.ValueType.String },
  execute: async function ([], context) {
    return ["This", "is", "a", "string", "array"];
  },
  // ...
});
```

The resulting array is represented as a [`List`][formula_list] in the Coda formula language.


### Objects

Structured data can be returned using the [`Object`][Object] value type. These objects must conform to an existing schema, as specified in the `schema` property. See the [Schemas guide][schemas] for more information about defining and using schemas.

```ts
const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // ...
  },
  // ...
});

pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: MySchema,
  execute: async function ([], context) {
    return {
      property1: "This is a string",
      property2: 42,
      // ...
    };
  },
});
```

Objects are displayed in the doc as a "chip", a small rectangle with rounded corners. A primary value is displayed within the chip, with additional properties of object shown on hover.

<img src="../../../images/data_types_object_hover.png" srcset="../../../images/data_types_object_hover_2x.png 2x" class="screenshot" alt="Hovering over an object chip">

Like Coda tables, the fields within an object can be accessed using dot notation.

<img src="../../../images/data_types_object_dot.png" srcset="../../../images/data_types_object_dot_2x.png 2x" class="screenshot" alt="Using dot notation to access the properties of the object">


## Value hints

To indicate that Coda should display your value in a more meaningful way you can set a value hint. The enumeration [`ValueHintType`][ValueHintType] defines the set of supported value hints, which correspond to the [column formats][column_formats] in Coda. The value hint is set one using the `codaType` property of a formula or schema. Hints can only be used with certain value types, for example the `Percent` value hint can only be used with the `Number` value type.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Markdown,
  execute: async function ([], context) {
    return "This _is_ **markdown**";
  },
});
```

[View all types][ValueHintType]{ .md-button }

### Markdown {. #markdown}

The [`Markdown`][hint_markdown] value hint indicates that Coda should parse the returned string as markdown as render it as rich text. The value can contain [basic markdown syntax][markdown], but extensions used by other applications (like tables, emoji, etc) are not supported.

<!-- TODO: Fully document the allowed markup. -->


### HTML

The [`Html`][hint_html] value hint indicates that Coda should parse the returned string as HTML and render it as rich text. Code only supports a small subset of HTML markup, limited to the basic formatting you can accomplish in [markdown](#markdown).

<!-- TODO: Fully document the allowed markup. -->


### Dates and times

The [`Date`][Date], [`Time`][Time], and [`DateTime`][DateTime] value hints can be applied to either `String` or `Number` values. When used with a string value, Coda attempts to parse the value, and is able to parse a wide variety of date and time formats. For maximum compatibility however use the [ISO 8601][ISO_8601] format. When used with a number value, the number should contain the number of seconds since the [Unix epoch][unix_epoch] (00:00:00 UTC on 1 January 1970).

!!! warning
    These value hints currently only work correctly within a sync table. When used outside of a sync table both the date and time parts of the returned date will be visible.


### Durations

The [`Duration`][Duration] value hint represents an amount of time, rather than a specific time. It can only be applied to `String` values, and those strings must match one of a few formats:

| Example                     | Result              | Notes                        |
|-----------------------------|---------------------|------------------------------|
| 6                           | 6 days              | A single number is days.     |
| 6:01                        | 6 hrs 1 min         | Hours and minutes.           |
| 6:01:15                     | 6 hrs 1 min 15 secs | Hours, minutes, and seconds. |
| 6 hours 1 minute 15 seconds | 5 hrs 1 min 15 secs | Full units.                  |
| 6 hrs 1 min 15 secs         | 5 hrs 1 min 15 secs | Abbreviated units.           |
| 6 hrs, 1 min, 15 secs       | 5 hrs 1 min 15 secs | Commas allowed.              |
| 0.25 days, 1 min, 15 secs   | 5 hrs 1 min 15 secs | Fractional amounts allowed.  |


### Images

There are two different value hints for image: [`ImageReference`][ImageReference] and [`ImageAttachment`][ImageAttachment]. Both of these are applied to string values, where the string contains the URL of the image. For image references, the image is always loaded from the source URL. For image attachments, Coda copies the image from the source URL into the document and shows that local copy.

Image attachments should be used in most cases, but an image reference may make more sense if you expect the image to be updated often and want to ensure the doc is always using the latest image.

!!! warning
    Image attachments currently only work correctly within a sync table. When used outside of a sync table they behave like image references and load the image from the source URL.


### Embedded content

The [`Embed`][Embed] value hint can be used to embed external content in the Coda doc. This value hint can be applied to `String` values, where the string contains the URL to the external content. The URL must be compatible with our embed provider, [Iframely][iframely], which supports the [oEmbed protocol][oEmbed].

!!! info "Force not available"
    The `=Embed()` Coda formula supports a [`force: true` option][embed_force] that allows you to skip Iframely and load the content directly in an iframe. This option isn't currently available for the `Embed` value hint.


### People

The [`Person`][Person] value hint can be used to @-reference a Coda user account. This hint can be applied to `Object` values, where the object has a property that specifies the user's email address. The email address must be contained within the property of the object that is listed as its `id` within the schema definition, and that property must be marked as `required`.

```ts
const MyPersonSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Person,
  properties: {
    name: {type: coda.ValueType.String},
    email: { type: coda.ValueType.String, required: true },
  },
  primary: "name",
  id: "email",
});
```

When no Coda user with the given email address is found the object will render as a normal object chip.

!!! warning
    This value hint currently only work correctly within a sync table. When used outside of a sync table it will render as a normal object chip, as if no value hint was applied.


### Row reference

The [`Reference`][Reference] value hint can be used to reference a row in a sync table. See the [Schemas guide][schemas] for more information about defining and using schema references.

!!! warning
    This value hint currently only work correctly within a sync table. When used outside of a sync table it will render as a normal object chip, as if no value hint was applied.


## Corresponding column types

The columns of a Coda table are strongly typed, and the data types in the Pack SDK roughly correspond to those same types. The table below indicates the corresponding value type and value hint that corresponds to a each column type.

| Column type   | Supported | Value type           | Value hint        |
|---------------|-----------|----------------------|-------------------|
| Text          | ✅ Yes     | `String`             |                   |
| Select list   | ❌ No      |                      |                   |
| Number        | ✅ Yes     | `Number`             |                   |
| Percent       | ✅ Yes     | `Number`             | `Percent`         |
| Currency      | ✅ Yes     | `Number`             | `Currency`        |
| Slider        | ✅ Yes     | `Number`             | `Slider`          |
| Scale         | ✅ Yes     | `Number`             | `Scale`           |
| Date          | ✅ Yes     | `String` or `Number` | `Date`            |
| Time          | ✅ Yes     | `String` or `Number` | `Time`            |
| Date and time | ✅ Yes     | `String` or `Number` | `DateTime`        |
| Duration      | ✅ Yes     | `String`             | `Duration`        |
| Checkbox      | ✅ Yes     | `Boolean`            |                   |
| People        | ✅ Yes     | `Object`             | `Person`          |
| Reaction      | ❌ No      |                      |                   |
| Button        | ❌ No[^1]  |                      |                   |
| Image         | ✅ Yes     | `String`             | `ImageAttachment` |
| Image URL     | ✅ Yes     | `String`             | `ImageReference`  |
| File          | ✅ Yes     | `String`             | `Attachment`      |
| Lookup        | ✅ Yes     | `Object`             | `Reference`       |


[^1]: While a Pack can't return a button directly, it can provide [actions][actions] that a user can use to power their buttons.


## Formatting options

When used in a sync table, some value types and value hints support additional formatting options. For example, `Number` types support a [`precision`][precision] property that controls how many decimal places to show.

```ts
const DoorSchema = coda.makeObjectSchema({
  properties: {
    heightInMeters: {type: coda.ValueType.Number, precision: 3},
    // ...
  },
  // ...
});
```

The full set of formatting options for a given value type and hint can be found in the corresponding schema definition.

| Value type           | Value hint | Formatting options                               |
|----------------------|------------|--------------------------------------------------|
| `Number`             |            | [`NumericSchema`][NumericSchema]                 |
| `Number`             | `Percent`  | [`NumericSchema`][NumericSchema]                 |
| `Number`             | `Currency` | [`CurrencySchema`][CurrencySchema]               |
| `Number`             | `Slider`   | [`SliderSchema`][SliderSchema]                   |
| `Number`             | `Scale`    | [`ScaleSchema`][ScaleSchema]                     |
| `Number`             | `Date`     | [`NumericDateSchema`][NumericDateSchema]         |
| `Number`             | `Time`     | [`NumericTimeSchema`][NumericTimeSchema]         |
| `Number`             | `DateTime` | [`NumericDateTimeSchema`][NumericDateTimeSchema] |
| `String` or `Number` | `Date`     | [`StringDateSchema`][StringDateSchema]           |
| `String` or `Number` | `Time`     | [`StringTimeSchema`][StringTimeSchema]           |
| `String` or `Number` | `DateTime` | [`StringDateTimeSchema`][StringDateTimeSchema]   |
| `String`             | `Duration` | [`DurationSchema`][DurationSchema]               |

!!! warning
    Formatting options currently only work correctly within a sync table column. When used outside of a sync table, or when viewed within a chip, the formatting is ignored.


[samples]: ../../samples/topic/data-type.md
[formulas]: ../blocks/formulas.md
[schemas]: ../advanced/schemas.md
[ValueType]: ../../reference/sdk/enums/ValueType.md
[Number]: ../../reference/sdk/enums/ValueType.md#Number
[Array]: ../../reference/sdk/enums/ValueType.md#Array
[Object]: ../../reference/sdk/enums/ValueType.md#Object
[ValueHintType]: ../../reference/sdk/enums/ValueHintType.md
[Date]: ../../reference/sdk/enums/ValueHintType.md#Date
[Time]: ../../reference/sdk/enums/ValueHintType.md#Time
[DateTime]: ../../reference/sdk/enums/ValueHintType.md#DateTime
[Duration]: ../../reference/sdk/enums/ValueHintType.md#Duration
[ImageAttachment]: ../../reference/sdk/enums/ValueHintType.md#ImageAttachment
[ImageReference]: ../../reference/sdk/enums/ValueHintType.md#ImageReference
[Embed]: ../../reference/sdk/enums/ValueHintType.md#Embed
[Person]: ../../reference/sdk/enums/ValueHintType.md#Person
[Reference]: ../../reference/sdk/enums/ValueHintType.md#Reference
[markdown]: https://www.markdownguide.org/basic-syntax/
[markdown_code_fenced]: https://www.markdownguide.org/extended-syntax/#fenced-code-blocks
[markdown_code_indent]: https://www.markdownguide.org/basic-syntax/#code-blocks
[markdown_checkbox_list]: https://www.markdownguide.org/extended-syntax/#task-lists
[markdown_strikethrough]: https://www.markdownguide.org/extended-syntax/#strikethrough
[markdown_automatic_links]: https://www.markdownguide.org/extended-syntax/#automatic-url-linking
[hint_markdown]: ../../reference/sdk/enums/ValueHintType.md#markdown
[hint_html]: ../../reference/sdk/enums/ValueHintType.md#html
[ISO_8601]: https://en.wikipedia.org/wiki/ISO_8601
[unix_epoch]: https://en.wikipedia.org/wiki/Unix_time
[iframely]: https://iframely.com/
[oEmbed]: https://oembed.com/
[embed_force]: https://help.coda.io/en/articles/1211364-embedding-content-in-your-doc#using-the-force-parameter
[column_formats]: https://help.coda.io/en/articles/1235680-overview-of-column-formats
[actions]: ../blocks/actions.md
[precision]: ../../reference/sdk/interfaces/NumericSchema.md/#precision
[NumericSchema]: ../../reference/sdk/interfaces/NumericSchema.md
[CurrencySchema]: ../../reference/sdk/interfaces/CurrencySchema.md
[SliderSchema]: ../../reference/sdk/interfaces/SliderSchema.md
[ScaleSchema]: ../../reference/sdk/interfaces/ScaleSchema.md
[NumericDateSchema]: ../../reference/sdk/interfaces/NumericDateSchema.md
[NumericTimeSchema]: ../../reference/sdk/interfaces/NumericTimeSchema.md
[NumericDateTimeSchema]: ../../reference/sdk/interfaces/NumericDateTimeSchema.md
[StringDateSchema]: ../../reference/sdk/interfaces/StringDateSchema.md
[StringTimeSchema]: ../../reference/sdk/interfaces/StringTimeSchema.md
[StringDateTimeSchema]: ../../reference/sdk/interfaces/StringDateTimeSchema.md
[DurationSchema]: ../../reference/sdk/interfaces/DurationSchema.md
[formula_list]: https://coda.io/formulas#List
