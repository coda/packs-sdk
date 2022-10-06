import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

const MySchema = coda.makeObjectSchema({
  properties: {
    property1: { type: coda.ValueType.String },
    property2: { type: coda.ValueType.Number },
    // Add more properties here.
  },
  displayProperty: "property1", // Which property above to display by default.
  idProperty: "property2", // Which property above is a unique ID.
});

pack.addSyncTable({
  name: "<User-visible name for the sync table>",
  description: "<User-visible description for the sync table>",
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
    execute: async function ([param], context) {
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
