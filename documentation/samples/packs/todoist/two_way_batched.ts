import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the data in the sync table, indicating which fields are
// editable (mutable).
const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      fromKey: "content",
      required: true,
      mutable: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
      mutable: true,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    completed: {
      description: "If the task has been completed.",
      type: coda.ValueType.Boolean,
      fromKey: "is_completed",
      mutable: true,
    },
    id: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "id",
  featuredProperties: ["name", "description", "url", "completed"],
});

pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function (args, context) {
      let response = await context.fetcher.fetch({
        method: "GET",
        url: "https://api.todoist.com/rest/v2/tasks",
      });
      let tasks = response.body;
      return {
        result: tasks,
      };
    },
    maxUpdateBatchSize: 10,
    // Function that handles the row updates.
    executeUpdate: async function (args, updates, context) {
      // Create an async job for each update.
      let jobs = updates.map(async update => {
        return updateTask(context, update);
      });
      // Wait for all of the jobs to finish .
      let completed = await Promise.allSettled(jobs);

      // For each update, return either the updated row or an error if the
      // update failed.
      let results = completed.map(job => {
        if (job.status === "fulfilled") {
          return job.value;
        } else {
          return job.reason;
        }
      });

      return {
        result: results,
      };
    },
  },
});

async function updateTask(context: coda.ExecutionContext,
  update: coda.GenericSyncUpdate): Promise<any> {
  let { previousValue, newValue } = update;
  let taskId = newValue.id;

  // Update the completion status, if it has changed.
  if (previousValue.is_completed !== newValue.is_completed) {
    let action = newValue.is_completed ? "close" : "reopen";
    await context.fetcher.fetch({
      method: "POST",
      url: `https://api.todoist.com/rest/v2/tasks/${taskId}/${action}`,
    });
  }

  // Update the other properties of the task.
  let response = await context.fetcher.fetch({
    url: `https://api.todoist.com/rest/v2/tasks/${taskId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newValue),
  });

  // Return the updated task.
  return response.body;
}

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
