---
nav: Actions
description: Samples that show how to create an action formula, for use in a button or automation.
icon: material/cursor-default-click-outline
---

# Action samples

Actions are special types of formulas that power buttons and automations. They usually send data to an external API, but can also be used for other one-time calculations.


[Learn More](../../../guides/blocks/actions){ .md-button }

## Template
The basic structure of an action. This sample takes in a single string parameter and returns the string &quot;OK&quot; when the action is complete.

```ts
{% raw %}
pack.addFormula({
  name: "<User-visible name of formula>",
  description: "<Help text for the formula>",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "<User-visible name of parameter>",
      description: "<Help text for the parameter>",
    }),
    // Add more parameters here and in the array below.
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([param], context) {
    // TODO: Do something.
    return "OK";
  },
});
{% endraw %}
```
## Random value
A formula that returns a random value. This sample rolls virtual dice and returns the results.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Rolls virtual dice and returns the resulting numbers. Use it with a button in
// table and store the results in another column.
pack.addFormula({
  name: "RollDice",
  description: "Roll some virtual dice.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "quantity",
      description: "How many dice to roll.",
      suggestedValue: 1,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "sides",
      description: "How many sides the dice have.",
      suggestedValue: 6,
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.Number,
  }),
  isAction: true,
  execute: async function ([quantity, sides], context) {
    let results = [];
    for (let i = 0; i < quantity; i++) {
      let roll = Math.ceil(Math.random() * sides);
      results.push(roll);
    }
    return results;
  },
});
{% endraw %}
```
## Post to API
A formula that posts data to an external API. This sample creates a new task in the Todoist app.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// Action formula (for buttons and automations) that adds a new task in Todoist.
pack.addFormula({
  name: "AddTask",
  description: "Add a new task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the task.",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,

  execute: async function ([name], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
      }),
    });
    // Return values are optional but recommended. Returning a URL or other
    // unique identifier is recommended when creating a new entity.
    return response.body.url;
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
## Update row in sync table
A formula that updates an item on the server, and the existing row in a sync table if it exists. This sample updates the name of a task in the Todoist app.

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

// Action formula (for buttons and automations) that updates an existing task,
// and by returning the schema also updates the existing row in the sync table.
pack.addFormula({
  name: "UpdateTask",
  description: "Updates the name of a task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task to update.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The new name of the task.",
    }),
  ],
  resultType: coda.ValueType.Object,
  // For schemas returned by actions to update rows in a sync table, set the
  // identity on the schema to match the identityName on the sync table being
  // updated, using the helper function coda.withIdentity().
  schema: coda.withIdentity(TaskSchema, "Task"),
  isAction: true,

  execute: async function ([taskId, name], context) {
    let url = "https://api.todoist.com/rest/v2/tasks/" + taskId;
    await context.fetcher.fetch({
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
      }),
    });
    // Get the updated Task and return it, which will update the row in the sync
    // table.
    let response = await context.fetcher.fetch({
      url: url,
      method: "GET",
      cacheTtlSecs: 0, // Ensure we are getting the latest data.
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      taskId: task.id,
    };
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
      let url = "https://api.todoist.com/rest/v2/tasks";
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

