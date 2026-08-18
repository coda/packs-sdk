import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

pack.addFormula({
  name: "AddTask",
  description: "Add a new task.",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "name",
      description: "The name of the task.",
    }),
  ],
  resultType: sdk.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [name] = args;
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/api/v1/tasks",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: name }),
    });
    return "https://app.todoist.com/app/task/" + response.body.id;
  },
});

pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});

pack.addNetworkDomain("todoist.com");
