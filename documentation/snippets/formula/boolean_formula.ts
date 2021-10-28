import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  name: "<User-visible name of formula>",
  description: "<Help text for the formula>",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "<User-visible name of parameter>",
      description: "<Help text for the parameter>",
    }),
    // Add more parameters here and in the array below.
  ],
  resultType: coda.ValueType.Boolean,
  execute: async function ([param], context) {
    return param === "true";
  },
});
