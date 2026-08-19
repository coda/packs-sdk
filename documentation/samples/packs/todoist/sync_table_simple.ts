import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addSyncTable({
  name: "Tasks",
  schema: sdk.makeObjectSchema({
    properties: {
      name: { type: sdk.ValueType.String, fromKey: "content" },
      description: { type: sdk.ValueType.String },
      url: { type: sdk.ValueType.String, codaType: sdk.ValueHintType.Url },
      id: { type: sdk.ValueType.String },
    },
    displayProperty: "name",
    // Sync table metadata.
    idProperty: "id",
    featuredProperties: ["description", "url"],
    // Indexing metadata.
    titleProperty: "name",
    linkProperty: "url",
    index: { properties: ["description"] },
  }),
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function (args, context) {
      let response = await context.fetcher.fetch({
        method: "GET",
        url: "https://api.todoist.com/api/v1/tasks",
      });
      let tasks = response.body.results;
      return {
        result: tasks.map(task => ({
          ...task,
          url: "https://app.todoist.com/app/task/" + task.id,
        })),
      };
    },
  },
});

pack.addNetworkDomain("todoist.com");

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
