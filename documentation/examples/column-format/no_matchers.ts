import * as coda from "@codahq/packs-sdk";

const pack = coda.newPack();

// BEGIN

// Replace all <text> with your own text
// A custom column type that you apply to any column in any Coda table.
pack.addColumnFormat({
  name: "<format name>",
  instructions: "<instruction text that will be visible by Users>",
  formulaName: "<the name of a formula to execute using the column value>",
  formulaNamespace: "Ignore", // this will be deprecated
  // Optional, regular expressions that detect urls that are handeable by this
  // column format. When a user pastes a url that matches any of these, the UI
  // will hint to the user that they can apply this format to their column.
  matchers: [],
});
