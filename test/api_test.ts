import './test_helper';
import type {ArrayType} from '../api_types';
import {ConnectionRequirement} from '../api_types';
import {ParameterType} from '../api_types';
import {StatusCodeError} from '../api';
import type {Type} from '../api_types';
import {ValueType} from '../schema';
import {makeDynamicSyncTable} from '../api';
import {makeFormula} from '../api';
import {makeMetadataFormula} from '../api';
import {makeParameter} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';
import * as schema from '../schema';

describe('API test', () => {
  describe('makeDynamicSyncTable', () => {
    it('connection overrides individual connection values', () => {
      const table = makeDynamicSyncTable({
        name: 'Whatever',
        identityName: 'Whatever',
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

    it('connectionRequirement on getter still carries through', () => {
      const table = makeSyncTable({
        name: 'SomeSync',
        identityName: 'Identity',
        schema: schema.makeObjectSchema({
          type: ValueType.Object,
          id: 'id',
          primary: 'id',
          properties: {id: {type: ValueType.String}},
        }),
        formula: {
          name: 'Whatever',
          connectionRequirement: ConnectionRequirement.Optional,
          description: 'Whatever',
          parameters: [],
          async execute() {
            return {result: []};
          },
        },
      });
      assert.equal(ConnectionRequirement.Optional, table.getter.connectionRequirement);
    });

    describe('getSchema', () => {
      const makeTable = (s: schema.ArraySchema | schema.ObjectSchema<any, any>) =>
        makeDynamicSyncTable({
          name: 'Whatever',
          identityName: 'Whatever',
          connectionRequirement: ConnectionRequirement.Optional,
          getName: makeMetadataFormula(async () => 'sup'),
          getSchema: async () => s,
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

      it('wraps', async () => {
        const table = makeTable({type: ValueType.Object, properties: {}});
        const schema = await table.getSchema.execute([] as any, {} as any);
        assert.deepEqual(schema, {type: 'array', items: {type: 'object', properties: {}}});
      });

      it('no wraps for array schema', async () => {
        const table = makeTable({type: ValueType.Array, items: {type: ValueType.Object, properties: {}}});
        const schema = await table.getSchema.execute([] as any, {} as any);
        assert.deepEqual(schema, {type: 'array', items: {type: 'object', properties: {}}});
      });
    });
  });

  describe('makeSyncTable', () => {
    it('identityName persists', () => {
      const table = makeSyncTable({
        name: 'SomeSync',
        identityName: 'MyIdentityName',
        schema: schema.makeObjectSchema({
          type: ValueType.Object,
          id: 'id',
          primary: 'id',
          properties: {id: {type: ValueType.String}},
        }),
        formula: {
          name: 'Whatever',
          description: 'Whatever',
          parameters: [],
          async execute() {
            return {result: []};
          },
        },
      });
      assert.equal(table.identityName, 'MyIdentityName');
      assert.equal(table.schema.identity?.name, 'MyIdentityName');

      // If the identityName is the same as identity.name that should be ok.
      const table2 = makeSyncTable({
        name: 'SomeSync',
        identityName: 'MyIdentityName',
        schema: schema.makeObjectSchema({
          type: ValueType.Object,
          id: 'id',
          primary: 'id',
          properties: {id: {type: ValueType.String}},
          identity: {
            name: 'MyIdentityName',
          },
        }),
        formula: {
          name: 'Whatever',
          description: 'Whatever',
          parameters: [],
          async execute() {
            return {result: []};
          },
        },
      });
      assert.equal(table2.identityName, 'MyIdentityName');
      assert.equal(table.schema.identity?.name, 'MyIdentityName');
    });

    it('identityName cannot conflict with identity.name', () => {
      assert.throw(
        () =>
          makeSyncTable({
            name: 'SomeSync',
            identityName: 'MyIdentityName',
            schema: schema.makeObjectSchema({
              type: ValueType.Object,
              id: 'id',
              primary: 'id',
              properties: {id: {type: ValueType.String}},
              identity: {
                name: 'ConflictingIdentity',
              },
            }),
            formula: {
              name: 'Whatever',
              description: 'Whatever',
              parameters: [],
              async execute() {
                return {result: []};
              },
            },
          }),
        "Identity name mismatch for sync table SomeSync. Either remove the schema's identity.name (ConflictingIdentity) or ensure it matches the table's identityName (MyIdentityName).",
      );
    });
  });

  describe('makeFormula', () => {
    it('object formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Object,
        name: 'Test',
        description: '',
        parameters: [],
        schema: schema.makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          properties: {foo: {type: ValueType.String}},
        }),
        execute: () => {
          return {foo: 'blah'};
        },
      });
      const result = await formula.execute([] as any, {} as any);
      assert.deepEqual(result, {foo: 'blah'});
    });

    it('array formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Array,
        name: 'Test',
        description: '',
        parameters: [],
        items: schema.makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          properties: {foo: {type: ValueType.String}},
        }),
        execute: () => {
          return [{foo: 'blah'}];
        },
      });
      const result = await formula.execute([] as any, {} as any);
      assert.deepEqual(result, [{foo: 'blah'}]);
    });
  });

  // These tests don't actually run anything, they're just examples of TypeScript usage that we
  // want to ensure continue to compile properly.
  describe('strong typing', () => {
    it('parameter types are strong', () => {
      const stringParam = makeParameter({type: ParameterType.String, name: 'stringScalar', description: ''});
      const stringType: Type.string = stringParam.type;
      stringType!;

      const stringArrayParam = makeParameter({type: ParameterType.StringArray, name: 'stringArray', description: ''});
      const stringArrayType: ArrayType<Type.string> = stringArrayParam.type;
      stringArrayType!;

      const numberParam = makeParameter({type: ParameterType.Number, name: 'numberScalar', description: ''});
      const numberType: Type.number = numberParam.type;
      numberType!;

      const numberArrayParam = makeParameter({type: ParameterType.NumberArray, name: 'numberArray', description: ''});
      const numberArrayType: ArrayType<Type.number> = numberArrayParam.type;
      numberArrayType!;

      const dateParam = makeParameter({type: ParameterType.Date, name: 'dateScalar', description: ''});
      const dateType: Type.date = dateParam.type;
      dateType!;

      const dateArrayParam = makeParameter({type: ParameterType.DateArray, name: 'dateArray', description: ''});
      const dateArrayType: ArrayType<Type.date> = dateArrayParam.type;
      dateArrayType!;
    });

    it('strong typing inferred from makeParameter with scalar param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: ParameterType.String, name: 'myParam', description: ''})],
        execute: ([param]) => param,
      });
    });

    it('strong typing inferred from makeParameter with optional scalar param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'optionalParam', description: '', optional: true}),
          makeParameter({type: ParameterType.String, name: 'requiredParam', description: '', optional: false}),
        ],
        execute: ([optionalParam, requiredParam]) => {
          optionalParam = undefined;
          optionalParam!;
          void requiredParam.length; // not nullable
          return '';
        },
      });
    });

    it('strong typing inferred from makeParameter with array param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: ParameterType.StringArray, name: 'myParam', description: ''})],
        execute: ([param]) => param[0],
      });
    });

    it('autocomplete works for array param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [
          makeParameter({
            type: ParameterType.StringArray,
            name: 'myParam',
            description: '',
            autocomplete: ['Foo', 'Bar', 'Baz'],
          }),
        ],
        execute: ([param]) => param[0],
      });
    });

    it('sparse array inferred from makeParameter with array param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: ParameterType.SparseStringArray, name: 'myParam', description: ''})],
        execute: ([param]) => param[0] ?? 'undefined',
      });
    });

    it('autocomplete works for array param', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [
          makeParameter({
            type: ParameterType.SparseStringArray,
            name: 'myParam',
            description: '',
            autocomplete: ['Foo', 'Bar', 'Baz'],
          }),
        ],
        execute: ([param]) => param[0] ?? 'undefined',
      });
    });

    it('strong typing inferred from makeParameter with multiple params', () => {
      makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'myParam', description: ''}),
          makeParameter({type: ParameterType.Number, name: 'myParam', description: ''}),
        ],
        execute: ([param1, param2]) => param1[param2],
      });
    });

    it('parameter autocomplete shorthand', () => {
      makeParameter({
        type: ParameterType.String,
        name: 'p',
        description: '',
        autocomplete: async (context, search) => {
          context.fetcher!;
          return [{display: search, value: search}];
        },
      });
    });

    it('parameter autocomplete with harcoded options', () => {
      makeParameter({
        type: ParameterType.String,
        name: 'p',
        description: '',
        autocomplete: ['foo', 'bar', 'baz'],
      });
    });

    it('parameter autocomplete with harcoded options with display values', () => {
      makeParameter({
        type: ParameterType.String,
        name: 'p',
        description: '',
        autocomplete: [{display: 'Foo', value: 'foo'}],
      });
    });

    it('parameter autocomplete longhand', () => {
      makeParameter({
        type: ParameterType.String,
        name: 'p',
        description: '',
        autocomplete: makeMetadataFormula(
          async (context, search) => {
            context.fetcher!;
            return [{display: search, value: search}];
          },
          {connectionRequirement: ConnectionRequirement.None},
        ),
      });
    });
  });

  it('StatusCodeError response body should always be a string', () => {
    const body = {};
    const error = new StatusCodeError(400, body, {url: '', method: 'GET'}, {body, headers: {}});
    assert.equal(error.response.body, '{}');
  });
});
