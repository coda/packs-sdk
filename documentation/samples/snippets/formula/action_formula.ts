/* eslint-disable @typescript-eslint/no-unused-vars */
import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  name: "${1:MyAction}",
  description: "${2:My description.}",
  parameters: [
    // TODO: Add parameters.
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  execute: async function (args, context) {
    let [
      // TODO: Unpack the parameter values.
    ] = args;
    // TODO: Do something.
    return "OK";
  },
});
