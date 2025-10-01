import {testHelper} from './test_helper';
import {AuthenticationType} from '../types';
import type {ExecutionContext} from '../api';
import type {Formula} from '../api';
import {FormulaType} from '../runtime/types';
import type {GenericExecuteGetPermissionsRequest} from '../api';
import type {GenericSyncUpdate} from '../api';
import {MetadataFormulaType} from '../runtime/types';
import type {PackDefinitionBuilder} from '../builder';
import {ParameterType} from '../api_types';
import {PermissionType} from '../schema';
import {PostSetupType} from '../types';
import type {ResponseHandlerTemplate} from '../handler_templates';
import type {Schema} from '../schema';
import {TimerShimStrategy} from '../testing/compile';
import {ValueType} from '../schema';
import {assertCondition} from '../helpers/ensure';
import {compilePackBundle} from '../testing/compile';
import {createFakePack} from './test_utils';
import {executeFormulaFromPackDef} from '../testing/execution';
import {executeFormulaOrSyncFromCLI} from '../testing/execution';
import {executeFormulaOrSyncWithVM} from '../testing/execution';
import {executeMetadataFormula} from '../testing/execution';
import {executeSyncFormula} from '../testing/execution';
import {manifest as fakePack} from './packs/fake';
import * as helpers from '../testing/helpers';
import {makeBooleanParameter} from '../api';
import {makeFormulaSpec} from '../testing/execution';
import {makeMetadataFormula} from '../api';
import {makeNumericFormula} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeParameter} from '../api';
import {makeSimpleAutocompleteMetadataFormula} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {newJsonFetchResponse} from '../testing/mocks';
import {newMockExecutionContext} from '../testing/mocks';
import {newMockSyncExecutionContext} from '../testing/mocks';
import {newPack} from '../builder';
import path from 'path';
import sinon from 'sinon';

