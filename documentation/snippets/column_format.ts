import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.addColumnFormat({
  name: 'format name',
  formulaNamespace: 'formulaNamespace of Pack',
  formulaName: 'the name of a formula to execute using the value in the column',
  instructions: '',
  matchers: [],
});