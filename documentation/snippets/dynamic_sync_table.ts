import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addDynamicSyncTable({
  name: "<User-visible name for the sync table>",
  listDynamicUrls: async function (context) {
    // TODO: Fetch the list of data sources the user can connect to.
    return [
      { display: "<Datasource Name>", value: "<Datasource URL>" },
    ];
  },
  getName: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and return the name.
    return "<Datasource Name>";
  },
  getSchema: async function (context) {
    let datasourceUrl = context.sync.dynamicUrl!;
    // TODO: Fetch metadata about the data source and get the list of fields.
    let properties: any = {
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
        identity: {
          name: "<User-visible name for the column containing the schema>",
          dynamicUrl: datasourceUrl,
        },
        properties: properties,
        id: id,
        primary: primary,
        featured: featured,
      }),
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
      }
    },
  },
});