describe('Execution', () => {
  let bundlePath: string;
  let bundleSourceMapPath: string;

  before(async () => {
    ({bundlePath, bundleSourceMapPath} = await compilePackBundle({
      manifestPath: `${__dirname}/packs/fake`,
      timerStrategy: TimerShimStrategy.Fake,
    }));
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
    const result = await executeFormulaFromPackDef(fakePack, 'Person', ['Alice'], undefined, {
      useDeprecatedResultNormalization: false,
    });
    assert.deepEqual(result, {name: 'Alice'});
  });

  it('executes a incremental sync formula by name', async () => {
    const mockContext = newMockSyncExecutionContext({
      sync: {
        previousCompletion: {
          incrementalContinuation: {
            isIncremental: 'true',
          },
        },
      },
    });
    const result = await executeSyncFormula(fakePack, 'Students', ['Smith'], mockContext);
    assert.deepEqual(result, {
      result: [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}],
      permissionsContext: [],
      deletedRowIds: ['Ed'],
    });
  });

  it('executes a sync formula by name', async () => {
    const result = await executeSyncFormula(fakePack, 'Students', ['Smith']);
    assert.deepEqual(result.result, [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}]);
  });

  it('executes a sync formulas without normalization', async () => {
    const result = await executeSyncFormula(fakePack, 'Students', ['Smith'], undefined, {
      validateParams: true,
      validateResult: true,
      useDeprecatedResultNormalization: false,
    });
    assert.deepEqual(result.result, [{name: 'Alice'}, {name: 'Bob'}, {name: 'Chris'}, {name: 'Diana'}]);
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

  it('execute sync works and returns passthrough', async () => {
    const results = await executeSyncFormula(
      fakePack,
      'Students',
      ['Smith', 'true'],
      undefined,
      {},
      {useRealFetcher: false},
    );
    assert.deepEqual(results.permissionsContext, [{userId: 42}, {userId: 123}, {userId: 53}, {userId: 22}]);
    assert.deepEqual(results.result, [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}]);
    assert.equal(results.permissionsContext?.length, results.result.length);
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
      context.fetcher.fetch.resolves(newJsonFetchResponse({result: 'hello'}));
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
      context.temporaryBlobStorage.storeBlob.resolves('blob-url-1');
      context.temporaryBlobStorage.storeUrl.resolves('blob-url-2');
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
          featured: ['stringVal', 'numberVal'],
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
        executeSyncFormula(createFakePack({formulas: undefined, syncTables: undefined}), 'Bar', []),
        /Pack definition has no sync tables./,
      );
    });

    it('non-existent sync formula', async () => {
      await testHelper.willBeRejectedWith(
        executeSyncFormula(fakePack, 'Foo', []),
        /Pack definition has no sync formula "Foo" in its sync tables./,
      );
    });
  });

  describe('execute metadata formula', () => {
    const fakePackWithMetadata = createFakePack({
      defaultAuthentication: {
        type: AuthenticationType.HeaderBearerToken,
        getConnectionName: makeMetadataFormula<ExecutionContext, string>(async context => {
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
      context.fetcher.fetch.resolves(newJsonFetchResponse({username: 'some-user'}));

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

  describe('CLI execution', () => {
    let mockPrint: sinon.SinonStub;
    let mockPrintFull: sinon.SinonStub;
    let mockExit: sinon.SinonStub;

    beforeEach(() => {
      mockPrint = sinon.stub(helpers, 'print');
      mockPrintFull = sinon.stub(helpers, 'printFull');
      mockExit = sinon.stub(process, 'exit');
    });

    afterEach(() => {
      sinon.restore();
    });

    for (const vm of [true, false]) {
      describe(`vm=${vm}`, () => {
        it('works', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Square',
            params: ['5'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          sinon.assert.calledOnceWithExactly(mockPrintFull, 25);
        });

        it('sync works', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students',
            params: ['Smith'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          // WTF? Why is this different in VM?
          if (vm) {
            assert.deepEqual(result, [{name: 'Alice'}, {name: 'Bob'}, {name: 'Chris'}, {name: 'Diana'}]);
          } else {
            assert.deepEqual(result, [{Name: 'Alice'}, {Name: 'Bob'}, {Name: 'Chris'}, {Name: 'Diana'}]);
          }
        });

        it('sync with includePermissions works', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students>permissions',
            params: ['Cunningham'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];

          assert.deepEqual(
            result,
            [
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
            ].map(student => {
              return {
                rowId: student.name,
                permissions: [{permissionType: PermissionType.Direct, principal: {type: 'user', userId: 1}}],
              };
            }),
          );
        });

        it('sync with includePermissions works with maxRows', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students>permissions',
            params: ['Cunningham'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
            maxRows: 17,
          });
          const result = mockPrintFull.args[0][0];

          assert.deepEqual(
            result,
            [
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
            ].map(student => {
              return {
                rowId: student.name,
                permissions: [{permissionType: PermissionType.Direct, principal: {type: 'user', userId: 1}}],
              };
            }),
          );
        });

        it('sync with incremental chaining works', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students>incremental',
            params: ['Mr. Incremental'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];

          assert.deepEqual(
            result,
            ['Ethan', 'Fiona', 'Gina', 'Hank'].map(name => (vm ? {name} : {Name: name})),
          );
        });

        it('sync update works', async () => {
          const syncUpdates: GenericSyncUpdate[] = [
            {previousValue: {name: 'Alice'}, newValue: {name: 'Alice Smith'}, updatedFields: ['name']},
          ];
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students:update',
            params: ['Smith', JSON.stringify(syncUpdates)],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {result: [{outcome: 'success', finalValue: {name: 'Alice Smith'}}]});
        });

        it('get permissions works', async () => {
          const names = [
            'Albert',
            'Brenda',
            'Cory',
            'Dylan',
            'Ethan',
            'Fiona',
            'Gina',
            'Hank',
            'Ivy',
            'Jack',
            'Kyle',
            'Liam',
            'Mia',
            'Noah',
            'Olivia',
            'Pam',
            'Quinn',
            'Ryan',
            'Sam',
            'Tia',
            'Uma',
            'Vince',
            'Wendy',
            'Xavier',
            'Yara',
            'Zack',
            'Aaron',
            'Bella',
            'Charlie',
            'Diana',
            'Easton',
            'Frank',
            'Greg',
            'Hannah',
            'Ian',
            'Julia',
          ];

          const syncRows: GenericExecuteGetPermissionsRequest = {
            rows: names.map(name => ({row: {name}})),
          };
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students:permissions',
            params: ['Cunningham', JSON.stringify(syncRows)],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {
            rowAccessDefinitions: names.map(name => ({
              rowId: name,
              permissions: [{permissionType: PermissionType.Direct, principal: {type: 'user', userId: 1}}],
            })),
          });
        });

        it('get permissions works with passthrough data', async () => {
          const names = [
            'Albert',
            'Brenda',
            'Cory',
            'Dylan',
            'Ethan',
            'Fiona',
            'Gina',
            'Hank',
            'Ivy',
            'Jack',
            'Kyle',
            'Liam',
            'Mia',
            'Noah',
            'Olivia',
            'Pam',
            'Quinn',
            'Ryan',
            'Sam',
            'Tia',
            'Uma',
            'Vince',
            'Wendy',
            'Xavier',
            'Yara',
            'Zack',
            'Aaron',
            'Bella',
            'Charlie',
            'Diana',
            'Easton',
            'Frank',
            'Greg',
            'Hannah',
            'Ian',
            'Julia',
          ];

          const syncRows: GenericExecuteGetPermissionsRequest = {
            rows: names.map(name => ({row: {name}})),
            permissionsContext: names.map((name, index) => ({userId: index % 2})),
          };
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students:permissions',
            params: ['Cunningham', JSON.stringify(syncRows)],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {
            rowAccessDefinitions: names.map((name, index) => ({
              rowId: name,
              permissions: [{permissionType: PermissionType.Direct, principal: {type: 'user', userId: index % 2}}],
            })),
          });
        });

        it('context includes sync for validateParameters and parameters on sync formula', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Students:validateParameters',
            params: ['', '{"teacher": "Personal"}'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {isValid: true});
        });

        it('validateParameters on formula does not include sync in context', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'ValidateParametersFailsDueToNonSync:validateParameters',
            params: ['', '{}'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {
            isValid: false,
            message: 'Validate parameters fails due to non-sync formula',
            errors: [],
          });
        });

        it('validateParameters on formula returns InvalidParameterValidationResult', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'ValidateParametersFailsIfParamIsNotPositive:validateParameters',
            params: ['', '{"value": 0}'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {
            isValid: false,
            message: 'Validate parameters fails if value is not positive',
            errors: [
              {
                message: 'Value must be positive, got 0',
                parameterName: 'value',
              },
            ],
          });
        });

        it('validateParameters on formula can return valid result', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'ValidateParametersFailsIfParamIsNotPositive:validateParameters',
            params: ['', '{"value": 1}'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, {isValid: true});
        });

        it('autocomplete', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Lookup:autocomplete:query',
            params: ['fo'],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, [{value: 'foo', display: 'foo'}]);
        });

        it('autocomplete with formula context', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Lookup:autocomplete:query',
            params: ['fo', JSON.stringify({blah: 'bar'})],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const result = mockPrintFull.args[0][0];
          assert.deepEqual(result, [{value: 'foo', display: 'foo'}]);
        });

        it('pack exceptions print stacktrace', async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'Throw',
            params: [],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const error = mockPrint.args[0][0];
          const exitValue = mockExit.args[0][0];
          assert.instanceOf(error, Error);
          assert.include(error.stack, path.join(__dirname, 'packs/fake.ts'));
          assert.equal(exitValue, 1);
        });

        it("CLI errors don't print stacktrace", async () => {
          await executeFormulaOrSyncFromCLI({
            vm,
            formulaName: 'NotRealFormula',
            params: [],
            manifest: fakePack,
            manifestPath: '',
            bundleSourceMapPath,
            bundlePath,
            contextOptions: {useRealFetcher: false},
          });
          const message = mockPrint.args[0][0];
          const exitValue = mockExit.args[0][0];
          assert.typeOf(message, 'string');
          assert.notInclude(message, path.join(__dirname, '/packs-sdk/dist/'));
          assert.equal(exitValue, 1);
        });
      });
    }
  });
});

