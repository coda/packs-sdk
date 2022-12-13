import * as coda from "@codahq/packs-sdk";

// Constants.

const ProjectUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/project/([0-9]+)$"),
  new RegExp("^https://todoist.com/showProject\\?id=([0-9]+)"),
];

const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

// Pack setup.

export const pack = coda.newPack();

pack.addNetworkDomain("todoist.com");

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  // OAuth2 URLs and scopes are found in the the Todoist OAuth guide:
  // https://developer.todoist.com/guides/#oauth
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read"],
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

// Schemas

// Schema that captures information about when a task is due. Used by
// TaskSchema.
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

// A reference to a synced Project. Usually you can use
// `coda.makeReferenceSchemaFromObjectSchema` to generate these from the primary
// schema, but that doesn't work in this case since a Project itself can contain
// a reference to a parent project.
const ProjectReferenceSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Reference,
  properties: {
    name: { type: coda.ValueType.String, required: true },
    projectId: { type: coda.ValueType.String, required: true },
  },
  displayProperty: "name",
  idProperty: "projectId",
  // For reference schemas, set identity.name the value of identityName on the
  // sync table being referenced.
  identity: {
    name: "Project",
  },
});

const ProjectSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the project.",
      type: coda.ValueType.String,
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
    },
    favorite: {
      description: "Is the project a favorite.",
      type: coda.ValueType.Boolean,
    },
    projectId: {
      description: "The ID of the project.",
      type: coda.ValueType.String,
      required: true,
    },
    parentProjectId: {
      description: "For sub-projects, the ID of the parent project.",
      type: coda.ValueType.String,
    },
    // Add a reference to the sync'ed row of the parent project.
    // References only work in sync tables.
    parentProject: ProjectReferenceSchema,
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "projectId",
  featuredProperties: ["url"],
  // Card metadata.
  linkProperty: "url",
  subtitleProperties: ["shared", "favorite"],
});

// A reference to a synced Task. Usually you can use
// `coda.makeReferenceSchemaFromObjectSchema` to generate these from the primary
// schema, but that doesn't work in this case since a task itself can contain
// a reference to a parent task.
const TaskReferenceSchema = coda.makeObjectSchema({
  codaType: coda.ValueHintType.Reference,
  properties: {
    name: { type: coda.ValueType.String, required: true },
    taskId: { type: coda.ValueType.String, required: true },
  },
  displayProperty: "name",
  idProperty: "taskId",
  // For reference schemas, set identity.name the value of identityName on the
  // sync table being referenced.
  identity: {
    name: "Task",
  },
});

