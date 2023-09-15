import {testHelper} from './test_helper';
import type {ArraySchema} from '../schema';
import {AttributionNodeType} from '..';
import {AuthenticationType} from '../types';
import {ConnectionRequirement} from '../api_types';
import {CurrencyFormat} from '..';
import {DurationUnit} from '..';
import type {Formula} from '../api';
import type {GenericSyncTable} from '../api';
import {ImageCornerStyle} from '../schema';
import {ImageOutline} from '../schema';
import {Limits} from '../testing/upload_validation';
import type {ObjectSchemaDefinition} from '../schema';
import type {OptionsReference} from '../api_types';
import {OptionsType} from '../api_types';
import type {PackFormulaMetadata} from '../api';
import {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionMetadata} from '../compiled_types';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {PostSetupType} from '../types';
import {ScaleIconSet} from '../schema';
import type {StringFormulaDefLegacy} from '../api';
import {Type} from '../api_types';
import {ValueHintType} from '../schema';
import {ValueType} from '../schema';
import {compilePackMetadata} from '../helpers/metadata';
import {createFakePack} from './test_utils';
import {createFakePackFormulaMetadata} from './test_utils';
import {createFakePackVersionMetadata} from './test_utils';
import {deepCopy} from '../helpers/object_utils';
import {makeAttributionNode} from '..';
import {makeDynamicSyncTable} from '../api';
import {makeFormula} from '../api';
import {makeMetadataFormula} from '../api';
import {makeNumericArrayParameter} from '../api';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeParameter} from '../api';
import {makeSchema} from '../schema';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';
import {makeSyncTableLegacy} from '../api';
import {numberArray} from '../api_types';
import {validatePackVersionMetadata} from '../testing/upload_validation';
import {validateSyncTableSchema} from '../testing/upload_validation';
import {validateVariousAuthenticationMetadata} from '../testing/upload_validation';

