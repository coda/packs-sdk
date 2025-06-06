---
nav: Dynamic sync tables
description: Build advanced sync tables that adapt to dynamic data sources.
---

# Creating sync tables with dynamic schemas

Sync tables are designed to bring records from an external data source into Coda, but sometimes those records don't have a predefined structure. For example, a task tracking application may allow each project to define its own set of custom fields. To bring this type of data into Coda you can create a dynamic sync table, which allows the columns in the table to adapt to the dataset that is being synced.

[View Sample Code][samples]{ .md-button }


## Using dynamic sync tables

Adding a dynamic sync table to a doc is similar to adding a regular sync table, but with an additional step of selecting the specific dataset to sync from. Start by navigating to {{ coda.pack_panel_clicks }} and clicking on the the table in the side panel. This will expand a section below the table that displays the specific datasets that the user has access to. Then drag one of these datasets onto the page.

<video style="width:auto" loop muted autoplay alt="Recording of adding a dynamic sync table." class="screenshot"><source src="../../../../images/dynamic_sync_table_usage.mp4" type="video/mp4"></source></video>


## Creating a dynamic sync table

Creating a dynamic sync table can be a bit of an involved process, and it requires an in-depth understanding of the target API and [sync table schemas][schemas_sync_table]. The sections below cover the components of a dynamic sync table definition.


### Define the table

The dynamic sync table is defined using the [`addDynamicSyncTable()`][addDynamicSyncTable] method. The `name` is user visible and should follow the [naming conventions][sync_tables_naming] of regular sync tables. The `description` is not required but recommended. An `identityName` is required, and defines the [identity][sync_tables_identity] of the table.

```ts
pack.addDynamicSyncTable({
  name: "Tasks",
  description: "The tasks in the selected project.",
  identityName: "Task",
  listDynamicUrls: async function (context) {
    // Return the datasets the user has access to.
    // ...
  },
  getName: async function (context) {
    // Return the name of the selected dataset.
    // ...
  },
  getDisplayUrl: async function (context) {
    // Return a display URL for the selected dataset.
    // ...
  },
  getSchema: async function (context) {
    // Return a schema for the selected dataset.
    // ...
  },
  formula: {
    // Sync the rows from the dataset.
    // ...
  },
});
```

More information the the various components of the dynamic sync table are described in the sections below.


### Generate the list of datasets

The [`listDynamicUrls`][listDynamicUrls] function is responsible for generating the list of datasets that the user can select from. Each dataset is represented by a unique URL, known as the dynamic URL. This list is typically generated by querying an external API using a connected account.

The function should return an array of [`MetadataFormulaObjectResultType`][MetadataFormulaObjectResultType] objects. The `display` field should be set to the user-facing name of the dataset, and the `value` field to its URL.

```ts
pack.addDynamicSyncTable({
  // ...
  listDynamicUrls: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.example.com/projects",
    });
    let projects = response.body.items;
    let results = [];
    for (let project of projects) {
      results.push({
        display: project.name,
        value: project.links.self,
      });
    }
    return results;
  },
  // ...
});
```

