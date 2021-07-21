import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

// Replace all <text> with your own text
// A custom column type that you apply to any column in any Coda table.
pack.addColumnFormat({
  name: '<format name>',
  formulaNamespace: '<the name of a formula in this pack>', // this will be deprecated
  formulaName: '<the name of a formula to execute using the value in the column>',
  instructions: '<instruction text that will be visible by Users>',
  // Optional, regular expressions that detect urls that are handeable by this column format. When a
  // user pastes a url that matches any of these, the UI will hint to the user that they can apply
  // this format to their column.
  matchers: [],
});