describe('CLI formula spec parsing', () => {
  let pack: PackDefinitionBuilder;

  beforeEach(() => {
    pack = newPack();
  });

  it('vanilla formula', () => {
    const spec = makeFormulaSpec(fakePack, 'Square');
    assert.deepEqual(spec, {type: FormulaType.Standard, formulaName: 'Square'});
  });

  it('vanilla sync', () => {
    const spec = makeFormulaSpec(fakePack, 'Students');
    assert.deepEqual(spec, {type: FormulaType.Sync, formulaName: 'Students'});
  });

  it('formula autocomplete', () => {
    pack.addFormula({
      resultType: ValueType.String,
      name: 'Foo',
      description: '',
      parameters: [
        makeParameter({type: ParameterType.String, name: 'myOtherParam', description: ''}),
        makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
      ],
      execute: async () => '',
    });

    const spec = makeFormulaSpec(pack, 'Foo:autocomplete:myParam');
    assert.deepEqual(spec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.ParameterAutocomplete,
      parameterName: 'myParam',
      parentFormulaName: 'Foo',
      parentFormulaType: FormulaType.Standard,
    });
  });

  it('sync formula autocomplete', () => {
    pack.addSyncTable({
      name: 'MySync',
      description: '',
      identityName: 'Foo',
      schema: makeObjectSchema({
        properties: {
          id: {type: ValueType.String},
        },
        idProperty: 'id',
        displayProperty: 'id',
        featuredProperties: ['id'],
      }),
      formula: {
        name: 'Foo',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
        ],
        execute: async () => ({result: []}),
      },
    });
    const spec = makeFormulaSpec(pack, 'MySync:autocomplete:myParam');
    assert.deepEqual(spec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.ParameterAutocomplete,
      parameterName: 'myParam',
      parentFormulaName: 'MySync',
      parentFormulaType: FormulaType.Sync,
    });
  });

  it('dynamic sync table metadata formulas', () => {
    pack.addDynamicSyncTable({
      name: 'MySync',
      description: '',
      identityName: 'Foo',
      getName: async () => 'name',
      getDisplayUrl: async () => 'display url',
      listDynamicUrls: async () => ['url1'],
      searchDynamicUrls: async () => ['search result'],
      getSchema: async () =>
        makeObjectSchema({
          properties: {
            id: {type: ValueType.String},
          },
          idProperty: 'id',
          displayProperty: 'id',
          featuredProperties: ['id'],
        }),
      formula: {
        name: 'Foo',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
        ],
        execute: async () => ({result: []}),
        executeUpdate: async () => ({result: []}),
        executeGetPermissions: async () => ({rowAccessDefinitions: []}),
      },
    });

    const getNameSpec = makeFormulaSpec(pack, 'MySync:getName');
    assert.deepEqual(getNameSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncGetTableName,
      syncTableName: 'MySync',
    });

    const getDisplayUrlSpec = makeFormulaSpec(pack, 'MySync:getDisplayUrl');
    assert.deepEqual(getDisplayUrlSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncGetDisplayUrl,
      syncTableName: 'MySync',
    });

    const listDynamicUrlsSpec = makeFormulaSpec(pack, 'MySync:listDynamicUrls');
    assert.deepEqual(listDynamicUrlsSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncListDynamicUrls,
      syncTableName: 'MySync',
    });

    const searchDynamicUrlsSpec = makeFormulaSpec(pack, 'MySync:searchDynamicUrls');
    assert.deepEqual(searchDynamicUrlsSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncSearchDynamicUrls,
      syncTableName: 'MySync',
    });

    const getSchemaSpec = makeFormulaSpec(pack, 'MySync:getSchema');
    assert.deepEqual(getSchemaSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncGetSchema,
      syncTableName: 'MySync',
    });

    const updateSpec = makeFormulaSpec(pack, 'MySync:update');
    assert.deepEqual(updateSpec, {
      type: FormulaType.SyncUpdate,
      formulaName: 'MySync',
    });

    const getPermissionsSpec = makeFormulaSpec(pack, 'MySync:permissions');
    assert.deepEqual(getPermissionsSpec, {
      type: FormulaType.GetPermissions,
      formulaName: 'MySync',
    });
  });

  it('auth metadata formulas', () => {
    pack.setUserAuthentication({
      type: AuthenticationType.HeaderBearerToken,
      getConnectionName: async () => 'connection name',
      getConnectionUserId: async () => 'user id',
      postSetup: [{type: PostSetupType.SetEndpoint, name: 'step 1', description: '', getOptions: async () => []}],
    });

    const getConnectionNameSpec = makeFormulaSpec(pack, 'Auth:getConnectionName');
    assert.deepEqual(getConnectionNameSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.GetConnectionName,
    });

    const getConnectionUserIdSpec = makeFormulaSpec(pack, 'Auth:getConnectionUserId');
    assert.deepEqual(getConnectionUserIdSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.GetConnectionUserId,
    });

    const setEndpointSpec = makeFormulaSpec(pack, 'Auth:postSetup:setEndpoint:step 1');
    assert.deepEqual(setEndpointSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.PostSetupSetEndpoint,
      stepName: 'step 1',
    });
  });

  it('formula named "Auth"', () => {
    pack.addFormula({
      resultType: ValueType.String,
      name: 'Auth',
      description: '',
      parameters: [
        makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
      ],
      execute: async () => '',
    });

    const spec = makeFormulaSpec(pack, 'Auth');
    assert.deepEqual(spec, {type: FormulaType.Standard, formulaName: 'Auth'});

    const autocompleteSpec = makeFormulaSpec(pack, 'Auth:autocomplete:myParam');
    assert.deepEqual(autocompleteSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.ParameterAutocomplete,
      parameterName: 'myParam',
      parentFormulaName: 'Auth',
      parentFormulaType: FormulaType.Standard,
    });
  });

  it('sync named "Auth"', () => {
    pack.addDynamicSyncTable({
      name: 'Auth',
      description: '',
      identityName: 'Foo',
      getName: async () => 'name',
      getDisplayUrl: async () => 'display url',
      listDynamicUrls: async () => ['url1'],
      searchDynamicUrls: async () => ['search result'],
      getSchema: async () =>
        makeObjectSchema({
          properties: {
            id: {type: ValueType.String},
          },
          idProperty: 'id',
          displayProperty: 'id',
          featuredProperties: ['id'],
        }),
      formula: {
        name: 'Foo',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
        ],
        execute: async () => ({result: []}),
      },
    });

    const spec = makeFormulaSpec(pack, 'Auth');
    assert.deepEqual(spec, {type: FormulaType.Sync, formulaName: 'Auth'});

    const autocompleteSpec = makeFormulaSpec(pack, 'Auth:autocomplete:myParam');
    assert.deepEqual(autocompleteSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.ParameterAutocomplete,
      parameterName: 'myParam',
      parentFormulaName: 'Auth',
      parentFormulaType: FormulaType.Sync,
    });

    const getNameSpec = makeFormulaSpec(pack, 'Auth:getName');
    assert.deepEqual(getNameSpec, {
      type: FormulaType.Metadata,
      metadataFormulaType: MetadataFormulaType.SyncGetTableName,
      syncTableName: 'Auth',
    });
  });

  describe('errors', () => {
    it('unknown formula', () => {
      assert.throws(() => makeFormulaSpec(pack, 'Foo'), 'Could not find a formula or sync named "Foo".');
    });

    it('no user auth', () => {
      assert.throws(
        () => makeFormulaSpec(pack, 'Auth:getConnectionName'),
        'Pack definition has no user authentication.',
      );
    });

    it('unrecognized post setup step type', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        postSetup: [{type: PostSetupType.SetEndpoint, name: 'step 1', description: '', getOptions: async () => []}],
      });
      assert.throws(
        () => makeFormulaSpec(pack, 'Auth:postSetup:garbage:step 1'),
        'Unrecognized setup step type "garbage".',
      );
    });

    it('unrecognized auth metadata formula falls through', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
      });
      assert.throws(
        () => makeFormulaSpec(pack, 'Auth:somethingElse'),
        'Could not find a formula or sync named "Auth".',
      );
    });

    it('sync updates and metadata not compatible with standard formula', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'Foo',
        description: '',
        parameters: [],
        execute: async () => '',
      });
      assert.throws(
        () => makeFormulaSpec(pack, 'Foo:update'),
        'Two-way sync formula "update" is only supported for sync formulas.',
      );
      assert.throws(
        () => makeFormulaSpec(pack, 'Foo:getName'),
        'Metadata formula "getName" is only supported for sync formulas.',
      );
    });

    it('unrecognized sync metadata formula', () => {
      pack.addDynamicSyncTable({
        name: 'MySync',
        description: '',
        identityName: 'Foo',
        getName: async () => 'name',
        getDisplayUrl: async () => 'display url',
        listDynamicUrls: async () => ['url1'],
        searchDynamicUrls: async () => ['search result'],
        getSchema: async () =>
          makeObjectSchema({
            properties: {
              id: {type: ValueType.String},
            },
            idProperty: 'id',
            displayProperty: 'id',
            featuredProperties: ['id'],
          }),
        formula: {
          name: 'Foo',
          description: '',
          parameters: [
            makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
          ],
          execute: async () => ({result: []}),
          executeUpdate: async () => ({result: []}),
        },
      });

      assert.throws(() => makeFormulaSpec(pack, 'MySync:garbage'), 'Unrecognized metadata formula type "garbage".');
    });

    it('formula autocomplete', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'Foo',
        description: '',
        parameters: [
          makeParameter({type: ParameterType.String, name: 'myOtherParam', description: ''}),
          makeParameter({type: ParameterType.String, name: 'myParam', description: '', autocomplete: ['foo', 'bar']}),
        ],
        execute: async () => '',
      });

      assert.throws(
        () => makeFormulaSpec(pack, 'Foo:autocomplete'),
        'No parameter name specified for autocomplete metadata formula.',
      );
      assert.throws(
        () => makeFormulaSpec(pack, 'Foo:autocomplete:garbage'),
        'Formula "Foo" has no parameter named "garbage".',
      );
    });

    it('too many parts', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'Foo',
        description: '',
        parameters: [],
        execute: async () => '',
      });
      assert.throws(
        () => makeFormulaSpec(pack, 'Foo:bar:baz:blah'),
        'Unrecognized execution command: "Foo:bar:baz:blah".',
      );
    });
  });
});