describe('Pack metadata Validation', async () => {
  async function getCurrentSdkVersion(): Promise<string> {
    const packageJson = await import('' + '../package.json');
    const codaPacksSDKVersion = packageJson.version as string;
    return codaPacksSDKVersion;
  }
  const codaPacksSDKVersion = await getCurrentSdkVersion();

  async function validateJson(obj: Record<string, any>, sdkVersion?: string) {
    try {
      return await doValidateJson(obj, sdkVersion);
    } catch (err) {
      const message = err instanceof PackMetadataValidationError ? JSON.stringify(err.validationErrors) : err;
      assert.fail(`Expected validation to succeed but failed with error ${message}`);
    }
  }

  async function doValidateJson(obj: Record<string, any>, sdkVersion?: string) {
    return validatePackVersionMetadata(obj, sdkVersion === null ? codaPacksSDKVersion : sdkVersion);
  }

  async function validateJsonAndAssertFails(obj: Record<string, any>, sdkVersion?: string) {
    const err = await testHelper.willBeRejectedWith(doValidateJson(obj, sdkVersion), /Pack metadata failed validation/);
    return err as PackMetadataValidationError;
  }

  it('empty upload JSON object', async () => {
    const err = await validateJsonAndAssertFails({});
    assert.deepEqual(err.validationErrors, [
      {
        message: 'Missing required field version.',
        path: 'version',
      },
    ]);
  });

  it('wrong top-level types', async () => {
    const metadata = 'asdf';
    const err = await validateJsonAndAssertFails(metadata as unknown as Record<string, any>);
    assert.deepEqual(err.validationErrors, [{path: '', message: 'Expected object, received string'}]);
  });

  it('simple valid upload', async () => {
    const metadata = createFakePackVersionMetadata();
    const result = await validateJson(metadata);
    assert.deepEqual(result, metadata);
  });

  it('extraneous fields are omitted', async () => {
    const metadata = createFakePackVersionMetadata({
      formulaNamespace: 'namespace',
      formulas: [
        makeStringFormula({
          extraneous: 'evil long string',
          name: 'formula',
          description: '',
          execute: () => '',
          parameters: [],
        } as StringFormulaDefLegacy<any>),
      ],
    });
    const result = await validateJson({
      ...metadata,
      extraneous: 'long evil string',
    });
    assert.notInclude(Object.keys(result), 'extraneous');
    assert.notInclude(Object.keys((result.formulas as PackFormulaMetadata[])[0]), 'extraneous');
  });

  it('formula namespace required when formulas present', async () => {
    const metadata = createFakePackVersionMetadata({
      formulas: [createFakePackFormulaMetadata()],
      formulaNamespace: undefined,
    });
    const err = await validateJsonAndAssertFails(metadata);
    assert.deepEqual(err.validationErrors, [
      {
        path: 'formulaNamespace',
        message: 'A formula namespace must be provided whenever formulas are defined.',
      },
    ]);
  });

  it('valid versions', async () => {
    for (const version of ['1', '1.0', '1.0.0', '2147483647', '0.0.2147483647']) {
      const metadata = createFakePackVersionMetadata({version});
      const result = await validateJson(metadata);
      assert.ok(result, `Expected version identifier "${version}" to be valid.`);
    }
  });

  it('invalid versions', async () => {
    async function expectFailureWith(version: string, message: string) {
      const metadata = createFakePackVersionMetadata({version});
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [{path: 'version', message}]);
    }
    for (const version of ['', 'foo', 'unversioned', '-1', '1.0.0.0', '1.0.0-beta']) {
      await expectFailureWith(version, 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".');
    }
    for (const version of ['3000000000', '0.3000000000']) {
      await expectFailureWith(version, 'Pack version number too large');
    }
  });

  it('formula namespace not required when formulas absent', async () => {
    const metadata = createFakePackVersionMetadata({formulas: undefined, formulaNamespace: undefined});
    await validateJson(metadata);
  });

  it('formula namespace not required when formulas present but empty', async () => {
    const metadata = createFakePackVersionMetadata({formulas: [], formulaNamespace: undefined});
    await validateJson(metadata);
  });

  it('valid formula namespace', async () => {
    const metadata = createFakePackVersionMetadata({formulas: [], formulaNamespace: 'Foo_Bar'});
    await validateJson(metadata);
  });

  it('invalid formula namespace', async () => {
    const metadata = createFakePackVersionMetadata({formulas: [], formulaNamespace: 'Foo Bar'});
    const err = await validateJsonAndAssertFails(metadata);
    assert.deepEqual(err.validationErrors, [
      {
        path: 'formulaNamespace',
        message: 'Formula namespaces can only contain alphanumeric characters and underscores.',
      },
    ]);
  });

  describe('Formulas', () => {
    function formulaToMetadata(formula: Formula): PackFormulaMetadata {
      const {execute, ...rest} = formula;
      return rest;
    }

    it('valid number formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Number,
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeNumericParameter('myParam', 'param description')],
        execute: () => 1,
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid string formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => '',
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid boolean formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Boolean,
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => true,
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid scalar array formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Array,
        items: {type: ValueType.String},
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [
          makeStringParameter('myParam', 'param description'),
          makeNumericArrayParameter('numberArray1', 'description'),
          makeParameter({type: ParameterType.NumberArray, name: 'numberArray2', description: 'A list of numbers'}),
        ],
        execute: () => ['hello'],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      const validatedMetadata = await validateJson(metadata);
      assert.deepEqual(validatedMetadata.formulas[0].parameters[1]?.type, numberArray);
      assert.deepEqual(validatedMetadata.formulas[0].parameters[2]?.type, numberArray);
    });

    it('valid object array formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Array,
        items: makeObjectSchema({
          type: ValueType.Object,
          properties: {foo: {type: ValueType.String}},
        }),
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => [{foo: 'test'}],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid object formula', async () => {
      const formula = makeFormula({
        resultType: ValueType.Object,
        schema: makeObjectSchema({
          type: ValueType.Object,
          properties: {foo: {type: ValueType.String}},
        }),
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => {
          return {foo: 'test'};
        },
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid formula names', async () => {
      for (const name of ['Foo', 'foo_bar', 'Foo123', 'føø']) {
        const formula = makeNumericFormula({
          name,
          description: 'My description',
          examples: [],
          parameters: [],
          execute: () => 1,
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
        await validateJson(metadata);
      }
    });

    it('invalid formula names', async () => {
      for (const name of ['_foo', 'foo-bar', 'foo bar', '2foo']) {
        const formula = makeNumericFormula({
          name,
          examples: [],
          description: 'desc',
          parameters: [],
        } as any);
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Formula names can only contain alphanumeric characters and underscores.',
            path: 'formulas[0].name',
          },
        ]);
      }
    });

    it('duplicate formula names', async () => {
      const formulas = [];
      for (const name of ['foo', 'Foo', 'foo_bar', 'Foo123', 'føø']) {
        formulas.push(
          formulaToMetadata(
            makeNumericFormula({
              name,
              description: 'My description',
              examples: [],
              parameters: [],
              execute: () => 1,
            }),
          ),
        );
      }
      const metadata = createFakePackVersionMetadata({
        formulas,
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Formula names must be unique. Found duplicate name "Foo".',
          path: 'formulas',
        },
      ]);
    });

    it('rejects formula names that are too long', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'A'.repeat(1 + Limits.BuildingBlockName),
        description: 'My description',
        examples: [],
        parameters: [],
        execute: () => '',
      });

      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
          path: 'formulas[0].name',
        },
      ]);
    });

    it('rejects formula descriptions that are too long', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'Hi',
        description: 'A'.repeat(1 + Limits.BuildingBlockDescription),
        examples: [],
        parameters: [],
        execute: () => '',
      });

      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: `String must contain at most ${Limits.BuildingBlockDescription} character(s)`,
          path: 'formulas[0].description',
        },
      ]);
    });

    it('valid string formula with examples', async () => {
      const formula = makeStringFormula({
        name: 'MyFormula',
        description: 'My description',
        examples: [{params: ['some-param'], result: 'some-result'}],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => '',
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid formula with network fields', async () => {
      const networkSettings: Array<{isAction?: boolean; connectionRequirement?: ConnectionRequirement}> = [
        {},
        {isAction: true},
        {isAction: false},
        {connectionRequirement: ConnectionRequirement.None},
        {connectionRequirement: ConnectionRequirement.Optional},
        {connectionRequirement: ConnectionRequirement.Required},
      ];
      for (const {isAction, connectionRequirement} of networkSettings) {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          isAction,
          connectionRequirement,
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
        await validateJson(metadata);
      }
    });

    it('reject formulas with connectionRequirement for no-auth packs', async () => {
      const formula = makeStringFormula({
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        connectionRequirement: ConnectionRequirement.Required,
        execute: () => '',
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
          path: 'formulas[0]',
        },
      ]);
    });

    it('reject sync table formulas with connectionRequirement for no-auth packs', async () => {
      const syncTable = makeSyncTable({
        name: 'SyncTable',
        identityName: 'Sync',
        schema: makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          id: 'foo',
          properties: {
            Foo: {type: ValueType.String},
          },
        }),
        formula: {
          name: 'SyncTable',
          description: 'A simple sync table',
          connectionRequirement: ConnectionRequirement.Required,
          async execute([], _context) {
            return {result: []};
          },
          parameters: [],
          examples: [],
        },
      });
      const metadata = createFakePackVersionMetadata(
        compilePackMetadata({
          version: '1',
          syncTables: [syncTable],
          defaultAuthentication: {
            type: AuthenticationType.None,
          },
        }),
      );
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'Sync table formulas cannot set a connectionRequirement when the Pack does not use user authentication.',
          path: 'syncTables[0].getter.connectionRequirement',
        },
      ]);
    });

    it('reject sync table formulas with varargParameters', async () => {
      const syncTable = makeSyncTable({
        name: 'SyncTable',
        identityName: 'Sync',
        schema: makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          id: 'foo',
          properties: {
            Foo: {type: ValueType.String},
          },
        }),
        formula: {
          name: 'SyncTable',
          description: 'A simple sync table',
          async execute([], _context) {
            return {result: []};
          },
          parameters: [],
          varargParameters: [makeParameter({type: ParameterType.String, name: 'param', description: 'param'})],
          examples: [],
        },
      });
      const metadata = createFakePackVersionMetadata(
        compilePackMetadata({
          version: '1',
          syncTables: [syncTable],
          defaultAuthentication: {
            type: AuthenticationType.None,
          },
        }),
      );
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Sync table formulas do not currently support varargParameters.',
          path: 'syncTables[0].getter.varargParameters',
        },
      ]);
    });

    // Evidently we allow this.
    it('valid object formula with no schema', async () => {
      const formula = makeObjectFormula({
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => ({}),
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('invalid numeric formula', async () => {
      const formula = makeNumericFormula({
        name: 'MyFormula',
        examples: [],
        parameters: [makeNumericParameter('myParam', 'param description')],
      } as any);
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [{message: 'Required', path: 'formulas[0].description'}]);
    });

    it('rejects if number of formulas goes over limit', async () => {
      const formula = makeFormula({
        resultType: ValueType.Number,
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => 1,
      });

      const formulas = [];
      for (let i = 0; i < Limits.BuildingBlockCountPerType + 1; i++) {
        formulas.push({
          ...formula,
          name: `Formula${i}`,
        });
      }
      const metadata = createFakePackVersionMetadata({
        formulas,
        formulaNamespace: 'MyNamespace',
      });

      const err = await validateJsonAndAssertFails(metadata);

      assert.deepEqual(err.validationErrors, [
        {
          message: `Array must contain at most ${Limits.BuildingBlockCountPerType} element(s)`,
          path: 'formulas',
        },
      ]);
    });

    describe('parameters', () => {
      function makeMetadataFromParams(params: ParamDefs) {
        const formula = makeNumericFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: params,
          execute: () => 1,
        });
        return createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
      }

      it('valid formula with generic makeParameter', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'myParam', description: 'param description'}),
        ]);
        await validateJson(metadata);
      });

      it('valid formula with generic makeParameter array param', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.StringArray, name: 'myParam', description: 'param description'}),
        ]);
        await validateJson(metadata);
      });

      it('invalid formula with spaces in parameter name', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'my param', description: ''}),
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Parameter names can only contain alphanumeric characters and underscores.',
            path: 'formulas[0].parameters[0].name',
          },
        ]);
      });

      it('invalid formula with object parameter', async () => {
        const metadata = makeMetadataFromParams([
          {type: Type.object, name: 'myParam', description: 'param description'},
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Object parameters are not currently supported.',
            path: 'formulas[0].parameters[0].type',
          },
        ]);
      });

      it('invalid formula with object array parameter', async () => {
        const metadata = makeMetadataFromParams([
          {type: {type: 'array', items: Type.object}, name: 'myParam', description: 'param description'},
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Object parameters are not currently supported.',
            path: 'formulas[0].parameters[0].type',
          },
        ]);
      });

      it('valid formula with only optional param', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'p', description: '', optional: true}),
        ]);
        await validateJson(metadata);
      });

      it('valid formula with required and optional params', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'p1', description: ''}),
          makeParameter({type: ParameterType.String, name: 'p2', description: '', optional: true}),
        ]);
        await validateJson(metadata);
      });

      it('invalid formula with required param after optional param', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'p1', description: ''}),
          makeParameter({type: ParameterType.String, name: 'p2', description: '', optional: true}),
          makeParameter({type: ParameterType.String, name: 'p3', description: ''}),
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'All optional parameters must come after all non-optional parameters.',
            path: 'formulas[0].parameters',
          },
        ]);
      });

      it('invalid formula with duplicate params', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({type: ParameterType.String, name: 'p1', description: ''}),
          makeParameter({type: ParameterType.String, name: 'p1', description: ''}),
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Parameter names must be unique. Found duplicate name "p1".',
            path: 'formulas[0].parameters',
          },
        ]);
      });

      it('rejects parameters with names that are too long', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({
            type: ParameterType.StringArray,
            name: 'a'.repeat(Limits.BuildingBlockName + 1),
            description: 'param description',
          }),
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
            path: 'formulas[0].parameters[0].name',
          },
        ]);
      });

      it('rejects parameters with descriptions that are too long', async () => {
        const metadata = makeMetadataFromParams([
          makeParameter({
            type: ParameterType.StringArray,
            name: 'Hi',
            description: 'a'.repeat(Limits.BuildingBlockDescription + 1),
          }),
        ]);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockDescription} character(s)`,
            path: 'formulas[0].parameters[0].description',
          },
        ]);
      });
    });

    describe('sync tables', () => {
      it('valid sync table', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePackVersionMetadata(
          compilePackMetadata({
            version: '1',
            syncTables: [syncTable],
          }),
        );
        await validateJson(metadata);
      });

      it('valid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
          identityName: 'DynamicItem',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        await validateJson(metadata);
      });

      it('valid sync table with nested object schema', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              foo: {type: ValueType.String},
              child: makeObjectSchema({
                type: ValueType.Object,
                id: 'c1',
                required: true,
                featured: ['c1'],
                properties: {
                  c1: {type: ValueType.String},
                },
              }),
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const validatedMetadata = await validateJson(metadata);

        const {schema} = validatedMetadata.syncTables[0];
        assert.ok(schema);
        const childSchema = schema.properties.Child;
        assert.ok(childSchema);
        assert.equal(childSchema.fromKey, 'child');
        assert.isTrue(childSchema.required);
      });

      it('invalid sync table name', async () => {
        const syncTable = makeSyncTable({
          name: 'Sync@Table',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Sync Table names can only contain alphanumeric characters and underscores.',
            path: 'syncTables[0].name',
          },
        ]);
      });

      it('options for a non-mutable property or bad property name', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: false,
                options: OptionsType.Dynamic,
              },
              // This next issue isn't something pack authors would normally do unless they do typecasts,
              // but could be an error caused by a bug in makeSyncTable().
              Bar: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: 'someProp' as OptionsReference,
              },
              Baz: {
                type: ValueType.String,
                // Missing codaType: SelectList
                mutable: true,
                options: ['foo', 'bar'],
              },
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: "Unrecognized key(s) in object: 'options'",
            path: 'syncTables[0].schema.properties.Baz',
          },
          {
            message: "Unrecognized key(s) in object: 'options'",
            path: 'syncTables[0].getter.schema.items.properties.Baz',
          },
          {
            message: 'Sync table SyncTable must define "options" for this property to use OptionsType.Dynamic',
            path: 'syncTables[0].properties.Foo.options',
          },
          {
            message: '"someProp" is not registered as an options function for this sync table.',
            path: 'syncTables[0].properties.Bar.options',
          },
        ]);
      });

      it('old SDK with legacy autocomplete fields', async () => {
        const metadata = {
          id: 1,
          name: 'some pack',
          shortDescription: 'Some description',
          description: 'Some description',
          logoPath: '',
          version: '1.2.3',
          syncTables: [
            {
              name: 'SyncFoo',
              identityName: 'foo',
              namedAutocompletes: {foo: 'bar'},
              schema: {
                type: ValueType.Object,
                properties: {
                  name: {
                    type: ValueType.String,
                    autocomplete: ['1', '2'],
                  },
                },
              },
              getter: {
                isSyncFormula: true,
                name: 'SyncFoo',
                description: 'Some description',
                parameters: [],
                execute: () => ({} as any),
                resultType: Type.object,
              },
            },
          ],
        };
        await validateJson(metadata, '1.4.0');
      });

      it('new SDK with legacy autocomplete fields', async () => {
        const metadata = {
          id: 1,
          name: 'some pack',
          shortDescription: 'Some description',
          description: 'Some description',
          logoPath: '',
          version: '1.2.3',
          syncTables: [
            {
              name: 'SyncFoo',
              identityName: 'foo',
              namedAutocompletes: {foo: 'bar'},
              schema: {
                type: ValueType.Object,
                properties: {
                  name: {
                    type: ValueType.String,
                    autocomplete: ['1', '2'],
                  },
                },
              },
              getter: {
                isSyncFormula: true,
                name: 'SyncFoo',
                description: 'Some description',
                parameters: [],
                execute: () => ({} as any),
                resultType: Type.object,
              },
            },
          ],
        };
        await validateJsonAndAssertFails(metadata);
      });

      it('options has hard-coded non-array value', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: {'totally invalid value': 'here'} as any as string[],
              },
              Bar: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: [{'totally invalid value': 'here'}] as any as string[],
              },
              Bop: {
                type: ValueType.String,
                mutable: true,
                options: [true],
              },
              Beep: {
                type: ValueType.Object,
                properties: {
                  id: {
                    type: ValueType.String,
                  },
                },
                idProperty: 'id',
                mutable: true,
                options: [],
              },
              Baz: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: ['this is ok', {display: 'foo', value: 'bar'}],
              },
              Baz2: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: ['text', {display: 'foo', value: 'more text'}],
              },
              Baz3: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: ['text', {display: 'foo', value: 'more text'}],
              },
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        const validationErrors = err.validationErrors ?? [];

        // There are quite a few zod errors when this happens, I think because all the union
        // types make it unsure of which one should match.
        assert.deepInclude(validationErrors, {
          message: 'Could not find any valid schema for this value.',
          path: 'syncTables[0].getter.schema.items.properties.Foo.codaType',
        });
        assert.deepInclude(validationErrors, {
          message: 'Expected string, received object',
          path: 'syncTables[0].getter.schema.items.properties.Bar.options[0]',
        });
        assert.deepInclude(validationErrors, {
          message: 'Required',
          path: 'syncTables[0].getter.schema.items.properties.Bar.options[0].display',
        });
        assert.deepInclude(validationErrors, {
          message: "Unrecognized key(s) in object: 'options'",
          path: 'syncTables[0].getter.schema.items.properties.Bop',
        });
        const selectListHintTypeError = {
          message:
            'You must set "codaType" to ValueHintType.SelectList or ValueHintType.Reference when setting an "options" property.',
          path: 'syncTables[0].schema.properties.Beep',
        };
        assert.deepInclude(validationErrors, selectListHintTypeError);

        const bazErrors = validationErrors.filter(e => e.path?.toLowerCase().includes('.baz'));
        assert.isEmpty(bazErrors);

        const errOlderSdkVersion = await validateJsonAndAssertFails(metadata, '1.4.0');
        assert.notDeepNestedInclude(errOlderSdkVersion.validationErrors ?? [], selectListHintTypeError);
      });

      it('options valid values', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              foo: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: ['this is ok', {display: 'foo', value: 'bar'}],
                allowNewValues: true,
              },
              foo2: {
                type: ValueType.Object,
                codaType: ValueHintType.SelectList,
                idProperty: 'id',
                properties: {
                  id: {
                    type: ValueType.String,
                  },
                },
                mutable: true,
                options: [{}],
              },
              bar: {
                type: ValueType.String,
                codaType: ValueHintType.SelectList,
                mutable: true,
                options: () => {
                  return [];
                },
              },
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const validatedMetadata = await validateJson(metadata);
        assert.isArray(validatedMetadata.syncTables[0].schema.properties.Foo.options);
        assert.isTrue(validatedMetadata.syncTables[0].schema.properties.Foo.allowNewValues);
        assert.isString(validatedMetadata.syncTables[0].schema.properties.Bar.options);
      });

      it('identityName propagated to identity field', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'SomeIdentity',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const validatedMetadata = await validateJson(metadata);

        const {schema} = validatedMetadata.syncTables[0];
        assert.ok(schema);
        assert.deepEqual(schema.identity, {name: 'SomeIdentity'});
      });

      it('identityName cannot conflict with schema identity if both present', async () => {
        // api_test.ts already tests that makeSyncTable won't let this happen, but we still
        // need to test our raw metadata validation.
        const syncTable: GenericSyncTable = {
          name: 'SyncTable',
          identityName: 'IdentityA',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {name: 'IdentityB'},
            properties: {
              foo: {type: ValueType.String},
            },
          }),
          getter: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
            isSyncFormula: true,
            resultType: Type.object,
          },
        };

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'Sync table "SyncTable" defines identityName "IdentityA" that conflicts with its schema\'s identity.name "IdentityB".',
            path: 'syncTables',
          },
        ]);
      });

      it('allows a schema object to be reused in 2 sync tables', async () => {
        const MySchema = makeObjectSchema({
          properties: {
            name: {type: ValueType.String},
            // Add more properties here.
          },
          idProperty: 'name',
          displayProperty: 'name',
        });

        const table1 = makeSyncTable({
          name: 'One',
          description: 'The first sync table.',
          identityName: 'IdOne',
          schema: MySchema,
          formula: {
            name: 'SyncThings',
            description: 'Sync some things.',
            parameters: [],
            async execute([]) {
              return {
                result: [],
              };
            },
          },
        });
        const table2 = makeSyncTable({
          name: 'Two',
          description: 'The second sync table.',
          identityName: 'IdTwo',
          schema: MySchema,
          formula: {
            name: 'SyncThings',
            description: 'Sync some things.',
            parameters: [],
            async execute([]) {
              return {
                result: [],
              };
            },
          },
        });
        const metadata = createFakePack({
          syncTables: [table1, table2],
        });
        const validatedMetadata = await validateJson(metadata);

        const {schema: schema1} = validatedMetadata.syncTables[0];
        const {schema: schema2} = validatedMetadata.syncTables[1];
        assert.ok(schema1);
        assert.ok(schema2);
        assert.deepEqual(schema1.identity, {name: 'IdOne'});
        assert.deepEqual(schema2.identity, {name: 'IdTwo'});
      });

      it('legacy wrapper requires inline identity name', async () => {
        const syncTable = makeSyncTableLegacy(
          'SyncTable',
          makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {name: 'LegacyName'},
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        );

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const validatedMetadata = await validateJson(metadata);

        const {schema, identityName} = validatedMetadata.syncTables[0];
        assert.ok(schema);
        assert.deepEqual(schema.identity, {name: 'LegacyName'});
        assert.equal(identityName, 'LegacyName');

        assert.throws(() => {
          makeSyncTableLegacy(
            'SyncTable',
            makeObjectSchema({
              type: ValueType.Object,
              primary: 'foo',
              id: 'foo',
              identity: {name: ''}, // Blank name
              properties: {
                Foo: {type: ValueType.String},
              },
            }),
            {
              name: 'SyncTable',
              description: 'A simple sync table',
              async execute([], _context) {
                return {result: []};
              },
              parameters: [],
              examples: [],
            },
          );
        }, 'Legacy sync tables must specify identity.name');

        assert.throws(() => {
          makeSyncTableLegacy(
            'SyncTable',
            makeObjectSchema({
              type: ValueType.Object,
              primary: 'foo',
              id: 'foo',
              // Missing identity
              properties: {
                Foo: {type: ValueType.String},
              },
            }),
            {
              name: 'SyncTable',
              description: 'A simple sync table',
              async execute([], _context) {
                return {result: []};
              },
              parameters: [],
              examples: [],
            },
          );
        }, 'Legacy sync tables must specify identity.name');
      });

      it('identityName is required on sync tables', async () => {
        // Not defined inline because I want to bypass Typescript errors, since many pack makers won't
        // be using Typescript.
        const syncTableArgs: any = {
          name: 'SyncTable',
          schema: makeObjectSchema({
            type: ValueType.Object,
            displayProperty: 'foo',
            idProperty: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute() {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        };
        assert.throws(() => makeSyncTable(syncTableArgs), 'Sync table schemas must set an identityName');

        // If you bypass makeSyncTable, the metadata validation should still catch this
        const syncTable: any = {
          name: 'SyncTable',
          schema: makeObjectSchema({
            type: ValueType.Object,
            displayProperty: 'foo',
            idProperty: 'foo',
            properties: {
              foo: {type: ValueType.String},
            },
          }),
          getter: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute() {
              return {result: []};
            },
            parameters: [],
            examples: [],
            isSyncFormula: true,
            resultType: Type.object,
          },
        };

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        // First make sure pre-1.0.0 passes
        await validateJson(metadata, '0.12.0');
        // Then 1.0.0 should fail
        const err = await validateJsonAndAssertFails(metadata, '1.0.0');
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Missing required field syncTables[0].identityName.',
            path: 'syncTables[0].identityName',
          },
        ]);
      });

      it('identity name matches property', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Foo',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: "Cannot have a sync table property with the same name as the sync table's schema identity.",
            path: 'syncTables[0].schema.properties.Foo',
          },
        ]);
      });

      it('sync table with various schemas', async () => {
        const syncTable = makeSyncTable({
          name: 'ScaleSyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.Number, codaType: ValueHintType.Scale, maximum: 5, icon: ScaleIconSet.Star},
              Bar: {type: ValueType.String, codaType: ValueHintType.Date, format: 'MMM D, YYYY'},
              Slider: {type: ValueType.Number, codaType: ValueHintType.Slider, minimum: 1, maximum: 3, step: 1},
              SliderWithFormulas: {
                type: ValueType.Number,
                codaType: ValueHintType.Slider,
                minimum: '[Min]',
                maximum: '[Max]',
                step: '[Step]',
              },
              Progress: {
                type: ValueType.Number,
                codaType: ValueHintType.ProgressBar,
                minimum: 1,
                maximum: 3,
                step: 1,
                showValue: true,
              },
              Currency: {
                type: ValueType.Number,
                codaType: ValueHintType.Currency,
                precision: 2,
                currencyCode: 'EUR',
                format: CurrencyFormat.Accounting,
              },
              Duration: {
                type: ValueType.String,
                codaType: ValueHintType.Duration,
                precision: 2,
                maxUnit: DurationUnit.Days,
              },
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          name: 'scalePack',
          syncTables: [syncTable],
        });
        const parsedMetadata = await validateJson(metadata);
        const schemaProperties = parsedMetadata.syncTables[0].schema.properties;
        assert.equal(schemaProperties.Foo.maximum, 5);
        assert.equal(schemaProperties.Foo.icon, ScaleIconSet.Star);

        assert.equal(schemaProperties.Bar.format, 'MMM D, YYYY');

        assert.equal(schemaProperties.Slider.minimum, 1);
        assert.equal(schemaProperties.Slider.maximum, 3);
        assert.equal(schemaProperties.Slider.step, 1);

        assert.equal(schemaProperties.SliderWithFormulas.minimum, '[Min]');
        assert.equal(schemaProperties.SliderWithFormulas.maximum, '[Max]');
        assert.equal(schemaProperties.SliderWithFormulas.step, '[Step]');

        assert.equal(schemaProperties.Currency.precision, 2);
        assert.equal(schemaProperties.Currency.currencyCode, 'EUR');
        assert.equal(schemaProperties.Currency.format, CurrencyFormat.Accounting);

        assert.equal(schemaProperties.Duration.precision, 2);
        assert.equal(schemaProperties.Duration.maxUnit, DurationUnit.Days);
      });

      it('invalid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
          identityName: 'DynamicItem',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });

        const metadata = createFakePack({
          syncTables: [{...syncTable, isDynamic: false as any}],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            path: 'syncTables[0]',
            message:
              "Unrecognized key(s) in object: 'getDisplayUrl', 'listDynamicUrls', 'searchDynamicUrls', 'getName'",
          },
        ]);

        const invalidFormulaSyncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
          identityName: 'DynamicItem',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {} as any, // broken
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });
        const metadata2 = createFakePack({
          syncTables: [{...invalidFormulaSyncTable}],
        });
        const invalidFormulaErrors = await validateJsonAndAssertFails(metadata2);
        assert.deepEqual(invalidFormulaErrors.validationErrors, [
          {path: 'syncTables[0].getter.name', message: 'Required'},
          {path: 'syncTables[0].getter.description', message: 'Required'},
          {path: 'syncTables[0].getter.parameters', message: 'Required'},
        ]);
      });

      it('invalid identity name', async () => {
        const schema = makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          id: 'foo',
          properties: {
            foo: {type: ValueType.String},
          },
        });
        const syncTable0 = makeSyncTable({
          name: 'SyncTable0',
          identityName: 'Name with spaces',
          schema,
          formula: {
            name: 'SyncTable0',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });
        // 'id' is reserved for Coda's internal use
        const syncTable1 = makeSyncTable({
          name: 'SyncTable1',
          identityName: 'id',
          schema,
          formula: {
            name: 'SyncTable1',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable0, syncTable1],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'Invalid name. Identity names can only contain ' +
              'alphanumeric characters, underscores, and dashes, and no spaces.',
            path: 'syncTables[0].schema.identity.name',
          },
          {
            message:
              'Invalid name. Identity names can only contain ' +
              'alphanumeric characters, underscores, and dashes, and no spaces.',
            path: 'syncTables[0].getter.schema.items.identity.name',
          },
          {
            message: `This property name is reserved for internal use by Coda and can't be used as an identityName, sorry!`,
            path: 'syncTables[1].identityName',
          },
        ]);

        // Check dynamic sync tables too
        const dynSyncTable1 = makeDynamicSyncTable({
          name: 'DynamicSyncTable1',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          identityName: 'DynamicIdentity',
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });
        const dynSyncTable2 = makeDynamicSyncTable({
          name: 'DynamicSyncTable2',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          identityName: 'DynamicIdentity',
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });
        const dynMetadata = createFakePack({
          syncTables: [dynSyncTable1, dynSyncTable2],
        });
        const dynErr = await validateJsonAndAssertFails(dynMetadata);
        assert.deepEqual(dynErr.validationErrors, [
          {
            message: 'Sync table identity names must be unique. Found duplicate name "DynamicIdentity".',
            path: 'syncTables',
          },
        ]);
      });

      it('duplicate sync table identity names', async () => {
        const syncTable1 = makeSyncTable({
          name: 'SyncTable1',
          identityName: 'Identity',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
          },
        });
        const syncTable2 = makeSyncTable({
          name: 'SyncTable2',
          identityName: 'Identity',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable1, syncTable2],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Sync table identity names must be unique. Found duplicate name "Identity".',
            path: 'syncTables',
          },
        ]);
      });

      it('duplicate sync table identity names not triggered for dynamic sync tables', async () => {
        const syncTable1 = makeDynamicSyncTable({
          name: 'DynamicSyncTable1',
          identityName: 'DynamicItem1',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });
        const syncTable2 = makeDynamicSyncTable({
          name: 'DynamicSyncTable2',
          identityName: 'DynamicItem2',
          getName: makeMetadataFormula(async () => {
            return '';
          }),
          getSchema: makeMetadataFormula(async () => {
            return '';
          }),
          formula: {
            name: 'SyncTable',
            description: 'Sync table',
            examples: [],
            parameters: [],
            execute: async () => {
              return {result: []};
            },
          },
          getDisplayUrl: makeMetadataFormula(async () => {
            return '';
          }),
        });
        const metadata = createFakePack({
          syncTables: [syncTable1, syncTable2],
        });
        await validateJson(metadata);
      });

      it('duplicate sync table names', async () => {
        const syncTable1 = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Identity1',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
          },
        });
        const syncTable2 = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Identity2',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable1, syncTable2],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Sync table names must be unique. Found duplicate name "SyncTable".',
            path: 'syncTables',
          },
        ]);
      });

      it('invalid sync table getter name', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'Formula with Spaces',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Formula names can only contain alphanumeric characters and underscores.',
            path: 'syncTables[0].getter.name',
          },
        ]);
      });

      it('invalid sync table getter name but in legacy exemption list', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'Sync repos',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          id: 1013,
          syncTables: [syncTable],
        });
        await validateJson(metadata);
      });

      it('rejects sync table names that are too long', async () => {
        const syncTable = makeSyncTable({
          name: 'A'.repeat(Limits.BuildingBlockName + 1),
          identityName: 'Sync',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          id: 1013,
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
            path: 'syncTables[0].name',
          },
        ]);
      });

      it('rejects sync table identity names that are too long', async () => {
        const syncTable = makeSyncTable({
          name: 'Hi',
          identityName: 'A'.repeat(Limits.BuildingBlockName + 1),
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          id: 1013,
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
            path: 'syncTables[0].identityName',
          },
        ]);
      });

      it('rejects sync table descriptions that are too long', async () => {
        const syncTable = makeSyncTable({
          name: 'Hi',
          identityName: 'Hi',
          description: 'A'.repeat(Limits.BuildingBlockDescription + 1),
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              Foo: {type: ValueType.String},
            },
          }),
          formula: {
            name: 'SyncTable',
            description: 'A simple sync table',
            async execute([], _context) {
              return {result: []};
            },
            parameters: [],
            examples: [],
          },
        });

        const metadata = createFakePack({
          id: 1013,
          syncTables: [syncTable],
        });
        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockDescription} character(s)`,
            path: 'syncTables[0].description',
          },
        ]);
      });

      it('rejects if number of sync tables goes over limit', async () => {
        const syncTables = [];
        for (let i = 0; i < Limits.BuildingBlockCountPerType + 1; i++) {
          syncTables.push(
            makeSyncTable({
              name: `Sync${i}`,
              identityName: `Sync${i}`,
              schema: makeObjectSchema({
                type: ValueType.Object,
                primary: 'foo',
                id: 'foo',
                properties: {
                  Foo: {type: ValueType.String},
                },
              }),
              formula: {
                name: 'SyncTable',
                description: 'A simple sync table',
                async execute([], _context) {
                  return {result: []};
                },
                parameters: [],
                examples: [],
              },
            }),
          );
        }

        const metadata = createFakePackVersionMetadata(
          compilePackMetadata({
            version: '1',
            syncTables,
            formulaNamespace: 'MyNamespace',
          }),
        );

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `Array must contain at most ${Limits.BuildingBlockCountPerType} element(s)`,
            path: 'syncTables',
          },
        ]);
      });
    });

    describe('object schemas', () => {
      function metadataForFormulaWithObjectSchema(
        schemaDef: ObjectSchemaDefinition<string, string>,
      ): PackVersionMetadata {
        const schema = makeObjectSchema(schemaDef);
        const formula = makeObjectFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          response: {
            schema,
          },
          execute: () => ({}),
        });
        return createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
      }

      function metadataForFormulaWithArraySchema(schema: ArraySchema): PackVersionMetadata {
        const formula = makeObjectFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          response: {
            schema,
          },
          execute: () => ({}),
        });
        return createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
        });
      }

      it('valid object formula with schema', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          idProperty: 'id',
          displayProperty: 'primary',
          identity: {
            name: 'IdentityName',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
            date: {type: ValueType.String, codaType: ValueHintType.Date},
          },
        });
        await validateJson(metadata);
      });

      it('valid object formula with object array schema', async () => {
        const itemSchema = makeObjectSchema({
          type: ValueType.Object,
          id: 'id',
          primary: 'primary',
          identity: {
            name: 'IdentityName',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
            date: {type: ValueType.String, codaType: ValueHintType.Date},
          },
        });
        const arraySchema = makeSchema({
          type: ValueType.Array,
          items: itemSchema,
        });
        const metadata = metadataForFormulaWithArraySchema(arraySchema);
        await validateJson(metadata);
      });

      it('valid object formula with primitive array schema', async () => {
        const arraySchema = makeSchema({
          type: ValueType.Array,
          items: {type: ValueType.String},
        });
        const metadata = metadataForFormulaWithArraySchema(arraySchema);
        await validateJson(metadata);
      });

      it('formula with invalid property in array schema', async () => {
        const arraySchema = makeSchema({
          type: ValueType.Array,
          codaType: ValueHintType.Html as any,
          items: {type: ValueType.String},
        });
        const metadata = metadataForFormulaWithArraySchema(arraySchema);
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: "Unrecognized key(s) in object: 'codaType'",
            path: 'formulas[0].schema',
          },
        ]);
      });

      it('invalid identity name', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          identity: {
            name: 'Name With Spaces',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
            path: 'formulas[0].schema.identity.name',
          },
        ]);
      });

      it('invalid identity name but in legacy exemptions', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          identity: {
            packId: 1013,
            name: 'Pull Request',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
          },
        });
        await validateJson(metadata);
      });

      it('id not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          idProperty: 'garbage',
          properties: {
            id: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "idProperty" property must appear as a key in the "properties" object.',
            path: 'formulas[0].schema',
          },
        ]);
      });

      it('primary not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          displayProperty: 'garbage',
          properties: {
            primary: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "displayProperty" property must appear as a key in the "properties" object.',
            path: 'formulas[0].schema',
          },
        ]);
      });

      it('evaluates JSON path properly', async () => {
        const baseMetadata: ObjectSchemaDefinition<string, string> = {
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
            nestedObject: {
              type: ValueType.Object,
              properties: {
                name: {type: ValueType.String},
                array: {
                  type: ValueType.Array,
                  items: {type: ValueType.Object, properties: {name: {type: ValueType.String}}},
                },
              },
            },
            array: {
              type: ValueType.Array,
              items: {type: ValueType.Object, properties: {name: {type: ValueType.String}}},
            },
          },
          titleProperty: 'nestedObject.name',
          snippetProperty: 'array[0].name',
        };
        let err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            snippetProperty: 'array[0][0].name',
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "snippetProperty" path "Array[0][0].Name" does not exist in the "properties" object.',
            path: 'formulas[0].schema.snippetProperty',
          },
        ]);
        err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            imageProperty: 'nestedObject.name',
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'The "imageProperty" path "NestedObject.Name" must refer to a "ValueType.String" property with a "ValueHintType.ImageAttachment" or "ValueHintType.ImageReference" "codaType".',
            path: 'formulas[0].schema.imageProperty',
          },
        ]);
        err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            titleProperty: 'nestedObject.nonexistent',
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "titleProperty" path "NestedObject.Nonexistent" does not exist in the "properties" object.',
            path: 'formulas[0].schema.titleProperty',
          },
        ]);
        err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            titleProperty: 'badProperty',
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "titleProperty" path "BadProperty" does not exist in the "properties" object.',
            path: 'formulas[0].schema.titleProperty',
          },
        ]);
        err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            subtitleProperties: ['badProperty'],
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "subtitleProperties" path "BadProperty" does not exist in the "properties" object.',
            path: 'formulas[0].schema.subtitleProperties[0]',
          },
        ]);
        err = await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            subtitleProperties: [
              'primary',
              {
                property: 'nestedObject.nonexistent',
              },
            ],
          }),
        );
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'The "subtitleProperties" path "NestedObject.Nonexistent" does not exist in the "properties" object.',
            path: 'formulas[0].schema.subtitleProperties[1]',
          },
        ]);

        // Pathing does not work for a property with invalid characters.
        await validateJsonAndAssertFails(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            properties: {
              ...baseMetadata.properties,
              'What[] is. your name?': {type: ValueType.Object, properties: {name: {type: ValueType.String}}},
            },
            titleProperty: 'What[] is. your name?.name',
          }),
        );

        // Valid paths
        await validateJson(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            titleProperty: 'nestedObject.array[0].name',
          }),
        );
        // works for initial property with periods / brackets
        await validateJson(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            properties: {
              ...baseMetadata.properties,
              'What[] is. your name?': {type: ValueType.Object, properties: {name: {type: ValueType.String}}},
            },
            titleProperty: 'What[] is. your name?',
          }),
        );
        await validateJson(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            titleProperty: {property: baseMetadata.titleProperty as string, label: 'new label'},
          }),
        );
        await validateJson(
          metadataForFormulaWithObjectSchema({
            ...baseMetadata,
            subtitleProperties: [{property: baseMetadata.titleProperty as string, label: 'new label'}],
          }),
        );
        await validateJson(metadataForFormulaWithObjectSchema(baseMetadata));
      });

      it('imageProperty is invalid', async () => {
        let metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          imageProperty: 'garbage',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          imageProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String},
          },
          imageProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);

        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String, codaType: ValueHintType.ImageAttachment},
          },
          imageProperty: 'primary',
        });
        await validateJson(metadata);
      });

      it('titleProperty is invalid', async () => {
        let metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          titleProperty: 'garbage',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          titleProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String},
          },
          titleProperty: 'primary',
        });
        await validateJson(metadata);
      });

      it('linkProperty is invalid', async () => {
        let metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          linkProperty: 'garbage',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          linkProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String},
          },
          linkProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);

        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String, codaType: ValueHintType.Url},
          },
          linkProperty: 'primary',
        });
        await validateJson(metadata);
      });

      it('descriptionProperty is invalid', async () => {
        let metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          snippetProperty: 'garbage',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
          },
          snippetProperty: 'primary',
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.String},
          },
          snippetProperty: 'primary',
        });
        await validateJson(metadata);
      });

      it('subtitleProperties is invalid', async () => {
        let metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
            secondary: {type: ValueType.String},
            third: {type: ValueType.Number, codaType: ValueHintType.Scale},
          },
          subtitleProperties: ['primary', 'secondary', 'blah'],
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
            secondary: {type: ValueType.String},
            third: {type: ValueType.Number, codaType: ValueHintType.Scale},
          },
          subtitleProperties: ['primary', 'secondary', 'third'],
        });
        await validateJsonAndAssertFails(metadata);
        metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            primary: {type: ValueType.Number},
            secondary: {type: ValueType.String},
            third: {type: ValueType.Number, codaType: ValueHintType.Date},
          },
          subtitleProperties: ['primary', 'secondary', 'third'],
        });
        await validateJson(metadata);
      });

      it('unknown key in properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          displayProperty: 'primary',
          properties: {
            primary: {type: ValueType.Number, required: true, foo: true} as any,
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: "Unrecognized key(s) in object: 'foo'",
            path: 'formulas[0].schema.properties.Primary',
          },
        ]);
      });

      it('featured field not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          featuredProperties: ['name', 'foo'],
          properties: {
            name: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "featuredProperties" field name "Foo" does not exist in the "properties" object.',
            path: 'formulas[0].schema.featured[1]',
          },
        ]);
      });

      it('bad schema type', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            name: {type: ValueHintType.DateTime} as any,
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {message: 'Could not find any valid schema for this value.', path: 'formulas[0].schema.properties.Name'},
        ]);
      });

      it('image attachment, default properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            name: {type: ValueType.String, codaType: ValueHintType.ImageAttachment},
          },
        });
        await validateJson(metadata);
      });

      it('image reference, default properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            name: {type: ValueType.String, codaType: ValueHintType.ImageReference},
          },
        });
        await validateJson(metadata);
      });

      it('image attachment, custom properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          properties: {
            name: {
              type: ValueType.String,
              codaType: ValueHintType.ImageAttachment,
              imageOutline: ImageOutline.Solid,
              imageCornerStyle: ImageCornerStyle.Rounded,
            },
          },
        });
        await validateJson(metadata);
      });
    });

    describe('Formats', () => {
      it('works', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'MyFormat',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placehoder',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });
        await validateJson(metadata);
      });

      it('no formula found', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'MyFormat',
              formulaNamespace: 'MyNamespace',
              formulaName: 'Unknown',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message:
              'Could not find a formula definition for this format. Each format must reference the name of a formula defined in this pack.',
            path: 'formats[0]',
          },
        ]);
      });

      it('requires format matchers to be valid regexes', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'MyFormat',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placehoder',
              matchers: ['not a regex'],
            },
          ],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Invalid input',
            path: 'formats[0].matchers[0]',
          },
        ]);
      });

      it('formula uses more than one parameter', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('p1', ''), makeStringParameter('p2', '')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'MyFormat',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Formats can only be implemented using formulas that take exactly one required parameter.',
            path: 'formats[0]',
          },
        ]);
      });

      it('formula uses no parameters', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'MyFormat',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'Formats can only be implemented using formulas that take exactly one required parameter.',
            path: 'formats[0]',
          },
        ]);
      });

      it('column format names are allowed to have funky characters', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'A Format @!#$%^&*()_-|/\\',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });
        await validateJson(metadata);
      });

      it('rejects column format names that are too long', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'A'.repeat(Limits.BuildingBlockName + 1),
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
            path: 'formats[0].name',
          },
        ]);
      });

      it('duplicate format names', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'A',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: ['/some compiled regex/i'],
            },
            {
              name: 'A',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: ['/some compiled regex/i'],
            },
          ],
        });

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: 'Format names must be unique. Found duplicate name "A".',
            path: 'formats',
          },
        ]);
      });

      it('rejects column matcher arrays that are too long', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'Hi',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: Array(Limits.NumColumnMatchersPerFormat + 1).fill('/some compiled regex/i'),
            },
          ],
        });

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `Array must contain at most ${Limits.NumColumnMatchersPerFormat} element(s)`,
            path: 'formats[0].matchers',
          },
        ]);
      });

      it('rejects column matcher character lengths that are too long', async () => {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => '',
        });
        const metadata = createFakePackVersionMetadata({
          formulas: [formulaToMetadata(formula)],
          formulaNamespace: 'MyNamespace',
          formats: [
            {
              name: 'Hi',
              formulaNamespace: 'MyNamespace',
              formulaName: 'MyFormula',
              hasNoConnection: true,
              instructions: 'some instructions',
              placeholder: 'some placeholder',
              matchers: [`/${'a'.repeat(Limits.ColumnMatcherRegex + 1)}/i`],
            },
          ],
        });

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `String must contain at most ${Limits.ColumnMatcherRegex} character(s)`,
            path: 'formats[0].matchers[0]',
          },
        ]);
      });

      it('rejects if number of column formats goes over limit', async () => {
        const formula = makeFormula({
          resultType: ValueType.Number,
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          execute: () => 1,
        });
        const format = {
          name: 'MyFormat',
          formulaNamespace: 'MyNamespace',
          formulaName: 'MyFormula',
          hasNoConnection: true,
          instructions: 'some instructions',
          placeholder: 'some placehoder',
          matchers: ['/some compiled regex/i'],
        };
        const formats = [];
        for (let i = 0; i < Limits.BuildingBlockCountPerType + 1; i++) {
          formats.push({
            ...format,
            name: `Format${i}`,
            formulaName: formula.name,
          });
        }

        const metadata = createFakePackVersionMetadata({
          formulas: [formula],
          formats,
          formulaNamespace: 'MyNamespace',
        });

        const err = await validateJsonAndAssertFails(metadata);

        assert.deepEqual(err.validationErrors, [
          {
            message: `Array must contain at most ${Limits.BuildingBlockCountPerType} element(s)`,
            path: 'formats',
          },
        ]);
      });
    });

    it('scalar parameter examples', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: ParameterType.String, name: 'myParam', description: ''})],
        execute: ([param1]) => param1[0],
        examples: [{params: ['param'], result: 'result'}],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formula],
        formulaNamespace: 'ignored',
      });
      await validateJson(metadata);
    });

    it('array parameter examples', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'Test',
        description: '',
        parameters: [makeParameter({type: ParameterType.StringArray, name: 'myParam', description: ''})],
        execute: ([param1]) => param1[0] ?? '',
        examples: [{params: [['item1']], result: 'item1'}],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formula],
        formulaNamespace: 'ignored',
      });
      await validateJson(metadata);
    });

    it('example with undefined for optional param', async () => {
      const formula = makeFormula({
        name: 'DoStuff',
        description: 'Do some stuff',
        parameters: [
          makeParameter({
            type: ParameterType.String,
            name: 'first',
            description: 'The first param',
          }),
          makeParameter({
            type: ParameterType.String,
            name: 'second',
            description: 'The second param',
            optional: true,
          }),
          makeParameter({
            type: ParameterType.String,
            name: 'third',
            description: 'The third param',
            optional: true,
          }),
        ],
        resultType: ValueType.String,
        examples: [
          {
            params: ['a', undefined, 'c'],
            result: 'cool',
          },
        ],
        async execute() {
          return 'whatever';
        },
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formula],
        formulaNamespace: 'ignored',
      });
      await validateJson(metadata);
    });

    it('valid options formula with unused dynamic options', async () => {
      // This is a regresson test for a past issue where function property options
      // would cause a validation error, even though they're not used it non-sync table
      // schemas.
      const formula = makeFormula({
        resultType: ValueType.Object,
        schema: makeObjectSchema({
          type: ValueType.Object,
          properties: {foo: {type: ValueType.String}},
          options: () => {
            return [];
          },
        }),
        name: 'MyFormula',
        description: 'My description',
        examples: [],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => {
          return {foo: 'test'};
        },
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });
  });

  describe('Authentication', () => {
    it('NoAuthentication', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });
      await validateJson(metadata);
    });

    it('HeaderBearerToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          instructionsUrl: 'some-url',
          requiresEndpointUrl: false,
          endpointDomain: 'some-endpoint',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          instructionsUrl: 'some-url',
          requiresEndpointUrl: false,
          endpointDomain: 'some-endpoint',
        },
      });
      await validateJson(metadata);
    });

    it('CodaApiHeaderBearerToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
        },
        networkDomains: ['coda.io'],
      });
      await validateJson(metadata);
    });

    it('CodaApiHeaderBearerToken, invalid domain', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
          networkDomain: 'other.domain',
        },
        networkDomains: ['coda.io', 'other.domain'],
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict `defaultAuthentication.networkDomain` to coda.io',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('CodaApiHeaderBearerToken, no auth domains', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
        },
        networkDomains: ['coda.io', 'other.domain'],
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict `defaultAuthentication.networkDomain` to coda.io',
          path: 'defaultAuthentication.networkDomain',
        },
        {
          message:
            'This pack uses multiple network domains and must set one as a `networkDomain` in setUserAuthentication()',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('CodaApiHeaderBearerToken, bad auth domain', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
          networkDomain: 'other.domain',
        },
        networkDomains: ['coda.io', 'other.domain'],
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'CodaApiHeaderBearerToken can only be used for coda.io domains. Restrict `defaultAuthentication.networkDomain` to coda.io',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('CodaApiHeaderBearerToken, valid domain with credential pinning', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
          networkDomain: 'coda.io',
        },
        networkDomains: ['coda.io', 'other.domain'],
      });
      await validateJson(metadata);
    });

    it('CustomHeaderToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'some-header',
          tokenPrefix: 'some-prefix',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'some-header',
          tokenPrefix: 'some-prefix',
        },
      });
      await validateJson(metadata);
    });

    it('MultiHeaderToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.MultiHeaderToken,
          headers: [
            {name: 'Header1', description: 'desc 1', tokenPrefix: 'some-prefix'},
            {name: 'Header2', description: 'desc 2'},
          ],
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.MultiHeaderToken,
          headers: [
            {name: 'Header1', description: 'desc 1', tokenPrefix: 'some-prefix'},
            {name: 'Header2', description: 'desc 2'},
          ],
        },
      });
      await validateJson(metadata);
    });

    it('MultiHeaderToken on dup names', async () => {
      const metadata = createFakePackVersionMetadata({
        systemConnectionAuthentication: {
          type: AuthenticationType.MultiHeaderToken,
          headers: [
            {name: 'Header1', description: 'description 1'},
            {name: 'HeAdEr1', description: 'description 2'},
          ],
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Duplicated header names in the MultiHeaderToken authentication config',
          path: 'systemConnectionAuthentication.headers',
        },
      ]);
    });

    it('QueryParamToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.QueryParamToken,
          paramName: 'some-param',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.QueryParamToken,
          paramName: 'some-param',
        },
      });
      await validateJson(metadata);
    });

    it('MultiQueryParamToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.MultiQueryParamToken,
          params: [
            {name: 'param1', description: 'description 1'},
            {name: 'param2', description: 'description 2'},
          ],
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.MultiQueryParamToken,
          params: [
            {name: 'param1', description: 'description 1'},
            {name: 'param2', description: 'description 2'},
          ],
        },
      });
      await validateJson(metadata);
    });

    it('MultiQueryParamToken on dup names', async () => {
      const metadata = createFakePackVersionMetadata({
        systemConnectionAuthentication: {
          type: AuthenticationType.MultiQueryParamToken,
          params: [
            {name: 'param1', description: 'description 1'},
            {name: 'param1', description: 'description 2'},
          ],
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Duplicated parameter names in the MultiQueryParamToken authentication config',
          path: 'systemConnectionAuthentication.params',
        },
      ]);
    });

    it('OAuth2, complete', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'https://example.com/authUrl',
          tokenUrl: 'https://example.com/tokenUrl',
          scopes: ['scope 1', 'scope 2'],
          tokenPrefix: 'some-prefix',
          additionalParams: {foo: 'bar'},
          endpointKey: 'some-key',
          tokenQueryParam: 'some-param',
          postSetup: [
            {
              type: PostSetupType.SetEndpoint,
              name: 'setEndpoint',
              description: 'some description',
              getOptions: {} as any,
            },
          ],
        },
      });
      await validateJson(metadata);
    });

    it('OAuth2, minimal', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'https://example.com/authUrl',
          tokenUrl: 'https://example.com/tokenUrl',
        },
      });
      await validateJson(metadata);
    });

    it('OAuth2, errors', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'some-url',
          tokenUrl: 'some-url',
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Invalid url',
          path: 'defaultAuthentication.authorizationUrl',
        },
        {
          message: 'Invalid url',
          path: 'defaultAuthentication.tokenUrl',
        },
      ]);
    });

    it('WebBasic', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.WebBasic,
          uxConfig: {
            placeholderUsername: 'username',
            placeholderPassword: 'password',
            usernameOnly: false,
          },
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.WebBasic,
          uxConfig: {
            placeholderUsername: 'username',
            placeholderPassword: 'password',
            usernameOnly: false,
          },
        },
      });
      await validateJson(metadata);
    });

    it('AWSAccessKey', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.AWSAccessKey,
          service: 'some-service',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.AWSAccessKey,
          service: 'some-service',
        },
      });
      await validateJson(metadata);
    });

    it('AWSAssumeRole', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.AWSAssumeRole,
          service: 'some-service',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.AWSAssumeRole,
          service: 'some-service',
        },
      });
      await validateJson(metadata);
    });

    it('Invalid QueryParamToken', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.QueryParamToken,
        } as any,
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Required',
          path: 'defaultAuthentication.paramName',
        },
      ]);
    });

    it('missing networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: undefined,
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            "This pack uses authentication but did not declare a network domain. Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
          path: 'networkDomains',
        },
      ]);
    });

    it('missing auth networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      const err = await validateJsonAndAssertFails(metadata, '1.0.0');
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'This pack uses multiple network domains and must set one as a `networkDomain` in setUserAuthentication()',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('empty auth networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: [],
        },
      });
      const err = await validateJsonAndAssertFails(metadata, '0.0.1');
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Array must contain at least 1 element(s)',
          path: 'defaultAuthentication.networkDomain',
        },
        {
          message:
            'This pack uses multiple network domains and must set one as a `networkDomain` in setUserAuthentication()',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('bad networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: 'baz.com',
        },
      });
      const err = await validateJsonAndAssertFails(metadata, '0.2.0');
      assert.deepEqual(err.validationErrors, [
        {
          message: 'The `networkDomain` in setUserAuthentication() must match a previously declared network domain.',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('bad networkDomains when specifying authentication, multi-domain', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: ['bar.com', 'baz.com'],
        },
      });
      const err = await validateJsonAndAssertFails(metadata, '0.1.0');
      assert.deepEqual(err.validationErrors, [
        {
          message: 'The `networkDomain` in setUserAuthentication() must match a previously declared network domain.',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('good networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: 'bar.com',
        },
      });
      const result = await validateJson(deepCopy(metadata));
      assert.deepEqual(result, metadata);
    });

    it('networkDomain has spaces', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo bar'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: 'foo bar',
        },
      });
      const err = await validateJsonAndAssertFails(metadata, '1.0.0');
      assert.deepEqual(err.validationErrors, [
        {
          message:
            'The `networkDomain` in setUserAuthentication() cannot contain spaces. Use an array for multiple domains.',
          path: 'defaultAuthentication.networkDomain',
        },
      ]);
    });

    it('good networkDomains when specifying authentication, multi-domain', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['foo.com', 'bar.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          networkDomain: ['bar.com', 'foo.com'],
        },
      });
      const result = await validateJson(deepCopy(metadata));
      assert.deepEqual(result, metadata);
    });

    it('empty networkDomains when specifying authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: [],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            "This pack uses authentication but did not declare a network domain. Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
          path: 'networkDomains',
        },
      ]);
    });

    it('various auth type exempt from networkDomains requirement', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: [],
        defaultAuthentication: {
          type: AuthenticationType.Various,
        },
      });
      await validateJson(metadata);
    });

    it('requiresEndpointUrl exempt from networkDomains requirement', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: [],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          requiresEndpointUrl: true,
        },
      });
      await validateJson(metadata);
    });

    it('missing networkDomains when specifying system authentication', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: undefined,
        systemConnectionAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            "This pack uses authentication but did not declare a network domain. Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
          path: 'networkDomains',
        },
      ]);
    });

    it('using a url instead of a domain gives friendly error', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['https://foo.com'],
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Invalid network domain. Instead of "https://www.example.com", just specify "example.com".',
          path: 'networkDomains[0]',
        },
      ]);
    });

    it('using example.com/path gives friendly error message ', async () => {
      const metadata = createFakePackVersionMetadata({
        networkDomains: ['example.com/path'],
      });
      const err = await validateJsonAndAssertFails(metadata, '1.0.0');
      assert.deepEqual(err.validationErrors, [
        {
          message: 'Invalid network domain. Instead of "https://www.example.com", just specify "example.com".',
          path: 'networkDomains[0]',
        },
      ]);
    });

    it('system authentication without network domains gives error', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: undefined,
        systemConnectionAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
        networkDomains: [],
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message:
            "This pack uses authentication but did not declare a network domain. Specify the domain that your pack makes http requests to using `networkDomains: ['example.com']`",
          path: 'networkDomains',
        },
      ]);
    });

    it('rejects when network domain length is greater than character limit', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
        },
        networkDomains: [`${'a'.repeat(Limits.NetworkDomainUrl)}.io`],
      });

      const err = await validateJsonAndAssertFails(metadata, '1.0.0');
      assert.deepEqual(err.validationErrors, [
        {
          message: `String must contain at most ${Limits.NetworkDomainUrl} character(s)`,
          path: 'networkDomains[0]',
        },
      ]);
    });
  });

  describe('validateVariousAuthenticationMetadata', () => {
    it('succeeds', () => {
      assert.ok(validateVariousAuthenticationMetadata({type: AuthenticationType.None}, {}));
      assert.ok(
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.HeaderBearerToken,
          },
          {},
        ),
      );
      assert.ok(
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.CustomHeaderToken,
            headerName: 'MyHeader',
          },
          {},
        ),
      );
      assert.ok(
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.MultiHeaderToken,
            headers: [{name: 'Header1', description: 'desc 1'}],
          },
          {},
        ),
      );
    });

    it('fails on invalid auth type', () => {
      assert.throws(() => validateVariousAuthenticationMetadata({type: AuthenticationType.OAuth2}, {}));
    });

    it('fails on invalid auth type', () => {
      assert.throws(() =>
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.CustomHeaderToken,
          },
          {},
        ),
      );
      assert.throws(() =>
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.CustomHeaderToken,
            headerName: {
              not: 'a string',
            },
          },
          {},
        ),
      );
      assert.throws(() =>
        validateVariousAuthenticationMetadata(
          {
            type: AuthenticationType.CustomHeaderToken,
            headerName: 'MyHeader',
            evilData: 0xdeadbeef,
          },
          {},
        ),
      );
    });
  });

  describe('validateSyncTableSchema', () => {
    function validateAndAssertFails(schema: any, details?: string): PackMetadataValidationError {
      try {
        validateSyncTableSchema(schema, {sdkVersion: codaPacksSDKVersion});
        assert.fail('Expected validateSyncTableSchema to fail but it succeeded');
      } catch (err: any) {
        assert.isTrue(err.message.startsWith('Schema failed validation'));
        if (details) {
          assert.include(err.message, details);
        }
        return err as PackMetadataValidationError;
      }
    }

    it('succeeds', () => {
      const itemSchema = makeObjectSchema({
        type: ValueType.Object,
        id: 'id',
        primary: 'primary',
        identity: {
          packId: 123,
          name: 'IdentityName',
        },
        properties: {
          id: {type: ValueType.Number, fromKey: 'foo', required: true},
          primary: {type: ValueType.String},
          date: {type: ValueType.String, codaType: ValueHintType.Date},
        },
      });
      const arraySchema = makeSchema({
        type: ValueType.Array,
        items: itemSchema,
      });
      // Test an array schema
      const arraySchemaResult = validateSyncTableSchema(arraySchema, {sdkVersion: codaPacksSDKVersion});
      assert.ok(arraySchemaResult);
      // Test an object schema
      const objectSchemaResult = validateSyncTableSchema(itemSchema, {sdkVersion: codaPacksSDKVersion});
      assert.ok(objectSchemaResult);
      // It should be changed into an Array schema automatically.
      assert.equal(objectSchemaResult.type, ValueType.Array);
    });

    it('fails', () => {
      const arraySchema = makeSchema({
        type: ValueType.Array,
        items: makeObjectSchema({
          type: ValueType.Object,
          properties: {
            foo: {type: ValueHintType.DateTime} as any,
          },
        }),
      });
      validateAndAssertFails(arraySchema);
    });

    it('fails on invalid identity name', async () => {
      const itemSchema = makeObjectSchema({
        type: ValueType.Object,
        id: 'id',
        primary: 'primary',
        identity: {
          packId: 123,
          name: 'Identity name with spaces',
        },
        properties: {
          id: {type: ValueType.Number, fromKey: 'foo', required: true},
          primary: {type: ValueType.String},
          date: {type: ValueType.String, codaType: ValueHintType.Date},
        },
      });
      const arraySchema = makeSchema({
        type: ValueType.Array,
        items: itemSchema,
      });
      const err = validateAndAssertFails(
        arraySchema,
        '[{"path":"items.identity.name","message":"Invalid name. Identity names can only contain ' +
          'alphanumeric characters, underscores, and dashes, and no spaces."}]',
      );
      assert.deepEqual(err.validationErrors, [
        {
          path: 'items.identity.name',
          message:
            'Invalid name. Identity names can only contain alphanumeric characters, underscores, and dashes, and no spaces.',
        },
      ]);
    });

    it('invalid identity name but in legacy exemption list', async () => {
      const itemSchema = makeObjectSchema({
        type: ValueType.Object,
        id: 'id',
        primary: 'primary',
        identity: {
          packId: 1090,
          name: 'Identity name with spaces',
        },
        properties: {
          id: {type: ValueType.Number, fromKey: 'foo', required: true},
          primary: {type: ValueType.String},
          date: {type: ValueType.String, codaType: ValueHintType.Date},
        },
      });
      const arraySchema = makeSchema({
        type: ValueType.Array,
        items: itemSchema,
      });
      const arraySchemaResult = validateSyncTableSchema(arraySchema, {sdkVersion: codaPacksSDKVersion});
      assert.ok(arraySchemaResult);
      const objectSchemaResult = validateSyncTableSchema(itemSchema, {sdkVersion: codaPacksSDKVersion});
      assert.ok(objectSchemaResult);
    });

    it('rejects formula names that are too long', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'A'.repeat(1 + Limits.BuildingBlockName),
        description: 'My description',
        examples: [],
        parameters: [],
        execute: () => '',
      });

      const metadata = createFakePackVersionMetadata({
        formulas: [formula],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: `String must contain at most ${Limits.BuildingBlockName} character(s)`,
          path: 'formulas[0].name',
        },
      ]);
    });

    it('rejects formula descriptions that are too long', async () => {
      const formula = makeFormula({
        resultType: ValueType.String,
        name: 'Hi',
        description: 'A'.repeat(1 + Limits.BuildingBlockDescription),
        examples: [],
        parameters: [],
        execute: () => '',
      });

      const metadata = createFakePackVersionMetadata({
        formulas: [formula],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          message: `String must contain at most ${Limits.BuildingBlockDescription} character(s)`,
          path: 'formulas[0].description',
        },
      ]);
    });
  });

  describe('deprecation warnings', () => {
    const sdkVersionTriggeringDeprecationWarnings = '1.0.0';

    it('deprecated schema properties in formula schema', async () => {
      const metadata = createFakePackVersionMetadata({
        formulaNamespace: 'ignored',
        formulas: [
          {
            schema: makeObjectSchema({
              id: 'id',
              primary: 'primary',
              featured: ['id', 'primary'],
              properties: {
                id: {type: ValueType.String},
                primary: {type: ValueType.String},
                featured: {type: ValueType.String},
              },
            }),
            name: 'MyFormula',
            description: 'Formula description',
            parameters: [],
            examples: [],
            resultType: Type.object,
          },
        ],
      });
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'formulas[0].schema.id',
          message: 'Property name "id" is no longer accepted. Use "idProperty" instead.',
        },
        {
          path: 'formulas[0].schema.primary',
          message: 'Property name "primary" is no longer accepted. Use "displayProperty" instead.',
        },
        {
          path: 'formulas[0].schema.featured',
          message: 'Property name "featured" is no longer accepted. Use "featuredProperties" instead.',
        },
      ]);
    });

    it('deprecated schema properties in sync table schema', async () => {
      const syncTable = makeSyncTable({
        name: 'SyncTable',
        identityName: 'Sync',
        schema: makeObjectSchema({
          id: 'id',
          primary: 'primary',
          featured: ['id', 'primary'],
          properties: {
            id: {type: ValueType.String},
            primary: {type: ValueType.String},
            featured: {type: ValueType.String},
          },
        }),
        formula: {
          name: 'SyncTable',
          description: 'A simple sync table',
          async execute([], _context) {
            return {result: []};
          },
          parameters: [],
          examples: [],
        },
      });
      const metadata = createFakePackVersionMetadata(
        compilePackMetadata({
          version: '1',
          syncTables: [syncTable],
          defaultAuthentication: {
            type: AuthenticationType.None,
          },
        }),
      );
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'syncTables[0].schema.id',
          message: 'Property name "id" is no longer accepted. Use "idProperty" instead.',
        },
        {
          path: 'syncTables[0].schema.primary',
          message: 'Property name "primary" is no longer accepted. Use "displayProperty" instead.',
        },
        {
          path: 'syncTables[0].schema.featured',
          message: 'Property name "featured" is no longer accepted. Use "featuredProperties" instead.',
        },
      ]);
    });

    it('deprecated schema properties in nested schema', async () => {
      const metadata = createFakePackVersionMetadata({
        formulaNamespace: 'ignored',
        formulas: [
          {
            schema: makeObjectSchema({
              properties: {
                childObj: makeObjectSchema({
                  id: 'id',
                  properties: {
                    id: {type: ValueType.String},
                  },
                }),
                childArr: {
                  type: ValueType.Array,
                  items: makeObjectSchema({
                    primary: 'primary',
                    properties: {
                      primary: {type: ValueType.String},
                    },
                  }),
                },
              },
            }),
            name: 'MyFormula',
            description: 'Formula description',
            parameters: [],
            examples: [],
            resultType: Type.object,
          },
        ],
      });
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'formulas[0].schema.properties.childObj.id',
          message: 'Property name "id" is no longer accepted. Use "idProperty" instead.',
        },
        {
          path: 'formulas[0].schema.properties.childArr.items.primary',
          message: 'Property name "primary" is no longer accepted. Use "displayProperty" instead.',
        },
      ]);
    });

    it('deprecated defaultValue in formula params', async () => {
      const metadata = createFakePackVersionMetadata({
        formulaNamespace: 'ignored',
        formulas: [
          {
            name: 'MyFormula',
            description: 'Formula description',
            parameters: [{name: 'param', description: '', type: Type.string, defaultValue: 'foo'}],
            varargParameters: [{name: 'otherParam', description: '', type: Type.string, defaultValue: 'foo'}],
            resultType: Type.string,
          },
        ],
      });
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'formulas[0].parameters[0].defaultValue',
          message: 'Property name "defaultValue" is no longer accepted. Use "suggestedValue" instead.',
        },
        {
          path: 'formulas[0].varargParameters[0].defaultValue',
          message: 'Property name "defaultValue" is no longer accepted. Use "suggestedValue" instead.',
        },
      ]);
    });

    it('deprecated defaultValue in sync table getter params', async () => {
      const syncTable = makeSyncTable({
        name: 'SyncTable',
        identityName: 'Sync',
        schema: makeObjectSchema({
          idProperty: 'id',
          displayProperty: 'primary',
          properties: {
            id: {type: ValueType.String},
            primary: {type: ValueType.String},
          },
        }),
        formula: {
          name: 'MyFormula',
          description: 'Formula description',
          parameters: [{name: 'param', description: '', type: Type.string, defaultValue: 'foo'}],
          async execute() {
            return {result: []};
          },
        },
      });
      const metadata = createFakePackVersionMetadata(
        compilePackMetadata({
          version: '1',
          syncTables: [syncTable],
        }),
      );
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'syncTables[0].getter.parameters[0].defaultValue',
          message: 'Property name "defaultValue" is no longer accepted. Use "suggestedValue" instead.',
        },
      ]);
    });

    it('deprecated getOptionsFormula', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          postSetup: [
            {type: PostSetupType.SetEndpoint, getOptionsFormula: {} as any, name: 'StepName', description: ''},
          ],
        },
      });
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'defaultAuthentication.postSetup[0].getOptionsFormula',
          message: 'Property name "getOptionsFormula" is no longer accepted. Use "getOptions" instead.',
        },
      ]);
    });

    it('deprecated attribution within identity', async () => {
      const metadata = createFakePackVersionMetadata({
        formulaNamespace: 'ignored',
        formulas: [
          {
            schema: makeObjectSchema({
              identity: {
                name: 'Foo',
                attribution: [makeAttributionNode({type: AttributionNodeType.Text, text: 'foo'})],
              },
              properties: {
                id: {type: ValueType.String},
              },
            }),
            name: 'MyFormula',
            description: 'Formula description',
            parameters: [],
            resultType: Type.object,
          },
        ],
      });
      const err = await validateJsonAndAssertFails(metadata, sdkVersionTriggeringDeprecationWarnings);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'formulas[0].schema.identity.attribution',
          message:
            'Attribution has moved and is no longer nested in the Identity object. ' +
            'Instead of specifying `schema.identity.attribution`, simply specify `schema.attribution`.',
        },
      ]);
    });
  });
});
