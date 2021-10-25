# Dynamic Sync Tables

Most sync tables have schemas that can be statically defined. For example, if you're writing a sync of a user's Google Calendar events, the structure of an Event from the Google Calendar API is well-known and you can write a schema for what your table should contain.

In certain cases, you may want to sync data whose structure is not known in advance and may depend on the user doing the sync. For example, Coda's Jira pack allows users to sync data from their Jira instance, but Jira lets users create arbitrary custom fields for their Issue objects. So the schema of the Issues sync table is not known in advance; it depends on the Jira account that the user is syncing from.

Coda supports "dynamic" sync tables for cases like these. Instead of including a static schema in your sync table definition, you include a formula that returns a schema. This formula can use the fetcher to make authenticated http requests to your Pack's API so that you may retrieve any necessary info from that third-party service needed to construct an appropriate schema.

To define a dynamic schema, use the `makeDynamicSyncTable()` wrapper function. You will provide a `getSchema` formula that returns a schema definition. You'll also provide some supporting formulas like `getName`, to return a name in the UI for the table, in case even the name of the entities being synced is dynamic.

There are two subtle variants of dynamic sync tables. A sync table can be dynamic simply because the shape of the entities being synced vary based on who the current user is. For example, in the Jira example, Jira Issues are synced by hitting the same static Jira API url for Issues, but the schema of the issues returned will be different depending on the configuration of the Jira instance of the calling user.

Alternatively, a sync table can be dynamic because the data source is specific to each instance of the table. If you were building a sync table to sync data from a Google Sheet, the data source would be the API url of a specific sheet. In this case, the sync table will be bound to a `dynamicUrl` that defines the data source. This url will be available to all of the formulas to implement the sync table in the sync context, as `context.sync.dynamicUrl`. To create a sync table that uses dynamic urls, you must implement the `listDynamicUrls` metadata formula in your dynamic sync table definition.

=== "Template"
    ```ts
    pack.addDynamicSyncTable({
      name: "<User-visible name for the sync table>",
      getName: coda.makeMetadataFormula(async context => {
        let datasourceUrl = context.sync!.dynamicUrl!;
        // TODO: Fetch metdata about the datasource and return the name.
        return "<Datasource Name>";
      }),
      getSchema: coda.makeMetadataFormula(async context => {
        let datasourceUrl = context.sync!.dynamicUrl!;
        // TODO: Fetch metdata about the datasource and get the list of fields.
        let propreties = {
          // TODO: Create a property for each field.
        };
        let id = "<Determine the field containing a unique ID>";
        let primary = "<Determine the field containing the display value>";
        let featured = [
          // TODO: Determine which fields to show in the table by default.
        ];
        return coda.makeSchema({
          type: coda.ValueType.Array,
          items: coda.makeObjectSchema({
            type: coda.ValueType.Object,
            identity: {
              name: "<User-visible name for the column containing the schema>",
              dynamicUrl: datasourceUrl,
            },
            properties: propreties,
            id: id,
            primary: primary,
            featured: featured,
          }),
        });
      }),
      getDisplayUrl: coda.makeMetadataFormula(async context => {
        return context.sync!.dynamicUrl!;
      }),
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
          let datasourceUrl = context.sync!.dynamicUrl!;
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
