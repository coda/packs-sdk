import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

const $3$ThingSchema$ = undefined;

// BEGIN

pack.addFormula({
  name: "${1:MyFormula}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
  ],
  resultType: coda.ValueType.Object,
  schema: $3$ThingSchema$,
  execute: async function (args, context) {
    // TODO: Unpack the parameter values.
    let [] = args;
    // TODO: Compute the result.
    return {};
  },
});
