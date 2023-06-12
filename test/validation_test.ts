import {testHelper} from './test_helper';
import {FakePack} from './test_utils';
import type {ParamDefs} from '../api_types';
import {ScaleIconSet} from '../schema';
import {ValueHintType} from '../schema';
import {ValueType} from '../schema';
import {coerceParams} from '../testing/coercion';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {executeSyncFormulaFromPackDef} from '../testing/execution';
import {makeBooleanParameter} from '../api';
import {makeNumericParameter} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeStringArrayParameter} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';

describe('Property validation in objects', () => {
  const fakeSchema = makeObjectSchema({
    type: ValueType.Object,
    primary: 'date',
    id: 'date',
    properties: {
      bool: {type: ValueType.Boolean},
      date: {type: ValueType.String, codaType: ValueHintType.Date},
      url: {type: ValueType.String, codaType: ValueHintType.Url},
      email: {type: ValueType.String, codaType: ValueHintType.Email},
      slider: {
        type: ValueType.Number,
        codaType: ValueHintType.Slider,
        minimum: 12,
        maximum: 30,
        step: 3,
      },
      scale: {
        type: ValueType.Number,
        codaType: ValueHintType.Scale,
        maximum: 5,
        icon: ScaleIconSet.Star,
      },
      names: {type: ValueType.Array, items: {type: ValueType.String}},
      person: {
        type: ValueType.Object,
        codaType: ValueHintType.Person,
        primary: 'email',
        id: 'email',
        properties: {email: {type: ValueType.String, required: true}},
      },
      ref: {
        type: ValueType.Object,
        codaType: ValueHintType.Reference,
        id: 'reference',
        primary: 'name',
        identity: {packId: FakePack.id, name: ''},
        properties: {
          name: {
            type: ValueType.String,
            required: true,
          },
          reference: {
            type: ValueType.String,
            required: true,
          },
        },
      },
      nested: {
        type: ValueType.Object,
        id: 'string',
        properties: {
          bool: {type: ValueType.Boolean, required: true},
          string: {type: ValueType.String},
          number: {type: ValueType.Number},
        },
      },
    },
    identity: {packId: FakePack.id, name: 'Events'},
  });

  const fakeBooleanFormula = makeObjectFormula({
    name: 'Boolean',
    description: 'Returns the boolean you passed in.',
    examples: [],
    parameters: [makeBooleanParameter('boolParam', 'Pass in a boolean (malformed is ok)')],
    execute: async ([boolParam]) => {
      return {bool: boolParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeDateFormula = makeObjectFormula({
    name: 'Date',
    description: 'Returns the dateString you passed in.',
    examples: [],
    parameters: [makeStringParameter('dateParam', 'Pass in a date (malformed is ok)')],
    execute: async ([dateParam]) => {
      return {date: dateParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeSliderFormula = makeObjectFormula({
    name: 'Slider',
    description: 'Returns the number you passed in.',
    examples: [],
    parameters: [makeNumericParameter('number', 'Pass in a number (malformed is ok)')],
    execute: async ([numberParam]) => {
      return {slider: numberParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeScaleFormula = makeObjectFormula({
    name: 'Scale',
    description: 'Returns the number you passed in.',
    examples: [],
    parameters: [makeNumericParameter('number', 'Pass in a number (malformed is ok)')],
    execute: async ([numberParam]) => {
      return {scale: numberParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeUrlFormula = makeObjectFormula({
    name: 'Url',
    description: 'Returns the string you passed in.',
    examples: [],
    parameters: [makeStringParameter('string', 'Pass in a string (malformed is ok)')],
    execute: async ([stringParam]) => {
      return {url: stringParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeEmailFormula = makeObjectFormula({
    name: 'Email',
    description: 'Returns the string you passed in.',
    examples: [],
    parameters: [makeStringParameter('string', 'Pass in a string (malformed is ok)')],
    execute: async ([stringParam]) => {
      return {email: stringParam};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeArrayFormula = makeObjectFormula({
    name: 'GetNames',
    description: 'Returns the names you passed in.',
    examples: [],
    parameters: [makeStringArrayParameter('string', 'Pass in an array of strings')],
    execute: async ([stringArray]) => {
      return {names: stringArray};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakePeopleFormula = makeObjectFormula({
    name: 'GetPerson',
    description: 'Returns the person you passed in.',
    examples: [],
    parameters: [
      makeStringParameter('email', 'Pass in a string'),
      makeBooleanParameter('returnMalformed', 'whether or not to return a malformed response'),
    ],
    execute: async ([email, malformed]) => {
      return malformed ? {person: {emailAddress: email}} : {person: {email}};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeReferenceFormula = makeObjectFormula({
    name: 'GetReference',
    description: 'Returns a single reference.',
    examples: [],
    parameters: [makeBooleanParameter('returnMalformed', 'whether or not to return a malformed response')],
    execute: async ([malformed]) => {
      return malformed ? {ref: {name: 'Test'}} : {ref: {reference: 'foobar', name: 'Test'}};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakeNestedObjectFormula = makeObjectFormula({
    name: 'GetNestedObject',
    description: 'Returns an object with an object inside.',
    examples: [],
    parameters: [makeBooleanParameter('returnMalformed', 'whether or not to return a malformed response')],
    execute: async ([malformed]) => {
      return {nested: {string: 'foo', number: malformed ? '123' : 123, bool: false}};
    },
    response: {
      schema: fakeSchema,
    },
  });

  const fakePack = createFakePack({
    formulas: [
      fakeBooleanFormula,
      fakeDateFormula,
      fakeSliderFormula,
      fakeScaleFormula,
      fakeUrlFormula,
      fakeEmailFormula,
      fakeArrayFormula,
      fakePeopleFormula,
      fakeReferenceFormula,
      fakeNestedObjectFormula,
    ],
  });

  it('validates boolean', async () => {
    await executeFormulaFromPackDef(fakePack, 'Boolean', [true]);
    await executeFormulaFromPackDef(fakePack, 'Boolean', [false]);
  });

  it('validates correct date string', async () => {
    await executeFormulaFromPackDef(fakePack, 'Date', ['Wed, 02 Oct 2002 15:00:00 +0200']);
  });

  it('throws on malformed date string', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Date', ['asdfdasf']),
      /The following errors were found when validating the result of the formula "Date":\nFailed to parse asdfdasf as a date./,
    );
  });

  it('validates correct slider value', async () => {
    await executeFormulaFromPackDef(fakePack, 'Slider', [15]);
  });

  it('rejects non-numeric slider value', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Slider', ['9']),
      /The following errors were found when validating the result of the formula "Slider":\nExpected a number property for Slider but got "9"./,
    );
  });

  it('rejects slider value below minimum', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Slider', [9]),
      /The following errors were found when validating the result of the formula "Slider":\nSlider value 9 is below the specified minimum value of 12./,
    );
  });

  it('rejects slider value above maximum', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Slider', [32]),
      /The following errors were found when validating the result of the formula "Slider":\nSlider value 32 is greater than the specified maximum value of 30./,
    );
  });

  it('validates correct scale value', async () => {
    await executeFormulaFromPackDef(fakePack, 'Scale', [4]);
  });

  it('rejects scale value below 0', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Scale', [-1]),
      /The following errors were found when validating the result of the formula "Scale":\nScale value -1 cannot be below 0./,
    );
  });

  it('rejects scale value above maximum', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Scale', [6]),
      /The following errors were found when validating the result of the formula "Scale":\nScale value 6 is greater than the specified maximum value of 5./,
    );
  });

  it('validates properly formatted https url', async () => {
    await executeFormulaFromPackDef(fakePack, 'Url', ['https://google.com']);
  });

  it('validates properly formatted data url', async () => {
    await executeFormulaFromPackDef(fakePack, 'Url', ['data:image/png;base64,iVBORw0KGg']);
  });

  it('rejects http url', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Url', ['http://google.com']),
      /The following errors were found when validating the result of the formula "Url":\nProperty with codaType "url" must be a valid HTTPS or data url, but got "http:\/\/google.com"./,
    );
  });

  it('rejects improperly formatted url', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Url', ['mailto:http://google.com']),
      /The following errors were found when validating the result of the formula "Url":\nProperty with codaType "url" must be a valid HTTPS or data url, but got "mailto:http:\/\/google.com"./,
    );
  });

  it('rejects garbage url', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Url', ['jasiofjsdofjiaof']),
      /The following errors were found when validating the result of the formula "Url":\nProperty with codaType "url" must be a valid HTTPS or data url, but got "jasiofjsdofjiaof"./,
    );
  });

  it('validates properly formatted email', async () => {
    await executeFormulaFromPackDef(fakePack, 'Email', ['jim@foo.com']);
  });

  it('rejects improperly formatted email', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'Email', ['derp']),
      /The following errors were found when validating the result of the formula "Email":\nProperty with codaType "email" must be a valid email address, but got "derp"./,
    );
  });

  it('rejects person with no id field', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetPerson', ['test@coda.io', true]),
      /The following errors were found when validating the result of the formula "GetPerson":\nSchema declares required property "Email" but this attribute is missing or empty./,
    );
  });

  it('rejects person with non-email id', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetPerson', ['notanemail', false]),
      /The following errors were found when validating the result of the formula "GetPerson":\nThe id field for the person result must be an email string, but got "notanemail"./,
    );
  });

  it('validates correct person reference', async () => {
    await executeFormulaFromPackDef(fakePack, 'GetPerson', ['test@coda.io', false]);
  });

  it('handles references', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetReference', [true]),
      /The following errors were found when validating the result of the formula "GetReference":\nSchema declares required property "Reference" but this attribute is missing or empty./,
    );

    await executeFormulaFromPackDef(fakePack, 'GetReference', [false]);
  });

  it('rejects nested object with incorrect nested type', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetNestedObject', [true]),
      /The following errors were found when validating the result of the formula "GetNestedObject":\nExpected a number property for Nested.Number but got "123"./,
    );
  });

  it('validates string array', async () => {
    await executeFormulaFromPackDef(fakePack, 'GetNames', [['Jack', 'Jill', 'Hill']]);
  });

  it('rejects non array', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetNames', ['Jack']),
      /The following errors were found when validating the result of the formula "GetNames":\nExpected an array result but got Jack./,
    );
  });

  it('rejects bad array items', async () => {
    await testHelper.willBeRejectedWith(
      executeFormulaFromPackDef(fakePack, 'GetNames', [['Jack', 'Jill', 123, true]]),
      /The following errors were found when validating the result of the formula "GetNames":\nExpected a string property for Names\[2\] but got 123.\nExpected a string property for Names\[3\] but got true./,
    );
  });
});

describe('validation in sync tables', () => {
  const fakePersonSchema = makeObjectSchema({
    type: ValueType.Object,
    primary: 'name',
    id: 'name',
    properties: {
      name: {type: ValueType.String},
      info: {
        type: ValueType.Object,
        properties: {
          age: {type: ValueType.Number},
          grade: {type: ValueType.Number},
        },
      },
    },
  });

  const fakePack = createFakePack({
    syncTables: [
      makeSyncTable({
        name: 'Students',
        identityName: 'Person',
        schema: fakePersonSchema,
        formula: {
          name: 'Students',
          description: 'Gets students in a class',
          execute: async ([malformed], context) => {
            const {continuation} = context.sync;
            const page = continuation?.page;
            switch (page) {
              case 1:
              case undefined:
                return {
                  result: [
                    {name: 'Alice', info: {age: malformed ? '100' : 100, grade: 1}},
                    {name: 'Bob', info: {age: 100, grade: 1}},
                  ],
                  continuation: {page: 2},
                } as any;
              case 2:
                return {
                  result: [
                    {name: 'Chris', info: {age: 100, grade: 1}},
                    {name: 'Diana', info: {age: 100, grade: 1}},
                  ],
                };
              default:
                return {
                  result: [],
                };
            }
          },
          parameters: [makeBooleanParameter('malformed', 'whether or not to return a malformed response')],
          examples: [],
        },
      }),
    ],
  });

  it('rejects bad nested object property for item in sync formula', async () => {
    await testHelper.willBeRejectedWith(
      executeSyncFormulaFromPackDef(fakePack, 'Students', [true]),
      /Expected a number property for Students\[0\].Info.Age but got "100"./,
    );
  });

  it('validates correct items in sync formula', async () => {
    await executeSyncFormulaFromPackDef(fakePack, 'Students', [false]);
  });
});

describe('param validation', () => {
  function makeFormula(parameters: ParamDefs, varargParameters?: ParamDefs) {
    return makeStringFormula({
      name: 'Fake',
      description: '',
      examples: [],
      execute: async _params => {
        return 'ok';
      },
      parameters,
      varargParameters,
    });
  }

  describe('coercion', () => {
    it('basic', () => {
      const formula = makeFormula([
        makeNumericParameter('num', ''),
        makeBooleanParameter('bool', ''),
        makeStringParameter('string', ''),
      ]);
      const coerced = coerceParams(formula, ['-5', 'true', '123']);
      assert.deepEqual(coerced, [-5, true, '123']);
    });

    it('excess params tolerated', () => {
      const formula = makeFormula([
        makeNumericParameter('num', ''),
        makeBooleanParameter('bool', ''),
        makeStringParameter('string', ''),
      ]);
      const coerced = coerceParams(formula, ['-5', 'true', '123', 'foo', 'bar']);
      assert.deepEqual(coerced, [-5, true, '123', 'foo', 'bar']);
    });

    it('varargs', () => {
      const formula = makeFormula(
        [makeBooleanParameter('bool', '')],
        [makeNumericParameter('num', ''), makeStringParameter('string', '')],
      );
      const coerced = coerceParams(formula, ['false', '2.2', 'foo', '-18', '123']);
      assert.deepEqual(coerced, [false, 2.2, 'foo', -18, '123']);
    });
  });
});
