import * as sdk from "@codahq/packs-sdk";
export const pack = sdk.newPack();

/*
--8<-- [start:json]
{
  "user_id": "2671355",
  "id": "6X7rfFVPjhvv84XG",
  "project_id": "6Xx8rMQZ5Wc9CqcH",
  "section_id": null,
  "parent_id": null,
  "added_by_uid": "2671355",
  "assigned_by_uid": null,
  "responsible_uid": null,
  "labels": ["Food", "Shopping"],
  "deadline": null,
  "duration": null,
  "is_collapsed": false,
  "checked": false,
  "is_deleted": false,
  "added_at": "2019-12-11T22:36:50.000000Z",
  "completed_at": null,
  "completed_by_uid": null,
  "updated_at": "2019-12-11T22:36:50.000000Z",
  "due": {
    "date": "2016-09-01",
    "timezone": null,
    "string": "tomorrow at 12",
    "lang": "en",
    "is_recurring": false
  },
  "priority": 1,
  "child_order": 1,
  "content": "Buy Milk",
  "description": "",
  "note_count": 10,
  "day_order": -1,
  "completed_count": 0,
  "postponed_count": 0
}
--8<-- [end:json]
*/

// --8<-- [start:schema]
const TaskSchema = sdk.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: sdk.ValueType.String,
      fromKey: "content",
    },
    description: {
      description: "A description of the task.",
      type: sdk.ValueType.String,
    },
    url: {
      description: "A link to the task.",
      type: sdk.ValueType.String,
      codaType: sdk.ValueHintType.Url,
    },
    id: {
      description: "The ID of the task.",
      type: sdk.ValueType.String,
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["description", "url"],
});
// --8<-- [end:schema]

// --8<-- [start:sync]
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
// --8<-- [end:sync]

/*
--8<-- [start:get]
GET https://api.todoist.com/api/v1/tasks/<taskId>
--8<-- [end:get]
*/

// --8<-- [start:getter]
pack.addFormula({
  name: "Task",
  description: "Gets a Todoist task by URL",
  parameters: [
    sdk.makeParameter({
      type: sdk.ParameterType.String,
      name: "url",
      description: "The URL of the task",
    }),
  ],
  resultType: sdk.ValueType.Object,
  schema: TaskSchema,

  execute: async function ([url], context) {
    let taskId = extractTaskId(url);
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/api/v1/tasks/" + taskId,
      method: "GET",
    });
    let task = response.body;
    return {
      ...task,
      url: "https://app.todoist.com/app/task/" + task.id,
    };
  },
});

const TaskUrlPatterns: RegExp[] = [
  // The current URL format, where the ID follows a slug of the task name.
  new RegExp("^https://app.todoist.com/app/task/(?:.*-)?([0-9a-zA-Z]+)$"),
  // Legacy URL formats, which only used numeric IDs.
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

function extractTaskId(taskUrl: string) {
  for (let pattern of TaskUrlPatterns) {
    let matches = taskUrl.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  throw new sdk.UserVisibleError("Invalid task URL: " + taskUrl);
}
// --8<-- [end:getter]

// --8<-- [start:format]
pack.addColumnFormat({
  name: "Task",
  formulaName: "Task",
  // If the first values entered into a new column match these patterns then
  // this column format will be automatically applied.
  matchers: TaskUrlPatterns,
});
// --8<-- [end:format]

// --8<-- [start:action]
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

  execute: async function ([name], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/api/v1/tasks",
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
    return "https://app.todoist.com/app/task/" + response.body.id;
  },
});
// --8<-- [end:action]

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: sdk.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
