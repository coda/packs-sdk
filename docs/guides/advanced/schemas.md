---
nav: Schemas
description: Design schemas to represent rich data, for use in formulas and sync tables.
---

# Structuring data with schemas

To return structured data in a Pack you must first define the shape of that data using a schema. Schemas describe the type of data that will be returned, as well as metadata about how Coda should render it, but not the data itself. Pack formulas and sync tables specify which schema they are using and return data that matches it.

[View Sample Code][samples]{ .md-button }


## Using schemas

When building a Pack there are a few times when you need to specify a schema.


### Object return types

Formulas that return an `Object` value must specify an object schema that defines the properties of the object. It is specified in the `schema` field of the formula definition.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: MySchema,
  // ...
});
```

See the [Data types guide][data_types_objects] for more information on object values.


### Array return types

Formulas that return an `Array` value must specify a schema that defines the items in the array. It is specified in the `items` field of the formula definition.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.Array,
  items: MySchema,
  // ...
});
```

## Creating schemas

Schemas are created using the [`makeSchema`][makeSchema] method.

```ts
let NumberSchema = coda.makeSchema({
  type: coda.ValueType.Number,
});
```

When defining a schema for the `Object` value type, use the more specific [`makeObjectSchema`][makeObjectSchema] method. The `type` field can be omitted, since the type must be `Object`.

```ts
let MySchema = coda.makeObjectSchema({
  properties: {
    name: {type: coda.ValueType.String},
  },
  displayProperty: "name",
});
```

Schemas can also be declared inline in the formula or sync table where they are used.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.Number,
  }),
  // ...
});
```

!!! tip
    We recommend against defining object schemas inline, as they can get quite long and are likely to be reused within the Pack.


## Data types

The primary role of a schema is to define the type of data that will be returned. This is done by specifying a value type and optionally a value hint. The value type corresponds to the JavaScript type that will be returned, and the value hint indicates how Coda should interpret that value. These are set using the `type` and `codaType` field respectively.

```ts
let DateSchema = coda.makeSchema({
  type: coda.ValueType.String,
  codaType: coda.ValueHintType.Date,
});
```

See the [Data types guide][data_types] for more information about the supported value types and value hints.


## Object schemas {: #object}

The most common form of schema you'll need to define are object schemas. They are often used to bundle together multiple pieces of data returned by an API.


### Properties

The individual properties of the object are defined using the `properties` field of the schema. It contains a set of key value/pairs, where the key is the name of the property and the value is a schema describing the property.

```ts
let PersonSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    born: { type: coda.ValueType.String, codaType: coda.ValueHintType.Date },
    age: { type: coda.ValueType.Number },
  },
  // ...
});
```

Object schema properties can themselves contain other object schemas, allowing complex nesting of structured data.

```ts
let MovieSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    year: { type: coda.ValueType.Number },
    director: PersonSchema,
    actors: {
      type: coda.ValueType.Array,
      items: PersonSchema,
    },
  },
  // ...
});
```

By default all properties are considered optional, but you can add `required: true` to the property's schema to indicate that the property is required. This adds some type checking to help ensure that formulas return all the required properties, but it cannot catch all cases.


### Object mapping

When a formula or sync table returns an object, only the fields matching the properties defined in the schema are retained, and all others are discarded. The simplest approach is to define a schema where the property names are the same as the fields returned by the API.

```ts
let LocationSchema = coda.makeObjectSchema({
  properties: {
    // These names match exactly what the API returns.
    latDeg: { type: coda.ValueType.Number },
    longDeg: { type: coda.ValueType.Number },
  },
  // ...
});

pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: LocationSchema,
  execute: async function([], context) {
    let location = await fetchLocationFromAPI(context);
    // Return the API response as-is.
    return location;
  },
});
```

However sometimes the names in the API aren't the most user-friendly, and it would be nicer to use a different name in your Pack. To do so, give your property a better name and then use the `fromKey` field of the schema to map it back to the API response.

```ts
let LocationSchema = coda.makeObjectSchema({
  properties: {
    // These are custom names, mapped to the API response using "fromKey".
    latitude: { type: coda.ValueType.Number, fromKey: "latDeg" },
    longitude: { type: coda.ValueType.Number, fromKey: "longDeg" },
  },
  // ...
});

pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: LocationSchema,
  execute: async function([], context) {
    let location = await fetchLocationFromAPI(context);
    // Return the API response as-is.
    return location;
  },
});
```

??? "Using `fromKey` with existing schemas"
    When mapping a response field to an existing schema, it isn't clear where to put the `fromKey` field. The best approach is to use the [spread operator (`...`)][mdn_spread_object] to copy the schema and then add on the `fromKey` field.

    ```ts
    let PersonSchema = coda.makeObjectSchema({
      // ...
    });

    let MovieSchema = coda.makeObjectSchema({
      properties: {
        director: {
          ...PersonSchema,
          fromKey: "director_info",
        },
        // ...
      },
      // ...
    });
    ```

The `fromKey` field works for simple renaming, but doesn't handle more complex cases such as pulling up a nested field. A more flexible approach is to rearrange the data from the API before you return it to ensure it matches the schema.

```ts
let LocationSchema = coda.makeObjectSchema({
  properties: {
    // These are custom names.
    latitude: { type: coda.ValueType.Number },
    longitude: { type: coda.ValueType.Number },
  },
  // ...
});

pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: LocationSchema,
  execute: async function([], context) {
    let location = await fetchLocationFromAPI(context);
    // Return a new object that matches the schema.
    return {
      latitude: location.latDeg,
      longitude: location.longDeg,
    };
  },
});
```


### Display value {: #display}

Object schemas must define what value should be displayed within the chip when it is rendered in the doc. This is done by setting the `displayProperty` field to the name of the property containing the value to display.

```ts
let MovieSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    // ...
  },
  displayProperty: "title",
  // ...
});
```

You can select any property to use as the display value, although usually a name or title is best. Some APIs may not return a suitable display value, and you may have to create a new property for that purpose.

Consider an API that returns locations with a separate `city` and `state` field. Neither of those alone is a very great display value, but you could combine them together to create one.

```ts
let LocationSchema = coda.makeObjectSchema({
properties: {
    city: { type: coda.ValueType.String },
    state: { type: coda.ValueType.String },
    // Add an additional property to use as the display value.
    display: { type: coda.ValueType.String },
    // ...
  },
  displayProperty: "display",
  // ...
});

