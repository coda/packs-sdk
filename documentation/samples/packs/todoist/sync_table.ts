import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the data in the sync table.
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
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
      sdk.makeParameter({
        type: sdk.ParameterType.String,
        name: "filter",
        description: "A supported filter string. See the Todoist help center.",
        optional: true,
      }),
    ],
    execute: async function ([filter], context) {
      let url = "https://api.todoist.com/api/v1/tasks";
      if (filter) {
        // Filter queries are handled by a separate endpoint.
        url = sdk.withQueryParams(
          "https://api.todoist.com/api/v1/tasks/filter",
          { query: filter },
        );
      }
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let task of response.body.results) {
        results.push({
          name: task.content,
          description: task.description,
          url: "https://app.todoist.com/app/task/" + task.id,
          id: task.id,
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
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
