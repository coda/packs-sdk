---
date: 2026-08-19
slug: agents-are-connectors
description: Packs now surface as connectors rather than agents, and agents are built in the new agent builder.
authors:
  - eric.koleda
categories:
  - Updates
---

# Your agent is now a connector

When Superhuman Go launched, every Pack was an agent. It defined both the instructions that shaped the agent's behavior and the tools it used to access users' data. However, we found that the approach didn't scale to more complex use cases, where an agent needs to work across multiple applications and services.

With the [1.0 launch][go_10] we changed the way Packs work in Go. Instead of agents, Packs now surface as [connectors][overview_connectors]. A connector provides tools, data, and skills that can be used across the platform, and agents compose them together to solve problems.

No code changes are required, and your existing agents have been converted into connectors. Some agent-specific parts of the SDK have been deprecated, and skills now work a little differently.


## SDK changes

You cannot chat directly with a connector, and therefore a number of SDK features no longer make sense. The following methods have been deprecated, and no longer have any effect:

- [`setChatSkill()`][set_chat_skill]
- [`setBenchInitializationSkill()`][set_bench_skill]
- [`addSuggestedPrompt()`][add_suggested_prompt]

[Skills][skills] are still supported, but the way they're used has changed. The LLM loads them as needed, using their descriptions to determine if they fit the task at hand. A skill's `tools` no longer limit what the LLM can call, but rather act as a suggestion of what to load. If a chat or bench initialization skill contained instructions still worth having, consider migrating them to [`addSkill()`][add_skill] instead.


## How to build agents now

Agents are now built in the [agent builder][builder], a UI for defining agents, available directly within Go. Agents built there have capabilities that weren't possible before:

- **Triggers** — An agent can run automatically on a schedule, when a user is typing, or from a Slack message.
- **Multiple connectors** — An agent can use as many connectors as it needs, making it possible to solve a workflow that spans several applications.

Together these make it possible to build proactive agents like Grammarly, on a custom set of connectors that bring in the data and actions your users need.


## What's next

We still want to enable developers to define agents via code, and over the coming months we'll be extending the SDK to support this new style of agent. For now, keep building connectors to the applications you care about, and prototype agents using the builder.


[go_10]: https://blog.superhuman.com/go-1-0/
[overview_connectors]: ../../guides/overview.md#connectors
[set_chat_skill]: ../../reference/sdk/core/classes/PackDefinitionBuilder.md#setchatskill
[set_bench_skill]: ../../reference/sdk/core/classes/PackDefinitionBuilder.md#setbenchinitializationskill
[add_suggested_prompt]: ../../reference/sdk/core/classes/PackDefinitionBuilder.md#addsuggestedprompt
[skills]: ../../guides/blocks/skills.md
[add_skill]: ../../reference/sdk/core/classes/PackDefinitionBuilder.md#addskill
[builder]: https://go.superhuman.com/builder
