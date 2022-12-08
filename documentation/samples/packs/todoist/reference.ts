import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the data in the Projects sync table.
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
    projectId: {
      description: "The ID of the project.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "projectId",
  featuredProperties: ["url"],
});

// A reference schema, allowing other sync tables to link to rows in the
// Projects sync table. The second parameter must match the identityName field
// of the sync table being referenced.
const ProjectReferenceSchema = coda.makeReferenceSchemaFromObjectSchema(
  ProjectSchema, "Project");

// A schema defining the data in the Tasks sync table.
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
    },
    url: {
      description: "A link to the task in the Todoist app.",
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
    },
    // Reference a project from the Projects sync table.
    project: ProjectReferenceSchema,
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  displayProperty: "name",
  idProperty: "taskId",
  featuredProperties: ["description", "url", "project"],
});

// The definition and logic for the Projects sync table.
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
        results.push({
          name: project.name,
          url: project.url,
          projectId: project.id,
        });
      }
      return {
        result: results,
      };
    },
  },
});

// The definition and logic for the Tasks sync table.
pack.addSyncTable({
  name: "Tasks",
  schema: TaskSchema,
  identityName: "Task",
  formula: {
    name: "SyncTasks",
    description: "Sync tasks",
    parameters: [],
    execute: async function ([], context) {
      let url = "https://api.todoist.com/rest/v2/tasks";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });

      let results = [];
      for (let task of response.body) {
        let item: any = {
          name: task.content,
          description: task.description,
          url: task.url,
          taskId: task.id,
        };
        if (task.project_id) {
          // Add a reference to the parent project in the Projects table.
          item.project = {
            projectId: task.project_id,
            name: "Not found", // Placeholder name, if not synced yet.
          };
        }
        results.push(item);
      }
      return {
        result: results,
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
