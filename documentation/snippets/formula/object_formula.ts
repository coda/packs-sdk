import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN

pack.addFormula({
  resultType: coda.ValueType.Object,
  name: 'MyFormula',
  description: '',
  schema: coda.makeObjectSchema({
    type: coda.ValueType.Object,
    id: 'idPropertyName',
    primary: 'displayPropertyName',
    identity: {
      name: 'entityName',
    },
    properties: {
      idPropertyName: {type: coda.ValueType.String},
      displayPropertyName: {type: coda.ValueType.Number},
      otherProperty: {type: coda.ValueType.String},
    },
  }),
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'myParam',
      description: '',
    }),
  ],
  execute: async ([param]) => {
    return {
      idPropertyName: param,
      displayPropertyName: 123,
      otherProperty: 'other property!',
    };
  },
});