pack.addFormula({
  // ...
  resultType: coda.ValueType.Object,
  schema: LocationSchema,
  execute: async function([], context) {
    let location = await fetchLocationFromAPI(context);
    return {
      city: location.city,
      state: location.state,
      // Populate the display value using data from the API.
      display: location.city + ", " + location.state,
    },
  },
});
```


### Property name normalization {: #normalization}

To ensure compatibility with the Coda Formula Language and consistency across Packs, all property names are normalized to a standard format before they are shown to the user. This process removes all punctuation and whitespace and reformats the name to upper camel case (AKA PascalCase). For example, `fooBar`, `foo_bar`, and `foo bar` will all be normalized to `FooBar`. This normalization happens after your Pack is run, and you should refer to the non-normalized property names throughout your code.

The normalized name of a property is shown in the formula editor, but it also impacts the display name of that property elsewhere in the doc. In the hover dialog and in sync table columns the normalized name is again converted, this time from upper camel case to space-separated. For example, the normalized property `FooBar` will be displayed as "Foo Bar".


### Data attribution {: #attribution}

The terms of service for some APIs require you to provide visual attribution when you display their data. This can be accommodated in Packs using the `attribution` field of the schema. You can include a mix of text, links, and images which will be displayed when the user hovers over the object's chip.

```ts
let TaskSchema = coda.makeObjectSchema({
  // ...
  attribution: [
    {
      type: coda.AttributionNodeType.Text,
      text: "Provided by Todoist",
    },
    {
      type: coda.AttributionNodeType.Link,
      anchorText: "todoist.com",
      anchorUrl: "https://todoist.com",
    },
    {
      type: coda.AttributionNodeType.Image,
      imageUrl: "https://todoist.com/favicon.ico",
      anchorUrl: "https://todoist.com",
    },
  ],
});
```

<img src="../../../images/schemas_attribution.png" srcset="../../../images/schemas_attribution_2x.png 2x" class="screenshot" alt="How attribution is displayed on hover">


## Schemas in sync tables

The columns of a sync table are defined using an object schema. When used in a sync table there are additional fields that you have to set or may want to set.


### Row identifier

Object schemas used in a sync table must specify which property value should be used as a unique identifier for that row. This ID is needed by the syncing logic to ensure that rows are added, updated, and removed correctly. The ID only needs to be unique within that sync table.

Similar to the [display value](#display-value), this is done by setting the `idProperty` field to the name of the property containing the unique identifier.

```ts
let MovieSchema = coda.makeObjectSchema({
  properties: {
    movieId: { type: coda.ValueType.String },
    // ...
  },
  idProperty: "movieId",
  // ...
});
```

!!! tip
    Avoid using the property name `id` in your schema, and instead prefer the pattern `{thing}Id`. Sync tables come with an internal "ID" field, and if you have an `id` property in your schema, when added as a column in the table it will have the name **ID 1**, which can be confusing to users.


### Schema identity

Sync tables have an `identityName` field which defines the [unique identifier][sync_tables_identity] for that table, and a schema that defines the shape of the data in each row. In some cases you need to set the identity name of the sync table in the schema itself:

- Manually constructing a [reference schema](#references).
- Returning an object schema in an action formula to [approximate two-way sync][sync_tables_actions].

This can be done by adding an `identity` to your schema and setting its `name` field.

```ts
let MovieSchema = coda.makeObjectSchema({
  // ...
  identity: {
    name: "Movie",
  },
});
```

Alternatively, you can use the helper function `coda.withIdentity()` to make a copy of the schema with the identity set. This can allow for better reuse of schemas across your Pack.

```ts
let MovieSchema = coda.makeObjectSchema({
  // ...
});

pack.addFormula({
  name: "UpdateMovie",
  description: "Update the movie details.",
  resultType: coda.ValueType.Object,
  schema: coda.withIdentity(MovieSchema, "Movie"),
  //...
});
```


### Featured columns

By default a sync table will only contain one column, containing a chip with the synced object. When viewing the hover card for the object, users can click the **Add column** button to create a new column from any property. Alternatively, they can manually create new columns and use the formula editor to reference a property of the synced object.

You can specify additional default columns by setting the `featuredProperties` field of the schema. This field should contain the names of the properties that should be given their own columns when the sync table is created.

```ts
let MovieSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    year: { type: coda.ValueType.Number },
    director: PersonSchema,
    actors: {
      type: coda.ValueType.Array,
      items: PersonSchema,
    },
  },
  // When creating the sync table, automatically add columns for these fields.
  featuredProperties: ["director", "actors"],
  // ...
});
```

!!! tip
    Select a small but meaningful set of featured columns for your sync tables. Too few and users may not know what data is available, and too many could be overwhelming.


### Reference schemas {: #references}

Reference schemas are used by sync tables to create relations between tables. See the [Sync tables guide][sync_tables_references] for more information on how row references work.

The simplest way to create a reference schema is to use the helper function [`makeReferenceSchemaFromObjectSchema`][makeReferenceSchemaFromObjectSchema]. Simply pass in the full schema and sync table's `identityName` and it will be converted to a reference schema.

```ts
let PersonReferenceSchema =
    coda.makeReferenceSchemaFromObjectSchema(PersonSchema, "Person");
