import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

const $3$MySchema$ = undefined;

// BEGIN

pack.addSyncTable({
  name: "${1:MyThings}",
  description: "${2:Table description.}",
  identityName: "$1",
  schema: $3$MySchema$,
  formula: {
    name: "Sync$1",
    description: "Syncs the data.",
    parameters: [
      // TODO: Add parameters.
    ],
    execute: async function (args, context) {
      let [
        // TODO: Unpack the parameter values.
      ] = args;
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
