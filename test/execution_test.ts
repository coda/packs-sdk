import {testHelper} from './test_helper';
import {FakePack} from './test_utils';
import type {ResponseHandlerTemplate} from '../handler_templates';
import type {Schema} from '../schema';
import {ValueType} from '../schema';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {executeSyncFormulaFromPackDef} from '../testing/execution';
import {makeBooleanParameter} from '../api';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';
import {newJsonFetchResponse} from '../testing/mocks';
import {newMockExecutionContext} from '../testing/mocks';
import sinon from 'sinon';
import {withQueryParams} from '../helpers/url';

describe('Execution', () => {
  const fakePersonSchema = makeObjectSchema({
    type: ValueType.Object,
    primary: 'name',
    id: 'name',
    properties: {
      name: {type: ValueType.String},
    },
    identity: {packId: FakePack.id, name: 'Person'},
  });

  const fakePack = createFakePack({
    formulas: {
      Fake: [
        makeNumericFormula({
          name: 'Square',
          description: 'Square a number',
          examples: [],
          parameters: [makeNumericParameter('value', 'A value to square.')],
          execute: ([value]) => {
            return value ** 2;
          },
        }),
        makeStringFormula({
          name: 'Lookup',
          description: 'Lookup a value from a remote service',
          examples: [],
          parameters: [makeStringParameter('query', 'A query to look up.')],
          execute: async ([query], context) => {
            const url = withQueryParams('https://example.com/lookup', {query});
            const response = await context.fetcher.fetch({method: 'GET', url});
            return response.body.result;
          },
        }),
      ],
    },
    syncTables: [
      makeSyncTable('Classes', fakePersonSchema, {
        name: 'Students',
        description: "Gets students in a teacher's class",
        execute: async ([teacher], context) => {
          const {continuation} = context.sync;
          const page = continuation?.page;
          switch (teacher) {
            case 'Smith':
              if (!page || page === 1) {
                return {
                  result: [{name: 'Alice'}, {name: 'Bob'}],
                  continuation: {page: 2},
                };
              }
              if (page === 2) {
                return {
                  result: [{name: 'Chris'}, {name: 'Diana'}],
                };
              }
            case 'Brown':
              if (!page || page === 1) {
                return {
                  result: [{name: 'Annie'}, {name: 'Bryan'}],
                  continuation: {page: 2},
                };
              }
              if (page === 2) {
                return {
                  result: [{name: 'Christina'}, {name: 'Donald'}],
                };
              }
            default:
              return {} as any;
          }
        },
        network: {hasSideEffect: false},
        parameters: [makeStringParameter('teacher', 'teacher name')],
        examples: [],
      }),
    ],
  });

  it('executes a formula by name', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Fake::Square', [5]);
    assert.equal(result, 25);
  });

  it('executes a sync formula by name', async () => {
    const result = await executeSyncFormulaFromPackDef(fakePack, 'Students', ['Smith']);
    assert.deepEqual(result, [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}]);
  });

  it('error when maxIterations exceeded', async () => {
    await testHelper.willBeRejectedWith(
      executeSyncFormulaFromPackDef(fakePack, 'Students', ['Smith'], undefined, {maxIterations: 1}),
      /Sync is still running after 1 iterations, this is likely due to an infinite loop. If more iterations are needed, use the maxIterations option./,
    );
  });

  describe('execution errors', () => {
    it('not enough params', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Fake::Square', []),
        /Expected at least 1 parameter but only 0 were provided./,
      );
    });
  });

  describe('errors resolving formulas', () => {
    it('no formulas', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(createFakePack({formulas: undefined}), 'Foo::Bar', []),
        /Pack definition for Fake Pack \(id 424242\) has no formulas./,
      );
    });

    it('malformed formula name', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'malformed', []),
        /Formula names must be specified as FormulaNamespace::FormulaName, but got "malformed"./,
      );
    });

    it('bad namespace', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Foo::Bar', []),
        /Pack definition for Fake Pack \(id 424242\) has no formulas for namespace "Foo"./,
      );
    });

    it('non-existent formula', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Fake::Foo', []),
        /Pack definition for Fake Pack \(id 424242\) has no formula "Foo" in namespace "Fake"./,
      );
    });
  });

  describe('fetcher mocks', () => {
    it('fetch calls are mocked', async () => {
      const context = newMockExecutionContext();
      context.fetcher.fetch.returns(newJsonFetchResponse({result: 'hello'}));
      const result = await executeFormulaFromPackDef(fakePack, 'Fake::Lookup', ['foo'], context);
      assert.equal(result, 'hello');

      sinon.assert.calledOnceWithExactly(context.fetcher.fetch, {
        method: 'GET',
        url: 'https://example.com/lookup?query=foo',
      });
    });

    it('temporary blob storage calls are mocked', async () => {
      const fakeBlobPack = createFakePack({
        formulas: {
          Fake: [
            makeStringFormula({
              name: 'Blobs',
              description: 'Store some blobs',
              examples: [],
              parameters: [],
              execute: async ([], context) => {
                const response1 = await context.temporaryBlobStorage.storeBlob(Buffer.from('asdf'), 'image/png');
                const response2 = await context.temporaryBlobStorage.storeUrl('url-to-store');
                return `${response1},${response2}`;
              },
            }),
          ],
        },
      });

      const context = newMockExecutionContext();
      context.temporaryBlobStorage.storeBlob.returns('blob-url-1');
      context.temporaryBlobStorage.storeUrl.returns('blob-url-2');
      const result = await executeFormulaFromPackDef(fakeBlobPack, 'Fake::Blobs', [], context);
      assert.equal(result, 'blob-url-1,blob-url-2');

      sinon.assert.calledOnceWithExactly(context.temporaryBlobStorage.storeBlob, Buffer.from('asdf'), 'image/png');
      sinon.assert.calledOnceWithExactly(context.temporaryBlobStorage.storeUrl, 'url-to-store');
    });
  });

  describe('result value validation', () => {
    describe('result types', () => {
      const pack = createFakePack({
        formulas: {
          Fake: [
            makeStringFormula({
              name: 'StringFoo',
              description: '',
              examples: [],
              parameters: [makeBooleanParameter('valid', 'Whether or not to return a valid value type.')],
              execute: async ([valid]) => {
                return valid ? 'foo' : (123 as any);
              },
            }),
            makeNumericFormula({
              name: 'NumberFoo',
              description: '',
              examples: [],
              parameters: [makeBooleanParameter('valid', 'Whether or not to return a valid value type.')],
              execute: async ([valid]) => {
                return valid ? 123 : ('blah' as any);
              },
            }),
            makeObjectFormula({
              name: 'ObjectFoo',
              description: '',
              examples: [],
              parameters: [makeBooleanParameter('valid', 'Whether or not to return a valid value type.')],
              response: {
                schema: makeObjectSchema({
                  type: ValueType.Object,
                  properties: {
                    foo: {type: ValueType.String},
                  },
                }),
              },
              execute: async ([valid]) => {
                return valid ? {foo: 'blah'} : 'blah';
              },
            }),
            makeObjectFormula({
              name: 'ObjectPropertyFoo',
              description: '',
              examples: [],
              parameters: [makeBooleanParameter('valid', 'Whether or not to return a valid property type.')],
              response: {
                schema: makeObjectSchema({
                  type: ValueType.Object,
                  properties: {
                    foo: {type: ValueType.String},
                  },
                }),
              },
              execute: async ([valid]) => {
                return valid ? {foo: 'blah'} : {foo: 123};
              },
            }),
          ],
        },
      });

      it('string', async () => {
        await executeFormulaFromPackDef(pack, 'Fake::StringFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'Fake::StringFoo', [false]),
          /The following errors were found when validating the result of the formula "StringFoo":\nExpected a string result but got 123./,
        );
      });

      it('number', async () => {
        await executeFormulaFromPackDef(pack, 'Fake::NumberFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'Fake::NumberFoo', [false]),
          /The following errors were found when validating the result of the formula "NumberFoo":\nExpected a number result but got "blah"./,
        );
      });

      it('object', async () => {
        await executeFormulaFromPackDef(pack, 'Fake::ObjectFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'Fake::ObjectFoo', [false]),
          /The following errors were found when validating the result of the formula "ObjectFoo":\nExpected a object result but got "blah"./,
        );
      });

      it('object property', async () => {
        await executeFormulaFromPackDef(pack, 'Fake::ObjectPropertyFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'Fake::ObjectPropertyFoo', [false]),
          /The following errors were found when validating the result of the formula "ObjectFoo2":\nExpected a string property for key Foo but got 123./,
        );
      });
    });

    describe('objects', () => {
      function makeFakePackWithResponseDef<T extends Schema = Schema>(response: ResponseHandlerTemplate<T>) {
        return createFakePack({
          formulas: {
            Fake: [
              makeObjectFormula({
                name: 'ObjectFormula',
                description: '',
                examples: [],
                parameters: [makeStringParameter('value', 'Pass-through value to return.')],
                response,
                execute: async ([value]) => {
                  return JSON.parse(value);
                },
              }),
            ],
          },
        });
      }

      const defaultPack = makeFakePackWithResponseDef({
        schema: makeObjectSchema({
          type: ValueType.Object,
          id: 'stringVal',
          feature: ['stringVal', 'numberVal'],
          properties: {
            stringVal: {type: ValueType.String, required: true},
            numberVal: {type: ValueType.Number, required: true},
            optionalVal: {type: ValueType.String},
          },
        }),
      });

      it('not an object schema', async () => {
        const pack = makeFakePackWithResponseDef({
          schema: {type: ValueType.String},
        });
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'Fake::ObjectFormula', [JSON.stringify({})]),
          /Expected an object schema, but found {"type":"string"}/,
        );
      });

      it('incomplete return value', async () => {
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(defaultPack, 'Fake::ObjectFormula', [JSON.stringify({})]),
          new RegExp(
            'Schema declares required property "StringVal" but this attribute is missing or empty.\n' +
              'Schema declares required property "NumberVal" but this attribute is missing or empty.',
          ),
        );
      });

      it('empty id value', async () => {
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(defaultPack, 'Fake::ObjectFormula', [
            JSON.stringify({stringVal: '', numberVal: 0}),
          ]),
          /Schema declares "StringVal" as an id property but an empty value was found in result./,
        );
      });

      it('valid return value', async () => {
        await executeFormulaFromPackDef(defaultPack, 'Fake::ObjectFormula', [
          JSON.stringify({stringVal: 'foo', numberVal: 1}),
        ]);
      });
    });
  });

  describe('errors resolving sync formulas', () => {
    it('no sync tables', async () => {
      await testHelper.willBeRejectedWith(
        executeSyncFormulaFromPackDef(createFakePack({formulas: undefined, syncTables: undefined}), 'Bar', []),
        /Pack definition for Fake Pack \(id 424242\) has no sync tables./,
      );
    });

    it('non-existent sync formula', async () => {
      await testHelper.willBeRejectedWith(
        executeSyncFormulaFromPackDef(fakePack, 'Foo', []),
        /Pack definition for Fake Pack \(id 424242\) has no sync formula "Foo" in its sync tables./,
      );
    });
  });
});
