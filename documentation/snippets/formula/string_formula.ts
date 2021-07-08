import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  resultType: coda.ValueType.String,
  name: 'MyFormula',
  description: '',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'myParam',
      description: '',
    }),
  ],
  execute: async ([param]) => {
    return `Hello ${param}`;
  },
});
