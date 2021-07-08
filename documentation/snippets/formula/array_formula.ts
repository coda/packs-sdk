import * as coda from '../../../index';

const pack = coda.newPack();

// TODO(Lucas): Validate this in the editor
// BEGIN
pack.addFormula({
  resultType: coda.ValueType.Array,
  name: 'MyFormula',
  description: '',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'myParam',
      description: '',
    }),
  ],
  items: {
    type: coda.ValueType.Object,
    properties: {
      column1: {type: coda.ValueType.String},
    },
  },
  execute: ([param]) => {
    return [{column1: 'hello'}, {column1: 'world'}, {column1: `${param}`}];
  },
});
