---
nav: Cards
description: Display structured information as rich cards.
---

# Preview content with rich cards

Pack formulas can return structured data as [objects][data_types_objects], allowing a single formula to return multiple values at once. By default these objects are presented as "mentions", shown as chips in the document that you can hover over to get the full set of information.

TODO: Animated gif of mention vs card.

Cards are an alternative, more visual display format for objects that allow the user to easily consume key information. Additionally URLs pasted into a document can be automatically shown as cards, providing an easy way for users to discover and use your Pack.

[View Sample Code][samples]{ .md-button }


## Using cards

Coda will promote cards as a distinct option in some cases, but any supported object can be shown in a card view.

=== "In the Pack side panel"
    TODO: Screenshot of Cards in side panel
=== "In the 'Display As' menu"
    TODO: Screenshot of Card option in the display as menu


## Creating cards

Although they appear as a separate type of building block, cards are really just an alternative display format for [formulas][formulas] that return structured data. Your formula will appear as a card if it returns an [object schema][schemas_object] that fulfills all of the following:

- [x] Defines one of: `displayProperty` or `titleProperty`
- [x] Defines one of: `linkProperty`, `snippetProperty`, or `subtitleProperties`
- [x] Defines an [`identity`][schemas_identity]

See the sections below for how to configure specific attributes of the card.

??? example "Example: Weather card"
    ```ts
    --8<-- "samples/packs/card/weather.ts"
    ```


### Title

The card's title appears at the top of the card, and is required.

TODO: Image highlighting card title

Many object schemas already define a [display value][schemas_display_value] (via `displayProperty`) which determines which property value is shown in the mention chip for the object. The same display value will be shown as the title of the card, but can be overridden by defining a `titleProperty`. This is useful if you want to use a different property specifically for cards, for example that is longer.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    sku: { type: coda.ValueType.String },
    name: { type: coda.ValueType.String },
    // ...
  },
  // Use the SKU in mention chips, to save space.
  displayProperty: "sku",
  // Display the full product name in cards.
  titleProperty: "name",
  // ...
});
```


### Subtitles

The card can include a subtitle that highlights key properties, which appears under the title.

TODO: Image highlighting card subtitle

The properties displayed in the subtitle are determined via the `subtitleProperties` field of the schema, which lists the subset of properties to show and the order to show them.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    quantity: { type: coda.ValueType.Number },
    price: { type: coda.ValueType.Number, codaType: coda.ValueHintType.Currency },
  },
  // ...
  subtitleProperties: ["quantity", "price"],
});
```

The subtitle shows a label for each property, which defaults to `{Name}: {Value}`. You can customize the label for a property, such as removing the property name, in the property definition. See the [Schemas guide][schemas_property_labels] for more information.


### Body

The card body can include a snippet of content, which appears under the title (and subtitle if defined).

TODO: Image highlighting card snippet

The snippet is meant to contain a limited amount of text, although there is no size limit enforced. Which property's content to use for the snippet is defined by the field `snippetProperty`, and it can only refer to properties of type `String` or `Array` of `String`. These properties can contain rich text, such as [Markdown][data_types_markdown] and [HTML][data_types_html].

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    description: { type: coda.ValueType.String },
  },
  // ...
  snippetProperty: "description",
});
```


### Image

The card can include an image, which appears to the left of the other content.

TODO: Image highlighting card image

Which property's content to use for the image is defined by the field `imageProperty`, and it can only refer to properties of type `String` with a hint of either `ImageReference` or `ImageAttachment`.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    photo: { type: coda.ValueType.String, codaType: coda.ValueHintType.ImageReference },
  },
  // ...
  imageProperty: "photo",
});
```


### Link

The card can include a link, which will be opened when the card is clicked. The domain of the link is also shown at the bottom of the card.

TODO: Image highlighting card link

Which property's content to use for the link is defined by the field `linkProperty`, and it can only refer to properties of type `String` with a hint of `Url`.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    websiteLink: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
  },
  // ...
  linkProperty: "websiteLink",
});
```


## Display a link as a card

One of the most common uses for cards is to display information about an item from an external application. For instance, to preview the details of a Slack message or Google Drive file. Coda provides an easy entry point to this functionality when a user pastes a link into the doc by offering to display it as a card instead.

TODO: Image of display link as card prompt

!!! info "Built-in card option"
    The link "Display as" menu always has an option for "Card", which displays a fix set of metadata for public URLs. This is distinct from Pack cards, which are shown as additional options below that.

Coda will automatically display a link as a card if it matches a Pack already installed in the doc, or for certain Coda-made Packs.

To enable this feature for your Pack, add a [column format][column_format] pointing to a formula that accepts a URL and returns a card. Then add [`matchers`][column_format_matchers] (regular expressions) to the column format that determine which URLs the the prompt should appear on.


```ts
pack.addFormula({
  name: "Product",
  description: "...",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "...",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ProductSchema,
  // ...
});

pack.addColumnFormat({
  name: "Product details",
  formulaName: "Product",
  matchers: [
    new RegExp("^https://example.com/products/[0-9]+$"),
  ],
});
```

!!! info "Table behavior"
    Formulas and column formats that return a card can be used in a table, but currently the resulting object can only be shown as a mention.

??? example "Example: Todoist task card"
    ```ts
    --8<-- "samples/packs/todoist/card.ts"
    ```


[formulas]: formulas.md
[schemas_object]: ../advanced/schemas.md#object
[schemas_display_value]: ../advanced/schemas.md#display-value
[schemas_featured_columns]: ../advanced/schemas.md#featured-columns
[schemas_property_labels]: ../advanced/schemas.md#property-labels
[data_types_markdown]: ../basics/data-types.md#markdown
[data_types_html]: ../basics/data-types.md#html
[column_format]: column-formats.md
[column_format_matchers]: column-formats.md#matchers
[schemas_identity]: ../advanced/schemas.md#schema-identity
[data_types_objects]: ../basics/data-types.md#objects
[samples]: ../../samples/topic/card.md
