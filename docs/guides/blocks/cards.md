---
nav: Cards 🚧
description: Display structured information as rich cards.
---

# Preview content with rich cards

!!! warning "Limited beta"
    This feature is currently only available to a limited group of beta testers.

Pack formulas can return structured data as [objects][data_types_objects], allowing a single call to return a variety of related information. By default these objects are presented as "mentions", shown as chips in the document that you can hover over to get the full set of information.

<img src="../../../images/cards_demo_mention.png" srcset="../../../images/cards_demo_mention_2x.png 2x" alt="Schema shown as a mention">

Cards are an alternative, more visual display format for objects that allow the user to easily consume key information. Additionally URLs pasted into a document can be automatically shown as cards, providing an easy way for users to discover and use your Pack.

<img src="../../../images/cards_demo_card.png" srcset="../../../images/cards_demo_card_2x.png 2x" alt="Schema shown as a card">

[View Sample Code][samples]{ .md-button }


## Using cards

Cards are shown as distinct type of building block, but any formula returning a compatible object can be displayed as a card. It will also be shown as an option for [matching links](#display).

=== "Pack side panel"
    <img src="../../../images/cards_use_side_panel.png" srcset="../../../images/cards_use_side_panel_2x.png 2x" class="screenshot" alt="Cards shown in the Pack side panel">
=== "Object menu"
    <img src="../../../images/cards_use_display_as.png" srcset="../../../images/cards_use_display_as_2x.png 2x" class="screenshot" alt="Changing a mention to show as a card in the display as menu">
=== "Link menu"
    <img src="../../../images/cards_link_installed.png" srcset="../../../images/cards_link_installed_2x.png 2x" class="screenshot" alt="Changing a mention to show as a card in the display as menu">
=== "Link menu (Pack not installed)"
    <img src="../../../images/cards_link_prompt.png" srcset="../../../images/cards_link_prompt_2x.png 2x" class="screenshot" alt="Changing a mention to show as a card in the display as menu">



## Creating cards

Although they appear as a separate type of building block, cards are really just an alternative display format for [formulas][formulas] that return structured data. Your formula will appear as a card if it returns an [object schema][schemas_object] that fulfills all of the following:

--8<-- "guides/advanced/.card_schema.md"

See the sections below for how to configure specific attributes of the card.

??? example "Example: Weather card"
    ```ts
    --8<-- "samples/packs/card/weather.ts"
    ```


### Title

The card's title appears at the top of the card, and is required.

<img src="../../../images/cards_parts_title.png" srcset="../../../images/cards_parts_title_2x.png 2x" alt="The card's title">

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

<img src="../../../images/cards_parts_subtitle.png" srcset="../../../images/cards_parts_subtitle_2x.png 2x" alt="The card's subtitle">

The properties displayed in the subtitle are determined via the `subtitleProperties` field of the schema, which lists the subset of properties to show and the order to show them.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    quantity: { type: coda.ValueType.Number },
    price: {
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
    },
  },
  // ...
  subtitleProperties: ["quantity", "price"],
});
```

The subtitle shows a label for each property, which defaults to `{Name}: {Value}`. You can customize the label for a property, such as removing the property name, in the property definition. See the [Schemas guide][schemas_property_labels] for more information.


### Body

The card body can include a snippet of content, which appears under the title (and subtitle if defined).

<img src="../../../images/cards_parts_snippet.png" srcset="../../../images/cards_parts_snippet_2x.png 2x" alt="The card's body">

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

<img src="../../../images/cards_parts_image.png" srcset="../../../images/cards_parts_image_2x.png 2x" alt="The card's image">

Which property's content to use for the image is defined by the field `imageProperty`, and it can only refer to properties of type `String` with a hint of  `ImageReference`.
<!-- TODO(spencer): Include ImageAttachment above once the post-processing work is complete. -->

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    photo: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
  },
  // ...
  imageProperty: "photo",
});
```

!!! info "Creating custom images"
    Images can make cards much more appealing, but sometimes the API you are calling does not include a relevant image for the resource. In those cases you can add a custom image to the object, for example a generic icon. [SVG data URIs][images_svg] can be a simple way to serve those images without needing a separate server to host them.


### Link

The card can include a link, which will be opened when the card is clicked. The domain of the link is also shown at the bottom of the card.

<img src="../../../images/cards_parts_link.png" srcset="../../../images/cards_parts_link_2x.png 2x" alt="The card's link">

Which property's content to use for the link is defined by the field `linkProperty`, and it can only refer to properties of type `String` with a hint of `Url`.

```ts
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    websiteLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
  },
  // ...
  linkProperty: "websiteLink",
});
```


## Display a link as a card {: #display}

One of the most common uses for cards is to display information about an item from an external application, usually identified by a URL. For example, the Slack Pack's contains a `Message` card takes in a message URL and displays the text, author, etc.

To make it easier to discover these cards, when a user pastes a link into a doc Coda will show a list of compatible Packs. Clicking one of these will install the Pack and display the link as a card.

<img src="../../../images/cards_link_prompt.png" srcset="../../../images/cards_link_prompt_2x.png 2x" class="screenshot" alt="Dialog showing cards that can be used to display a link">

!!! info "Built-in card option"
    The link "Display as" menu may include an option for "Card", which displays a fix set of metadata for public URLs. This is distinct from Pack cards, which are shown as additional options below that.

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
  name: "Product",
  formulaName: "Product",
  matchers: [
    new RegExp("^https://example.com/products/[A-Z0-9]+$"),
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
[data_types_objects]: ../basics/data-types.md#objects
[samples]: ../../samples/topic/card.md
[images_svg]: ../advanced/images.md#svg-images
