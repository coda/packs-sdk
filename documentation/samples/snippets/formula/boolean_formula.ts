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
  resultType: coda.ValueType.Boolean,
  execute: async function (args, context) {
    let [
      // TODO: Unpack the parameter values.
    ] = args;
    return true;
  },
});
