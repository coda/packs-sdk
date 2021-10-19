# Sync Tables

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent sync options and returns an array of objects representing row data. A sync table also includes a schema describing the structure of the returned objects.

=== "Basic Sync Table"
    ```ts
    const MySchema = coda.makeObjectSchema({
      type: coda.ValueType.Object,
      // The actual schema properties.
      properties: {
        // Add your properties here e.g.
        // idColumn: {type: coda.ValueType.String},
        // displayColumn: {type: coda.ValueType.String},
        // otherColumn: {type: coda.ValueType.Number},
      },
      // The property name from the properties object below that represents the
      // unique identifier of this item. A sync table MUST have a stable unique
      // identifier. Without one, each subsequent sync will wipe away all rows and
      // recreate them from scratch.
      id: "<idColumn>",
      // The property name from the properties object below that should label this
      // item in the UI. All properties can be seen when hovering over a synced
      // item in the UI, but the primary property value is shown on the chip
      // representing the full object.
      primary: "<displayColumn>",
    })

    // Replace all <text> with your own text
    pack.addSyncTable({
      // The display name for the table, shown in the UI.
      name: "<MySyncTable>",
      // The unique identifier for the table.
      identityName: "<TableName>",
      schema: MySchema,
      formula: {
        // This is the name that will be called in the formula builder.
        // Remember, your formula name cannot have spaces in it.
        name: "<SyncTable>",
        description: "<Creates a sync table>",

        // If your formula requires one or more inputs, you’ll define them here.
        // You can change the coda.Type to anything but object.
        parameters: [
          coda.makeParameter({
            type: coda.ParameterType.String,
            name: "<myParam>",
            description: "<My description>",
          }),
        ],

        // Everything inside this statement will execute anytime your Coda formula
        // is called in a doc.
        execute: async function ([param], context) {
          let response = await context.fetcher.fetch({
            method: "GET",
            url: "<your url>"
          });
          return {
            result: [
              {
                // idColumn: "Example1",
                // displayColumn: response.body,
                // otherColumn: myParam,
              },
            ],
          };
        },
      },
    });
    ```
