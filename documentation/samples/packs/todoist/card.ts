import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

// A schema defining the card, including all of metadata what specifically to
// highlight in the card.
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
    priority: {
      description: "The priority of the task.",
      type: coda.ValueType.String,
    },
    taskId: {
      description: "The ID of the task.",
      type: coda.ValueType.String,
      required: true,
    },
  },
  // Which property's content to show in the title of the card.
  displayProperty: "name",
  // Which property contains the link to open when the card is clicked.
  linkProperty: "url",
  // Which property's content to show in the body of the card.
  snippetProperty: "description",
  // Which properties' content to show in the subtitle of the card.
  subtitleProperties: ["priority"],
});

// Formula that renders a card for a task given it's URL. This will be shown a
// "Card" in the Pack's list of building blocks, but is also a regular formula
// that can be used elsewhere.
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
    let task = response.body;
    return {
      name: task.content,
      description: task.description,
      url: task.url,
      priority: task.priority,
      taskId: task.id,
    };
  },
});

// Regular expressions that match Todoist task URLs. Used to match and parse
// relevant URLs.
const TaskUrlPatterns: RegExp[] = [
  new RegExp("^https://todoist.com/app/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/app/project/[0-9]+/task/([0-9]+)$"),
  new RegExp("^https://todoist.com/showTask\\?id=([0-9]+)"),
];

// Add a column format for the Task formula, to define which URLs it should
// trigger for. This also makes it easier to use the formula in a table column.
pack.addColumnFormat({
  // How the option will show in the link and column type dialogs.
  name: "Task",
  // The formula that generates the card.
  formulaName: "Task",
  // The set of regular expressions that match Todoist task URLs.
  matchers: TaskUrlPatterns,
});

// Helper function to extract the Task ID from the URL.
function extractTaskId(taskUrl: string) {
  for (let pattern of TaskUrlPatterns) {
    let matches = taskUrl.match(pattern);
    if (matches && matches[1]) {
      return matches[1];
    }
  }
  throw new coda.UserVisibleError("Invalid task URL: " + taskUrl);
}

// Allow the pack to make requests to Todoist.
pack.addNetworkDomain("todoist.com");

// Setup authentication using a Todoist API token.
pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://todoist.com/app/settings/integrations",
});
