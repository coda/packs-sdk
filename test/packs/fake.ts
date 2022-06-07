import type {PackDefinition} from '../../types';
import {ValueType} from '../../schema';
import {createFakePack} from '../test_utils';
import {makeFormula} from '../../api';
import {makeNumericFormula} from '../../api';
import {makeNumericParameter} from '../../api';
import {makeObjectFormula} from '../../api';
import {makeObjectSchema} from '../../schema';
import {makeStringFormula} from '../../api';
import {makeStringParameter} from '../../api';
import {makeSyncTable} from '../../api';
import {v4} from 'uuid';
import {withQueryParams} from '../../helpers/url';

const fakePersonSchema = makeObjectSchema({
  type: ValueType.Object,
  primary: 'name',
  id: 'name',
  properties: {
    name: {type: ValueType.String},
  },
});

function throwError() {
  throw new Error('here');
}

export const manifest: PackDefinition = createFakePack({
  formulaNamespace: 'Fake',
  formulas: [
    makeNumericFormula({
      name: 'Timer',
      description: 'Timer',
      examples: [],
      parameters: [makeNumericParameter('value', 'The time to wait.')],
      execute: ([value]) => {
        setTimeout(() => {}, value);
        return value;
      },
    }),
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
    makeFormula({
      resultType: ValueType.Boolean,
      name: 'Throw',
      description: 'Throw an error.',
      examples: [],
      parameters: [],
      execute: ([]) => {
        throwError();
        return false;
      },
    }),
    makeFormula({
      resultType: ValueType.String,
      name: 'RandomId',
      description: 'Returns a uuid.',
      examples: [],
      parameters: [],
      execute: ([]) => {
        return v4();
      },
    }),
    makeFormula({
      resultType: ValueType.String,
      name: 'marshalBuffer',
      description: 'Returns a marshaled buffer.',
      examples: [],
      parameters: [],
      execute: async ([], context) => {
        await context.temporaryBlobStorage.storeBlob(Buffer.from('test'), 'text/html');
        return 'okay';
      },
    }),
    makeObjectFormula({
      name: 'Person',
      description: 'Returns a random UUID inside an object.',
      examples: [],
      response: {schema: fakePersonSchema},
      parameters: [makeStringParameter('name', 'The name to search for.')],
      execute: ([name]) => {
        const students = [{name: 'Alice'}, {name: 'Bob'}];
        return students.find(student => student.name === name) as any;
      },
    }),
  ],
  syncTables: [
    makeSyncTable({
      name: 'Students',
      identityName: 'Person',
      schema: fakePersonSchema,
      formula: {
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
        parameters: [makeStringParameter('teacher', 'teacher name')],
        examples: [],
      },
    }),
  ],
});
