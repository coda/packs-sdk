import {testHelper} from './test_helper';
import type {ArraySchema} from '../schema';
import {AuthenticationType} from '../types';
import {ConnectionRequirement} from '../api_types';
import {DefaultConnectionType} from '../types';
import type {Formula} from '../api';
import type {ObjectSchemaDefinition} from '../schema';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionMetadata} from '../compiled_types';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {PostSetupType} from '../types';
import type {StringFormulaDef} from '../api';
import {Type} from '../api_types';
import {ValueHintType} from '../schema';
import {ValueType} from '../schema';
import {createFakePack} from './test_utils';
import {createFakePackFormulaMetadata} from './test_utils';
import {createFakePackVersionMetadata} from './test_utils';
import {makeDynamicSyncTable} from '../api';
import {makeFormula} from '../api';
import {makeMetadataFormula} from '../api';
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
import {validatePackVersionMetadata} from '../testing/upload_validation';
import {validateSyncTableSchema} from '../testing/upload_validation';
import {validateVariousAuthenticationMetadata} from '../testing/upload_validation';

describe('Pack metadata Validation', () => {
  async function validateJson(obj: Record<string, any>) {
    return validatePackVersionMetadata(obj);
  }

  async function validateJsonAndAssertFails(obj: Record<string, any>) {
    const err = await testHelper.willBeRejectedWith(validateJson(obj), /Pack metadata failed validation/);
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
        } as StringFormulaDef<any>),
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
    for (const version of ['1', '1.0', '1.0.0']) {
      const metadata = createFakePackVersionMetadata({version});
      const result = await validateJson(metadata);
      assert.ok(result, `Expected version identifier "${version}" to be valid.`);
    }
  });

  it('invalid versions', async () => {
    for (const version of ['', 'foo', 'unversioned', '-1', '1.0.0.0', '1.0.0-beta']) {
      const metadata = createFakePackVersionMetadata({version});
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [
        {
          path: 'version',
          message: 'Pack versions must use semantic versioning, e.g. "1", "1.0" or "1.0.0".',
        },
      ]);
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
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => ['hello'],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
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
        execute: () => ['hello'],
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
        execute: () => ['hello'],
      });
      const metadata = createFakePackVersionMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid formula names', async () => {
      for (const name of ['foo', 'Foo', 'foo_bar', 'Foo123', 'føø']) {
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
            message: 'All optional parameters must be come after all non-optional parameters.',
            path: 'formulas[0].parameters',
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
            identity: {packId: 424242, name: 'foo'},
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
        await validateJson(metadata);
      });

      it('valid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
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
            identity: {packId: 424242, name: 'foo'},
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

      it('identityName propagated to identiy field', async () => {
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

      it('identityName overwrites schema identity if both present', async () => {
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'SomeIdentity',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {name: 'IgnoredName'},
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

      it('legacy wrapper does not overwrite inline identity name', async () => {
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

        const {schema} = validatedMetadata.syncTables[0];
        assert.ok(schema);
        assert.deepEqual(schema.identity, {name: 'LegacyName'});
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

      it('invalid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
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
            message: "Unrecognized key(s) in object: 'getDisplayUrl', 'listDynamicUrls', 'getName'",
          },
        ]);

        const invalidFormulaSyncTable = makeDynamicSyncTable({
          name: 'DynamicSyncTable',
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
        const syncTable = makeSyncTable({
          name: 'SyncTable',
          identityName: 'Name with spaces',
          schema: makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            properties: {
              foo: {type: ValueType.String},
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
        ]);
      });
    });

    it('duplicate sync table identity names', async () => {
      const syncTable1 = makeSyncTable({
        name: 'SyncTable1',
        identityName: 'Identity',
        schema: makeObjectSchema({
          type: ValueType.Object,
          primary: 'foo',
          id: 'foo',
          identity: {packId: 424242, name: 'foo'},
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
          identity: {packId: 424242, name: 'foo'},
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
          identity: {packId: 424242, name: 'foo'},
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
          identity: {packId: 424242, name: 'foo'},
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

      it('id not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          id: 'garbage',
          properties: {
            id: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "id" property must appear as a key in the "properties" object.',
            path: 'formulas[0].schema',
          },
        ]);
      });

      it('primary not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          primary: 'garbage',
          properties: {
            primary: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The "primary" property must appear as a key in the "properties" object.',
            path: 'formulas[0].schema',
          },
        ]);
      });

      it('featured field not among properties', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          featured: ['name', 'foo'],
          properties: {
            name: {type: ValueType.Number, required: true},
          },
        });
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: 'The featured field name "Foo" does not exist in the "properties" object.',
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
              matchers: ['some-regex'],
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
              matchers: ['some-regex'],
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
              matchers: ['some-regex'],
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
              matchers: ['some-regex'],
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
          defaultConnectionType: DefaultConnectionType.Shared,
          instructionsUrl: 'some-url',
          requiresEndpointUrl: false,
          endpointDomain: 'some-endpoint',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.HeaderBearerToken,
          defaultConnectionType: DefaultConnectionType.Shared,
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
          message: 'Duplicated parameter names in the mutli-query-token authentication config',
          path: 'systemConnectionAuthentication.params',
        },
      ]);
    });

    it('OAuth2, complete', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'some-url',
          tokenUrl: 'some-url',
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
              getOptionsFormula: {} as any,
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
          authorizationUrl: 'some-url',
          tokenUrl: 'some-url',
        },
      });
      await validateJson(metadata);
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

    it('AWSSignature4', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.AWSSignature4,
          service: 'some-service',
        },
        systemConnectionAuthentication: {
          type: AuthenticationType.AWSSignature4,
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
        defaultAuthentication: {
          type: AuthenticationType.Various,
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
  });

  describe('validateVariousAuthenticationMetadata', () => {
    it('succeeds', () => {
      assert.ok(validateVariousAuthenticationMetadata({type: AuthenticationType.None}));
      assert.ok(
        validateVariousAuthenticationMetadata({
          type: AuthenticationType.HeaderBearerToken,
        }),
      );
      assert.ok(
        validateVariousAuthenticationMetadata({
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'MyHeader',
        }),
      );
    });

    it('fails on invalid auth type', () => {
      assert.throws(() => validateVariousAuthenticationMetadata({type: AuthenticationType.OAuth2}));
    });

    it('fails on invalid auth type', () => {
      assert.throws(() =>
        validateVariousAuthenticationMetadata({
          type: AuthenticationType.CustomHeaderToken,
        }),
      );
      assert.throws(() =>
        validateVariousAuthenticationMetadata({
          type: AuthenticationType.CustomHeaderToken,
          headerName: {
            not: 'a string',
          },
        }),
      );
      assert.throws(() =>
        validateVariousAuthenticationMetadata({
          type: AuthenticationType.CustomHeaderToken,
          headerName: 'MyHeader',
          evilData: 0xdeadbeef,
        }),
      );
    });
  });

  describe('validateSyncTableSchema', () => {
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
      const result = validateSyncTableSchema(arraySchema);
      assert.ok(result);
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
      assert.throws(() => validateSyncTableSchema(arraySchema), /Schema failed validation/);
    });
  });
});
