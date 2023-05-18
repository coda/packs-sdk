import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  name: "${1:MyFormula}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
  ],
  resultType: coda.ValueType.Number,
  execute: async function (args, context) {
    // TODO: Unpack the parameter values.
    let [] = args;
    // TODO: Compute the result.
    return 0;
  },
});
