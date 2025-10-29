---
nav: Schema changes
description: Update your schemas to include the metadata needed for indexing.
---

# Enrich the schema for indexing

A sync table's schema defines the resulting columns and their types, along with other metadata required by the sync engine. To index that content in the knowledge layer, additional metadata must be provided in the schema.

At a minimum, the schema must specify:

- The title property, via `titleProperty`
- The link property, via `linkProperty`

Additional fields allow for better index tuning. Most schemas should set:

- The properties to split into chunks, via `index.properties`
- The properties to replicate in each chunk, via `index.contextProperties`
- The properties to use to filter results, via `index.filterableProperties`

See the sections below for more information.


## Title property

Set `titleProperty` to the property that contains the title of the record. This property is indexed and displayed to the user when the LLM provides a citation.

<!-- TODO: Screenshot -->

Often, the same property is used for both `displayProperty` and `titleProperty`. However, these may differ for records with both a short and a long identifier, with the former preferred for `displayProperty` and the latter preferred for `titleProperty`.

```{.ts hl_lines="9"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    sku: { type: coda.ValueType.String },
    name: { type: coda.ValueType.String },
  },
  idProperty: "id",
  displayProperty: "sku",
  titleProperty: "name",
});
```


## Link property

Set `linkProperty` to the property that contains the user-visible link to the record. This link will be used by the LLM when creating citations to the record.

<!-- TODO: Screenshot -->

The property should contain a deep link to the record in the source application, which a user can open in their browser.

```{.ts hl_lines="7"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    link: { type: coda.ValueType.String, codaType: coda.ValueHintType.Url },
  },
  // ...
  linkProperty: "link",
});
```


## Properties to index

Optionally set `index.properties` to the list of properties that contain long-form text that should be indexed for the record. These are typically properties such as descriptions, notes, and message bodies. The content of these properties will be broken down into smaller chunks for retrieval and usage by the LLM.

```{.ts hl_lines="10-12"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    description: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Html,
    },
  },
  // ...
  index: {
    properties: ["description"],
  },
});
```

Using the example above, a single row could be split into multiple chunks, each containing part of the description and a copy of the name.

<!-- TODO: Diagram -->

How a long piece of text is split into chunks is dynamic and can vary, but in general, each chunk contains a paragraph or two.


### Indexing file content

In addition to text, you can index binary content in files as well. The following file types are supported:

- Plain Text (`text/plain`)
- HTML (`text/html`)
- Markdown (`text/markdown`)
- PDF (`application/pdf`)
- Microsoft Word (`application/msword` and <nobr>`application/vnd.openxmlformats-officedocument.wordprocessingml.document`</nobr>)
- Rich Text Format (`application/rtf`)

To index binary content, add to`index.properties` the `Attachment` property containing the link to the file.

```{.ts hl_lines="12"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    specSheetLink: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Attachment,
      description: "Link the PDF spec sheet for the product.",
    },
  },
  // ...
  index: {
    properties: ["specSheetLink"],
  },
});
```

!!! info "Temporary blob storage required"

    Even if the original file URL is publicly accessible, you must store the contents in [temporary blob storage][temporary_blob_storage] and return those URLs in your Pack.


## Context properties

Optionally set `index.contextProperties` to a list of properties that contain short-form text that should be duplicated in each chunk of indexed text. Context properties help with retrieval, increasing the likelihood that the LLM will find the desired records.

Select properties of type `String`. If you select a property of type `Array<String>`, it will be flattened into a string, comma-separated. You can use [property paths](https://coda.io/packs/build/latest/guides/advanced/schemas/#property-paths) to reference data in nested objects.

The `titleProperty` will automatically be included as a context property in each chunk.

```{.ts hl_lines="22"}
const ManufacturerSchema = coda.makeObjectSchema({
  properties: {
    name: { type: coda.ValueType.String },
    id: { type: coda.ValueType.String },
  },
  displayProperty: "name",
});

const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    size: { type: coda.ValueType.String },
    materials: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    manufacturer: ManufacturerSchema,
  },
  // ...
  index: {
    // ...
    contextProperties: ["size", "materials", "manufacturer.name" ],
  },
});
```

!!! tip "Tips for selecting context properties"

    - Include properties that are likely to include search terms from a user query
    - Don’t include properties that can contain a lot of text (instead, add those to `index.properties`)
    - Aim for at most 3-5 context properties


## Filterable properties

Optionally set `index.filterableProperties` to a list of properties that contain simple values that can be used to filter the list of records. Currently, this is limited to a maximum of five (5) properties per schema. Only the following types of properties can be used as filterable properties:

- `String`
- `Number` (values rounded to integers)
- `Boolean`
- `Object` of type `Person` ([learn more][people])
- `Array` of `String`, `Number`, or `Person` object

```{.ts hl_lines="10"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    category: { type: coda.ValueType.String },
    rating: { type: coda.ValueType.Number },
  },
  // ...
  index: {
    // ...
    filterableProperties: ["category", "rating"],
  },
});
```

## Additional semantic properties

To help with filtering and ranking, set the following fields in your schema, if possible.

| Field | Description | Supported types |
| --- | --- | --- |
| <nobr>`createdAtProperty`</nobr>  | The property containing the date the record was created. | Date, DateTime |
| <nobr>`createdByProperty`</nobr>  | The property containing the person who created the record. | Email, Person |
| <nobr>`modifiedAtProperty`</nobr>  | The property containing the date the record was last modified. | Date, DateTime |
| <nobr>`modifiedByProperty`</nobr>  | The property containing the person who last modified the record. | Email, Person |


## Property descriptions

Ensure each property has an informative description that provides relevant context to help the LLM interpret the meaning of that column.

```{.ts hl_lines="6-9"}
const ProductSchema = coda.makeObjectSchema({
  properties: {
    // ...
    rmaRequired: {
      type: coda.ValueType.Boolean,
      description: `
        True if the product requires an RMA (Return Merchandise Authorization)
        before a refund can be issued.
      `,
    },
  },
});
```

In addition to helping the LLM, these descriptions will be shown to users in the Coda Formula Language editor and as initial values for column descriptions. See the [Schemas guide][schemas] for more information.

## Schema descriptions

Schemas themselves can have descriptions, helping the LLM understand what the record represents. While they aren't as necessary for regular sync tables, it's helpful to use them with [dynamic sync tables][dynamic_sync_tables], where the semantic meaning of the schema can vary.

```{.ts hl_lines="5"}
getSchema: async function (context) {
  let reportUrl = context.sync.dynamicUrl;
  let report = await getReportInfo(context, reportUrl);
  return coda.makeObjectSchema({
    description: report.description,
    // ...
  });
},
```

## Known limitations

### Reference properties not resolved

`Reference` properties are not resolved during indexing, meaning they don’t link up to the whole record in the foreign table. If you are building an agent from scratch, avoid using them.

If you are upgrading an existing Pack, you’ll need to denormalize any data you want to use in either `contextProperties` or `filterableProperties`. For example, adding a `projectName` property alongside the existing `project` reference property.


[temporary_blob_storage]: ../../reference/sdk/interfaces/core.TemporaryBlobStorage.md
[people]: ../../guides/basics/data-types.md#people
[schemas]: ../../guides/advanced/schemas.md
[dynamic_sync_tables]: ../../guides/blocks/sync-tables/dynamic.md
