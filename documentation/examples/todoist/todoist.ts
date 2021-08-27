import * as coda from '../../../index';

// BEGIN
// **This import statement gives you access to all parts of the Coda Packs SDK. Uncomment to start!**
// import * as coda from '@codahq/packs-sdk';

// This line creates your new Pack.
export const pack = coda.newPack();

// We use "user authentication" so that users of this Pack will provide their own credentials,
// as opposed to "system authentication", which the pack author provides a single set of credentials
// that apply to all requests from this pack.
// In this case, users must grab the API token from the "Integrations" tab within Todoist's settings
pack.setUserAuthentication({type: coda.AuthenticationType.HeaderBearerToken});

// When using the fetcher, this is the domain of the API that your pack makes fetcher requests to.
pack.addNetworkDomain('api.todoist.com');

// The following adds a new formula to this Pack.
pack.addFormula({
  // Remember, the formula name cannot have spaces in it.
  name: 'AddProject',
  description: 'Add a Todoist project',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'title',
      description: 'The title or name of your new project',
    }),
  ],
  execute: async function ([title], context) {
    // This formula makes an HTTP Post request to create a new project.
    await context.fetcher.fetch({
      url: `https://api.todoist.com/rest/v1/projects`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      // The project is created with the given title. No other fields are needed.
      body: JSON.stringify({
        name: title,
      }),
    });
    // We don't necessarily have to return anything, but it's useful to return
    // some kind of non-empty values that callers can use to check whether this
    // button action has already been taken. Often it's a good idea to return the
    // id of the object that was created, if possible.
    return 'OK';
  },
  // This is an action, so it will show up as a button in the Coda UI.
  isAction: true,
  // This formula requires that a user has connected a Todoist account.
  connectionRequirement: coda.ConnectionRequirement.Required,

  // This formula returns a simple string upon completion, per line 46 above.
  resultType: coda.ValueType.String,
});

pack.addFormula({
  name: 'AddTask',
  description: 'Add a task.',

  // This formula takes two parameters: the task, and the project it is to be added to.
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'content',
      description: 'Content of the task.',
    }),

    // The project is an optional field. If not provided, it defaults to the inbox per Todoist's documentation.
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'project',
      description: 'project ID. if blank, will default to inbox.',
      optional: true,
    }),
  ],
  execute: async function ([title, id], context) {
    await context.fetcher.fetch({
      url: `https://api.todoist.com/rest/v1/tasks`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: title,
        project_id: id,
      }),
    });
    return 'OK';
  },
  isAction: true,
  connectionRequirement: coda.ConnectionRequirement.Required,
  resultType: coda.ValueType.String,
});

pack.addFormula({
  name: 'MarkAsComplete',
  description: 'Mark a task as completed.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'taskId',
      description: 'The ID of the task to be marked as complete.',
    }),
  ],

  // This formula makes a POST request to a designated URL constructed from the task ID.
  execute: async function ([id], context) {
    await context.fetcher.fetch({
      url: `https://api.todoist.com/rest/v1/tasks/${id}/close`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return 'OK';
  },
  isAction: true,
  connectionRequirement: coda.ConnectionRequirement.Required,
  resultType: coda.ValueType.String,
});

// Here, we define the two schemas for our sync tables (tasks and projects).
const taskSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,

  // These properties are applied to each row and will be used to define other information about this schema below.
  properties: {
    task: {type: coda.ValueType.String},
    projectId: {type: coda.ValueType.Number},
    id: {type: coda.ValueType.Number},
  },

  // The 'primary' property defines which field from this object will render in
  // the object chip in the UI.
  primary: 'task',

  // The 'featured' array defines which of the above properties should have columns
  // created for them by default. If your schema has lots of properties, it's often
  // a good idea to only feature some of them so the table doesn't have an overwhelming
  // number of columns. Users can always add additional columns for non-featured properties
  // at any time.
  featured: ['projectId'],

  // 'id' is the property that acts as the unique id of each row.
  // Entities being synced must have unique, stable ids in order for rows to be updated
  // in-place on subsequent syncs.
  id: 'id',
});

const projectSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  primary: 'name',
  featured: ['projectId'],
  id: 'projectId',
  properties: {
    name: {type: coda.ValueType.String},
    projectId: {type: coda.ValueType.Number},
  },
});

pack.addSyncTable({
  // This is the name of the table displayed to users.
  name: 'Tasks',
  // This is a unique identifier for this table, used internally by Coda.
  identityName: 'TaskTitle',
  schema: taskSchema,
  // Users must have a connection to Todoist to sync in tasks.
  connectionRequirement: coda.ConnectionRequirement.Required,
  formula: {
    name: 'Tasks',
    description: 'Sync current tasks',
    parameters: [],

    // Unlike canvas formulas, sync table formulas may run multiple times to get
    // multiple pages of results, based on whether you return a "continuation".
    execute: async function ([], context) {
      const url = 'https://api.todoist.com/rest/v1/tasks';
      const response = await context.fetcher.fetch({method: 'GET', url});
      const result = [];

      // Here, we add the relevant properties from the returned JSON per task to a new array.
      for (const taskObj of response.body) {
        result.push({
          task: taskObj.content,
          projectId: taskObj.project_id,
          id: taskObj.id,
        });
      }

      return {
        result,
        // Todoist returns all tasks at once, so this formula only needs to run once to fill the sync table.
        continuation: undefined,
      };
    },
  },
});

pack.addSyncTable({
  name: 'Projects',
  schema: projectSchema,
  identityName: 'Project',
  connectionRequirement: coda.ConnectionRequirement.Required,
  formula: {
    name: 'Projects',
    description: 'Sync open projects',
    parameters: [],
    execute: async function ([], context) {
      const url = `https://api.todoist.com/rest/v1/projects`;
      const response = await context.fetcher.fetch({method: 'GET', url});

      const result = [];

      for (const project of response.body) {
        result.push({
          name: project.name,
          projectId: project.id,
        });
      }

      return {result};
    },
  },
});
