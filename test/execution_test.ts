import {testHelper} from './test_helper';
import {createFakePack, FakePack} from './test_utils';
import {executeFormulaFromPackDef, executeSyncFormulaFromPackDef} from '../testing/execution';
import {makeNumericArrayParameter, makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {newJsonFetchResponse} from '../testing/mocks';
import {newMockExecutionContext} from '../testing/mocks';
import {withQueryParams} from '../helpers/url';
import sinon from 'sinon';
import {makeSyncTable} from '../api';
import {makeSchema, ObjectSchema, ValueType} from '../schema';

describe('Execution', () => {
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
            const response = await context.fetcher!.fetch({method: 'GET', url});
            return response.body.result;
          },
        }),
      ],
    },
    syncTables: [
      makeSyncTable('Squares', makeSchema({
        type: ValueType.Object,
        primary: 'Value',
        id: 'Value',
        properties: {
          Value: {type: ValueType.Number},
        },
        identity: {packId: FakePack.id, name: FakePack.name},
      } as ObjectSchema<any, any>), {
        name: 'Squares',
        description: 'Syncs squared numbers',
        execute: async ([values]) => {
          return {
            result: values.map(value => ({
              Value: value ** 2,
            })) as any,
          };
        },
        network: {hasSideEffect: false},
        parameters: [makeNumericArrayParameter('Values', 'List of values to square')],
        examples: [],
      }),
    ]
  });

  it('executes a formula by name', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Fake::Square', [5]);
    assert.equal(result, 25);
  });

  it('executes a sync formula by name', async () => {
    const result = await executeSyncFormulaFromPackDef(fakePack, 'Squares', [[1, 2, 3, 4, 5]]);
    assert.deepEqual(result, {
      result: [
        { Value: 1 },
        { Value: 4 },
        { Value: 9 },
        { Value: 16 },
        { Value: 25 }
      ],
      continuation: undefined
    });
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
