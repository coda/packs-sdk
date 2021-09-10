import * as coda from '@codahq/packs-sdk';

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  resultType: coda.ValueType.Boolean,
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
    return param === 'true';
  },
});
