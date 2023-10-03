import * as coda from "@codahq/packs-sdk";

// #region Constants

const ProjectUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/project/([0-9]+)$"),
  new RegExp("^https://todoist.com/showProject\\?id=([0-9]+)"),
];

const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

// #endregion


// #region Pack setup

export const pack = coda.newPack();

pack.addNetworkDomain("todoist.com");

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // OAuth2 URLs and scopes are found in the the Todoist OAuth guide:
  // https://developer.todoist.com/guides/#oauth
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],
  scopeDelimiter: ",",

  // Determines the display name of the connected account.
  getConnectionName: async function (context) {
    let url = coda.withQueryParams("https://api.todoist.com/sync/v9/sync", {
      resource_types: JSON.stringify(["user"]),
    });
    let response = await context.fetcher.fetch({
      method: "GET",
      url: url,
    });
    return response.body.user?.full_name;
  },
});

// #endregion


// #region Schemas

const DueSchema = coda.makeObjectSchema({
  properties: {
    date: {
      description: "The date the task is due.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Date,
    },
    time: {
      description: "The specific moment the task is due.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      fromKey: "datetime",
    },
    display: {
      description: "The display value for the due date.",
      type: coda.ValueType.String,
      fromKey: "string",
    },
  },
  displayProperty: "display",
});

const ProjectSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the project.",
      type: coda.ValueType.String,
      mutable: true,
      required: true,
    },
    url: {
      description: "A link to the project in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    shared: {
      description: "Is the project is shared.",
      type: coda.ValueType.Boolean,
      fromKey: "is_shared",
    },
    favorite: {
      description: "Is the project a favorite.",
      type: coda.ValueType.Boolean,
      mutable: true,
      fromKey: "is_favorite",
    },
    projectId: {
      description: "The ID of the project.",
      type: coda.ValueType.String,
      required: true,
      fromKey: "id",
    },
    parentProjectId: {
      description: "For sub-projects, the ID of the parent project.",
      type: coda.ValueType.String,
      fromKey: "parent_id",
    },
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "projectId",
  featuredProperties: ["url", "favorite"],
  // Card metadata.
  linkProperty: "url",
  subtitleProperties: ["shared", "favorite"],
});

// Create a reference schema for projects, to use for relation columns.
const ProjectReferenceSchema =
  coda.makeReferenceSchemaFromObjectSchema(ProjectSchema, "Project");

// Using the reference schema, add a property for the parent project.
(ProjectSchema.properties as coda.ObjectSchemaProperties)
  .parentProject = ProjectReferenceSchema;

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
      codaType: coda.ValueHintType.Markdown,
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
    order: {
      description: "The position of the task in the project or parent task.",
      type: coda.ValueType.Number,
      mutable: true,
    },
    priority: {
      description: "The priority of the task.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.SelectList,
      options: ["P1", "P2", "P3", "P4"],
      mutable: true,
    },
    due: {
      description: "When the task is due.",
      ...DueSchema,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      fromKey: "id",
      required: true,
    },
    projectId: {
      description: "The ID of the project that the task belongs to.",
      type: coda.ValueType.String,
      fromKey: "project_id",
    },
    parentTaskId: {
      description: "For sub-tasks, the ID of the parent task it belongs to.",
      type: coda.ValueType.String,
      fromKey: "parent_id",
    },
    // A reference to the project (for sync tables only).
    project: {
      ...ProjectReferenceSchema,
      mutable: true,
    },
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "taskId",
  featuredProperties: ["project", "url", "completed"],
  // Card metadata.
  linkProperty: "url",
  snippetProperty: "description",
  subtitleProperties: [
    "priority",
    "completed",
    { label: "Due", property: "due.display" },
  ],
});

// Create a reference schema for tasks, to use for relation columns.
const TaskReferenceSchema =
  coda.makeReferenceSchemaFromObjectSchema(TaskSchema, "Task");

// Using the reference schema, add a property for the parent task.
(TaskSchema.properties as coda.ObjectSchemaProperties)
  .parentTask = TaskReferenceSchema;

// Format a project from the API and return an object matching the schema.
function formatProjectForSchema(project: any, withReferences = false) {
  let result: any = {
    ...project,
  };
  if (withReferences && project.parent_id) {
    result.parentProject = {
      id: project.parent_id,
      name: "Not found", // If sync'ed, the real name will be shown instead.
    };
  }
  return result;
}

// Format a task from the API and return an object matching the Task schema.
function formatTaskForSchema(task: any, withReferences = false) {
  let result: any = {
    ...task,
    // Convert the priority to a string like "P1".
    priority: "P" + (5 - task.priority),
  };
  if (withReferences) {
    // Add a reference to the corresponding row in the Projects sync table.
    result.project = {
      id: task.project_id,
      name: "Not found", // If sync'ed, the real name will be shown instead.
    };
    if (task.parent_id) {
      // Add a reference to the corresponding row in the Tasks sync table.
      result.parentTask = {
        taskId: task.parent_id,
        name: "Not found", // If sync'ed, the real name will be shown instead.
      };
    }
  }
  return result;
}

// Format a task from a sync table and return an object matching the API.
function formatTaskForAPI(task: any) {
  let result: any = {
    ...task,
  };
  if (result.priority) {
    // Convert the priority back to a number.
    result.priority = 5 - Number(result.priority.substring(1));
  }
  return result;
}

