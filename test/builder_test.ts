import './test_helper';
import type {AgentDefinitionBuilder} from '../builder';
import {AuthenticationType} from '../types';
import {BaseDefinitionBuilder} from '../builder';
import {ConnectionRequirement} from '../api_types';
import {ContextualTriggerAssistMode} from '../types';
import {ContextualTriggerSurface} from '../types';
import type {DynamicSyncTableDef} from '../api';
import type {DynamicSyncTableOptions} from '../api';
import type {ExternalPackVersionMetadata} from '../compiled_types';
import type {GenericObjectSchema} from '../schema';
import {KnowledgeToolSourceType} from '../types';
import type {MetadataFormulaDef} from '../api';
import type {ObjectFormulaDef} from '../api';
import type {ObjectSchema} from '../schema';
import {PackDefinitionBuilder} from '../builder';
import type {PackVersionDefinition} from '../types';
import type {ParamDefs} from '../api_types';
import {ParameterType} from '../api_types';
import {PostSetupType} from '..';
import type {Skill} from '../types';
import type {StringPackFormula} from '../api';
import type {SyncTableOptions} from '../api';
import {ToolType} from '../types';
import {ValueHintType} from '..';
import {ValueType} from '../schema';
import {assertCondition} from '..';
import {compilePackMetadata} from '../helpers/metadata';
import {makeMetadataFormula} from '../api';
import {makeObjectSchema} from '../schema';
import {makeParameter} from '../api';
import {makeSchema} from '../schema';
import {newAgent} from '../builder';
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
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any, any, any>;
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
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any, any, any>;
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
      const syncTable = pack.syncTables[0] as DynamicSyncTableDef<any, any, any, any, any, any>;
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
      const tableAttributes: SyncTableOptions<string, string, ParamDefs, GenericObjectSchema, any, any> = {
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
      const tableAttributes: DynamicSyncTableOptions<string, string, ParamDefs, GenericObjectSchema, any, any> = {
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

  describe('skills', () => {
    let skill: Skill;
    beforeEach(() => {
      skill = {
        name: 'MySkill',
        displayName: 'My Display Name',
        description: 'My description.',
        prompt: 'My prompt',
        tools: [{type: ToolType.Knowledge, source: {type: KnowledgeToolSourceType.Global}}],
      };
    });

    it('adds skills', () => {
      pack.addSkill(skill);
      assert.equal(pack.skills.length, 1);
      assert.deepEqual(pack.skills[0], skill);
    });

    it('sets chat skill', () => {
      const chatSkill: Skill = {
        name: 'DefaultChat',
        displayName: 'Chat',
        description: 'Default chat experience.',
        prompt: 'You are an expert in this pack.',
        tools: [{type: ToolType.Pack}],
      };
      pack.setChatSkill(chatSkill);
      assert.deepEqual(pack.chatSkill, chatSkill);
    });

    it('sets chat skill with contact resolution tool', () => {
      const chatSkill: Skill = {
        name: 'DefaultChat',
        displayName: 'Chat',
        description: 'Default chat experience.',
        prompt: 'You are an expert in this pack.',
        tools: [{type: ToolType.Pack}, {type: ToolType.ContactResolution}],
      };
      pack.setChatSkill(chatSkill);
      assert.deepEqual(pack.chatSkill, chatSkill);
      assert.equal(pack.chatSkill?.tools?.length, 2);
    });

    it('sets bench initialization skill', () => {
      const benchSkill: Skill = {
        name: 'BenchInit',
        displayName: 'Bench Initialization',
        description: 'Initializes the agent in the bench.',
        prompt: 'You are initializing...',
        tools: [{type: ToolType.Pack}],
      };
      pack.setBenchInitializationSkill(benchSkill);
      assert.deepEqual(pack.benchInitializationSkill, benchSkill);
    });

    it('sets skill entrypoints (deprecated)', () => {
      pack.setSkillEntrypoints({
        benchInitialization: {skillName: skill.name},
        defaultChat: {skillName: skill.name},
      });
      assert.deepEqual(pack.skillEntrypoints, {
        benchInitialization: {skillName: skill.name},
        defaultChat: {skillName: skill.name},
      });
    });
  });

  describe('instructions support', () => {
    it('accepts instructions on addFormula()', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'WithInstructions',
        description: 'desc',
        instructions: 'formula-instructions',
        parameters: [],
        execute: () => '',
      });
      assert.equal((pack.formulas[0] as any).instructions, 'formula-instructions');
    });

    it('accepts instructions on parameters', () => {
      pack.addFormula({
        resultType: ValueType.String,
        name: 'ParamInstructions',
        description: 'desc',
        parameters: [
          makeParameter({
            type: ParameterType.String,
            name: 'p',
            description: 'param',
            instructions: 'param-instructions',
          }),
        ],
        execute: () => '',
      });
      assert.equal((pack.formulas[0].parameters[0] as any).instructions, 'param-instructions');
    });
  });
});

