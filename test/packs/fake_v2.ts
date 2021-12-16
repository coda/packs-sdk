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

pack.addSyncTable({
  name: 'Foos',
  description: 'FooDesc',
  identityName: 'Foo',
  schema: coda.makeObjectSchema({
    type: coda.ValueType.Object,
    id: 'foo',
    primary: 'foo',
    properties: {foo: {type: coda.ValueType.String}},
  }),
  formula: {
    name: 'Ignored',
    description: '',
    parameters: [],
    execute: async () => {
      return {result: []};
    },
  },
});

pack.addSyncTable({
  name: 'Foos',
  description: 'FooDesc',
  identityName: 'Foo',
  schema: coda.makeObjectSchema({
    type: coda.ValueType.Object,
    id: 'foo',
    primary: 'foo',
    properties: {foo: {type: coda.ValueType.String}},
  }),
  formula: {
    name: 'Ignored',
    description: '',
    parameters: [],
    execute: async () => {
      return {result: []};
    },
  },
});

pack.addDynamicSyncTable({
  name: 'FooDyns',
  description: 'FooDynDesc',
  getName: coda.makeMetadataFormula(async () => 'name'),
  getDisplayUrl: coda.makeMetadataFormula(async () => 'display url'),
  getSchema: coda.makeMetadataFormula(async () => {
    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: {type: coda.ValueType.Object, properties: {}},
    });
  }),
  formula: {
    name: 'Ignored',
    description: '',
    parameters: [],
    execute: async () => {
      return {result: []};
    },
  },
});
