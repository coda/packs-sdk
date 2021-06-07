import './test_helper';
import {NetworkConnection} from '../api_types';
import {ValueType} from '../schema';
import {makeDynamicSyncTable} from '../api';
import {makeMetadataFormula} from '../api';
import {makeStringParameter} from '../api';
import * as schema from '../schema';

describe('API test', () => {
  describe('makeDynamicSyncTable', () => {
    it('connection overrides individual connection values', () => {
      const table = makeDynamicSyncTable({
        name: 'Whatever',
        connection: NetworkConnection.Optional,
        getName: makeMetadataFormula(async () => 'sup'),
        getSchema: makeMetadataFormula(async () =>
          schema.makeSchema({
            type: ValueType.Array,
            items: schema.makeSchema({type: ValueType.Object, properties: {}}),
          }),
        ),
        getDisplayUrl: makeMetadataFormula(async () => 'sup'),
        listDynamicUrls: makeMetadataFormula(async () => []),
        formula: {
          name: 'Whatever',
          description: 'Whatever',
          parameters: [makeStringParameter('arg', 'whatever', {autocomplete: makeMetadataFormula(async () => 'Hi')})],
          varargParameters: [
            makeStringParameter('whatever', 'arg', {autocomplete: makeMetadataFormula(async () => 'Hi')}),
          ],
          async execute() {
            return {result: []};
          },
        },
      });

      assert.equal(NetworkConnection.Optional, table.getDisplayUrl.network?.connection);
      assert.equal(NetworkConnection.Optional, table.getName.network?.connection);
      assert.equal(NetworkConnection.Optional, table.listDynamicUrls?.network?.connection);
      assert.equal(NetworkConnection.Optional, table.getSchema?.network?.connection);
      assert.equal(NetworkConnection.Optional, table.getter.parameters[0].autocomplete?.network?.connection);
      assert.equal(NetworkConnection.Optional, table.getter.varargParameters![0]!.autocomplete?.network?.connection);
    });
  });
});
