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
