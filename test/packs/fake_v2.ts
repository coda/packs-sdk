import * as coda from '../..';

export const pack = coda.newPack();

const fakePersonSchema = coda.makeObjectSchema({
  type: coda.ValueType.Object,
  primary: 'name',
  id: 'name',
  properties: {
    name: {type: coda.ValueType.String, required: true},
  },
});

function doThrow() {
  throw new Error('test');
}

pack.addFormula({
  name: 'Person',
  description: 'A formula that returns an object',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'name',
      description: 'the name of the pereson',
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: fakePersonSchema,
  execute: async ([name]) => {
    return {name};
  },
});

pack.addFormula({
  name: 'String',
  description: 'A formula that returns a string',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'name',
      description: 'the name of the pereson',
      autocomplete: async () => ['a', 'b', 'c'],
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async ([name]) => {
    return name;
  },
});

pack.addFormula({
  name: 'StringWithObjectAutocomplete',
  description: 'A formula that returns a string',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'name',
      description: 'the name of the pereson',
      autocomplete: async () => [{display: 'a', value: 'b'}],
    }),
  ],
  resultType: coda.ValueType.String,
  execute: async ([name]) => {
    return name;
  },
});

pack.addFormula({
  name: 'Throw',
  description: 'A Hello World example.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'name',
      description: 'The name you would like to say hello to.',
    }),
  ],
  resultType: coda.ValueType.String,
  async execute([name]) {
    doThrow();
    return 'Hello ' + name + '!';
  },
});

pack.addColumnFormat({
  name: 'test',
  formulaName: 'Throw',
  formulaNamespace: 'deprecated',
  matchers: [/https:\/\/testregex/],
});
