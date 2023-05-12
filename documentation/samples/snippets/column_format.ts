import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addColumnFormat({
  name: "${1:My Column Format}",
  instructions: "${2:My description.}",
  formulaName: "${3:MyFormula}",
  matchers: [
    // TODO: If formatting a URL, add a regular expression that matches it.
  ],
});
