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
    // Process updates in batches of 10 rows at a time.
    maxUpdateBatchSize: 10,
    // Function that handles the row updates.
    executeUpdate: async function (args, updates, context) {
      // Generate the set of commands needed to process each update.
      let commandSets = updates.map(update => generateCommands(update));

      // Send all of the commands to the sync endpoint.
      let response = await context.fetcher.fetch({
        method: "POST",
        url: "https://api.todoist.com/sync/v9/sync",
        form: {
          commands: JSON.stringify(commandSets.flat()),
        },
      });
      let statuses = response.body.sync_status;

      // Process the results, returning either an error or the updated task.
      // This is done async, so the fetches can be done in parallel.
      let jobs = updates.map(async (update, i) => {
        let taskId = update.newValue.id;
        let commands = commandSets[i];
        for (let command of commands) {
          let status = statuses[command.uuid];
          if (status.error) {
            return new coda.UserVisibleError(status.error);
          }
        }
        // If there were no errors, fetch the updated task and return it.
        return getTask(context, taskId);
      });
      let results = await Promise.all(jobs);
      return {
        result: results,
      };
    },
  },
});

// Generate a list of API commands from a row update.
function generateCommands(update: coda.GenericSyncUpdate): any[] {
  let commands = [];
  let { previousValue, newValue } = update;
  // Update the task.
  commands.push({
    type: "item_update",
    uuid: Math.random().toString(36),
    args: newValue,
  });
  // Update the completion status, if it's changed.
  if (previousValue.is_completed !== newValue.is_completed) {
    commands.push({
      type: newValue.is_completed ? "item_complete" : "item_uncomplete",
      uuid: Math.random().toString(36),
      args: {
        id: newValue.id,
      },
    });
  }
  return commands;
}

// Fetch the current state of an individual task.
async function getTask(context: coda.ExecutionContext, id: string) {
  let response = await context.fetcher.fetch({
    method: "GET",
    url: `https://api.todoist.com/rest/v2/tasks/${id}`,
  });
  return response.body;
}

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
