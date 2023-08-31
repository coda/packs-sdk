import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

const $3$ThingSchema$ = undefined;

// BEGIN

pack.addSyncTable({
  name: "${1:MyThings}",
  description: "${2:Table description.}",
  identityName: "${3:Thing}",
  schema: $3$ThingSchema$,
  formula: {
    name: "Sync$1",
    description: "Syncs the data.",
    parameters: [
      // TODO: Add parameters.
    ],
    execute: async function (args, context) {
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
