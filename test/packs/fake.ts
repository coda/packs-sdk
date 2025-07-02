import type {PackDefinition} from '../../types';
import {ParameterType} from '../../api_types';
import type {Permission} from '../../schema';
import {PermissionSyncMode} from '../../api_types';
import {PermissionType} from '../../schema';
import {PrincipalType} from '../../schema';
import type {RowAccessDefinition} from '../../schema';
import type {UserPrincipal} from '../../schema';
import {ValueType} from '../../schema';
import {createFakePack} from '../test_utils';
import {ensureExists} from '../../helpers/ensure';
import {makeFormula} from '../../api';
import {makeNumericFormula} from '../../api';
import {makeNumericParameter} from '../../api';
import {makeObjectFormula} from '../../api';
import {makeObjectSchema} from '../../schema';
import {makeParameter} from '../../api';
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
      parameters: [
        makeParameter({
          type: ParameterType.String,
          name: 'query',
          description: 'A query to look up.',
          autocomplete: ['foo', 'bar'],
        }),
      ],
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
    makeNumericFormula({
      name: 'ValidateParametersFailsDueToNonSync',
      description: 'Validate parameters fails due to non-sync formula',
      parameters: [],
      execute: async ([], _context) => 1,
      validateParameters: async context => {
        if (context.sync?.permissionSyncMode) {
          return {isValid: true};
        }
        return {
          isValid: false,
          message: 'Validate parameters fails due to non-sync formula',
          errors: [],
        };
      },
    }),
    makeNumericFormula({
      name: 'ValidateParametersFailsIfParamIsNotPositive',
      description: 'Validate parameters fails if param is not positive',
      parameters: [makeNumericParameter('value', 'The value to validate.')],
      execute: async ([_value], _context) => 1,
      validateParameters: async (_context, _search, params) => {
        const {value} = ensureExists(params);
        if (value > 0) {
          return {isValid: true};
        }
        return {
          isValid: false,
          message: 'Validate parameters fails if value is not positive',
          errors: [{parameterName: 'value', message: `Value must be positive, got ${JSON.stringify(value)}`}],
        };
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
        validateParameters: async (context, _search, params) => {
          const {teacher} = ensureExists(params);
          // This will be valid if the teacher is Permission and the context permissionSyncMode is PermissionAware
          if (teacher === 'Permission' && context.sync?.permissionSyncMode === PermissionSyncMode.PermissionAware) {
            return {isValid: true};
          }
          // Also valid if the teacher is Personal and the context permissionSyncMode is Personal
          if (
            teacher === 'Personal' &&
            (context.sync?.permissionSyncMode === PermissionSyncMode.Personal ||
              context.sync?.permissionSyncMode === undefined)
          ) {
            return {isValid: true};
          }
          return {
            isValid: false,
            message: 'Validate parameters fails if teacher does not match permissionSyncMode',
            errors: [{parameterName: 'teacher', message: 'Teacher does not match permissionSyncMode'}],
          };
        },
        execute: async ([teacher, shouldPassthrough], context) => {
          const {continuation, previousCompletion} = context.sync;
          const isIncremental = Boolean(context.sync.previousCompletion);
          const page = continuation?.page;
          const incrementalPage = previousCompletion?.incrementalContinuation?.page;
          switch (teacher) {
            case 'Smith':
              if (!page || page === 1) {
                if (shouldPassthrough) {
                  return {
                    result: [{name: 'Alice'}, {name: 'Bob'}],
                    permissionsContext: [{userId: 42}, {userId: 123}],
                    continuation: {page: 2},
                  };
                }
                return {
                  result: [{name: 'Alice'}, {name: 'Bob'}],
                  continuation: {page: 2},
                };
              }
              if (page === 2) {
                if (shouldPassthrough) {
                  return {
                    result: [{name: 'Chris'}, {name: 'Diana'}],
                    permissionsContext: [{userId: 53}, {userId: 22}],
                    deletedRowIds: isIncremental ? ['Ed'] : undefined,
                  };
                }
                return {
                  result: [{name: 'Chris'}, {name: 'Diana'}],
                  deletedRowIds: isIncremental ? ['Ed'] : undefined,
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
            case 'Cunningham':
              if (!page || page === 1) {
                return {
                  result: [
                    {name: 'Albert'},
                    {name: 'Brenda'},
                    {name: 'Cory'},
                    {name: 'Dylan'},
                    {name: 'Ethan'},
                    {name: 'Fiona'},
                    {name: 'Gina'},
                    {name: 'Hank'},
                    {name: 'Ivy'},
                    {name: 'Jack'},
                    {name: 'Kyle'},
                    {name: 'Liam'},
                    {name: 'Mia'},
                    {name: 'Noah'},
                    {name: 'Olivia'},
                    {name: 'Pam'},
                    {name: 'Quinn'},
                    {name: 'Ryan'},
                    {name: 'Sam'},
                    {name: 'Tia'},
                    {name: 'Uma'},
                    {name: 'Vince'},
                  ],
                  continuation: {page: 2},
                };
              }
              if (page === 2) {
                return {
                  result: [
                    {name: 'Wendy'},
                    {name: 'Xavier'},
                    {name: 'Yara'},
                    {name: 'Zack'},
                    {name: 'Aaron'},
                    {name: 'Bella'},
                    {name: 'Charlie'},
                    {name: 'Diana'},
                    {name: 'Easton'},
                    {name: 'Frank'},
                    {name: 'Greg'},
                    {name: 'Hannah'},
                    {name: 'Ian'},
                    {name: 'Julia'},
                  ],
                };
              }
            case 'Mr. Incremental':
              if (!incrementalPage || incrementalPage === 1) {
                if (!page || page === 1) {
                  return {
                    result: [{name: 'Alice'}, {name: 'Bob'}],
                    continuation: {page: 2},

                    // This should be ignored, since we have a continuation
                    completion: {
                      hasIncompleteResults: true,
                      incrementalContinuation: {page: -1},
                    },
                  };
                } else {
                  return {
                    result: [{name: 'Chris'}, {name: 'Diana'}],
                    completion: {
                      hasIncompleteResults: true,
                      incrementalContinuation: {page: 3},
                    },
                  };
                }
              }
              if (incrementalPage === 3) {
                if (!page || page === 1) {
                  return {
                    result: [{name: 'Ethan'}, {name: 'Fiona'}],
                    continuation: {page: 2},
                  };
                }
                if (page === 2) {
                  return {
                    result: [{name: 'Gina'}, {name: 'Hank'}],
                  };
                }
              }
            default:
              return {} as any;
          }
        },
        executeUpdate: async (_params, updates, _context) => {
          return {result: updates.map(u => u.newValue)};
        },
        executeGetPermissions: async (_params, {rows, permissionsContext}, context) => {
          const {continuation} = context.sync;
          const page = continuation?.page;

          const rowAccessDefinitions: RowAccessDefinition[] = rows
            .map(r => r.row)
            .map((r, index) => {
              const id = ensureExists(r.name);
              const currPassthrough = permissionsContext ? permissionsContext[index] : undefined;
              // Default to 1 if no passthrough data is provided
              const userId = currPassthrough?.userId ?? 1;
              const principal: UserPrincipal = {
                type: PrincipalType.User,
                userId,
              };

              const permissions: Permission[] = [
                {
                  permissionType: PermissionType.Direct,
                  principal,
                },
              ];

              return {
                permissions,
                rowId: id,
              };
            });

          const pages: RowAccessDefinition[][] = [];
          const pageSize = 3;
          for (const [index, rowAccessDefinition] of rowAccessDefinitions.entries()) {
            const pageIndex = Math.floor(index / pageSize);
            if (!pages[pageIndex]) {
              pages[pageIndex] = [];
            }
            pages[pageIndex].push(rowAccessDefinition);
          }

          const pageToReturn = typeof page === 'number' ? page : 0;
          const resultsInPage = pages[pageToReturn];
          const resultsInNextPage = pages.length > pageToReturn + 1 ? pages[pageToReturn + 1] : [];
          const newContinuation = resultsInNextPage.length === 0 ? undefined : {page: pageToReturn + 1};

          return newContinuation
            ? {
                rowAccessDefinitions: resultsInPage,
                continuation: newContinuation,
              }
            : {
                rowAccessDefinitions: resultsInPage,
              };
        },
        parameters: [
          makeStringParameter('teacher', 'teacher name'),
          makeStringParameter('shouldPassthrough', 'should passthrough', {optional: true}),
        ],
        examples: [],
      },
    }),
  ],
});
