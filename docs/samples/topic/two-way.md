---
nav: Two-way sync
description: Samples that show how to create sync tables with editable values.
icon: material/card-text
---

# Two-way sync samples

Two-way sync is an optional feature of sync tables that allows users to make edits to row data and push those changes back to the data source. Pack makers enable two-way sync on their tables by annotating their schemas and writing an `executeUpdate` function that handles the update logic.


[Learn More](../../../guides/blocks/sync-tables/two-way){ .md-button }

## Simple two-way sync
A sync table that supports user edits via two-way sync. It uses the default behavior of updating one row at a time. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
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
    // Function that handles the row updates.
    executeUpdate: async function (args, updates, context) {
      // By default only one row is processed at a time.
      let update = updates[0];
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
      let updated = response.body;
      return {
        result: [updated],
      };
    },
  },
});

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
{% endraw %}
```
## With batched updates
A sync table that supports user edits via two-way sync, batch processing multiple rows at once. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
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
{% endraw %}
```
## Using a batch update endpoint
A sync table that supports user edits via two-way sync, batch processing multiple rows at once using the API&#x27;s batch update endpoint. This sample syncs the tasks from a user&#x27;s Todoist account.

```ts
{% raw %}
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
{% endraw %}
```
## With property options
A sync table that supports user edits via two-way sync, with a defined set of options for certain properties. This sample syncs a user&#x27;s expenses in Splitwise.

```ts
{% raw %}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

const CategorySchema = coda.makeObjectSchema({
  properties: {
    id: {
      description: "A unique ID for the category.",
      type: coda.ValueType.Number,
      required: true,
    },
    name: {
      description: "The name of the category.",
      type: coda.ValueType.String,
      required: true,
    },
    icon: {
      description: "An icon representing the category.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
    },
  },
  displayProperty: "name",
});

const ExpenseSchema = coda.makeObjectSchema({
  properties: {
    id: {
      description: "A unique ID for the expense.",
      type: coda.ValueType.String,
    },
    description: {
      description: "The description of the expense.",
      type: coda.ValueType.String,
      mutable: true,
    },
    date: {
      description: "The date the expense was made.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
      mutable: true,
    },
    cost: {
      description: "The total cost of the expense.",
      type: coda.ValueType.Number,
      codaType: coda.ValueHintType.Currency,
      mutable: true,
    },
    notes: {
      description: "Any notes on the expense.",
      type: coda.ValueType.String,
      fromKey: "details",
      mutable: true,
    },
    repeat: {
      description: "How often the expense automatically repeats.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      fromKey: "repeat_interval",
      mutable: true,
      // Static list of options.
      options: ["never", "weekly", "fortnightly", "monthly", "yearly"],
    },
    currency: {
      description: "The code of the currency of the expense.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      fromKey: "currency_code",
      mutable: true,
      // Dynamic list of options.
      options: async function (context) {
        // Fetch the list of supported currencies.
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://secure.splitwise.com/api/v3.0/get_currencies",
        });
        return response.body.currencies.map(currency => currency.currency_code);
      },
    },
    category: {
      ...CategorySchema,
      codaType: coda.ValueHintType.SelectList,
      mutable: true,
      // Dynamic list of options, as objects.
      options: async function (context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://secure.splitwise.com/api/v3.0/get_categories",
        });
        let categories = response.body.categories;
        let result = [];
        for (let category of categories) {
          result.push(category);
          let subcategories = category.subcategories || [];
          for (let subcategory of subcategories) {
            if (subcategory.name === "Other") {
              // Add the parent category's name in front, to distinguish it.
              subcategory.name = `${category.name} - ${subcategory.name}`;
            }
            result.push(subcategory);
          }
        }
        return result;
      },
    },
  },
  displayProperty: "description",
  idProperty: "id",
  featuredProperties: [
    "date", "cost", "notes", "currency", "repeat", "category",
  ],
});

pack.addSyncTable({
  name: "Expenses",
  description: "Lists your expenses.",
  identityName: "Expense",
  schema: ExpenseSchema,
  formula: {
    name: "SyncExpenses",
    description: "Syncs the data.",
    parameters: [],
    execute: async function (args, context) {
      let [] = args;
      let offset = context.sync.continuation?.offset as number || 0;
      let limit = 20;
      let url = coda.withQueryParams(
        "https://secure.splitwise.com/api/v3.0/get_expenses",
        {
          offset: offset,
          limit: limit,
        }
      );
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let expenses = response.body.expenses;

      let continuation;
      if (expenses.length === limit) {
        offset += limit;
        continuation = { offset: offset };
      }

      return {
        result: expenses,
        continuation: continuation,
      };
    },
    maxUpdateBatchSize: 10,
    executeUpdate: async function (args, updates, context) {
      // Make all of the updates in parallel to improve performance.
      let jobs = updates.map(async update => {
        return updateExpense(context, update);
      });
      let completed = await Promise.allSettled(jobs);
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

async function updateExpense(context: coda.ExecutionContext,
  update: coda.GenericSyncUpdate) {
  let expense = update.newValue;

  // Only include fields in the body that have been updated.
  // The API will throw an error if you include fields that can't be modified.
  let body: Record<string, any> = {};
  for (let field of update.updatedFields) {
    if (field === "category") {
      // Only send the category ID when updating it.
      body.category_id = expense.category.id;
    } else {
      body[field] = expense[field];
    }
  }

  try {
    let response = await context.fetcher.fetch({
      method: "POST",
      url: `https://secure.splitwise.com/api/v3.0/update_expense/${expense.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let result = response.body;
    return result.expenses[0];
  } catch (e) {
    // If the API returned an error, show that error to the user.
    if (coda.StatusCodeError.isStatusCodeError(e)) {
      let errors = Object.values(e.body.errors).flat();
      if (errors?.length > 0) {
        throw new coda.UserVisibleError(errors.join("\n"));
      }
    }
    throw e;
  }
}

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://secure.splitwise.com/oauth/authorize",
  tokenUrl: "https://secure.splitwise.com/oauth/token",
  getConnectionName: async function (context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://secure.splitwise.com/api/v3.0/get_current_user",
    });
    let user = response.body.user;
    return `${user.first_name} ${user.last_name}`;
  },
});

pack.addNetworkDomain("splitwise.com");
{% endraw %}
```

