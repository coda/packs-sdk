import './test_helper';
import type {ArrayType} from '../api_types';
import {NetworkConnection} from '../api_types';
import {Type} from '../api_types';
import {ValueType} from '../schema';
import {makeDynamicSyncTable} from '../api';
import {makeMetadataFormula} from '../api';
import {makeParameter} from '../api';
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

  // These tests don't actually run anything, they're just examples of TypeScript usage that we
  // want to ensure continue to compile properly.
  describe('strong typing', () => {
    it('parameter types are strong', () => {
      const stringParam = makeParameter({type: Type.string, name: 'stringScalar', description: ''});
      const stringType: Type.string = stringParam.type;
      stringType!;

      const stringArrayParam = makeParameter({arrayType: Type.string, name: 'stringArray', description: ''});
      const stringArrayType: ArrayType<Type.string> = stringArrayParam.type;
      stringArrayType!;

      const numberParam = makeParameter({type: Type.number, name: 'numberScalar', description: ''});
      const numberType: Type.number = numberParam.type;
      numberType!;

      const numberArrayParam = makeParameter({arrayType: Type.number, name: 'numberArray', description: ''});
      const numberArrayType: ArrayType<Type.number> = numberArrayParam.type;
      numberArrayType!;

      const dateParam = makeParameter({type: Type.date, name: 'dateScalar', description: ''});
      const dateType: Type.date = dateParam.type;
      dateType!;

      const dateArrayParam = makeParameter({arrayType: Type.date, name: 'dateArray', description: ''});
      const dateArrayType: ArrayType<Type.date> = dateArrayParam.type;
      dateArrayType!;
    });
  });
});
