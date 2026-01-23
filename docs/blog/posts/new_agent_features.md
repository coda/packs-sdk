---
date: 2026-01-22
slug: new-agent-features
description: A rundown of the new agent features added to the SDK since the closed beta launched.
authors:
  - eric.koleda
categories:
  - Updates
---

# Seven new SDk features for building better agents

Since the initial launch of Superhuman Go in late October, we've been busy improving the platform, including adding new features for agent developers. Here's a quick rundown of what's new:

- [MCP support][mcp] - We've turned the agent platform into an MCP client, allowing your agent to use the tools exposed by an MCP server. This makes it possible to build the initial version of your agent in only a few lines of code.
- [Bench initialization][bench_initialization] - While the name of this feature is a mouthful, the idea is simple: allow the agent to start working as soon as the user has clicked on its icon in the bench. A bench initialization skill can kick off the most common user flow, show help text, or just say hi!
- [Copyable blocks][copyable_blocks] - Wrap generated content in a blockquote to make it easy to copy or insert into other applications.
- [Agent logs][agent_logs] - Developers can see detailed logs for each interaction with an agent they create, to enable better debugging.
- [Parameter validation][parameter_validation] - For agents indexing data into the knowledge layer, add parameter validation to your sync tables to ensure that users enter valid settings before kicking off the indexing process.

We've also worked to make it easier for legacy Packs to be upgraded to agents, with these new features:

- [Ingestion suggested values][suggested_values] - Provide an alternate suggestion value for a parameter to be used in the agent setup screen.
- [Invocation source][invocation_source] - Determine if your sync table is being run in Superhuman Go vs Coda, to adjust the logic, etc.


[mcp]: ../../agents/features/mcp.md
[bench_initialization]: ../../agents/features/skills.md#bench
[copyable_blocks]: ../../agents/features/chat.md#copyable-block
[agent_logs]: ../../agents/troubleshooting.md#agent-logs
[parameter_validation]: ../../guides/basics/parameters/index.md#validation
[suggested_values]: ../../agents/upgrade.md#alternate-suggested-parameter-values
[invocation_source]: ../../agents/upgrade.md#source-application-detection
