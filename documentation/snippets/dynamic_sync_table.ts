import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.addDynamicSyncTable({
  name: 'MyDynamicSynctable',
  getName: coda.makeMetadataFormula(async context => {
    const response = await context.fetcher.fetch({method: 'GET', url: 'coda.io'});
    return response.body;
  }),
  getSchema: coda.makeMetadataFormula(async () => {
    return coda.makeSchema({
      type: coda.ValueType.Array,
      items: coda.makeObjectSchema({
        type: coda.ValueType.Object,
        id: 'idColumn',
        primary: 'displayColumn',
        featured: ['otherColumn'],
        properties: {
          idColumn: {type: coda.ValueType.Number},
          displayColumn: {type: coda.ValueType.String},
          otherColumn: {type: coda.ValueType.String},
        },
      }),
    });
  }),
  getDisplayUrl: coda.makeMetadataFormula(async context => context.sync!.dynamicUrl!),
  formula: {
    name: 'DynamicSyncTable',
    description: 'Creates a dynamic sync table',
    connectionRequirement: coda.ConnectionRequirement.None,
    parameters: [coda.makeParameter({type: coda.ParameterType.String, name: 'myParam', description: 'My description'})],
    execute: async ([param]) => {
      return {
        result: [
          {
            idPropertyName: 1,
            displayPropertyName: 'Example1',
            otherPropertyName: param,
          },
        ],
      };
    },
  },
});
