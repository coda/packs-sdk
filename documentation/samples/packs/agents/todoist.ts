import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// The REST API and MCP server are hosted on different domains.
// Note: Connecting to multiple domains requires approval.
pack.addNetworkDomain("todoist.com");
pack.addNetworkDomain("todoist.net");

// The REST API and MCP server use the same OAuth credentials.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,

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

const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      fromKey: "content",
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Markdown,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.Url,
    },
    priority: {
      description: "The priority of the task.",
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.SelectList,
      options: ["P1", "P2", "P3", "P4"],
    },
    due: {
      description: "When the task is due.",
      type: sdk.ValueType.String,
      hintType: sdk.ValueHintType.DateTime,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
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
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "filter",
        description: "A supported filter string. See the Todoist help center.",
        optional: true,
      }),
    ],
    execute: async function (args, context) {
      let [filter] = args;
      let url = sdk.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
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
