---
title: Sync tables
---

# Sync table samples

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.


[Learn More]({{config.site_url.rstrip('/')}}/reference/sdk/classes/PackDefinitionBuilder#addSyncTable){ .md-button }

## Template


```ts
const MySchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    property1: {type: coda.ValueType.Number},
    property2: {type: coda.ValueType.String},
    // Add more properties here.
  },
  id: "property1", // Which property above is a unique ID.
  primary: "property2", // Which property above to display by default.
  identity: {
    name: "<User-visible name for the column containing the schema>",
  },
});

pack.addSyncTable({
  name: "<User-visible name for the sync table>",
  identityName: "<User-visible name for the column containing the schema>",
  schema: MySchema,
  formula: {
    name: "<Name of the sync formula, not show to the user>",
    description: "<Help text for the sync formula, not show to the user>",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "<User-visible name of parameter>",
        description: "<Help text for the parameter>",
      }),
      // Add more parameters here and in the array below.
    ],
    execute: async function ([param], context) {
      let url = "<URL to pull data from>";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let items = response.body.items;
      // Adjust the items to fit the schema if required.
      return {
        result: items,
      }
    },
  },
});
```
## Cats


```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema for a Cat image.
const CatSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    image: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
    tags: {
      type: coda.ValueType.Array,
      items: { type: coda.ValueType.String },
    },
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
    },
    id: { type: coda.ValueType.String },
  },
  primary: "image",
  id: "id",
  featured: ["tags"],
  identity: {
    name: "Cat",
  },
});

// Sync table that retrieves all cat images, optionally filtered by tags.
pack.addSyncTable({
  name: "Cats",
  identityName: "Cat",
  schema: CatSchema,
  connectionRequirement: coda.ConnectionRequirement.None,
  formula: {
    name: "SyncCats",
    description: "Syncs the cats.",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "tag",
        description: "Only cats with this tag will be selected.",
        optional: true,
        // Pull the list of tags to use for autocomplete from the API.
        autocomplete: async function (context, search) {
          let response = await context.fetcher.fetch({
            method: "GET",
            url: "https://cataas.com/api/tags",
          });
          let tags = response.body;
          // Convert the tags into a list of autocomplete options.
          return coda.simpleAutocomplete(search, tags);
        },
      }),
    ],
    execute: async function ([tag], context) {
      let url = coda.withQueryParams("https://cataas.com/api/cats", {
        tags: tag
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let cats = response.body;
      let result: any = [];
      for (let cat of cats) {
        result.push({
          image: "https://cataas.com/cat/" + cat.id,
          tags: cat.tags,
          created: cat.created_at,
          id: cat.id,
        });
      }
      return {
        result: result,
      };
    },
  },
});

// Allow the pack to make requests to Cat-as-a-service API.
pack.addNetworkDomain("cataas.com");
```
## Todoist


```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the data in the sync table.
const TaskSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.Number,
      required: true,
    },
  },
  primary: "name",
  id: "taskId",
  featured: ["description", "url"],
  identity: {
    name: "Task",
  },
});

pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v1/tasks";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results: any[] = [];
      for (let task of response.body) {
        results.push({
          name: task.content,
          description: task.description,
          url: task.url,
          taskId: task.id,
        });
      }
      return {
        result: results,
      };
    },
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
```

