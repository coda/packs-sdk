import * as testHelper from './test_helper';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';

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
      ],
    },
  });

  it('executes a formula by name', async () => {
    const result = await executeFormulaFromPackDef(fakePack, 'Fake::Square', [5]);
    assert.equal(result, 25);
  });

  describe('execution errors', () => {
    it('not enough params', async () => {
      await testHelper.customAssert.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Fake::Square', []),
        /Expected at least 1 parameter but only 0 were provided./,
      );
    });
  });

  describe('errors resolving formulas', () => {
    it('no formulas', async () => {
      await testHelper.customAssert.willBeRejectedWith(
        executeFormulaFromPackDef(createFakePack({formulas: undefined}), 'Foo::Bar', []),
        /Pack definition for Fake Pack \(id 424242\) has no formulas./,
      );
    });

    it('malformed formula name', async () => {
      await testHelper.customAssert.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'malformed', []),
        /Formula names must be specified as FormulaNamespace::FormulaName, but got "malformed"./,
      );
    });

    it('bad namespace', async () => {
      await testHelper.customAssert.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Foo::Bar', []),
        /Pack definition for Fake Pack \(id 424242\) has no formulas for namespace "Foo"./,
      );
    });

    it('non-existent formula', async () => {
      await testHelper.customAssert.willBeRejectedWith(
        executeFormulaFromPackDef(fakePack, 'Fake::Foo', []),
        /Pack definition for Fake Pack \(id 424242\) has no formula "Foo" in namespace "Fake"./,
      );
    });
  });
});
