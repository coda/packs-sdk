import * as coda from '../../index';

const pack = coda.newPack();

// BEGIN

pack.addSyncTable({
  name: 'MySyncTable',
  identityName: 'EntityName',
  schema: coda.makeObjectSchema({
    type: coda.ValueType.Object,
    id: 'idColumn',
    primary: 'displayColumn',
    properties: {
      idColumn: {type: coda.ValueType.String},
      displayColumn: {type: coda.ValueType.String},
      otherColumn: {type: coda.ValueType.Number},
    },
  }),
  formula: {
    name: 'SyncTable',
    description: 'Creates a sync table',
    connectionRequirement: coda.ConnectionRequirement.None,
    parameters: [coda.makeParameter({type: coda.ParameterType.String, name: 'myParam', description: 'My description'})],
    execute: async ([param], context) => {
      const response = await context.fetcher.fetch({method: 'GET', url: 'coda.io'});
      return {
        result: [
          {
            idColumn: 'Example1',
            displayColumn: response.body,
            otherColumn: param,
          },
        ],
      };
    },
  },
});
