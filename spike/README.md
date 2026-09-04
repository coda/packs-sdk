# Plugin packaging spike

A plugin is a listing that composes existing packs. Each pack keeps its own id, authentication, version, and review lifecycle.

This follows the boundary used by [OpenAI plugins](https://developers.openai.com/plugins/deploy/submission) and [Anthropic plugins](https://claude.com/docs/plugins/overview): the plugin packages a workflow while connectors remain independently governed capabilities.

## Layout (same as `modules/packs/packs/`)

One repository can contain several pack folders:

```
radical-candor/
  plugin.json          versioned listing and install graph
  SETUP.md             connection instructions
  agent/pack.ts        agent behavior
  connector/pack.ts    network and authentication
```

Both `coda add plugin radical-candor` and `coda plugin create radical-candor` write that tree.

`coda plugin validate radical-candor/plugin.json` checks the manifest, references, privacy rules, and local files.

`coda plugin plan radical-candor/plugin.json` prints a staged publish plan. It makes no network calls.

## Manifest

`plugin.json` uses stable component names instead of pack ids. Publishing resolves those names after the platform creates or links each pack:

```json
{
  "schemaVersion": 1,
  "entrypoints": ["agent"],
  "components": {
    "agent": {
      "type": "agent",
      "manifest": "agent/pack.ts",
      "uses": ["feedback-api"]
    },
    "feedback-api": {
      "type": "connector",
      "manifest": "connector/pack.ts",
      "visibility": "private",
      "usedBy": ["agent"]
    }
  }
}
```

The full example also includes:

- `setup`, modeled after Anthropic's `SETUP.md`
- `starterPrompts`, required as submission material by OpenAI
- positive and negative `testCases`, so review expectations travel with the plugin

Packs SDK already supports skills and MCP servers. This spike adds the missing composition and submission metadata rather than defining those features twice.

## Publish contract

The plan has three phases:

1. Validate, create, and upload every pack independently.
2. Resolve component names to pack ids and apply connector visibility and allowlists.
3. Register which connectors the agent receives at install time.
4. Publish the plugin listing after every dependency succeeds.

The CLI only prints this plan because the server lacks an atomic plugin-publish endpoint. Running the current upload command in a loop would leave partial releases when a later upload or policy update fails.

## Deferred features

Anthropic also packages commands, sub-agents, and hooks. OpenAI supports app templates and UI. Those need Go runtime and review contracts, so this SDK-only spike does not invent inert manifest fields for them.

## Commands (local)

From this checkout, after `pnpm exec tsc` (or `npx ts-node`):

```
npx ts-node cli/index.ts add plugin radical-candor
npx ts-node cli/index.ts plugin validate radical-candor/plugin.json
npx ts-node cli/index.ts plugin plan radical-candor/plugin.json
```
