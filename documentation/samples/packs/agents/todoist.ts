import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// The REST API and MCP server are hosted on different domains.
// Note: Connecting to multiple domains requires approval.
pack.addNetworkDomain("todoist.com");
pack.addNetworkDomain("todoist.net");

// The REST API and MCP server use the same OAuth credentials.
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],
  scopeDelimiter: ",",

  // Allow the credentials to be sent to both domains.
  networkDomain: ["todoist.com", "todoist.net"],

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://api.todoist.com/api/v1/user",
    });
    return response.body.full_name;
  },
});

pack.addMCPServer({
  name: "Todoist",
  endpointUrl: "https://ai.todoist.net/mcp",
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
      let rows = response.body.map(task => {
          return {
            ...task,
            // Convert the priority to a string like "P1".
            priority: "P" + (5 - task.priority),
          };
      });
      return {
        result: rows,
      };
    },
  },
});
