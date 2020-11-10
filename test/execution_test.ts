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
});
