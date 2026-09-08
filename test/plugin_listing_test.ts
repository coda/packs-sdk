import './test_helper';
import type {PackVersionMetadata} from '../compiled_types';
import type {PluginListing} from '../plugin/listing';
import {PluginListingError} from '../plugin/listing';
import {formatPluginPublishPlan} from '../plugin/listing';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {planPluginPublish} from '../plugin/listing';
import {scaffoldPlugin} from '../plugin/listing';
import {validatePluginComponentMetadata} from '../plugin/listing';
import {validatePluginComponentType} from '../plugin/listing';

describe('Plugin listing', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-listing-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, {recursive: true, force: true});
  });

  function writePlugin(root: string, listing: PluginListing): string {
    const componentDirectories = new Set(
      Object.values(listing.components).map(component =>
        path.dirname(
          component.type === 'agent' || component.type === 'connector' ? component.manifest : component.path,
        ),
      ),
    );
    for (const directory of componentDirectories) {
      fs.mkdirSync(path.join(root, directory), {recursive: true});
    }
    for (const component of Object.values(listing.components)) {
      const componentPath =
        component.type === 'agent' || component.type === 'connector' ? component.manifest : component.path;
      fs.writeFileSync(path.join(root, componentPath), 'export const pack = {};\n');
    }
    if (listing.setup) {
      fs.writeFileSync(path.join(root, listing.setup), '# Setup\n');
    }
    const pluginJsonPath = path.join(root, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(listing));
    return pluginJsonPath;
  }

  function baseListing(): PluginListing {
    return {
      schemaVersion: 1,
      name: 'example',
      displayName: 'Example',
      description: 'An example plugin.',
      entrypoints: ['agent'],
      components: {
        agent: {type: 'agent', manifest: 'agent/pack.ts', uses: [], skills: []},
      },
      starterPrompts: [],
      testCases: {positive: [], negative: []},
    };
  }

  it('scaffolds two pack folders and a plugin.json', () => {
    const root = path.join(tmpDir, 'radical-candor');
    scaffoldPlugin(root, 'radical-candor');

    assert.isTrue(fs.existsSync(path.join(root, 'plugin.json')));
    assert.isTrue(fs.existsSync(path.join(root, 'SETUP.md')));
    assert.isTrue(fs.existsSync(path.join(root, 'agent', 'pack.ts')));
    assert.isTrue(fs.existsSync(path.join(root, 'connector', 'pack.ts')));

    const listing = JSON.parse(fs.readFileSync(path.join(root, 'plugin.json'), 'utf8'));
    assert.equal(listing.schemaVersion, 1);
    assert.deepEqual(listing.entrypoints, ['agent']);
    assert.equal(listing.components.agent.manifest, 'agent/pack.ts');
    assert.equal(listing.components.connector.visibility, 'private');
    assert.deepEqual(listing.components.agent.uses, [
      {component: 'connector', formulas: [{formulaName: 'GetFeedback'}]},
    ]);
    assert.deepEqual(listing.components.agent.skills, []);
  });

  it('plans two Pack uploads plus an allowlist', () => {
    const root = path.join(tmpDir, 'radical-candor');
    scaffoldPlugin(root, 'radical-candor');
    const plan = planPluginPublish(path.join(root, 'plugin.json'));

    assert.equal(plan.uploads.length, 2);
    assert.equal(plan.uploads[0].kind, 'connector');
    assert.equal(plan.uploads[1].kind, 'agent');
    assert.deepEqual(plan.connectorPolicies, [
      {connector: 'connector', visibility: 'private', allowedConsumers: ['agent']},
    ]);
    assert.deepEqual(plan.installBindings, [
      {agent: 'agent', connector: 'connector', formulas: [{formulaName: 'GetFeedback'}]},
    ]);
    assert.equal(plan.setup, 'SETUP.md');
    assert.equal(plan.starterPromptCount, 1);
    assert.equal(plan.positiveTestCount, 1);
    assert.equal(plan.negativeTestCount, 1);

    const rendered = formatPluginPublishPlan(plan);
    assert.match(rendered, /Phase 1: validate every pack and the composition graph/);
    assert.match(rendered, /Phase 2: create and upload connectors/);
    assert.match(rendered, /Phase 3: materialize connector pack ids in agent tools/);
    assert.match(rendered, /Phase 4: apply connector policy and list deferred attachments/);
    assert.match(rendered, /Phase 5: publish the plugin listing/);
  });

  it('requires agent components to use newAgent metadata', () => {
    const listing = baseListing();
    const component = listing.components.agent;
    const agentMetadata = {
      version: '1',
      formulas: [],
      formats: [],
      syncTables: [],
      agent: {instructions: 'Help the user.', tools: []},
    };
    const connectorMetadata = {version: '1', formulas: [], formats: [], syncTables: []};

    assert.doesNotThrow(() => validatePluginComponentType('agent', component, agentMetadata));
    assert.throws(
      () => validatePluginComponentType('agent', component, connectorMetadata as PackVersionMetadata),
      /declared as agent.*defines a connector/,
    );
  });

  it('rejects a private connector that no agent uses', () => {
    const root = path.join(tmpDir, 'broken');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'private',
    };
    const pluginJsonPath = writePlugin(root, listing);

    try {
      planPluginPublish(pluginJsonPath);
      assert.fail('expected PluginListingError');
    } catch (err: unknown) {
      assert.instanceOf(err, PluginListingError);
      assert.match((err as Error).message, /must be used by an agent component/);
    }
  });

  it('allows an agent plus a public connector (SH Mail shape)', () => {
    const root = path.join(tmpDir, 'sh-mail');
    const listing = baseListing();
    listing.name = 'sh-mail';
    listing.displayName = 'SH Mail';
    listing.components.gmail = {
      type: 'connector',
      manifest: 'gmail/pack.ts',
      visibility: 'public',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.uses = [{component: 'gmail'}];
    }
    const pluginJsonPath = writePlugin(root, listing);

    const plan = planPluginPublish(pluginJsonPath);
    assert.deepEqual(plan.connectorPolicies, [{connector: 'gmail', visibility: 'public', allowedConsumers: []}]);
  });

  it('keeps a Harvey-shaped agent, API connector, and MCP connector as separate Packs', () => {
    const root = path.join(tmpDir, 'harvey');
    const listing = baseListing();
    listing.name = 'harvey';
    listing.displayName = 'Harvey';
    listing.components['chat-api'] = {
      type: 'connector',
      manifest: 'chat-api/pack.ts',
      visibility: 'private',
    };
    listing.components.mcp = {
      type: 'connector',
      manifest: 'mcp/pack.ts',
      visibility: 'public',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.uses = [{component: 'chat-api'}, {component: 'mcp'}];
    }
    const pluginJsonPath = writePlugin(root, listing);

    const plan = planPluginPublish(pluginJsonPath);
    assert.equal(plan.uploads.length, 3);
    assert.equal(plan.uploads.filter(step => step.kind === 'connector').length, 2);
    assert.deepEqual(plan.installBindings, [
      {agent: 'agent', connector: 'chat-api'},
      {agent: 'agent', connector: 'mcp'},
    ]);
  });

  it('rejects duplicate connector references from one agent', () => {
    const root = path.join(tmpDir, 'duplicate-connector');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.uses = [{component: 'connector'}, {component: 'connector'}];
    }
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /reference each connector only once/);
  });

  it('allows a connector-only plugin', () => {
    const root = path.join(tmpDir, 'connector-only');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    delete listing.components.agent;
    listing.entrypoints = ['connector'];
    const pluginJsonPath = writePlugin(root, listing);

    const plan = planPluginPublish(pluginJsonPath);
    assert.deepEqual(plan.entrypoints, ['connector']);
  });

  it('attaches one skill to multiple agents and keeps files out of uploads', () => {
    const root = path.join(tmpDir, 'shared-skill');
    const listing = baseListing();
    listing.components['second-agent'] = {
      type: 'agent',
      manifest: 'second-agent/pack.ts',
      uses: [],
      skills: ['review'],
    };
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'private',
    };
    listing.components.review = {
      type: 'skill',
      path: 'skills/review.md',
      uses: ['connector'],
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.skills = ['review'];
    }
    const pluginJsonPath = writePlugin(root, listing);

    const plan = planPluginPublish(pluginJsonPath);
    assert.equal(plan.uploads.length, 3);
    assert.deepEqual(plan.skillAttachments, [
      {
        skill: 'review',
        path: 'skills/review.md',
        agents: ['agent', 'second-agent'],
        connectors: ['connector'],
      },
    ]);
    assert.deepEqual(plan.connectorPolicies, [
      {connector: 'connector', visibility: 'private', allowedConsumers: ['agent', 'second-agent']},
    ]);
  });

  it('rejects agent skills that reference a non-skill component', () => {
    const root = path.join(tmpDir, 'invalid-agent-skill');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.skills = ['connector'];
    }
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /skills can only reference skill components/);
  });

  it('rejects duplicate skill references from one agent', () => {
    const root = path.join(tmpDir, 'duplicate-skill');
    const listing = baseListing();
    listing.components.review = {
      type: 'skill',
      path: 'skills/review.md',
      uses: [],
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.skills = ['review', 'review'];
    }
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /Component references must be unique/);
  });

  it('rejects skill uses that reference an agent', () => {
    const root = path.join(tmpDir, 'invalid-skill-use');
    const listing = baseListing();
    listing.components.review = {
      type: 'skill',
      path: 'skills/review.md',
      uses: ['agent'],
    };
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /Skill review can only use connector components/);
  });

  it('detects MCP on connector metadata and defers its UI file', () => {
    const root = path.join(tmpDir, 'mcp-ui');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    listing.components['review-card'] = {
      type: 'ui',
      path: 'ui/review.html',
      for: ['connector'],
    };
    const pluginJsonPath = writePlugin(root, listing);
    const connectorMetadata = {
      version: '1',
      formulas: [],
      formats: [],
      syncTables: [],
      mcpServers: [{name: 'review', endpointUrl: 'https://example.com/mcp'}],
    } as PackVersionMetadata;

    const plan = planPluginPublish(pluginJsonPath, {connector: connectorMetadata});
    assert.deepEqual(plan.mcpConnectors, ['connector']);
    assert.deepEqual(plan.deferredUi, [{ui: 'review-card', path: 'ui/review.html', connectors: ['connector']}]);
    assert.match(formatPluginPublishPlan(plan), /connector: MCP-capable connector/);
    assert.match(formatPluginPublishPlan(plan), /review-card: ui\/review.html; UI deferred for connector/);
  });

  it('rejects UI for a connector without MCP servers', () => {
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    listing.components.ui = {
      type: 'ui',
      path: 'ui/index.html',
      for: ['connector'],
    };
    const connectorMetadata = {
      version: '1',
      formulas: [],
      formats: [],
      syncTables: [],
    } as PackVersionMetadata;

    assert.throws(
      () => validatePluginComponentMetadata(listing, {connector: connectorMetadata}),
      /can only reference connectors that define MCP servers/,
    );
  });

  it('rejects a missing skill file', () => {
    const root = path.join(tmpDir, 'missing-skill');
    const listing = baseListing();
    listing.components.review = {
      type: 'skill',
      path: 'skills/review.md',
      uses: [],
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.skills = ['review'];
    }
    fs.mkdirSync(path.join(root, 'agent'), {recursive: true});
    fs.writeFileSync(path.join(root, 'agent/pack.ts'), 'export const pack = {};\n');
    const pluginJsonPath = path.join(root, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(listing));

    assert.throws(() => planPluginPublish(pluginJsonPath), /File for review is missing/);
  });

  it('rejects a missing UI file', () => {
    const root = path.join(tmpDir, 'missing-ui');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
    };
    listing.components.ui = {
      type: 'ui',
      path: 'ui/index.html',
      for: ['connector'],
    };
    fs.mkdirSync(path.join(root, 'agent'), {recursive: true});
    fs.mkdirSync(path.join(root, 'connector'), {recursive: true});
    fs.writeFileSync(path.join(root, 'agent/pack.ts'), 'export const pack = {};\n');
    fs.writeFileSync(path.join(root, 'connector/pack.ts'), 'export const pack = {};\n');
    const pluginJsonPath = path.join(root, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(listing));

    assert.throws(() => planPluginPublish(pluginJsonPath), /File for ui is missing/);
  });

  it('rejects a missing entrypoint component', () => {
    const root = path.join(tmpDir, 'broken-entrypoint');
    const listing = baseListing();
    listing.entrypoints = ['missing'];
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /Entrypoint does not exist: missing/);
  });

  it('rejects manifest paths outside the plugin directory', () => {
    const root = path.join(tmpDir, 'unsafe-path');
    fs.mkdirSync(root, {recursive: true});
    const listing = baseListing();
    listing.components.agent = {
      type: 'agent',
      manifest: '../pack.ts',
      uses: [],
      skills: [],
    };
    const pluginJsonPath = path.join(root, 'plugin.json');
    fs.writeFileSync(pluginJsonPath, JSON.stringify(listing));

    assert.throws(() => planPluginPublish(pluginJsonPath), /cannot leave the plugin directory/);
  });

  it('rejects duplicate prompt names', () => {
    const root = path.join(tmpDir, 'duplicate-prompts');
    const listing = baseListing();
    listing.starterPrompts = [
      {name: 'review', prompt: 'Review this draft.'},
      {name: 'review', prompt: 'Review this proposal.'},
    ];
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /Duplicate starter prompt name: review/);
  });
});
