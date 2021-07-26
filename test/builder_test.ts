import './test_helper';
import {AuthenticationType} from '../types';
import {ConnectionRequirement} from '../api_types';
import type {DynamicSyncTableDef} from '../api';
import type {MetadataFormulaDef} from '../api';
import type {PackDefinitionBuilder} from '../builder';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {ValueType} from '../schema';
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
    {connectionRequirement, parameters}: {connectionRequirement?: ConnectionRequirement; parameters?: ParamDefs} = {},
  ) {
    pack_.addSyncTable({
      name: 'Foos',
      identityName: 'Foo',
      connectionRequirement,
      schema: makeObjectSchema({
        type: ValueType.Object,
        id: 'foo',
        primary: 'foo',
        properties: {foo: {type: ValueType.String}},
      }),
      formula: {
        name: 'Ignored',
        description: '',
        parameters: parameters || [],
        execute: async () => {
          return {result: []};
        },
      },
    });
  }

  function addDummyDynamicSyncTable(
    pack_: PackDefinitionBuilder,
    {
      connectionRequirement,
      getName,
      getSchema,
      getDisplayUrl,
      listDynamicUrls,
    }: {
      connectionRequirement?: ConnectionRequirement;
      getName: MetadataFormulaDef;
      getSchema: MetadataFormulaDef;
      getDisplayUrl: MetadataFormulaDef;
      listDynamicUrls: MetadataFormulaDef;
    },
  ) {
    pack_.addDynamicSyncTable({
      name: 'Foos',
      connectionRequirement,
      getName,
      getSchema,
      getDisplayUrl,
      listDynamicUrls,
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

    it('works for dynamic sync table metadata formulas', () => {
      pack.setUserAuthentication({
        type: AuthenticationType.HeaderBearerToken,
        defaultConnectionRequirement: ConnectionRequirement.Optional,
      });
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name'),
        getDisplayUrl: makeMetadataFormula(async () => 'display-url'),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema})),
        listDynamicUrls: makeMetadataFormula(async () => ['url']),
      });
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any>;
      assert.equal(syncTable.getName.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getDisplayUrl.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.getSchema.connectionRequirement, ConnectionRequirement.Optional);
      assert.equal(syncTable.listDynamicUrls!.connectionRequirement, ConnectionRequirement.Optional);
    });

    it('works for dynamic sync table metadata formulas after the fact', () => {
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name'),
        getDisplayUrl: makeMetadataFormula(async () => 'display-url'),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema})),
        listDynamicUrls: makeMetadataFormula(async () => ['url']),
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
    });

    // This is demonstrating a quirk of setDefaultConnectionRequirement()
    // documented in the lengthy comment in that method. We don't about
    // supporting the behavior in this test, it's simply demonstarting that
    // it occurs, and perhaps one day we can eliminate the behavior and
    // remove this test.
    it('unfortunate behavior that default connection requirement overrides explicit connection requirement on dynamic sync table formulas', () => {
      addDummyDynamicSyncTable(pack, {
        getName: makeMetadataFormula(async () => 'name', {connectionRequirement: ConnectionRequirement.None}),
        getDisplayUrl: makeMetadataFormula(async () => 'display-url', {
          connectionRequirement: ConnectionRequirement.None,
        }),
        getSchema: makeMetadataFormula(async () => makeSchema({type: ValueType.Array, items: dummyObjectSchema}), {
          connectionRequirement: ConnectionRequirement.None,
        }),
        listDynamicUrls: makeMetadataFormula(async () => ['url'], {connectionRequirement: ConnectionRequirement.None}),
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
    });
  });
});
