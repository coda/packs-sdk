import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.addColumnFormat({
  name: 'MyName',
  formulaNamespace: 'deprecated', // Will be removed shortly
  formulaName: 'the name of a formula to execute using the value in the column',
  instructions: '',
  matchers: [],
});
