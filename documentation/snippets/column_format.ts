import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

pack.addColumnFormat({
  name: "<User-visible name>",
  instructions: "<Help text for the format>",
  formulaName: "<Name of the formula to run>",
  formulaNamespace: "Deprecated", // Will be removed shortly
});
