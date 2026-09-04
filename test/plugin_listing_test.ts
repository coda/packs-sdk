import './test_helper';
import type {PluginListing} from '../plugin/listing';
import {PluginListingError} from '../plugin/listing';
import {formatPluginPublishPlan} from '../plugin/listing';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {planPluginPublish} from '../plugin/listing';
import {scaffoldPlugin} from '../plugin/listing';

describe('Plugin listing spike', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-spike-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, {recursive: true, force: true});
  });

  function writePlugin(root: string, listing: PluginListing): string {
    const componentDirectories = new Set(
      Object.values(listing.components).map(component => path.dirname(component.manifest)),
    );
    for (const directory of componentDirectories) {
      fs.mkdirSync(path.join(root, directory), {recursive: true});
    }
    for (const component of Object.values(listing.components)) {
      fs.writeFileSync(path.join(root, component.manifest), 'export const pack = {};\n');
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
        agent: {type: 'agent', manifest: 'agent/pack.ts', uses: []},
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
    assert.deepEqual(listing.components.connector.usedBy, ['agent']);
  });

  it('plans a bundle as two uploads plus an allowlist, not one fused pack', () => {
    const root = path.join(tmpDir, 'radical-candor');
    scaffoldPlugin(root, 'radical-candor');
    const plan = planPluginPublish(path.join(root, 'plugin.json'));

    assert.equal(plan.uploads.length, 2);
    assert.equal(plan.uploads[0].kind, 'agent');
    assert.equal(plan.uploads[1].kind, 'connector');
    assert.deepEqual(plan.connectorPolicies, [
      {connector: 'connector', visibility: 'private', allowedConsumers: ['agent']},
    ]);
    assert.deepEqual(plan.installBindings, [{agent: 'agent', connector: 'connector'}]);
    assert.equal(plan.setup, 'SETUP.md');
    assert.equal(plan.starterPromptCount, 1);
    assert.equal(plan.positiveTestCount, 1);
    assert.equal(plan.negativeTestCount, 1);

    const rendered = formatPluginPublishPlan(plan);
    assert.match(rendered, /Phase 1: validate, create, and upload each pack/);
    assert.match(rendered, /Phase 2: resolve component names to pack ids and apply connector policy/);
    assert.match(rendered, /Phase 3: register install-time connector attachments/);
    assert.match(rendered, /Phase 4: publish the plugin listing/);
  });

  it('rejects a private connector with no allowlist', () => {
    const root = path.join(tmpDir, 'broken');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'private',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.uses = ['connector'];
    }
    const pluginJsonPath = writePlugin(root, listing);

    try {
      planPluginPublish(pluginJsonPath);
      assert.fail('expected PluginListingError');
    } catch (err: unknown) {
      assert.instanceOf(err, PluginListingError);
      assert.match((err as Error).message, /does not allow|usedBy/);
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
      agent.uses = ['gmail'];
    }
    const pluginJsonPath = writePlugin(root, listing);

    const plan = planPluginPublish(pluginJsonPath);
    assert.deepEqual(plan.connectorPolicies, [{connector: 'gmail', visibility: 'public', allowedConsumers: []}]);
  });

  it('allows Harvey-shaped two connectors without fusing auths', () => {
    const root = path.join(tmpDir, 'harvey');
    const listing = baseListing();
    listing.name = 'harvey';
    listing.displayName = 'Harvey';
    listing.components['chat-api'] = {
      type: 'connector',
      manifest: 'chat-api/pack.ts',
      visibility: 'private',
      usedBy: ['agent'],
    };
    listing.components.mcp = {
      type: 'connector',
      manifest: 'mcp/pack.ts',
      visibility: 'public',
    };
    const agent = listing.components.agent;
    if (agent.type === 'agent') {
      agent.uses = ['chat-api', 'mcp'];
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

  it('rejects a public connector with a private allowlist', () => {
    const root = path.join(tmpDir, 'broken-public');
    const listing = baseListing();
    listing.components.connector = {
      type: 'connector',
      manifest: 'connector/pack.ts',
      visibility: 'public',
      usedBy: ['agent'],
    };
    const pluginJsonPath = writePlugin(root, listing);

    assert.throws(() => planPluginPublish(pluginJsonPath), /cannot set usedBy/);
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
