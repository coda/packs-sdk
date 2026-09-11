# Experimental plugin packaging

A plugin is a `plugin.json` listing that composes existing Packs and optional files. It does not create a new Pack type or merge agent and connector Packs.

Each Pack keeps its own ID, version, authentication, review, and upload. The listing names components and their relationships:

- `agent`: a `newAgent()` Pack
- `connector`: a `newPack()` Pack that owns formulas, auth, sync tables, connector skills, and MCP servers
- `skill`: a markdown file attached to agents through `agent.skills`
- `ui`: an optional file associated with an MCP-capable connector

## Commands

From the repository root, after `pnpm exec tsc`:

```sh
npx ts-node cli/index.ts add plugin my-plugin
npx ts-node cli/index.ts plugin validate examples/plugins/radical-candor/plugin.json
npx ts-node cli/index.ts plugin plan examples/plugins/radical-candor/plugin.json
npx ts-node cli/index.ts plugin plan examples/plugins/radical-candor/plugin.json --output json
```

`add plugin` creates an agent Pack, a private connector Pack, setup instructions, and a listing. Optional skill and UI files are added only when a plugin needs them.
Running the same scaffold command again is a no-op when the existing listing is valid and has the same name.

`plugin validate` validates the listing graph, checks every referenced file, and runs normal Pack validation for agent and connector Packs.

`plugin plan` prints the intended publication flow without changing server state:

1. Upload connectors and resolve their Pack IDs.
2. Materialize connector IDs in agent tools, then upload agents.
3. Apply connector policy.
4. List attached skills and deferred UI.
5. Publish the listing after the Pack operations succeed.

All three commands accept `--output json` for scripts and agents. Use each subcommand's `--help` for its inputs and examples.

Only Packs are uploadable today. Installing listing skills and UI, resolving component names to Pack IDs, and publishing the composition atomically require server and runtime support.

## Examples

- `radical-candor/` shows an agent-owned review skill that uses a private feedback connector.
- `harvey-assistant/` keeps an agent, a private Harvey REST connector (files, streaming, Vault), and Harvey's hosted MCP connector as separate Packs.

The schema and plan are implemented in [`../../plugin/listing.ts`](../../plugin/listing.ts).
