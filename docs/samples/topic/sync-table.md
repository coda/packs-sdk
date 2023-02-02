---
nav: Sync tables
description: Samples that show how to create a sync table.
icon: material/table-sync
---

# Sync table samples

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.


[Learn More](../../../guides/blocks/sync-tables){ .md-button }

## Template
The basic structure of a sync table.

```ts
{% raw %}
const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "property1", // Which property above to display by default.
  idProperty: "property2", // Which property above is a unique ID.
});

pack.addSyncTable({
  name: "<User-visible name for the sync table>",
  description: "<User-visible description for the sync table>",
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
      };
    },
  },
});
{% endraw %}
```
## With parameter
A sync table that uses a parameter. This sample syncs cat photos from the CatAAS API.

```ts
{% raw %}
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
      items: coda.makeSchema({ type: coda.ValueType.String }),
    },
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
    },
    id: { type: coda.ValueType.String },
  },
  displayProperty: "image",
  idProperty: "id",
  featuredProperties: ["tags"],
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
        tags: tag,
        limit: 10000,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let cats = response.body;
      let result = [];
      for (let cat of cats) {
        result.push({
          image: "https://cataas.com/cat/" + cat._id,
          tags: cat.tags,
          created: cat.createdAt,
          id: cat._id,
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
{% endraw %}
```
## With continuation
A sync table that uses continuations to sync data using multiple executions. This sample syncs the spells available in Dungeons and Dragons.

```ts
{% raw %}
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
    name: {
      description: "The spell name.",
      type: coda.ValueType.String,
    },
    description: {
      description: "A description of the spell.",
      type: coda.ValueType.String,
    },
    higher_level: {
      description: "A description for casting the spell at a higher level.",
      type: coda.ValueType.String,
    },
    level: {
      description: "The level of the spell.",
      type: coda.ValueType.Number,
    },
    range: {
      description: "The range of the spell.",
      type: coda.ValueType.String,
    },
    material: {
      description: "The material component for the spell to be cast.",
      type: coda.ValueType.String,
    },
    duration: {
      description: "How long the spell effect lasts.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "Instantaneous".
    },
    casting_time: {
      description: "How long it takes for the spell to activate.",
      type: coda.ValueType.String,
      // Not using the Duration value hint, since this can contain values like
      // "1 action".
    },
    attack_type: {
      description: "The attack type of the spell.",
      type: coda.ValueType.String,
    },
    damage_type: {
      description: "The damage type of the spell.",
      type: coda.ValueType.String,
    },
    index: {
      description: "A unique identifier for the spell.",
      type: coda.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "index",
  featuredProperties: ["description", "level", "range"],
});

// Reformat the API response for a spell to fit the schema.
function formatSpell(spell) {
  return {
    // Start with all of the properties in the API response.
    ...spell,
    description: spell.desc?.join("\n"),
    higher_level: spell.higher_level?.join("\n"),
    damage_type: spell.damage?.damage_type?.name,
  };
}

// A sync table that displays all spells available in the API.
pack.addSyncTable({
  name: "Spells",
  identityName: "Spell",
  schema: SpellSchema,
  connectionRequirement: coda.ConnectionRequirement.None,
  formula: {
    name: "SyncSpells",
    description: "Sync all the spells.",
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
      let index: number = (context.sync.continuation?.index as number) || 0;

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
      url: url,
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
{% endraw %}
```
## With authentication
A sync table that pulls from an API using authentication. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
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
      codaType: coda.ValueHintType.Url,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
  featuredProperties: ["description", "url"],
});

pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "filter",
        description: "A supported filter string. See the Todoist help center.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "project",
        description: "Limit tasks to a specific project.",
        optional: true,
        autocomplete: async function (context, search) {
          let url = "https://api.todoist.com/rest/v2/projects";
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });
          let projects = response.body;
          return coda.autocompleteSearchObjects(search, projects, "name", "id");
        },
      }),
    ],
    execute: async function ([filter, project], context) {
      let url = coda.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
        filter: filter,
        project_id: project,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
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
{% endraw %}
```
## With row references
A sync table that contains a reference to a row in another sync table. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the data in the Projects sync table.
const ProjectSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the project.",
      type: coda.ValueType.String,
      required: true,
    },
    url: {
      description: "A link to the project in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    projectId: {
      description: "The ID of the project.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "projectId",
  featuredProperties: ["url"],
});

// A reference schema, allowing other sync tables to link to rows in the
// Projects sync table. The second parameter must match the identityName field
// of the sync table being referenced.
const ProjectReferenceSchema = coda.makeReferenceSchemaFromObjectSchema(
  ProjectSchema, "Project");

// A schema defining the data in the Tasks sync table.
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
      codaType: coda.ValueHintType.Url,
    },
    // Reference a project from the Projects sync table.
    project: ProjectReferenceSchema,
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
  featuredProperties: ["description", "url", "project"],
});

// The definition and logic for the Projects sync table.
pack.addSyncTable({
  name: "Projects",
  schema: ProjectSchema,
  identityName: "Project",
  formula: {
    name: "SyncProjects",
    description: "Sync projects",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/projects";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let project of response.body) {
        results.push({
          name: project.name,
          url: project.url,
          projectId: project.id,
        });
      }
      return {
        result: results,
      };
    },
  },
});

// The definition and logic for the Tasks sync table.
pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/tasks";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let task of response.body) {
        let item: any = {
          name: task.content,
          description: task.description,
          url: task.url,
          taskId: task.id,
        };
        if (task.project_id) {
          // Add a reference to the parent project in the Projects table.
          item.project = {
            projectId: task.project_id,
            name: "Not found", // Placeholder name, if not synced yet.
          };
        }
        results.push(item);
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
{% endraw %}
```

