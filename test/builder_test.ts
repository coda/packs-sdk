import './test_helper';
import {AuthenticationType} from '../types';
import {ConnectionRequirement} from '../api_types';
import type {DynamicSyncTableDef} from '../api';
import type {DynamicSyncTableOptions} from '../api';
import type {GenericObjectSchema} from '../schema';
import type {MetadataFormulaDef} from '../api';
import type {ObjectFormulaDef} from '../api';
import type {ObjectSchema} from '../schema';
import type {PackDefinitionBuilder} from '../builder';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {PostSetupType} from '..';
import type {StringPackFormula} from '../api';
import type {SyncTableOptions} from '../api';
import {ValueHintType} from '..';
import {ValueType} from '../schema';
import {assertCondition} from '..';
import {makeMetadataFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeParameter} from '../api';
import {makeSchema} from '../schema';
import {newPack} from '../builder';

describe('Builder', () => {
  let pack: PackDefinitionBuilder;
  const dummyObjectSchema = makeObjectSchema({
    type: ValueType.Object,
    id: 'foo',
    primary: 'foo',
    identity: {name: 'Identity'},
    properties: {
      foo: {type: ValueType.String},
    },
  });

  beforeEach(() => {
    pack = newPack();
  });

  function addDummyFormula(
    pack_: PackDefinitionBuilder,
    {connectionRequirement, parameters}: {connectionRequirement?: ConnectionRequirement; parameters?: ParamDefs} = {},
  ) {
    pack_.addFormula({
      resultType: ValueType.String,
      name: 'Foo',
      description: '',
      connectionRequirement,
      parameters: parameters || [],
      execute: () => '',
    });
  }

  function addDummySyncTable(
    pack_: PackDefinitionBuilder,
    {
      connectionRequirement,
      parameters,
      schema,
    }: {
      connectionRequirement?: ConnectionRequirement;
      parameters?: ParamDefs;
      schema?: ObjectSchema<string, string>;
    } = {},
  ) {
    pack_.addSyncTable({
      name: 'Foos',
      identityName: 'Foo',
      connectionRequirement,
      schema: makeObjectSchema(
        schema ?? {
          type: ValueType.Object,
          id: 'foo',
          primary: 'foo',
          properties: {foo: {type: ValueType.String}},
        },
      ),
      formula: {
        name: 'Ignored',
        description: '',
        parameters: parameters || [],
        execute: async () => {
          return {result: []};
        },
        maxUpdateBatchSize: 10,
      },
    });
  }

  function addDummyDynamicSyncTable(
    pack_: PackDefinitionBuilder,
    {
      connectionRequirement,
      getName,
      identityName,
      getSchema,
      getDisplayUrl,
      listDynamicUrls,
      searchDynamicUrls,
    }: {
      connectionRequirement?: ConnectionRequirement;
      getName: MetadataFormulaDef;
      identityName: string;
      getSchema: MetadataFormulaDef;
      getDisplayUrl: MetadataFormulaDef;
      listDynamicUrls: MetadataFormulaDef;
      searchDynamicUrls: MetadataFormulaDef;
    },
  ) {
    pack_.addDynamicSyncTable({
      name: 'Foos',
      identityName,
      connectionRequirement,
      getName,
      getSchema,
      getDisplayUrl,
      listDynamicUrls,
      searchDynamicUrls,
      formula: {
        name: 'Ignored',
        description: '',
        parameters: [],
        execute: async () => {
          return {result: []};
        },
      },
    });
  }

  describe('typing works', () => {
    it('oauth2', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.OAuth2,
        authorizationUrl: 'auth-url',
        tokenUrl: 'token-url',
      });
    });

    it('query param, system auth', () => {
      pack.setSystemAuthentication({
        type: AuthenticationType.QueryParamToken,
        paramName: 'param',
      });
    });
  });

  describe('default connection requirement', () => {
    it('works for formula', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummyFormula(pack);
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for formula after the fact', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'Foo',
        description: '',
        parameters: [],
        execute: () => '',
      });
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for formula with alternate default', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.None,
      });
      addDummyFormula(pack);
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.None);
    });

    it('works for formula with alternate default after the fact', () => {
      addDummyFormula(pack);
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.Optional,
      });
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.Optional);
    });

    it('does not override manually set value for formula', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummyFormula(pack, {connectionRequirement: ConnectionRequirement.None});
      assert.equal(pack.formulas[0].connectionRequirement, ConnectionRequirement.None);
    });

    it('works for formula autocomplete', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummyFormula(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      assert.equal(pack.formulas[0].parameters[0]?.autocomplete?.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for formula autocomplete after the fact', () => {
      addDummyFormula(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      assert.equal(pack.formulas[0].parameters[0]?.autocomplete?.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for sync table', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummySyncTable(pack);
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for sync table after the fact', () => {
      addDummySyncTable(pack);
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.Required);
    });

    it('does not override manually set value for sync table', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummySyncTable(pack, {connectionRequirement: ConnectionRequirement.None});
      assert.equal(pack.syncTables[0].getter.connectionRequirement, ConnectionRequirement.None);
    });

    it('works for sync table parameter autocomplete', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummySyncTable(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      assert.equal(
        pack.syncTables[0].getter.parameters[0]?.autocomplete?.connectionRequirement,
        ConnectionRequirement.Required,
      );
    });

    it('works for sync table parameter autocomplete after the fact', () => {
      addDummySyncTable(pack, {
        parameters: [
          makeParameter({type: ParameterType.String, name: 'p', description: '', autocomplete: ['foo', 'bar']}),
        ],
      });
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      assert.equal(
        pack.syncTables[0].getter.parameters[0]?.autocomplete?.connectionRequirement,
        ConnectionRequirement.Required,
      );
    });

    it('works for sync table cell autocomplete', () => {
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      addDummySyncTable(pack, {
        schema: {
          type: ValueType.Object,
          id: 'foo',
          primary: 'foo',
          properties: {
            foo: {
              type: ValueType.String,
              codaType: ValueHintType.SelectList,
              mutable: true,
              options: () => {
                return ['bar'];
              },
            },
          },
        },
      });
      assert.equal(pack.syncTables[0].namedPropertyOptions!.foo.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for sync table cell autocomplete after the fact', () => {
      addDummySyncTable(pack, {
        schema: {
          type: ValueType.Object,
          id: 'foo',
          primary: 'foo',
          properties: {
            foo: {
              type: ValueType.String,
              codaType: ValueHintType.SelectList,
              mutable: true,
              options: () => {
                return ['bar'];
              },
            },
          },
        },
      });
      assert.equal(pack.syncTables[0].namedPropertyOptions!.foo.connectionRequirement, ConnectionRequirement.Optional);
      pack.setUserAuthentication({type: AuthenticationType.HeaderBearerToken});
      assert.equal(pack.syncTables[0].namedPropertyOptions!.foo.connectionRequirement, ConnectionRequirement.Required);
    });

    it('works for dynamic sync table metadata formulas', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.Optional,
      });
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name'),
        identityName: 'Foo',
        getDisplayUrl: makeMetadataFormula(async () => 'display-url'),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema})),
        listDynamicUrls: makeMetadataFormula(async () => ['url']),
        searchDynamicUrls: makeMetadataFormula(async () => ['url']),
      });
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any>;
      assert.equal(syncTable.getName.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getDisplayUrl.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getSchema.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.listDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.searchDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
    });

    it('works for dynamic sync table metadata formulas after the fact', () => {
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name'),
        identityName: 'Foo',
        getDisplayUrl: makeMetadataFormula(async () => 'display-url'),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema})),
        listDynamicUrls: makeMetadataFormula(async () => ['url']),
        searchDynamicUrls: makeMetadataFormula(async () => ['url']),
      });
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.Optional,
      });
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any>;
      assert.equal(syncTable.getName.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getDisplayUrl.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getSchema.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.listDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.searchDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
    });

    // This is demonstrating a quirk of setDefaultConnectionRequirement()
    // documented in the lengthy comment in that method. We don't about
    // supporting the behavior in this test, it's simply demonstarting that
    // it occurs, and perhaps one day we can eliminate the behavior and
    // remove this test.
    it('unfortunate behavior that default connection requirement overrides explicit connection requirement on dynamic sync table formulas', () => {
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name', {connectionRequirement: ConnectionRequirement.None}),
        identityName: 'Foo',
        getDisplayUrl: makeMetadataFormula(async () => 'display-url', {
          connectionRequirement: ConnectionRequirement.None,
        }),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema}), {
          connectionRequirement: ConnectionRequirement.None,
        }),
        listDynamicUrls: makeMetadataFormula(async () => ['url'], {connectionRequirement: ConnectionRequirement.None}),
        searchDynamicUrls: makeMetadataFormula(async () => ['url'], {
          connectionRequirement: ConnectionRequirement.None,
        }),
      });
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.Optional,
      });
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any>;
      assert.equal(syncTable.getName.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getDisplayUrl.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getSchema.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.listDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.searchDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
    });

    it('omits codaType as a formula property but preserves it in the schema definition', () => {
      pack.addFormula({
        resultType: ValueType.String,
        codaType: ValueHintType.Html,
        name: 'MyFormula',
        description: 'My description.',
        parameters: [],
        execute: async ([]) => {
          return ``;
        },
      });

      const formula = pack.formulas[0];
      assert.isUndefined((formula as any).codaType);
      assert.equal((formula as unknown as StringPackFormula<any>).schema?.codaType, ValueHintType.Html);
    });
  });

  describe('metadata formula shorthand syntax', () => {
    it('SetEndpoint.getOptions, user authentication', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        postSetup: [
          {
            type: PostSetupType.SetEndpoint,
            name: 'set-endpoint',
            description: 'sets endpoint',
            getOptions: async () => [{display: 'Display', value: 'value'}],
          },
        ],
      });
      assertCondition(pack.defaultAuthentication?.type === AuthenticationType.HeaderBearerToken);
      const {postSetup} = pack.defaultAuthentication;
      assert.ok(postSetup);
      // Make sure we converted the shorthand function into a full formula def.
      assert.ok(postSetup?.[0].getOptions!.name);
      assert.ok(postSetup?.[0].getOptions!.execute);
    });

    it('SetEndpoint.getOptions, system authentication', () => {
      pack.setSystemAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        postSetup: [
          {
            type: PostSetupType.SetEndpoint,
            name: 'set-endpoint',
            description: 'sets endpoint',
            getOptions: async () => [{display: 'Display', value: 'value'}],
          },
        ],
      });
      assertCondition(pack.systemConnectionAuthentication?.type === AuthenticationType.HeaderBearerToken);
      const {postSetup} = pack.systemConnectionAuthentication;
      assert.ok(postSetup);
      // Make sure we converted the shorthand function into a full formula def.
      assert.ok(postSetup?.[0].getOptions!.name);
      assert.ok(postSetup?.[0].getOptions!.execute);
    });
  });

  describe('does not re-normalize input schemas', () => {
    it('in formulas', () => {
      const formulaAttributes: ObjectFormulaDef<ParamDefs, GenericObjectSchema> = {
        name: 'formula1',
        description: '',
        parameters: [],
        resultType: ValueType.Object,
        schema: dummyObjectSchema,
        execute: () => ({}),
      };
      pack.addFormula({...formulaAttributes});
      pack.addFormula({...formulaAttributes, name: 'formula2'});
    });

    it('in sync tables', () => {
      // We don't re-use dummyObjectSchema because it has an identity.
      const schema = makeObjectSchema({
        id: 'foo',
        primary: 'foo',
        properties: {
          foo: {type: ValueType.String},
        },
      });
      const tableAttributes: SyncTableOptions<string, string, ParamDefs, GenericObjectSchema> = {
        name: 'table1',
        identityName: 'table1',
        schema,
        formula: {
          name: 'formula',
          description: '',
          parameters: [],
          execute: async () => ({result: []}),
        },
      };
      pack.addSyncTable({...tableAttributes});
      pack.addSyncTable({...tableAttributes, name: 'table2', identityName: 'table2'});
    });

    it('in dynamic sync tables (placeholder schema)', () => {
      // We don't re-use dummyObjectSchema because it has an identity.
      const schema = makeObjectSchema({
        id: 'foo',
        primary: 'foo',
        properties: {
          foo: {type: ValueType.String},
        },
      });
      const tableAttributes: DynamicSyncTableOptions<string, string, ParamDefs, GenericObjectSchema> = {
        name: 'table1',
        identityName: 'table1',
        placeholderSchema: schema,
        getDisplayUrl: makeMetadataFormula(async () => 'display-url'),
        getName: makeMetadataFormula(async () => 'name'),
        getSchema: makeMetadataFormula(async () => schema),
        formula: {
          name: 'formula',
          description: '',
          parameters: [],
          execute: async () => ({result: []}),
        },
      };
      pack.addDynamicSyncTable({...tableAttributes});
      pack.addDynamicSyncTable({...tableAttributes, name: 'table2', identityName: 'table2'});
    });
  });
});
