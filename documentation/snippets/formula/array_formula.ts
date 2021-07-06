import * as coda from '../../../index';

const pack = coda.newPack();

// BEGIN
// TODO(Lucas): Validate this in the editor
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
    type: coda.ValueType.Number
  },
  execute([param]) {
    return [1,2,3,param];
  }
});