// #endregion


// #region Formulas

pack.addFormula({
  name: "Project",
  description: "Gets a Todoist project by URL",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "url",
      description: "The URL of the project",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ProjectSchema,
  execute: async function ([url], context) {
    let projectId = extractProjectId(url);
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/projects/" + projectId,
      method: "GET",
    });
    return formatProjectForSchema(response.body);
  },
});

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
    return formatTaskForSchema(response.body);
  },
});

// #endregion


// #region Column Formats

pack.addColumnFormat({
  name: "Project",
  formulaName: "Project",
  matchers: ProjectUrlPatterns,
});

pack.addColumnFormat({
  name: "Task",
  formulaName: "Task",
  matchers: TaskUrlPatterns,
});

// #endregion


// #region Actions

pack.addFormula({
  name: "AddProject",
  description: "Add a new Todoist project",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the new project",
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([name], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/projects",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    });
    return response.body.url;
  },
});

pack.addFormula({
  name: "AddTask",
  description: "Add a new task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the task.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "projectId",
      description: "The ID of the project to add it to. If blank, " +
        "it will be added to the user's Inbox.",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function ([name, projectId], context) {
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
        project_id: projectId,
      }),
    });
    return response.body.url;
  },
});

pack.addFormula({
  name: "SetDueDate",
  description: "Change the due date of a task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Date,
      name: "date",
      description: "The date the task is due.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "endOfDay",
      description:
        "If the task is due at the end of the day (vs a specific time).",
      suggestedValue: true,
    }),
  ],
  resultType: coda.ValueType.Object,
  // To update the existing row in a sync table, return the schema with an
  // identity matching the identityName on the sync table being updated, using
  // the helper function coda.withIdentity().
  schema: coda.withIdentity(TaskSchema, "Task"),
  isAction: true,
  execute: async function ([taskId, date, endOfDay = false], context) {
    let url = "https://api.todoist.com/rest/v2/tasks/" + taskId;
    let payload: any = {
      id: taskId,
    };
    if (endOfDay) {
      payload.due_date = date.toISOString().split("T")[0];
    } else {
      payload.due_datetime = date.toISOString();
    }
    let response = await context.fetcher.fetch({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return formatTaskForSchema(response.body);
  },
});

// #endregion


// #region Sync tables

pack.addSyncTable({
  name: "Projects",
  schema: ProjectSchema,
  identityName: "Project",
  formula: {
    name: "SyncProjects",
    description: "Sync projects",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/projects";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results: any[] = [];
      for (let project of response.body) {
        results.push(formatProjectForSchema(project, true));
      }
      return {
        result: results,
      };
    },
    // Process row updates one at a time.
    maxUpdateBatchSize: 1,
    executeUpdate: async function (args, updates, context) {
      let update = updates[0];
      let project = update.newValue;
      let response = await context.fetcher.fetch({
        method: "POST",
        url: `https://api.todoist.com/rest/v2/projects/${project.id}`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });
      let updated = formatProjectForSchema(response.body, true);

      return {
        result: [updated],
      };
    },
  },
});

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

      let results: any[] = [];
      for (let task of response.body) {
        results.push(formatTaskForSchema(task, true));
      }
      return {
        result: results,
      };
    },
    // Process row updates in batches.
    maxUpdateBatchSize: 10,
    executeUpdate: async function (args, updates, context) {
      // Generate the set of commands needed to process each update.
      let commandSets = updates.map(update => generateTaskCommands(update));

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
        let response = await context.fetcher.fetch({
          method: "GET",
          url: `https://api.todoist.com/rest/v2/tasks/${taskId}`,
          cacheTtlSecs: 0,
        });
        return formatTaskForSchema(response.body, true);
      });
      let results = await Promise.all(jobs);
      return {
        result: results,
      };
    },
  },
});

// Generate a list of API commands from a Task row update.
function generateTaskCommands(update: coda.GenericSyncUpdate): any[] {
  let commands: any[] = [];
  let { previousValue, newValue, updatedFields } = update;

  // Update the task.
  commands.push({
    type: "item_update",
    uuid: getUniqueId(),
    args: formatTaskForAPI(newValue),
  });

  // Update the parent project, if it has changed.
  if (updatedFields.includes("project")) {
    commands.push({
      type: "item_move",
      args: {
        id: newValue.id,
        project_id: newValue.project?.id,
      },
      uuid: getUniqueId(),
    });
  }

  // Update the completion status, if it's changed.
  if (previousValue.is_completed !== newValue.is_completed) {
    commands.push({
      type: newValue.is_completed ? "item_complete" : "item_uncomplete",
      uuid: getUniqueId(),
      args: {
        id: newValue.id,
      },
    });
  }
  return commands;
}

// #endregion


// #region Helper functions

function extractProjectId(projectUrl: string) {
  for (let pattern of ProjectUrlPatterns) {
    let matches = projectUrl.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  throw new coda.UserVisibleError("Invalid project URL: " + projectUrl);
}

function extractTaskId(taskUrl: string) {
  for (let pattern of TaskUrlPatterns) {
    let matches = taskUrl.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  throw new coda.UserVisibleError("Invalid task URL: " + taskUrl);
}

function getUniqueId() {
  return Math.random().toString(36);
}

// #endregion
