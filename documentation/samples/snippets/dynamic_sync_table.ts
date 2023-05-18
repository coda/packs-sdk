import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addDynamicSyncTable({
  name: "${1:MyThings}",
  description: "${2:My description.}",
  identityName: "${1}",
  listDynamicUrls: async function (context) {
    // TODO: Fetch the list of datasets the user can connect to.
    let datasets = [];
    // TODO: Replace "name" and "url" below with correct JSON keys.
    return coda.autocompleteSearchObjects(undefined, datasets, "name", "url");
  },
  getName: async function (context) {
    let datasetUrl = context.sync.dynamicUrl;
    // TODO: Fetch metadata about the dataset and return the name.
    return "Table Name";
  },
  getSchema: async function (context) {
    let datasetUrl = context.sync.dynamicUrl;
    // TODO: Fetch metadata about the dataset and use it to construct a schema.
    let schema = coda.makeObjectSchema({
      properties: {},
      displayProperty: "",
      idProperty: "",
      featuredProperties: [],
    });
    return schema;
  },
  getDisplayUrl: async function (context) {
    let datasetUrl = context.sync.dynamicUrl;
    // TODO: Fetch metadata about the dataset and return a user-friendly URL.
    return "";
  },
  formula: {
    name: "Sync$1",
    description: "Syncs the data.",
    parameters: [
      // TODO: Add parameters.
    ],
    execute: async function (args, context) {
      let datasetUrl = context.sync.dynamicUrl!;
      // TODO: Unpack the parameter values.
      let [] = args;
      // TODO: Fetch the rows.
      let rows = [];
      for (let row of rows) {
        // TODO: If required, adjust the row to match the schema.
      }
      return {
        result: rows,
      };
    },
  },
});
