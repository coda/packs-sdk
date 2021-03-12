import {testHelper} from './test_helper';
import {AuthenticationType} from '../types';
import {DefaultConnectionType} from '../types';
import type {GenericObjectSchema} from '../index';
import type {Network} from '../index';
import type {PackFormulaMetadata} from '../api';
import type {PackMetadata} from '../index';
import type {PackMetadataValidationError} from '../testing/upload_validation';
import {PostSetupType} from '../types';
import type {TypedStandardFormula} from '../api';
import {ValueType} from '../index';
import {createFakePackFormulaMetadata} from './test_utils';
import {createFakePackMetadata} from './test_utils';
import {makeNumericFormula} from '../api';
import {makeNumericParameter} from '../api';
import {makeObjectFormula} from '../api';
import {makeStringFormula} from '../api';
import {makeStringParameter} from '../api';
import {validatePackMetadata} from '../testing/upload_validation';

describe('Pack metadata Validation', () => {
  async function validateJson(obj: Record<string, any>) {
    return validatePackMetadata(obj);
  }

  async function validateJsonAndAssertFails(obj: Record<string, any>) {
    const err = await testHelper.willBeRejectedWith(validateJson(obj), /Pack metadata failed validation/);
    return err as PackMetadataValidationError;
  }

  it('empty upload JSON object', async () => {
    const err = await validateJsonAndAssertFails({});
    assert.deepEqual(err.validationErrors, [
      {
        message: 'Missing required field name.',
        path: 'name',
      },
      {
        message: 'Missing required field shortDescription.',
        path: 'shortDescription',
      },
      {
        message: 'Missing required field description.',
        path: 'description',
      },
      {
        message: 'Missing required field version.',
        path: 'version',
      },
      {
        message:
          'Input must be one of these values: CRM, Calendar, Communication, DataStorage, Design, Financial, Fun, Geo, IT, Mathematics, Organization, Recruiting, Shopping, Social, Sports, Travel, Weather',
        path: 'category',
      },
    ]);
  });

  it('wrong top-level types', async () => {
    const metadata = 'asdf';
    const err = await validateJsonAndAssertFails((metadata as unknown) as Record<string, any>);
    assert.deepEqual(err.validationErrors, [{path: '', message: 'Expected object, received string'}]);
  });

  it('simple valid upload', async () => {
    const metadata = createFakePackMetadata();
    const result = await validateJson(metadata);
    assert.deepEqual(result, metadata);
  });

  it('extraneous fields are omitted', async () => {
    const metadata = createFakePackMetadata();
    const result = await validateJson({
      ...metadata,
      extraneous: 'long evil string',
    });
    assert.notInclude(Object.keys(result), 'extraneous');
  });

  it('formula namespace required when formulas present', async () => {
    const metadata = createFakePackMetadata({formulas: [createFakePackFormulaMetadata()], formulaNamespace: undefined});
    const err = await validateJsonAndAssertFails(metadata);
    assert.deepEqual(err.validationErrors, [
      {
        path: 'formulaNamespace',
        message: 'A formula namespace must be provided whenever formulas are defined.',
      },
    ]);
  });

  it('formula namespace not required when formulas absent', async () => {
    const metadata = createFakePackMetadata({formulas: undefined, formulaNamespace: undefined});
    await validateJson(metadata);
  });

  it('formula namespace not required when formulas present but empty', async () => {
    const metadata = createFakePackMetadata({formulas: [], formulaNamespace: undefined});
    await validateJson(metadata);
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid string formula with examples', async () => {
      const formula = makeStringFormula({
        name: 'MyFormula',
        description: 'My description',
        examples: [{params: ['some-param'], result: 'some-result'}],
        parameters: [makeStringParameter('myParam', 'param description')],
        execute: () => '',
      });
      const metadata = createFakePackMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('valid formula with network', async () => {
      const networks: Network[] = [
        {},
        {requiresConnection: true},
        {requiresConnection: false},
        {hasSideEffect: true},
        {hasSideEffect: false},
        {hasSideEffect: true, requiresConnection: false},
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
        const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      await validateJson(metadata);
    });

    it('invalid numeric formula', async () => {
      const formula = makeNumericFormula({
        name: '',
        examples: [],
        parameters: [makeNumericParameter('myParam', 'param description')],
      } as any);
      const metadata = createFakePackMetadata({
        formulas: [formulaToMetadata(formula)],
        formulaNamespace: 'MyNamespace',
      });
      const err = await validateJsonAndAssertFails(metadata);
      assert.deepEqual(err.validationErrors, [{message: 'Required', path: 'formulas[0].description'}]);
    });

    describe('object schemas', () => {
      function metadataForFormulaWithObjectSchema(schema: GenericObjectSchema): PackMetadata {
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
        return createFakePackMetadata({
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
            name: 'identity name',
          },
          properties: {
            id: {type: ValueType.Number, fromKey: 'foo', required: true},
            primary: {type: ValueType.String},
            date: {type: ValueType.String, codaType: ValueType.Date},
          },
        });
        await validateJson(metadata);
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
        const metadata = createFakePackMetadata({
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
        const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
        defaultAuthentication: {
          type: AuthenticationType.None,
        },
      });
      await validateJson(metadata);
    });

    it('HeaderBearerToken', async () => {
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
        defaultAuthentication: {
          type: AuthenticationType.CodaApiHeaderBearerToken,
          deferConnectionSetup: true,
          shouldAutoAuthSetup: true,
        },
      });
      await validateJson(metadata);
    });

    it('CustomHeaderToken', async () => {
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
        defaultAuthentication: {
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
      const metadata = createFakePackMetadata({
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
      const metadata = createFakePackMetadata({
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
});