```

In some instances you may have to create the reference schema manually however, like when you want a row to be able to reference other rows in the same table. A reference schema is an object schema with the `codaType` field set to `Reference`. It must specify both an `idProperty` and `displayProperty`, and those properties must be marked as `required`. It must also have an `identity` set, with the name matching the `identityName` of the target sync table.

```ts
let PersonReferenceSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Reference,
  properties: {
    name: { type: coda.ValueType.String, required: true },
    personId: { type: coda.ValueType.String, required: true },
    // Other properties can be omitted.
  },
  displayProperty: "name",
  idProperty: "personId",
  identity: {
    name: "Person",
  },
});
```

You can then use the reference schema in other sync table schemas in your Pack.

```ts
let MovieSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    year: { type: coda.ValueType.Number },
    director: PersonReferenceSchema,
    actors: {
      type: coda.ValueType.Array,
      items: PersonReferenceSchema,
    },
  },
  // ...
});
```

In your sync formula you only need to populate the fields of the reference object corresponding to the `idProperty` and `displayProperty` fields. If your API only returns the ID of the referenced item, you can set the display value to "Not found" or something equivalent, as this value will only be shown when the referenced row hasn't been synced yet.

!!! warning
    Reference schemas are only resolved to rows when they are used in a sync table. If used in a formula or column format they will always appear in a broken state, even if the row they are referencing is present.


## Schemas in cards {: #cards}

The contents of a card are defined using an object schema. The following fields are specific to cards:

- [`titleProperty`][titleProperty]
- [`subtitleProperties`][subtitleProperties]
- [`snippetProperty`][snippetProperty]
- [`linkProperty`][linkProperty]
- [`imageProperty`][imageProperty]

To be eligible to be displayed as a card, the schemas must meet all of the following criteria:

--8<-- "guides/advanced/.card_schema.md"

Read the [Cards guide][cards] for more information on how these fields are used.


### Property labels {: #labels}

A card's subtitle contains a set of properties, joined with a separator. Unlike other areas of the card where only the property's value is shown, in the subtitle a label is shown as well. By default, the label and value are shown together as `{label}: {value}`.

```ts
let MovieSchema = coda.makeObjectSchema({
  // ...
  subtitleProperties: ["director", "year", "rating"],
});
```

<img src="../../../images/schemas_labels_default.png" srcset="../../../images/schemas_labels_default_2x.png 2x" class="screenshot" alt="Default labels for subtitle properties">

However, there are times when the default label isn't a great fit. For instance you may want to put the property name after the value (`10 bugs` instead of `Bugs: 10`) or remove the label completely (`P1` instead of `Priority: P1`).

To customize the label, when specifying the `subtitleProperties` pass a [`PropertyIdentifierDetails`][PropertyIdentifierDetails] object instead of a string. Set the `property` field to the path of the property (what the string value normally contains) and set the `label` field to the template string to use for the label.

There are three options for setting the label:

1.  Pass a string which will be used as an alternative label.
1.  Pass a string containing the constant [`PropertyLabelValueTemplate`][PropertyLabelValueTemplate], which acts as a placeholder for where the property's value should be inserted.
1.  Pass an empty string, which will remove the label completely.

```ts
let MovieSchema = coda.makeObjectSchema({
  // ...
  subtitleProperties: [
    "director",
    // Fully customize the label for the year property.
    { property: "year", label: `Released in ${coda.PropertyLabelValueTemplate}` },
    // Only show the value of the rating property.
    { property: "rating", label: "" },
  ],
});
```

<img src="../../../images/schemas_labels_custom.png" srcset="../../../images/schemas_labels_custom_2x.png 2x" class="screenshot" alt="Custom labels for subtitle properties">


### Property placeholders

When a property used in a card doesn't have a value set the corresponding section of the card is hidden. For example, an empty subtitle property will not render any label or value in the card's subtitle. However there are cases where you may want to show some default or fallback value to the user instead. While these default values could be injected in your formula code, you can simplify the process by specifying a placeholder value in the schema.

To do so, use a [`PropertyIdentifierDetails`][PropertyIdentifierDetails] object to specify the property to use and set the `placeholder` field to the default / fallback value to display when the property is empty.

```ts
let MovieSchema = coda.makeObjectSchema({
  // ...
  subtitleProperties: [
    "director",
    { property: "year", placeholder: "In production" },
    { property: "rating", placeholder: "TBD" },
  ],
});
```

<img src="../../../images/schemas_placeholders.png" srcset="../../../images/schemas_placeholders_2x.png 2x" class="screenshot" alt="Placeholders for subtitle properties">

A property will be considered empty and fallback to the placeholder when it's value is one of the following: `null`, `undefined`, `""`, `[]`, `{}`. The placeholder is only used to render the card, and when using the Coda Formula Language to access the property it will still return the original value. Placeholders are currently only supported on the following fields:

- [`titleProperty`][titleProperty]
- [`subtitleProperties`][subtitleProperties]
- [`snippetProperty`][snippetProperty]


## Property paths

Object schema fields that expect a property name (`titleProperty`, `snippetProperty`, etc) also accept a path to a property on a nested object. The paths are specified using a subset of the [JSONPath syntax][jsonpath], which at it's simplest just joins the property names with a dot (like `property1.property2`).

!!! warning "Only supported for card fields"
    At the moment property paths can only be used in the object [schema fields used by cards](#cards).
    <!-- TODO(spencer): Remove this warning when support has been added for the other fields. -->

Consider the following schema for a movie:

```ts
let PersonSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    // ...
  },
});

