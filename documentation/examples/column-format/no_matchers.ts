import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

// Replace all <text> with your own text
// a custom column type that you apply to any column in any Coda table.
pack.addColumnFormat({
  name: '<format name>',
  formulaNamespace: '<formulaNamespace of Pack>', // this will be deprecated
  formulaName: '<the name of a formula to execute using the value in the column>',
  instructions: '<instruction text that will be visible by Users',
  // regular expressions used to detect inputs of a certain format type.
  matchers: [],
});
