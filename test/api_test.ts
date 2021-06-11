import './test_helper';
import type {ArrayType} from '../api_types';
import {ConnectionRequirement} from '../api_types';
import {Type} from '../api_types';
import {ValueType} from '../schema';
import {makeDynamicSyncTable} from '../api';
import {makeFormula} from '../api';
import {makeMetadataFormula} from '../api';
import {makeParameter} from '../api';
import {makeStringParameter} from '../api';
import * as schema from '../schema';

describe('API test', () => {
  describe('makeDynamicSyncTable', () => {
    it('connection overrides individual connection values', () => {
      const table = makeDynamicSyncTable({
        name: 'Whatever',
        connectionRequirement: ConnectionRequirement.Optional,
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

      assert.equal(ConnectionRequirement.Optional, table.getDisplayUrl.connectionRequirement);
      assert.equal(ConnectionRequirement.Optional, table.getName.connectionRequirement);
      assert.equal(ConnectionRequirement.Optional, table.listDynamicUrls?.connectionRequirement);
      assert.equal(ConnectionRequirement.Optional, table.getSchema?.connectionRequirement);
      assert.equal(ConnectionRequirement.Optional, table.getter.parameters[0].autocomplete?.connectionRequirement);
      assert.equal(
        ConnectionRequirement.Optional,
        table.getter.varargParameters![0]!.autocomplete?.connectionRequirement,
      );
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

    it('strong typing inferred from makeParameter with scalar param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: Type.string, name: 'myParam', description: ''})],
        execute: ([param]) => param,
      });
    });

    it('strong typing inferred from makeParameter with array param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({arrayType: Type.string, name: 'myParam', description: ''})],
        execute: ([param]) => param[0],
      });
    });

    it('strong typing inferred from makeParameter with multiple params', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [
          makeParameter({arrayType: Type.string, name: 'myParam', description: ''}),
          makeParameter({type: Type.number, name: 'myParam', description: ''}),
        ],
        execute: ([param1, param2]) => param1[param2],
      });
    });
  });
});
