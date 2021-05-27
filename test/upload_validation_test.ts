import {testHelper} from './test_helper';
import type {ArraySchema} from '../schema';
import {AuthenticationType} from '../types';
import {DefaultConnectionType} from '../types';
import type {GenericObjectSchema} from '../schema';
import type {Network} from '../api_types';
import {NetworkConnection} from '../api_types';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import type {PackVersionMetadata} from '../compiled_types';
import {PostSetupType} from '../types';
import type {StringFormulaDef} from '../api';
import type {TypedStandardFormula} from '../api';
import {ValueType} from '../schema';
import {createFakePack} from './test_utils';
import {createFakePackFormulaMetadata} from './test_utils';
import {createFakePackVersionMetadata} from './test_utils';
import {makeDynamicSyncTable} from '../api';
import {makeMetadataFormula} from '../api';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeObjectFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeSchema} from '../schema';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {makeSyncTable} from '../api';
import {validatePackVersionMetadata} from '../testing/upload_validation';
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
    function formulaToMetadata(formula: TypedStandardFormula): PackFormulaMetadata {
      const {execute, ...rest} = formula;
      return rest;
    }

    it('valid number formula', async () => {
      const formula = makeNumericFormula({
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

    it('valid formula with network', async () => {
      const networks: Network[] = [
        {},
        {hasSideEffect: true},
        {hasSideEffect: false},
        {hasSideEffect: true, connection: NetworkConnection.Required},
        {connection: NetworkConnection.None},
        {connection: NetworkConnection.Optional},
        {connection: NetworkConnection.Required},
        {hasSideEffect: true, connection: NetworkConnection.Optional},
      ];
      for (const network of networks) {
        const formula = makeStringFormula({
          name: 'MyFormula',
          description: 'My description',
          examples: [],
          parameters: [makeStringParameter('myParam', 'param description')],
          network,
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

    describe('sync tables', () => {
      it('valid sync table', async () => {
        const syncTable = makeSyncTable(
          'SyncTable',
          makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {packId: 424242, name: 'foo'},
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
        await validateJson(metadata);
      });

      it('valid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          packId: 424242,
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

      it('identity name matches property', async () => {
        const syncTable = makeSyncTable(
          'SyncTable',
          makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {packId: 424242, name: 'Foo'},
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
        const err = await validateJsonAndAssertFails(metadata);
        assert.deepEqual(err.validationErrors, [
          {
            message: "Cannot have a sync table property with the same name as the sync table's schema identity.",
            path: '',
          },
        ]);
      });

      it('invalid dynamic sync table', async () => {
        const syncTable = makeDynamicSyncTable({
          packId: 424242,
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
          packId: 424242,
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
        const syncTable = makeSyncTable(
          'SyncTable',
          makeObjectSchema({
            type: ValueType.Object,
            primary: 'foo',
            id: 'foo',
            identity: {packId: 424242, name: 'Name with spaces'},
            properties: {
              foo: {type: ValueType.String},
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

    describe('object schemas', () => {
      function metadataForFormulaWithObjectSchema(schema: GenericObjectSchema | ArraySchema): PackVersionMetadata {
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
            packId: 123,
            name: 'IdentityName',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
            date: {type: ValueType.String, codaType: ValueType.Date},
          },
        });
        await validateJson(metadata);
      });

      it('valid object formula with array schema', async () => {
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
            date: {type: ValueType.String, codaType: ValueType.Date},
          },
        });
        const arraySchema = makeSchema({
          type: ValueType.Array,
          items: itemSchema,
        });
        const metadata = metadataForFormulaWithObjectSchema(arraySchema);
        await validateJson(metadata);
      });

      it('invalid identity name', async () => {
        const metadata = metadataForFormulaWithObjectSchema({
          type: ValueType.Object,
          identity: {
            packId: 123,
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
            message: 'One or more of the "featured" fields do not appear in the "properties" object.',
            path: 'formulas[0].schema',
          },
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
              'Could not find a formula for one or more matchers. Check that the "formulaName" for each matcher matches the name of a formula defined in this pack.',
            path: 'formats',
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

    it('OAuth2, complete', async () => {
      const metadata = createFakePackVersionMetadata({
        defaultAuthentication: {
          type: AuthenticationType.OAuth2,
          authorizationUrl: 'some-url',
          tokenUrl: 'some-url',
          scopes: ['scope 1', 'scope 2'],
          tokenPrefix: 'some-prefix',
          additionalParams: {foo: 'bar'},
          clientIdEnvVarName: 'deprecated',
          clientSecretEnvVarName: 'deprecated',
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
          clientIdEnvVarName: 'deprecated',
          clientSecretEnvVarName: 'deprecated',
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
});
