---
nav: Todoist
description: A Pack that integrates with the application Todoist.
icon: octicons/tasklist-16
---

# Todoist sample

This Pack provides an integration with the task tracking app [Todoist][todoist]. It uses a variety of building blocks to allow users to work with their projects and tasks, including:

- Formulas that provide rich data about an item given its URL.
- Column formats that automatically apply those formulas to matching URLs.
- Action formulas that create and update items, for use in button and automations.
- Sync tables for pulling in all of the user's items.

The Pack uses OAuth2 to connect to a user's Todoist account, which you can create for free.

[todoist]: https://todoist.com/


=== "pack.ts"
    ```ts
    import * as sdk from "@codahq/packs-sdk";

    // #region Constants

    const ApiUrl = "https://api.todoist.com/api/v1";

    const ProjectUrlPatterns: RegExp[] = [
      // The current URL format, where the ID follows a slug of the project name.
      new RegExp("^https://app.todoist.com/app/project/(?:.*-)?([0-9a-zA-Z]+)$"),
      // Legacy URL formats, which only used numeric IDs.
      new RegExp("^https://todoist.com/app/project/([0-9]+)$"),
      new RegExp("^https://todoist.com/showProject\\?id=([0-9]+)"),
    ];

    const TaskUrlPatterns: RegExp[] = [
      // The current URL format, where the ID follows a slug of the task name.
      new RegExp("^https://app.todoist.com/app/task/(?:.*-)?([0-9a-zA-Z]+)$"),
      // Legacy URL formats, which only used numeric IDs.
      new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
      new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
      new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
    ];

    // #endregion


    // #region Pack setup

    export const pack = sdk.newPack();

    pack.addNetworkDomain("todoist.com");

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.OAuth2,
      // OAuth2 URLs and scopes are found in the Todoist OAuth guide:
      // https://developer.todoist.com/guides/#oauth
      authorizationUrl: "https://app.todoist.com/oauth/authorize",
      tokenUrl: "https://api.todoist.com/oauth/access_token",
      scopes: ["data:read_write"],
      scopeDelimiter: ",",

      // Determines the display name of the connected account.
      getConnectionName: async function (context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: sdk.joinUrl(ApiUrl, "/user"),
        });
        return response.body.full_name;
      },
    });

    // #endregion


    // #region Schemas

    const DueSchema = sdk.makeObjectSchema({
      properties: {
        date: {
          description: "When the task is due.",
          type: sdk.ValueType.String,
          // The API returns either a date or a datetime here, depending on if the
          // task has a specific time set.
          codaType: sdk.ValueHintType.DateTime,
        },
        recurring: {
          description: "If the task repeats on a schedule.",
          type: sdk.ValueType.Boolean,
          fromKey: "is_recurring",
        },
        display: {
          description: "The display value for the due date.",
          type: sdk.ValueType.String,
          fromKey: "string",
        },
      },
      displayProperty: "display",
    });

    const ProjectSchema = sdk.makeObjectSchema({
      properties: {
        name: {
          description: "The name of the project.",
          type: sdk.ValueType.String,
          mutable: true,
          required: true,
        },
        url: {
          description: "A link to the project in the Todoist app.",
          type: sdk.ValueType.String,
          codaType: sdk.ValueHintType.Url,
        },
        shared: {
          description: "Is the project is shared.",
          type: sdk.ValueType.Boolean,
          fromKey: "is_shared",
        },
        favorite: {
          description: "Is the project a favorite.",
          type: sdk.ValueType.Boolean,
          mutable: true,
          fromKey: "is_favorite",
        },
        id: {
          description: "The ID of the project.",
          type: sdk.ValueType.String,
          required: true,
        },
        parentProjectId: {
          description: "For sub-projects, the ID of the parent project.",
          type: sdk.ValueType.String,
          fromKey: "parent_id",
        },
      },
      displayProperty: "name",
      // Sync table metadata.
      idProperty: "id",
      featuredProperties: ["url", "favorite"],
      // Card metadata.
      linkProperty: "url",
      subtitleProperties: ["shared", "favorite"],
    });

    // Create a reference schema for projects, to use for relation columns.
    const ProjectReferenceSchema =
      sdk.makeReferenceSchemaFromObjectSchema(ProjectSchema, "Project");

    // Using the reference schema, add a property for the parent project.
    (ProjectSchema.properties as sdk.ObjectSchemaProperties)
      .parentProject = ProjectReferenceSchema;

    const TaskSchema = sdk.makeObjectSchema({
      properties: {
        name: {
          description: "The name of the task.",
          type: sdk.ValueType.String,
          fromKey: "content",
          required: true,
          mutable: true,
        },
        description: {
          description: "A detailed description of the task.",
          type: sdk.ValueType.String,
          codaType: sdk.ValueHintType.Markdown,
          mutable: true,
        },
        url: {
          description: "A link to the task in the Todoist app.",
          type: sdk.ValueType.String,
          codaType: sdk.ValueHintType.Url,
        },
        completed: {
          description: "If the task has been completed.",
          type: sdk.ValueType.Boolean,
          fromKey: "checked",
          mutable: true,
        },
        order: {
          description: "The position of the task in the project or parent task.",
          type: sdk.ValueType.Number,
          fromKey: "child_order",
          mutable: true,
        },
        priority: {
          description: "The priority of the task.",
          type: sdk.ValueType.String,
          codaType: sdk.ValueHintType.SelectList,
          options: ["P1", "P2", "P3", "P4"],
          mutable: true,
        },
        due: {
          description: "When the task is due.",
          ...DueSchema,
        },
        id: {
          description: "The ID of the task.",
          type: sdk.ValueType.String,
          required: true,
        },
        projectId: {
          description: "The ID of the project that the task belongs to.",
          type: sdk.ValueType.String,
          fromKey: "project_id",
        },
        parentTaskId: {
          description: "For sub-tasks, the ID of the parent task it belongs to.",
          type: sdk.ValueType.String,
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
      idProperty: "id",
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
      sdk.makeReferenceSchemaFromObjectSchema(TaskSchema, "Task");

    // Using the reference schema, add a property for the parent task.
    (TaskSchema.properties as sdk.ObjectSchemaProperties)
      .parentTask = TaskReferenceSchema;

    // Format a project from the API and return an object matching the schema.
    function formatProjectForSchema(project: any, withReferences = false) {
      let result: any = {
        ...project,
        url: getProjectUrl(project.id),
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
        url: getTaskUrl(task.id),
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
            id: task.parent_id,
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
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "url",
          description: "The URL of the project",
        }),
      ],
      resultType: sdk.ValueType.Object,
      schema: ProjectSchema,
      execute: async function ([url], context) {
        let projectId = extractProjectId(url);
        let response = await context.fetcher.fetch({
          url: sdk.joinUrl(ApiUrl, "/projects/", projectId),
          method: "GET",
        });
        return formatProjectForSchema(response.body);
      },
    });

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
          url: sdk.joinUrl(ApiUrl, "/tasks/", taskId),
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
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "name",
          description: "The name of the new project",
        }),
      ],
      resultType: sdk.ValueType.String,
      isAction: true,
      execute: async function ([name], context) {
        let response = await context.fetcher.fetch({
          url: sdk.joinUrl(ApiUrl, "/projects"),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
          }),
        });
        return getProjectUrl(response.body.id);
      },
    });

    pack.addFormula({
      name: "AddTask",
      description: "Add a new task.",
      parameters: [
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "name",
          description: "The name of the task.",
        }),
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "projectId",
          description: "The ID of the project to add it to. If blank, " +
            "it will be added to the user's Inbox.",
          optional: true,
        }),
      ],
      resultType: sdk.ValueType.String,
      isAction: true,
      execute: async function ([name, projectId], context) {
        let response = await context.fetcher.fetch({
          url: sdk.joinUrl(ApiUrl, "/tasks"),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: name,
            project_id: projectId,
          }),
        });
        return getTaskUrl(response.body.id);
      },
    });

    pack.addFormula({
      name: "SetDueDate",
      description: "Change the due date of a task.",
      parameters: [
        sdk.makeParameter({
          type: sdk.ParameterType.String,
          name: "taskId",
          description: "The ID of the task.",
        }),
        sdk.makeParameter({
          type: sdk.ParameterType.Date,
          name: "date",
          description: "The date the task is due.",
        }),
        sdk.makeParameter({
          type: sdk.ParameterType.Boolean,
          name: "endOfDay",
          description:
            "If the task is due at the end of the day (vs a specific time).",
          suggestedValue: true,
        }),
      ],
      resultType: sdk.ValueType.Object,
      // To update the existing row in a sync table, return the schema with an
      // identity matching the identityName on the sync table being updated, using
      // the helper function sdk.withIdentity().
      schema: sdk.withIdentity(TaskSchema, "Task"),
      isAction: true,
      execute: async function ([taskId, date, endOfDay = false], context) {
        let url = sdk.joinUrl(ApiUrl, "/tasks/", taskId);
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
          let url = sdk.joinUrl(ApiUrl, "/projects");
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });

          let results: any[] = [];
          for (let project of response.body.results) {
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
            url: sdk.joinUrl(ApiUrl, "/projects/", project.id),
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
          sdk.makeParameter({
            type: sdk.ParameterType.String,
            name: "filter",
            description: "A supported filter string. See the Todoist help center.",
            optional: true,
          }),
        ],
        execute: async function ([filter], context) {
          let url = sdk.joinUrl(ApiUrl, "/tasks");
          if (filter) {
            // Filter queries are handled by a separate endpoint.
            url = sdk.withQueryParams(sdk.joinUrl(ApiUrl, "/tasks/filter"), {
              query: filter,
            });
          }
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });

          let results: any[] = [];
          for (let task of response.body.results) {
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
            url: sdk.joinUrl(ApiUrl, "/sync"),
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
                return new sdk.UserVisibleError(status.error);
              }
            }
            // If there were no errors, fetch the updated task and return it.
            let response = await context.fetcher.fetch({
              method: "GET",
              url: sdk.joinUrl(ApiUrl, "/tasks/", taskId),
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
    function generateTaskCommands(update: sdk.GenericSyncUpdate): any[] {
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
      if (previousValue.checked !== newValue.checked) {
        commands.push({
          type: newValue.checked ? "item_complete" : "item_uncomplete",
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
      throw new sdk.UserVisibleError("Invalid project URL: " + projectUrl);
    }

    function extractTaskId(taskUrl: string) {
      for (let pattern of TaskUrlPatterns) {
        let matches = taskUrl.match(pattern);
        if (matches && matches[1]) {
          return matches[1];
        }
      }
      throw new sdk.UserVisibleError("Invalid task URL: " + taskUrl);
    }

    function getProjectUrl(projectId: string) {
      return "https://app.todoist.com/app/project/" + projectId;
    }

    function getTaskUrl(taskId: string) {
      return "https://app.todoist.com/app/task/" + taskId;
    }

    function getUniqueId() {
      return Math.random().toString(36);
    }

    // #endregion
    ```

