/* eslint-disable @typescript-eslint/no-unused-vars */
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

/*
--8<-- [start:json]
{
  "creator_id": "2671355",
  "created_at": "2019-12-11T22:36:50.000000Z",
  "assignee_id": "2671362",
  "assigner_id": "2671355",
  "comment_count": 10,
  "is_completed": false,
  "content": "Buy Milk",
  "description": "",
  "due": {
    "date": "2016-09-01",
    "is_recurring": false,
    "datetime": "2016-09-01T12:00:00.000000Z",
    "string": "tomorrow at 12",
    "timezone": "Europe/Moscow"
  },
  "id": "2995104339",
  "labels": ["Food", "Shopping"],
  "order": 1,
  "priority": 1,
  "project_id": "2203306141",
  "section_id": "7025",
  "parent_id": "2995104589",
  "url": "https://todoist.com/showTask?id=2995104339"
}
--8<-- [end:json]
*/

// --8<-- [start:schema]
const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      fromKey: "content",
    },
    description: {
      description: "A description of the task.",
      type: coda.ValueType.String,
    },
    url: {
      description: "A link to the task.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      fromKey: "id",
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
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
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "filter",
        description: "A supported filter string. See the Todoist help center.",
        optional: true,
      }),
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "project",
        description: "Limit tasks to a specific project.",
        optional: true,
        autocomplete: async function (context, search) {
          let url = "https://api.todoist.com/rest/v2/projects";
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });
          let projects = response.body;
          return coda.autocompleteSearchObjects(search, projects, "name", "id");
        },
      }),
    ],
    execute: async function ([filter, project], context) {
      let url = coda.withQueryParams("https://api.todoist.com/rest/v2/tasks", {
        filter: filter,
        project_id: project,
      });
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
// --8<-- [end:sync]

/*
--8<-- [start:get]
GET https://api.todoist.com/rest/v2/tasks/<taskId>
--8<-- [end:get]
*/

// --8<-- [start:getter]
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

  execute: async function ([url], context) {
    let taskId = extractTaskId(url);
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
    });
    return response.body;
  },
});

const TaskUrlPatterns: RegExp[] = [
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
  throw new coda.UserVisibleError("Invalid task URL: " + taskUrl);
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
// --8<-- [end:action]