describe('Agent builder', () => {
  let agent: AgentDefinitionBuilder;

  beforeEach(() => {
    agent = newAgent();
  });

  it('declares itself before it has any content', () => {
    // The definition's presence is what marks this as an agent.
    assert.deepEqual(agent.agent, {tools: []});
  });

  it('sets instructions', () => {
    agent.setInstructions('You help a team run async standups.');
    assert.deepEqual(agent.agent, {tools: [], instructions: 'You help a team run async standups.'});
  });

  it('keeps the last instructions set', () => {
    agent.setInstructions('First.').setInstructions('Second.');
    assert.deepEqual(agent.agent, {tools: [], instructions: 'Second.'});
  });

  it('survives compilePackMetadata rather than being stripped', () => {
    agent.setInstructions('You help a team run async standups.').setVersion('1.0.0');
    const metadata = compilePackMetadata(agent as unknown as PackVersionDefinition);
    assert.deepEqual(metadata.agent, {tools: [], instructions: 'You help a team run async standups.'});
  });

  it('does not add a agent field to an ordinary pack', () => {
    const metadata = compilePackMetadata(newPack().setVersion('1.0.0') as PackVersionDefinition);
    assert.isUndefined(metadata.agent);
  });

  it('compiles with no connector building blocks of its own', () => {
    agent.setInstructions('You help a team run async standups.').setVersion('1.0.0');
    const metadata = compilePackMetadata(agent as unknown as PackVersionDefinition);
    assert.deepEqual(metadata.formulas, []);
    assert.deepEqual(metadata.syncTables, []);
    assert.deepEqual(metadata.formats, []);
    assert.isUndefined(metadata.networkDomains);
    assert.isUndefined(metadata.defaultAuthentication);
  });

  describe('tools', () => {
    it('starts with an empty tool list rather than no list at all', () => {
      agent.setInstructions('Do a thing.');
      assert.deepEqual(agent.agent.tools, []);
    });

    it('builds a tool for each capability turned on', () => {
      agent.setTools({docs: true, mail: true, webSearch: {allowedDomains: ['docs.example.com']}});
      assert.deepEqual(agent.agent.tools, [
        {type: ToolType.WebSearch, allowedDomains: ['docs.example.com']},
        {type: ToolType.CodaDocsAndTables},
        {type: ToolType.MailAndCalendar},
      ]);
    });

    it('leaves out what was left out', () => {
      agent.setTools({docs: true});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.CodaDocsAndTables}]);
    });

    it('treats false the same as absent', () => {
      agent.setTools({docs: true, mail: false});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.CodaDocsAndTables}]);
    });

    it('takes web search without a domain restriction', () => {
      agent.setTools({webSearch: true});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.WebSearch}]);
    });

    it('keeps an empty domain list, so validation can tell the author it is wrong', () => {
      agent.setTools({webSearch: {allowedDomains: []}});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.WebSearch, allowedDomains: []}]);
    });

    it('adds a connector pack', () => {
      agent.setTools({connectors: [{packId: 1234}]});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.Pack, packId: 1234}]);
    });

    it('limits a connector to specific formulas', () => {
      agent.setTools({connectors: [{packId: 1234, formulas: [{formulaName: 'CreateTask'}]}]});
      assert.deepEqual(agent.agent.tools, [
        {type: ToolType.Pack, packId: 1234, formulas: [{formulaName: 'CreateTask'}]},
      ]);
    });

    it('takes more than one connector', () => {
      agent.setTools({connectors: [{packId: 1}, {packId: 2}]});
      assert.deepEqual(agent.agent.tools, [
        {type: ToolType.Pack, packId: 1},
        {type: ToolType.Pack, packId: 2},
      ]);
    });

    it('puts connectors after the built-in tools, the way the in-app builder does', () => {
      agent.setTools({docs: true, webSearch: true, mail: true, connectors: [{packId: 1234}]});
      assert.deepEqual(agent.agent.tools, [
        {type: ToolType.WebSearch},
        {type: ToolType.CodaDocsAndTables},
        {type: ToolType.MailAndCalendar},
        {type: ToolType.Pack, packId: 1234},
      ]);
    });

    it('keeps the last call', () => {
      agent.setTools({mail: true}).setTools({docs: true});
      assert.deepEqual(agent.agent.tools, [{type: ToolType.CodaDocsAndTables}]);
    });

    it('takes everything off again', () => {
      agent.setTools({docs: true}).setTools({});
      assert.deepEqual(agent.agent.tools, []);
    });

    it('leaves instructions alone', () => {
      agent.setInstructions('Do a thing.').setTools({docs: true});
      assert.deepEqual(agent.agent, {instructions: 'Do a thing.', tools: [{type: ToolType.CodaDocsAndTables}]});
    });

    it('carries tools through compilePackMetadata', () => {
      agent.setInstructions('Do a thing.').setTools({docs: true}).setVersion('1.0.0');
      const metadata = compilePackMetadata(agent as unknown as PackVersionDefinition);
      assert.deepEqual(metadata.agent, {
        instructions: 'Do a thing.',
        tools: [{type: ToolType.CodaDocsAndTables}],
      });
    });
  });

  describe('default while-writing trigger', () => {
    const contextualTrigger = {condition: 'Offer a citation when the user asserts a statistic', enabled: true};

    it('has none until one is set', () => {
      agent.setInstructions('Do a thing.');
      assert.isUndefined(agent.defaultTriggers);
    });

    it('sets a trigger', () => {
      agent.setDefaultWhileWritingTrigger(contextualTrigger);
      assert.deepEqual(agent.defaultTriggers, {contextualTrigger});
    });

    it('takes assist mode and surfaces', () => {
      agent.setDefaultWhileWritingTrigger({
        ...contextualTrigger,
        assistMode: ContextualTriggerAssistMode.OnDemand,
        surfaces: [ContextualTriggerSurface.Docs, ContextualTriggerSurface.Email],
      });
      assert.deepEqual(agent.defaultTriggers, {
        contextualTrigger: {
          ...contextualTrigger,
          assistMode: ContextualTriggerAssistMode.OnDemand,
          surfaces: [ContextualTriggerSurface.Docs, ContextualTriggerSurface.Email],
        },
      });
    });

    it('keeps the last call', () => {
      agent
        .setDefaultWhileWritingTrigger({...contextualTrigger, enabled: false})
        .setDefaultWhileWritingTrigger(contextualTrigger);
      assert.deepEqual(agent.defaultTriggers, {contextualTrigger});
    });

    it('leaves the agent definition alone', () => {
      agent.setInstructions('Do a thing.').setDefaultWhileWritingTrigger(contextualTrigger);
      assert.deepEqual(agent.agent, {instructions: 'Do a thing.', tools: []});
    });

    it('carries through compilePackMetadata', () => {
      agent.setInstructions('Do a thing.').setDefaultWhileWritingTrigger(contextualTrigger).setVersion('1.0.0');
      const metadata = compilePackMetadata(agent as unknown as PackVersionDefinition);
      assert.deepEqual(metadata.defaultTriggers, {contextualTrigger});
    });

    it('does not add a defaultTriggers field to an ordinary pack', () => {
      const metadata = compilePackMetadata(newPack().setVersion('1.0.0') as PackVersionDefinition);
      assert.isUndefined(metadata.defaultTriggers);
    });
  });

  describe('withheld surface', () => {
    it('is not reachable through the types', () => {
      // Checked by tsc, not at runtime: if one of these stops being an error, the directive
      // above it becomes the error and the build fails. Never actually called.
      function checkedByTscOnly(builder: AgentDefinitionBuilder) {
        // @ts-expect-error only newAgent() can stamp an agent
        newPack({agent: {instructions: 'x'}});
        // @ts-expect-error nor can the builder be constructed with one
        new PackDefinitionBuilder({agent: {instructions: 'x'}});
        // @ts-expect-error the browser-facing metadata must not carry the instructions
        (undefined as unknown as ExternalPackVersionMetadata).agent!.instructions;
        // @ts-expect-error connector building blocks are not authorable on an agent
        builder.addFormula({});
        // @ts-expect-error nor are their fields
        builder.formulas.push();
        // @ts-expect-error an agent takes no seed definition
        newAgent({formulas: []});
        // @ts-expect-error MCP belongs on a connector packId, not as a top-level boolean
        builder.setTools({mcp: true});
        // @ts-expect-error only newAgent() can stamp default triggers
        newPack({defaultTriggers: {}});
      }
      assert.isFunction(checkedByTscOnly);
    });

    it('is not reachable at runtime either', () => {
      // Enumerated rather than hardcoded, so a method added to PackDefinitionBuilder later
      // can't quietly become reachable on an agent.
      const packOnly = Object.getOwnPropertyNames(PackDefinitionBuilder.prototype).filter(
        name => name !== 'constructor' && !name.startsWith('_'),
      );
      const reachable = packOnly.filter(name => (agent as any)[name] !== undefined);
      assert.deepEqual(reachable, [], 'nothing pack-only is reachable on an agent');
    });

    it('shares nothing else through the base class', () => {
      assert.deepEqual(
        Object.getOwnPropertyNames(BaseDefinitionBuilder.prototype).filter(name => name !== 'constructor'),
        ['setVersion'],
      );
    });
  });
});
