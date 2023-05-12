import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

const $3$MySchema$ = undefined;

// BEGIN

pack.addFormula({
  name: "${1:MyFormula}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
  ],
  resultType: coda.ValueType.Object,
  schema: $3$MySchema$,
  execute: async function (args, context) {
    let [
      // TODO: Unpack the parameter values.
    ] = args;
    // TODO: Compute the result.
    return {};
  },
});
