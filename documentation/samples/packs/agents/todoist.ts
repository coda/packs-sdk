import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addNetworkDomain("todoist.com");

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // OAuth2 URLs and scopes are found in the the Todoist OAuth guide:
  // https://developer.todoist.com/guides/##oauth
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],
  scopeDelimiter: ",",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.todoist.com/api/v1/user",
    });
    return response.body.full_name;
  },
});

const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      fromKey: "content",
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Markdown,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    priority: {
      description: "The priority of the task.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      options: ["P1", "P2", "P3", "P4"],
    },
    due: {
      description: "When the task is due.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
    },
    id: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "id",
  featuredProperties: ["url", "priority", "due"],
  // Indexing metadata.
  titleProperty: "name",
  linkProperty: "url",
  index: {
    properties: ["description"],
    filterableProperties: ["priority"],
  },
});

// Index tasks into the knowledge layer.
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
    ],
    execute: async function (args, context) {
      let [filter] = args;
      let url = coda.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
        filter: filter,
      });
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let rows = response.body.map(task => formatTaskForSchema(task));
      return {
        result: rows,
      };
    },
  },
});

pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by URL",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the task",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: TaskSchema,
  execute: async function (args, context) {
    let [url] = args;
    let taskId = extractTaskId(url);
    let response = await context.fetcher.fetch({
      method: "GET",
      url: `https://api.todoist.com/rest/v2/tasks/${taskId}`,
    });
    return formatTaskForSchema(response.body);
  },
});

pack.addFormula({
  name: "AddTask",
  description: "Add a new task. Returns the URL of the new task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the task.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "description",
      description: "The description of the task.",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [name, description] = args;
    let response = await context.fetcher.fetch({
      method: "POST",
      url: "https://api.todoist.com/rest/v2/tasks",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
        description: description,
      }),
    });
    return response.body.url;
  },
});

pack.addFormula({
  name: "MarkComplete",
  description: "Mark a task as complete.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the task",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [url] = args;
    let taskId = extractTaskId(url);
    await context.fetcher.fetch({
      method: "POST",
      url: `https://api.todoist.com/rest/v2/tasks/${taskId}/close`,
    });
    return "OK";
  },
});

function extractTaskId(taskUrl: string) {
  let pattern = /^https:\/\/app\.todoist\.com\/app\/task\/(?:\w+-)*(\w+)$/;
  let matches = taskUrl.match(pattern);
  if (matches && matches[1]) {
    return matches[1];
  }
  throw new coda.UserVisibleError("Invalid task URL: " + taskUrl);
}

// Format a task from the API and return an object matching the Task schema.
function formatTaskForSchema(task: any) {
  return {
    ...task,
    // Convert the priority to a string like "P1".
    priority: "P" + (5 - task.priority),
  };
}
