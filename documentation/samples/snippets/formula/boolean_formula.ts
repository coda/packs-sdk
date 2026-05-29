import * as sdk from "@codahq/packs-sdk";

const pack = sdk.newPack();

// BEGIN

pack.addFormula({
  name: "${1:MyFormula}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
  ],
  resultType: sdk.ValueType.Boolean,
  execute: async function (args, context) {
    // TODO: Unpack the parameter values.
    let [] = args;
    // TODO: Compute the result.
    return true;
  },
});