let MovieSchema = coda.makeObjectSchema({
  properties: {
    director: PersonSchema,
    actors: {
      type: coda.ValueType.Array,
      items: PersonSchema,
    },
    // ...
  },
});
```

The following property Paths are all valid:

- `director.name` - The name of the director.
- `actors[0].name` - The name of the first actor.
- `actors[*].name` - The names of all of the actors (comma separated).

If you need to further customize the value, such as combining the value of multiple properties or doing some other transformation, you'll need to create a new property to hold that value and manually populate it in your `execute` function. See the [Display value](#display) for an example of this.

!!! info "Set property labels in card subtitle"
    When using property paths to specify a card's subtitle, it's recommended that you manually set the [labels for those properties](#labels). Coda will generate a label based off of the property path, but the result is often not desirable.

    ```
    let MovieSchema = coda.makeObjectSchema({
      // ...
      subtitleProperties: [
        { property: "director.name", label: "Director" },
      ],
    });
    ```



[samples]: ../../samples/topic/schema.md
[data_types]: ../basics/data-types.md
[sync_tables]: ../blocks/sync-tables/index.md
[makeSchema]: ../../reference/sdk/functions/core.makeSchema.md
[makeObjectSchema]: ../../reference/sdk/functions/core.makeObjectSchema.md
[sync_tables_identity]: ../blocks/sync-tables/index.md#identity
[todoist]: ../../samples/full/todoist.md
[makeReferenceSchemaFromObjectSchema]: ../../reference/sdk/functions/core.makeReferenceSchemaFromObjectSchema.md
[sync_tables_references]: ../blocks/sync-tables/index.md#references
[data_types_objects]: ../basics/data-types.md#objects
[mdn_spread_object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals
[sync_tables_actions]: ../blocks/sync-tables/index.md#actions
[cards]: ../blocks/cards.md
[PropertyIdentifierDetails]: ../../reference/sdk/interfaces/core.PropertyIdentifierDetails.md
[PropertyLabelValueTemplate]: ../../reference/sdk/variables/core.PropertyLabelValueTemplate.md
[titleProperty]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#titleproperty
[subtitleProperties]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#subtitleproperties
[snippetProperty]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#snippetproperty
[linkProperty]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#linkproperty
[imageProperty]: ../../reference/sdk/interfaces/core.ObjectSchemaDefinition.md#imageproperty
[jsonpath]: https://goessner.net/articles/JsonPath/index.html
