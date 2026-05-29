import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

// A schema defining the rich metadata to be returned about each task.
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
      hintType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
});

// Formula that looks up rich metadata about a task given its ID.
pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by ID",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "taskId",
      description: "The ID of the task",
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: TaskSchema,

  execute: async function ([taskId], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      id: task.id,
    };
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
