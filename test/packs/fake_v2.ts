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
    // coda.makeParameter({
    //   type: coda.ParameterType.String,
    //   name: 'simple-string',
    //   description: 'the name of the pereson',
    //   autocomplete: [1, 'b'],
    // }),
    // coda.makeParameter({
    //   type: coda.ParameterType.Number,
    //   name: 'simple-number',
    //   description: 'the name of the pereson',
    //   autocomplete: [1, 'b'],
    // }),
    // coda.makeParameter({
    //   type: coda.ParameterType.Boolean,
    //   name: 'invalid-boolean',
    //   description: 'the name of the pereson',
    //   autocomplete: [1, 'b'],
    // }),
    // coda.makeParameter({
    //   type: coda.ParameterType.String,
    //   name: 'name',
    //   description: 'the name of the pereson',
    //   autocomplete: async () => {
    //     return [1, 'b'];
    //   },
    // }),
    // coda.makeParameter({
    //   type: coda.ParameterType.Number,
    //   name: 'number',
    //   description: 'the name of the pereson',
    //   autocomplete: async () => {
    //     return [1, 'b'];
    //   },
    // }),
    //
    // // the following two tests are only for backwards compatibility in the packs repo. maybe we should
    // // just deprecate these APIs?
    // coda.makeParameter({
    //   type: coda.ParameterType.String,
    //   name: 'makeSimpleAutocompleteMetadataFormula',
    //   description: 'the name of the pereson',
    //   autocomplete: coda.makeSimpleAutocompleteMetadataFormula<coda.ParameterType.String>([
    //     'any',
    //     1,
    //     'published',
    //     'unpublished',
    //   ]),
    // }),
    // coda.makeParameter({
    //   type: coda.ParameterType.String,
    //   name: 'makeMetadataFormula',
    //   description: 'the name of the pereson',
    //   autocomplete: coda.makeMetadataFormula<AutocompleteReturnType<coda.ParameterType.String>>(
    //     async (context, search) => {
    //       return coda.autocompleteSearchObjects(search, [{name: 'a', value: 'b'}], 'name', 'name');
    //     },
    //   ),
    // }),
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
