import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  name: "${1:MyFormula}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
    // $0
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.String,
  }),
  execute: async function (args, context) {
    let [
      // TODO: Unpack the parameter values.
    ] = args;
    return ["A", "B", "C"];
  },
});
