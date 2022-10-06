import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addDynamicSyncTable({
  name: "<User-visible name for the sync table>",
  listDynamicUrls: async function (context) {
    // TODO: Fetch the list of data sources the user can connect to.
    return [{ display: "<Datasource Name>", value: "<Datasource URL>" }];
  },
  getName: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and return the name.
    return "<Datasource Name>";
  },
  identityName: "<User-visible name for the column containing the schema>",
  getSchema: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and get the list of fields.
    let properties: coda.ObjectSchemaProperties = {
      // TODO: Create a property for each field.
    };
    let idProperty = "<Determine the field containing a unique ID>";
    let displayProperty = "<Determine the field containing the display value>";
    let featuredProperties = [
      // TODO: Determine which fields to show in the table by default.
    ];
    return coda.makeObjectSchema({
      properties: properties,
      idProperty: idProperty,
      displayProperty: displayProperty,
      featuredProperties: featuredProperties,
    });
  },
  getDisplayUrl: async function (context) {
    return context.sync.dynamicUrl!;
  },
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
    execute: async function ([param], context) {
      let datasourceUrl = context.sync.dynamicUrl!;
      let url = "<URL to pull data from>";
      let response = await context.fetcher.fetch({
        method: "GET",
        url: url,
      });
      let items = response.body.items;
      // Adjust the items to fit the schema if required.
      return {
        result: items,
      };
    },
  },
});
