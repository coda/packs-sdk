# Sync Tables

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.

=== "Template"
    ```ts
    const MySchema = coda.makeObjectSchema({
      type: coda.ValueType.Object,
      properties: {
        property1: {type: coda.ValueType.Number},
        property2: {type: coda.ValueType.String},
        // Add more properties here.
      },
      id: "property1", // Which property above is a unique ID.
      primary: "property2", // Which property above to display by default.
      identity: {
        name: "<User-visible name for the column containing the schema>",
      },
    });

    pack.addSyncTable({
      name: "<User-visible name for the sync table>",
      identityName: "<User-visible name for the column containing the schema>",
      schema: MySchema,
      formula: {
        name: "<Name of the sync formula, not show to the user>",
        description: "<Help text for the sync formula, not show to the user>",
        parameters: [
          coda.makeParameter({
            type: coda.ParameterType.String,
            name: "<User-visible name of parameter>",
            description: "<Help text for the parameter>",
          }),
          // Add more parameters here and in the array below.
        ],
        execute: async ([param], context) => {
          let url = "<URL to pull data from>";
          let response = await context.fetcher.fetch({
            method: "GET", 
            url: url,
          });
          let items = response.body.items;
          // Adjust the items to fit the schema if required.
          return {
            result: items,
          }
        },
      },
    });
    ```
=== "Todoist"
    ```ts
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    // A schema defining the data in the sync table.
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
      featured: ["description", "url"],
      identity: {
        name: "Task",
      },
    });

    pack.addSyncTable({
      name: "Tasks",
      schema: TaskSchema,
      identityName: "Task",
      formula: {
        name: "SyncTasks",
        description: "Sync tasks",
        parameters: [],
        execute: async function ([], context) {
          let url = "https://api.todoist.com/rest/v1/tasks";
          let response = await context.fetcher.fetch({
            method: "GET",
            url: url,
          });

          let results: any[] = [];
          for (let task of response.body) {
            results.push({
              name: task.content,
              description: task.description,
              url: task.url,
              taskId: task.id,
            });
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
    ```