You can choose any URL to represent the dataset, and is not directly exposed to the user. Most Packs choose an API endpoint URL for ease of development, but you could also select a more user-friendly URL. The URL shown to users is generated using the [`getDisplayUrl`](#display-url) method.

The selected URL is made available to all further methods via [`context.sync.dynamicUrl`][dynamicUrl].


### Generate the table name

The [`getName`][getName] function is responsible for generating the user-visible name of the sync table based on the dataset selected. The resulting value is used as the title shown above the sync table after it is added to the document.  This differs from the `name` field of the dynamic sync table definition, which is shown in the Pack side panel to identify the type of table.

```ts
pack.addDynamicSyncTable({
  // ...
  getName: async function (context) {
    let projectUrl = context.sync.dynamicUrl;
    let response = await context.fetcher.fetch({
      method: "GET",
      url: projectUrl,
    });
    let project = response.body;
    return project.name + " Tasks";
  },
  // ...
});
```


### Generate the display URL {: #display-url}

The [`getDisplayUrl`][getDisplayUrl] function is responsible for generating the user-facing version of the dynamic URL. If the URL you selected to represent the dataset is already user friendly (it will open in their browser) then you can return it as-is. However if you chose to use an API-specific URL as the dynamic URL, this function should translate that into something more useful. This is typically done by making an API request to retrieve a user-facing URL.

```ts
pack.addDynamicSyncTable({
  // ...
  getDisplayUrl: async function (context) {
    let projectUrl = context.sync.dynamicUrl;
    let response = await context.fetcher.fetch({
      method: "GET",
      url: projectUrl,
    });
    let project = response.body;
    return project.links.web;
  },
  // ...
});
```


### Generate the row schema {:. #get-schema}

The [`getSchema`][getSchema] function is responsible for generating the schema that represents each row of the sync table. Unlike regular sync tables that can define their sync table at build time, the schema for a dynamic sync table must be generated at run-time based on the dataset selected. The function is first run when the user drags the sync table into the document, and then again before every sync.

In order to generate the schema you must have a way of determining the shape of the data for the selected dataset. Some APIs provide endpoints that allow you to query metadata about a dataset, such as which fields are available and what type of data they contain. Alternatively you can query the first row of data and infer this information based on the results.

```ts
pack.addDynamicSyncTable({
  // ...
  getSchema: async function (context) {
    let projectUrl = context.sync.dynamicUrl;

    // Fetch information about the custom fields available for the selected
    // project.
    let response = await context.fetcher.fetch({
      method: "GET",
      url: projectUrl + "/metadata",
    });
    let projectMetadata = response.body;

    // Start with the properties are the same regardless of the which project
    // was selected.
    let properties: coda.ObjectSchemaProperties = {
      name: { type: coda.ValueType.String },
      id: { type: coda.ValueType.String },
    };
    // Use them as the display value and ID of the rows.
    let displayProperty = "name";
    let idProperty = "id";

    // For each custom field defined in the project, add a property to the
    // schema.
    let featuredProperties = [];
    for (let customField of projectMetadata.customFields) {
      // Generate a property name for the custom field.
      let name = getPropertyName(customField);
      // Generate a schema for the field and add it to the set of properties.
      properties[name] = getPropertySchema(customField);
      // Mark the property as featured (included in the table by default).
      featuredProperties.push(name);
    }

    // Return the schema for each row.
    return coda.makeObjectSchema({
      properties: properties,
      displayProperty: displayProperty,
      idProperty: idProperty,
      featuredProperties: featuredProperties,
    });
  },
  // ...
});
```

The schema you generate must have all of the same fields as those used in a regular sync table, such as `properties`, `idProperty`, and `displayProperty`. More information about generating the property names and schemas are covered below.


### Write the sync formula

All of the code discussed in the previous steps are used to generate metadata about the sync table, but in order to populate it with data you must also include a sync formula. Like regular sync tables, this formula's `execute` function is responsible for fetching rows from the dataset and transforming them to match the schema.

```ts
pack.addDynamicSyncTable({
  // ...
  formula: {
    name: "SyncTasks",
    description: "Sync tasks in a project.",
    parameters: [],
    execute: async function ([], context) {
      let projectUrl = context.sync.dynamicUrl;

      let response = await context.fetcher.fetch({
        method: "GET",
        url: projectUrl + "/tasks",
      });
      let tasks = response.body.items;

      // Reformat each response to match the schema.
      let rows = [];
      for (let task of tasks) {
        // Include the metadata common to all projects.
        let row = {
          name: task.name,
          id: task.id,
        };

        // For each custom field, add it to the row.
        for (let customField of task.customFields) {
          let key = getPropertyKey(customField);
          let value = getPropertyValue(customField);
          row[key] = value;
        }
        rows.push(row);
      }

      return {
        result: rows,
      };
    },
  },
});
```

Since the schema itself is dynamically generated, getting the rows to match that schema becomes more challenging. More information on this topic is [discussed below](#fromKey).


## Property names

When generating the schema for the table you need to determine the name of each property. Usually this is based on the name or title of the corresponding field or column in the dataset. Although the convention for manually defined schemas is to use lower camel case, there are no limitations to the characters you can use in a property name. This means that you don't need to sanitize or convert the names as you build the schema.

It's worth remembering though that Coda will [normalize your property names][schemas_normalization] before exposing them in the Coda formula language. When you click the **Add Column** button for a property in the sync table, that normalized name is then transformed again into a column title. This process can sometimes lead to unexpected results.

For example, if you define a property with the name `GitHub (Beta)`, it will be normalized to `GitHubBeta` in the Coda formula language, and then transformed to `Git Hub Beta` as a column name. Currently it's not possible to override this behavior and manually specify the column name.


## Property schemas

Similar to property names, you must also determine the schema for each property. In many cases this involves a large `switch` statement that translates from the type descriptors in the dataset to the equivalent schemas in Coda. If a given field type doesn't have an equivalent schema in Coda it usually makes sense to fallback to a string.

```ts
function getPropertySchema(
  customField
): coda.Schema & coda.ObjectSchemaProperty {
  // Select the schema type depending on the custom field type.
  switch (customField.type) {
    case "yes_no":
      return { type: coda.ValueType.Boolean };
    case "number":
      return { type: coda.ValueType.Number };
    case "date":
      return {
        type: coda.ValueType.String,
        codaType: coda.ValueHintType.Date,
      };
    default:
      // Default to strings.
      return { type: coda.ValueType.String };
  }
}
```


## Mapping values to the schema {: #fromKey}

Like with all sync tables, the sync formula has the job of fetching the rows from the dataset and formatting them to match the schema. With a dynamic sync table this can be more difficult, since the schema itself was generated dynamically and at an earlier phases of the execution. The row responses may not include the name of each custom field, requiring you to make additional requests to the metadata endpoint and join the data.

An approach that works with some APIs is to leverage the [`fromKey`][fromKey] feature of property schemas. When generating the schema for a property, set `fromKey` to the ID or position of the custom field. Then in the sync formula you can return the data keyed off of that ID or position, without needing to refetch the metadata about the custom field.

Here is a demonstration of this approach, showing some dummy values.

=== "Metadata from API"
    ```json
    {
      "title": "Total Cost",
      "id": "abc123",
      "type": "currency"
    }
    ```
=== "Generated Schema"
    ```ts
    properties: {
      "Total Cost": {
        type: coda.ValueType.Number,
        codaType: coda.ValueHintType.Currency,
        fromKey: "abc123",
      },
      // ...
    },
    ```
=== "Value from API"
    ```json
    {
      "id": "abc123",
      "value": 525,
    }
    ```
=== "Sync Formula Result"
    ```ts
    {
      "abc123": 525,
      // ...
    }
    ```


## Stable identifiers

A sync table schema requires that you set both the `displayProperty` and `idProperty` fields, which determine the display name and unique ID for a row respectively. Some APIs provide predictable values that can serve these roles, like a task object with a consistent `name` and `id` field in addition to a variable number of custom fields. However other datasets may contain only custom fields, and it's not clear which if any of them can be used this way.

There currently isn't a good solution for dealing with datasets without stable, unique IDs for each row. It's possible to use a generated row number, hash, or random string to act as the unique ID, but those aren't guaranteed to remain stable across syncs. Without a stable identifier some of the features of a sync table, such as companion columns and @-references, won't work correctly.


## Parameter access

The `getSchema` function can access the values of the parameters defined in the sync formula, making it possible to adjust the schema based on user input beyond the selection of the dynamic URL. This is done in a using the third parameter to the function, which is a key-value map of parameter names to values. This is similar to the pattern used by [autocomplete functions][autocomplete_parameter].

```ts
pack.addDynamicSyncTable({
  // ...
  getSchema: async function (context, _, { query }) {
    // ...
  },
  formula: {
    // ...
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "query",
        description: "A filter query.",
      }),
    ],
    execute: async function ([query], context) {
      // ...
    },
  },
  // ...
});
```

The `getSchema` function is first run when the table is initially dragged into the document, before any parameter values have been set. Make sure your function can handle the absence of parameter values, even required ones.


## Organize the dataset list {: #folders}

Instead of returning a flat list of datasets in the `listDynamicUrls` function, you can instead organize them into folders.

<img src="../../../../images/dynamic_sync_table_folder.png" srcset="../../../../images/dynamic_sync_table_folder_2x.png 2x" class="screenshot" alt="Organize the URL list into folders">

To create a folder, return a [`MetadataFormulaObjectResultType`][MetadataFormulaObjectResultType] with `hasChildren: true`. When a user clicks on a folder, the `listDynamicUrls` function will be re-run, passing in the URL of the parent folder as the second parameter.

```ts
pack.addDynamicSyncTable({
  // ...
  listDynamicUrls: async function (context, folderUrl) {
    if (folderUrl) {
      // Return the items in the selected folder.
    } else {
      // Get the items at the root.
    }
  },
  // ...
});
```

Folders can be nested inside of other folders, allowing you to represent complex hierarchies.


## Search for datasets {: #search}

Finding the desired dataset, even when [organized into folders](#folders), can be difficult when the there are many options to select from. If the underlying API supports it you can allow users to search for the dataset instead.

<img src="../../../../images/dynamic_sync_table_search.png" srcset="../../../../images/dynamic_sync_table_search_2x.png 2x" class="screenshot" alt="Searching for a dataset.">

 To enable this search feature, add a `searchDynamicUrls` function to your sync table definition. This function works identically to `listDynamicUrls`, except that the 2nd parameter contains the user-entered search term instead of the folder URL.

```ts
pack.addDynamicSyncTable({
  // ...
  searchDynamicUrls: async function (context, search) {
    let url = coda.withQueryParams("https://api.example.com/projects", {
      q: search,
    });
    // Fetch and return the matching projects...
  },
  // ...
});
```


## Manually entered URLs

In some cases it's not feasible to generate a list of all possible datasets the user can select from. In these cases you can omit the `listDynamicUrls` function and instead have your users directly enter the URL of the dataset.

<img src="../../../../images/dynamic_sync_table_url.png" srcset="../../../../images/dynamic_sync_table_url_2x.png 2x" class="screenshot" alt="Manually entering the dynamic URL">

When using this approach you should use a user-facing URL as the dynamic URL, as that is what users will have access to. You'll need some way to translate those URLs into something you can use with the API, typically by extracting an ID.

Dynamic sync tables created this way differ from the ones using a list of URLs in a few notable ways:

- The same dynamic URL can be used to create multiple tables.
- The rows in these tables can't be [referenced][sync_tables_reference] by other sync tables.


## Dynamic schema only {: #schema-only }

Dynamic sync tables are built around the idea that the external data source has a list of datasets, each with their own unique set of fields. Sometimes though there aren't different datasets to select from, but the fields available to sync do vary slightly based on the connected account. In these cases you can use a somewhat simpler approach: a regular sync table with a dynamic schema.

To implement this, create a regular sync table using `addSyncTable` and define the function `dynamicOptions.getSchema`. You'll still need to specify a static schema in the `schema` field of the sync table, but it will be overridden during the sync with the output of `getSchema`.

```ts
pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  dynamicOptions: {
    getSchema: async function (context) {
      // Generate the dynamic schema.
    },
  },
  identityName: "Task",
  formula: {
    // ...
  },
});
```


## Lifecycle

Dynamic sync tables include a lot of individual functions, but they are run at different times and with different frequencies. Below is an outline of the typical lifecycle of a dynamic sync table.

1.  **The table is expanded in the Pack's side panel**[^1]
    - The `listDynamicUrls` function is called to populate the list of data sources.
1.  **The table is added to the page**
    - The `getDisplayUrl` function is called to calculate the display URL for the table.
    - The `getName` function is called to calculate the initial name for the table (the user can later change it).
    - The `getSchema` function is called to calculate the initial set of featured columns for the table.
1.  **The table is synced (or re-synced)**
    - The `getSchema` function is called to calculate the structure of the table.
    - The `formula.execute` function is called to populate the table.


[^1]: Using a slash command to insert the dynamic sync table into the page will invoke the same code path, in order to populate a dropdown of data sources.

[samples]: ../../../samples/topic/dynamic-sync-table.md
[sync_tables_naming]: index.md#naming
[MetadataFormulaObjectResultType]: ../../../reference/sdk/interfaces/core.MetadataFormulaObjectResultType.md
[schemas_identity]: ../../advanced/schemas.md#schema-identity
[schemas_normalization]: ../../advanced/schemas.md#normalization
[schemas_sync_table]: ../../advanced/schemas.md#schemas-in-sync-tables
[fromKey]: ../../../reference/sdk/interfaces/core.ObjectSchemaProperty.md#fromkey
[addDynamicSyncTable]: ../../../reference/sdk/classes/core.PackDefinitionBuilder.md#adddynamicsynctable
[listDynamicUrls]: ../../../reference/sdk/interfaces/core.DynamicSyncTableOptions.md#listdynamicurls
[getName]: ../../../reference/sdk/interfaces/core.DynamicSyncTableOptions.md#getname
[getDisplayUrl]: ../../../reference/sdk/interfaces/core.DynamicSyncTableOptions.md#getdisplayurl
[getSchema]: ../../../reference/sdk/interfaces/core.DynamicSyncTableOptions.md#getschema
[dynamicUrl]: ../../../reference/sdk/interfaces/core.SyncBase.md#dynamicurl
[sync_tables_identity]: index.md#identity
[autocomplete_parameter]: ../../basics/parameters/autocomplete.md#parameters
[sync_tables_reference]: index.md#references
