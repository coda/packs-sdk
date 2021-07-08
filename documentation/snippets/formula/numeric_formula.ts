import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  resultType: coda.ValueType.Number,
  name: 'MyFormula',
  description: '',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'myParam',
      description: '',
    }),
  ],
  execute: ([param]) => {
    if (param === 'ten') {
      return 10;
    } else {
      return 0;
    }
  },
});
