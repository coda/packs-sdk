---
title: Sync tables
---

# Sync table samples

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.


[Learn More](../../../guides/blocks/sync-tables){ .md-button }

## Template
The basic structure of a sync table.

```ts
const MySchema = coda.makeObjectSchema({
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
## With parameter (Cats)
A sync table that uses a parameter. This sample syncs cat photos from the CatAAS API.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Schema for a Cat image.
const CatSchema = coda.makeObjectSchema({
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
## With continuation (Dungeons and Dragons)
A sync table that uses continuations to sync data using multiple executions. This sample syncs the spells available in Dungeons and Dragons.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// How many spells to fetch in each sync formula execution.
const BATCH_SIZE = 20;

// Allow requests to the DND API.
pack.addNetworkDomain("dnd5eapi.co");

// Schema that defines the metadata to return for each spell. Shared by the
// formula, column format, and sync table.
let SpellSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  properties: {
    name: {type: coda.ValueType.String},
    description: {type: coda.ValueType.String},
    higher_level: {type: coda.ValueType.String},
    level: {type: coda.ValueType.Number},
    range: {type: coda.ValueType.String},
    material: {type: coda.ValueType.String},
    duration: {type: coda.ValueType.String},
    casting_time: {type: coda.ValueType.String},
    attack_type: {type: coda.ValueType.String},
    damage_type: {type: coda.ValueType.String},
    index: {type: coda.ValueType.String},
  },
  primary: "name",
  id: "index",
  featured: ["description", "level", "range"],
  identity: {
    name: "Spell",
  },
});

// Reformat the API response for a spell to fit the schema.
function formatSpell(spell) {
  return {
    // Start with all of the properties in the API response.
    ...spell,
    description: spell.desc?.join("\n"),
    higher_level: spell.higher_level?.join("\n"),
    damage_type: spell.damage?.damage_type?.name,
  }
}

// A sync table that displays all spells available in the API.
pack.addSyncTable({
  name: "Spells",
  identityName: "Spell",
  schema: SpellSchema,
  formula: {
    name: "SyncSpells",
    description: "Sync all the spells.",
    connectionRequirement: coda.ConnectionRequirement.None,
    parameters: [],
    execute: async function ([], context) {
      // Get the list of all spells.
      let listUrl = "https://www.dnd5eapi.co/api/spells";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: listUrl,
      });
      let results = response.body.results;

      // If there is a previous continuation, start from the index contained
      // within, otherwise start at zero.
      let index: number = context.sync.continuation?.index as number || 0;

      // Get a batch of results, starting from the index determined above.
      let batch = results.slice(index, index + BATCH_SIZE);

      // Fetch the spells for the batch of results.
      let spells = await fetchSpells(context.fetcher, batch);

      // Move the index forward.
      index += BATCH_SIZE;

      // If there are more results to process, create a new continuation.
      let continuation;
      if (index <= results.length) {
        continuation = {
          index: index,
        };
      }

      // Return the batch of spells and the next continuation, if any.
      return {
        result: spells,
        continuation: continuation,
      };
    },
  },
});

// Fetch a batch of spells from the API and return them formatted to match the
// schema. This utility function is shared by the formula and sync table.
async function fetchSpells(fetcher: coda.Fetcher, spellResults) {
  let requests = [];
  for (let spellResult of spellResults) {
    // Add on the domain.
    let url = "https://www.dnd5eapi.co" + spellResult.url;
    // Put the request in the list. Don"t use await here, since we want them to
    // run at the same time.
    let request = fetcher.fetch({
      method: "GET",
      url: url
    });
    requests.push(request);
  }

  // Wait for all of the requests to finish.
  let responses = await Promise.all(requests);

  // Format the API responses and return them.
  let spells = [];
  for (let response of responses) {
    spells.push(formatSpell(response.body));
  }
  return spells;
}
```
## With authentication (Todoist)
A sync table that pulls from an API using authentication. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the data in the sync table.
const TaskSchema = coda.makeObjectSchema({
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

