# Dynamic Sync Tables

Most sync tables have schemas that can be statically defined. For example, if you're writing a sync of a user's Google Calendar events, the structure of an Event from the Google Calendar API is well-known and you can write a schema for what your table should contain.

In certain cases, you may want to sync data whose structure is not known in advance and may depend on the user doing the sync. For example, Coda's Jira pack allows users to sync data from their Jira instance, but Jira lets users create arbitrary custom fields for their Issue objects. So the schema of the Issues sync table is not known in advance; it depends on the Jira account that the user is syncing from.

Coda supports "dynamic" sync tables for cases like these. Instead of including a static schema in your sync table definition, you include a formula that returns a schema. This formula can use the fetcher to make authenticated http requests to your Pack's API so that you may retrieve any necessary info from that third-party service needed to construct an appropriate schema.

To define a dynamic schema, use the `makeDynamicSyncTable()` wrapper function. You will provide a `getSchema` formula that returns a schema definition. You'll also provide some supporting formulas like `getName`, to return a name in the UI for the table, in case even the name of the entities being synced is dynamic.

There are two subtle variants of dynamic sync tables. A sync table can be dynamic simply because the shape of the entities being synced vary based on who the current user is. For example, in the Jira example, Jira Issues are synced by hitting the same static Jira API url for Issues, but the schema of the issues returned will be different depending on the configuration of the Jira instance of the calling user.

Alternatively, a sync table can be dynamic because the data source is specific to each instance of the table. If you were building a sync table to sync data from a Google Sheet, the data source would be the API url of a specific sheet. In this case, the sync table will be bound to a `dynamicUrl` that defines the data source. This url will be available to all of the formulas to implement the sync table in the sync context, as `context.sync.dynamicUrl`. To create a sync table that uses dynamic urls, you must implement the `listDynamicUrls` metadata formula in your dynamic sync table definition.

=== "Basic Dynamic Sync Table"
    ```ts
    // Replace all <text> with your own names
    pack.addDynamicSyncTable({
      // The static name for this category of sync table
      name: "<MyDynamicSynctable>",
      // The display name for the table, shown in the UI.
      getName: async context => {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: context.sync.dynamicUrl
        });
        // Return whatever represents the name of the entity you're syncing.
        return response.body.name;
      },
      // A label for the kind of entities that you are syncing.
      // Using Google Sheets as example you might use "Row" here, as each synced
      // entity is a row from the source sheet.
      entityName: "<RowName>",
      getSchema: async () => {
        return coda.makeSchema({
          type: coda.ValueType.Array,
          items: coda.makeObjectSchema({
            type: coda.ValueType.Object,
            // The actual schema properties.
            properties: {
              // Add your properties here e.g.
              // idColumn: {type: coda.ValueType.Number},
              // displayColumn: {type: coda.ValueType.String},
              // otherColumn: {type: coda.ValueType.String},
            },
            // The property name from the properties object below that represents
            // the unique identifier of this item. A sync table MUST have a stable
            // unique identifier. Without one, each subsequent sync will wipe away
            // all rows and recreate them from scratch.
            id: "<idColumn>",
            // The property name from the properties object below that should label
            // this item in the UI. All properties can be seen when hovering over a
            // synced item in the UI, but the primary property value is shown on the
            // chip representing the full object.
            primary: "<displayColumn>",
            // The columns that will be displayed on the table
            featured: ["<otherColumn>"],
          }),
        });
      },
      // A user-friendly url representing the entity being synced. The table UI in
      // the doc will provide a convenience link to this url so the user can easily
      // click through to the source of data in that table.
      getDisplayUrl: async context => {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: context.sync.dynamicUrl
        });
        // Return whatever represents a browser-friendly version of the dynamic url.
        return response.body.browserLink;
      },
      formula: {
        // This is the name that will be called in the formula builder.
        // Remember, your formula name cannot have spaces in it.
        name: "<DynamicSyncTable>",
        description: "<Creates a dynamic sync table>",

        // If your formula requires one or more inputs, you’ll define them here.
        parameters: [
          coda.makeParameter({
            type: coda.ParameterType.String,
            name: "<myParam>",
            description: "<My description>",
          }),
        ],
        // Everything inside this statement will execute anytime your Coda function
        // is called in a doc.
        execute: async function ([param], context) {
          return {
            result: [
              // {
              //   idPropertyName: 1,
              //   displayPropertyName: "<Example1>",
              //   otherPropertyName: myParam,
              // },
            ],
          };
        },
      },
    });
    ```
