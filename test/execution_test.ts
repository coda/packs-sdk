import {testHelper} from './test_helper';
import {AuthenticationType} from '../types';
import type {Formula} from '../api';
import type {ResponseHandlerTemplate} from '../handler_templates';
import type {Schema} from '../schema';
import {TimerShimStrategy} from '../testing/compile';
import {ValueType} from '../schema';
import {assertCondition} from '../helpers/ensure';
import {build as buildBundle} from '../cli/build';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {executeFormulaOrSyncWithVM} from '../testing/execution';
import {executeMetadataFormula} from '../testing/execution';
import {executeSyncFormulaFromPackDef} from '../testing/execution';
import {manifest as fakePack} from './packs/fake';
import {makeBooleanParameter} from '../api';
import {makeMetadataFormula} from '../api';
import {makeNumericFormula} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeSimpleAutocompleteMetadataFormula} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {newJsonFetchResponse} from '../testing/mocks';
import {newMockExecutionContext} from '../testing/mocks';
import sinon from 'sinon';

describe('Execution', () => {
  let bundlePath: string;

  before(async () => {
    bundlePath = await buildBundle(`${__dirname}/packs/fake`, {timerStrategy: TimerShimStrategy.Fake});
  });

  it('executes a formula by name', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Square', [5]);
    assert.equal(result, 25);
  });

  it('executes an object formula without normalization', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Person', ['Alice']);
    assert.deepEqual(result, {Name: 'Alice'});
  });

  it('executes a formula without normalization', async () => {
    const result = await executeFormulaFromPackDef(
      fakePack, 
      'Person', 
      ['Alice'], 
      undefined, 
      {useDeprecatedResultNormalization: false});
    assert.deepEqual(result, {name: 'Alice'});
  });

  it('executes a sync formula by name', async () => {
    const result = await executeSyncFormulaFromPackDef(fakePack, 'Students', ['Smith']);
    assert.deepEqual(result, [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}]);
  });

  it('executed a sync formulas without normalization', async () => {
    const result = await executeSyncFormulaFromPackDef(
      fakePack, 
      'Students', 
      ['Smith'], 
      undefined, 
      {validateParams: true, validateResult: true, useDeprecatedResultNormalization: false});
    assert.deepEqual(result, [{name: 'Alice'}, {name: 'Bob'}, {name: 'Chris'}, {name: 'Diana'}]);
  });

  it('executes a formula by name with VM', async () => {
    const result = await executeFormulaOrSyncWithVM({
      formulaName: 'Square',
      params: [5],
      bundlePath,
    });
    assert.equal(result, 25);
  });

  it('executes a sync formula by name with VM', async () => {
    const result = await executeFormulaOrSyncWithVM({
      formulaName: 'Students',
      params: ['Smith'],
      bundlePath,
    });
    assert.deepEqual(result, {result: [{name: 'Alice'}, {name: 'Bob'}], continuation: {page: 2}});
  });

  it('exercises timer shim in VM', async () => {
    const result = await executeFormulaOrSyncWithVM({
      formulaName: 'Timer',
      params: [1],
      bundlePath,
    });
    assert.equal(result, 1);
  });

  describe('execution errors', () => {
    it('not enough params', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Square', []),
        /Expected at least 1 parameter but only 0 were provided./,
      );
    });
  });

  describe('errors resolving formulas', () => {
    it('no formulas', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(createFakePack({formulas: undefined}), 'Bar', []),
        /Pack definition has no formulas./,
      );
    });

    it('malformed formula name', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'malformed', []),
        /Pack definition has no formula "malformed"./,
      );
    });

    it('bad namespace', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Bar', []),
        /Pack definition has no formula "Bar"./,
      );
    });

    it('non-existent formula', async () => {
      await testHelper.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Foo', []),
        /Pack definition has no formula "Foo"./,
      );
    });
  });

  describe('fetcher mocks', () => {
    it('fetch calls are mocked', async () => {
      const context = newMockExecutionContext();
      context.fetcher.fetch.returns(newJsonFetchResponse({result: 'hello'}));
      const result = await executeFormulaFromPackDef(fakePack, 'Lookup', ['foo'], context);
      assert.equal(result, 'hello');

      sinon.assert.calledOnceWithExactly(context.fetcher.fetch, {
        method: 'GET',
        url: 'https://example.com/lookup?query=foo',
      });
    });

    it('temporary blob storage calls are mocked', async () => {
      const fakeBlobPack = createFakePack({
        formulas: [
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
      });

      const context = newMockExecutionContext();
      context.temporaryBlobStorage.storeBlob.returns('blob-url-1');
      context.temporaryBlobStorage.storeUrl.returns('blob-url-2');
      const result = await executeFormulaFromPackDef(fakeBlobPack, 'Blobs', [], context);
      assert.equal(result, 'blob-url-1,blob-url-2');

      sinon.assert.calledOnceWithExactly(context.temporaryBlobStorage.storeBlob, Buffer.from('asdf'), 'image/png');
      sinon.assert.calledOnceWithExactly(context.temporaryBlobStorage.storeUrl, 'url-to-store');
    });
  });

  describe('result value validation', () => {
    describe('result types', () => {
      const pack = createFakePack({
        formulas: [
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
      });

      it('string', async () => {
        await executeFormulaFromPackDef(pack, 'StringFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'StringFoo', [false]),
          /The following errors were found when validating the result of the formula "StringFoo":\nExpected a string result but got 123./,
        );
      });

      it('number', async () => {
        await executeFormulaFromPackDef(pack, 'NumberFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'NumberFoo', [false]),
          /The following errors were found when validating the result of the formula "NumberFoo":\nExpected a number result but got "blah"./,
        );
      });

      it('object', async () => {
        await executeFormulaFromPackDef(pack, 'ObjectFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'ObjectFoo', [false]),
          /The following errors were found when validating the result of the formula "ObjectFoo":\nExpected a object result but got "blah"./,
        );
      });

      it('object property', async () => {
        await executeFormulaFromPackDef(pack, 'ObjectPropertyFoo', [true]);
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(pack, 'ObjectPropertyFoo', [false]),
          /The following errors were found when validating the result of the formula "ObjectPropertyFoo":\nExpected a string property for Foo but got 123./,
        );
      });
    });

    describe('objects', () => {
      function makeFakePackWithResponseDef<T extends Schema = Schema>(response: ResponseHandlerTemplate<T>) {
        return createFakePack({
          formulas: [
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
          executeFormulaFromPackDef(pack, 'ObjectFormula', [JSON.stringify({})]),
          /Expected an object schema, but found {"type":"string"}/,
        );
      });

      it('incomplete return value', async () => {
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(defaultPack, 'ObjectFormula', [JSON.stringify({})]),
          new RegExp(
            'Schema declares required property "StringVal" but this attribute is missing or empty.\n' +
              'Schema declares required property "NumberVal" but this attribute is missing or empty.',
          ),
        );
      });

      it('empty id value', async () => {
        await testHelper.willBeRejectedWith(
          executeFormulaFromPackDef(defaultPack, 'ObjectFormula', [JSON.stringify({stringVal: '', numberVal: 0})]),
          /Schema declares "StringVal" as an id property but an empty value was found in result./,
        );
      });

      it('valid return value', async () => {
        await executeFormulaFromPackDef(defaultPack, 'ObjectFormula', [
          JSON.stringify({stringVal: 'foo', numberVal: 1}),
        ]);
      });
    });
  });

  describe('errors resolving sync formulas', () => {
    it('no sync tables', async () => {
      await testHelper.willBeRejectedWith(
        executeSyncFormulaFromPackDef(createFakePack({formulas: undefined, syncTables: undefined}), 'Bar', []),
        /Pack definition has no sync tables./,
      );
    });

    it('non-existent sync formula', async () => {
      await testHelper.willBeRejectedWith(
        executeSyncFormulaFromPackDef(fakePack, 'Foo', []),
        /Pack definition has no sync formula "Foo" in its sync tables./,
      );
    });
  });

  describe('execute metadata formula', () => {
    const fakePackWithMetadata = createFakePack({
      defaultAuthentication: {
        type: AuthenticationType.HeaderBearerToken,
        getConnectionName: makeMetadataFormula(async context => {
          const response = await context.fetcher.fetch({method: 'GET', url: 'https://example.com/whoami'});
          return response.body.username;
        }),
      },
      formulaNamespace: 'Fake',
      formulas: [
        makeStringFormula({
          name: 'Foo',
          description: '',
          examples: [],
          parameters: [
            makeStringParameter('value', 'Pass-through value to return.', {
              autocomplete: makeSimpleAutocompleteMetadataFormula(['foo', 'bar', 'baz']),
            }),
          ],
          execute: async ([value]) => {
            return value;
          },
        }),
      ],
    });

    it('executes getConnectionName formula', async () => {
      assertCondition(fakePackWithMetadata.defaultAuthentication?.type === AuthenticationType.HeaderBearerToken);
      const context = newMockExecutionContext();
      context.fetcher.fetch.returns(newJsonFetchResponse({username: 'some-user'}));

      const result = await executeMetadataFormula(
        fakePackWithMetadata.defaultAuthentication.getConnectionName!,
        undefined,
        context,
      );
      assert.equal(result, 'some-user');
    });

    it('executes simple autocomplete formula', async () => {
      const formula = (fakePackWithMetadata.formulas as Formula[])![0];
      const result = await executeMetadataFormula(formula.parameters[0]?.autocomplete!, {search: 'ba'});
      assert.deepEqual(result, [
        {
          display: 'bar',
          value: 'bar',
        },
        {
          display: 'baz',
          value: 'baz',
        },
      ]);
    });
  });

  it('works with uuid', async () => {
    await executeFormulaFromPackDef(fakePack, 'RandomId', []);
  });

  it('works with uuid in VM', async () => {
    await executeFormulaOrSyncWithVM({formulaName: 'RandomId', params: [], bundlePath});
  });
});
