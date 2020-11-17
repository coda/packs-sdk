import { makeObjectFormula, makeStringParameter } from '../api';
import { makeObjectSchema, ValueType } from '../schema';
import { executeFormulaFromPackDef } from '../testing/execution';
import { createFakePack, FakePack } from './test_utils';
import {testHelper} from './test_helper';

describe('Validation', () => {
  const fakeEventsSchema = makeObjectSchema({
    type: ValueType.Object,
    primary: 'date',
    id: 'date',
    properties: {
      date: {type: ValueType.String, codaType: ValueType.Date},
    },
    identity: {packId: FakePack.id, name: 'Events'},
  });

  const fakeDateFormula = makeObjectFormula({
    name: 'Date',
    description: 'Returns the date you passed in.',
    examples: [],
    parameters: [makeStringParameter('dateParam', 'Pass in a date (malformed is ok)')],
    execute: async ([dateParam]) => {
      return {date: dateParam};
    },
    response: {
      schema: fakeEventsSchema,
    }
  });

  const fakePack = createFakePack({
    formulas: {Fake: [fakeDateFormula]}
  })

  it('correctly validates date object', async () => {
    await executeFormulaFromPackDef(fakePack, 'Fake::Date', ['Wed, 02 Oct 2002 15:00:00 +0200']);
  });

  it('correctly throws on malformed date object', async () => {
    // await executeFormulaFromPackDef(fakePack, 'Fake::Date', ['asdfdasf']);
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Fake::Date', ['asdfdasf']),
      /The following errors were found when validating the result of the formula "Date":\nFailed to parse asdfdasf as a date./,
    )
  });
});
