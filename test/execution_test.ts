import {testHelper} from './test_helper';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {newJsonFetchResponse} from '../testing/mocks';
import {newMockExecutionContext} from '../testing/mocks';
import {withQueryParams} from '../helpers/url';
import sinon from 'sinon';

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
  });

  it('executes a formula by name', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Fake::Square', [5]);
    assert.equal(result, 25);
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
});