const TaskSchema = coda.makeObjectSchema({
  properties: {
    name: {
      description: "The name of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    description: {
      description: "A detailed description of the task.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Markdown,
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    completed: {
      description: "If the task has been completed.",
      type: coda.ValueType.Boolean,
    },
    order: {
      description: "The position of the task in the project or parent task.",
      type: coda.ValueType.Number,
    },
    priority: {
      description: "The priority of the task.",
      type: coda.ValueType.String,
    },
    due: {
      description: "When the task is due.",
      ...DueSchema,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
    projectId: {
      description: "The ID of the project that the task belongs to.",
      type: coda.ValueType.String,
    },
    parentTaskId: {
      description: "For sub-tasks, the ID of the parent task it belongs to.",
      type: coda.ValueType.String,
    },
    // A reference to the sync'ed row of the project.
    // References only work in sync tables.
    project: ProjectReferenceSchema,
    // Add a reference to the sync'ed row of the parent task.
    // References only work in sync tables.
    parentTask: TaskReferenceSchema,
  },
  displayProperty: "name",
  // Sync table metadata.
  idProperty: "taskId",
  featuredProperties: ["project", "url"],
  // Card metadata.
  linkProperty: "url",
  snippetProperty: "description",
  subtitleProperties: ["priority", "completed", "due"],
});

/**
 * Convert a Project API response to a Project schema.
 */
function toProject(project: any, withReferences = false) {
  let result: any = {
    name: project.name,
    projectId: project.id,
    url: project.url,
    shared: project.is_shared,
    favorite: project.is_favorite,
    parentProjectId: project.parent_id,
  };
  if (withReferences && project.parent_id) {
    result.parentProject = {
      projectId: project.parent_id,
      name: "Not found", // If sync'ed, the real name will be shown instead.
    };
  }
  return result;
}

/**
 * Convert a Task API response to a Task schema.
 */
function toTask(task: any, withReferences = false) {
  let result: any = {
    name: task.content,
    description: task.description,
    url: task.url,
    completed: task.is_completed,
    order: task.order,
    priority: task.priority,
    due: task.due,
    taskId: task.id,
    projectId: task.project_id,
    parentTaskId: task.parent_id,
  };
  if (withReferences) {
    // Add a reference to the corresponding row in the Projects sync table.
    result.project = {
      projectId: task.project_id,
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

// Formulas (read-only).

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
    return toProject(response.body);
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
    return toTask(response.body);
  },
});

// Column Formats.

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

// Action formulas (buttons/automations).

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
  extraOAuthScopes: ["data:read_write"],
  onError: handleMissingScopes,

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
  extraOAuthScopes: ["data:read_write"],
  onError: handleMissingScopes,

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
  name: "UpdateTask",
  description: "Updates the name of a task.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task to update.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The new name of the task.",
    }),
  ],
  resultType: coda.ValueType.Object,
  // For schemas returned by actions to update rows in a sync table, set the
  // identity on the schema to match the identityName on the sync table being
  // updated, using the helper function coda.withIdentity().
  schema: coda.withIdentity(TaskSchema, "Task"),
  isAction: true,
  extraOAuthScopes: ["data:read_write"],
  onError: handleMissingScopes,

  execute: async function ([taskId, name], context) {
    let url = "https://api.todoist.com/rest/v2/tasks/" + taskId;
    await context.fetcher.fetch({
      url: url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: name,
      }),
    });
    // Get the updated Task and return it, which will update the row in the sync
    // table.
    let response = await context.fetcher.fetch({
      url: url,
      method: "GET",
      cacheTtlSecs: 0, // Ensure we are getting the latest data.
    });
    return toTask(response.body);
  },
});

pack.addFormula({
  name: "MarkAsComplete",
  description: "Mark a task as completed.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "taskId",
      description: "The ID of the task to be marked as complete.",
    }),
  ],
  resultType: coda.ValueType.Object,
  // For schemas returned by actions to update rows in a sync table, set the
  // identity on the schema to match the identityName on the sync table being
  // updated, using the helper function coda.withIdentity().
  schema: coda.withIdentity(TaskSchema, "Task"),
  isAction: true,
  extraOAuthScopes: ["data:read_write"],
  onError: handleMissingScopes,

  execute: async function ([taskId], context) {
    let url = "https://api.todoist.com/rest/v2/tasks/" + taskId + "/close";
    await context.fetcher.fetch({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Get the updated Task and return it, which will update the row in the sync
    // table.
    let response = await context.fetcher.fetch({
      url: "https://api.todoist.com/rest/v2/tasks/" + taskId,
      method: "GET",
      cacheTtlSecs: 0, // Ensure we are getting the latest data.
    });
    return toTask(response.body);
  },
});

// Sync tables.

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

      let results = [];
      for (let project of response.body) {
        results.push(toProject(project, true));
      }
      return {
        result: results,
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

      let results = [];
      for (let task of response.body) {
        results.push(toTask(task, true));
      }
      return {
        result: results,
      };
    },
  },
});

// Helper functions.

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

function handleMissingScopes(error: coda.StatusCodeError) {
  if (error.statusCode === 401) {
    throw new coda.MissingScopesError();
  }
  throw error;
}
