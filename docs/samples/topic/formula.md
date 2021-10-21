# Formulas

A **formula (including a button)** is a JavaScript function that will be exposed as a Coda formula, that you can use anywhere in a Coda doc that you can use any normal formula. Formulas take basic Coda types as input, like strings, numbers, dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any of these types. Buttons are just a flavor of a formula with the flag `isAction` activated.

=== "Template"
    ```ts
    pack.addFormula({
      name: "<User-visible name of formula>",
      description: "<Help text for the formula>",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "<User-visible name of parameter>",
          description: "<Help text for the parameter>",
        }),
        // Add more parameters here and in the array below.
      ],
      resultType: coda.ValueType.String,
      execute: async ([param], context) => {
        return "Hello " + param;
      },
    });
    ```
=== "Image (Cats)"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    // Formula that fetches a random cat image, with various options.
    pack.addFormula({
      name: "CatImage",
      description: "Gets a random cat image.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "text",
          description: "Text to display over the image.",
          optional: true,
        }),
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "filter",
          description: "A filter to apply to the image.",
          autocomplete: ["blur", "mono", "sepia", "negative", "paint", "pixel"],
          optional: true,
        }),
      ],
      resultType: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      execute: async ([text, filter], context) => {
        let url = "https://cataas.com/cat";
        if (text) {
          url += "/says/" + encodeURIComponent(text);
        }
        url = coda.withQueryParams(url, {
          filter: filter,
          json: true,
        });
        let response = await context.fetcher.fetch({
          method: "GET",
          url: url,
          cacheTtlSecs: 0, // Don't cache the result, so we can get a fresh cat.
        });
        return "https://cataas.com" + response.body.url;
      },
    });

    // Allow the pack to make requests to Cat-as-a-service API.
    pack.addNetworkDomain("cataas.com");
    ```
=== "Rich Data (Todoist)"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    // A schema defining the rich metadata to be returned about each task.
    const TaskSchema = coda.makeObjectSchema({
      type: coda.ValueType.Object,
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
          codaType: coda.ValueHintType.Url
        },
        taskId: {
          description: "The ID of the task.",
          type: coda.ValueType.Number,
          required: true,
        },
      },
      primary: "name",
      id: "taskId",
      identity: {
        name: "Task",
      },
    });

    // Formula that looks up rich metadata about a task given it's URL.
    pack.addFormula({
      name: "GetTaskById",
      description: "Gets a Todoist task by ID",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "taskId",
          description: "The ID of the task",
        }),
      ],
      resultType: coda.ValueType.Object,
      schema: TaskSchema,

      execute: async function ([taskId], context) {
        let response = await context.fetcher.fetch({
          url: "https://api.todoist.com/rest/v1/tasks/" + taskId,
          method: "GET",
        });
        let task = response.body;
        return {
          name: task.content,
          description: task.description,
          url: task.url,
          taskId: task.id,
        };
      },
    });

    // Allow the pack to make requests to Todoist.
    pack.addNetworkDomain("todoist.com");

    // Setup authentication using a Todoist API token.
    pack.setUserAuthentication({
      type: coda.AuthenticationType.HeaderBearerToken,
      instructionsUrl: "https://todoist.com/app/settings/integrations",
    });
    ```
