---
nav: Overview
description: A quick introduction to what Packs are and how they work.
cSpell:words: add-ons
---

# What are Packs?

_A Pack is an extension that adds new powers to Superhuman._

What other platforms call plugins, add-ons, or extensions, we call "Packs". A Pack is how you extend Superhuman with your own code, adding new features or integrating it with other applications.

Anyone can build a Pack, and you can use it yourself, share it with your team, or publish it to the world. Packs are built using our TypeScript SDK, uploaded to our servers, and run within Superhuman products.


## What can a Pack deliver?

A Pack is a container for the things you want to add to Superhuman, and what your users get depends on what you put inside it. Today a Pack delivers one thing, a connector, and we'll be adding more over time.

### Connectors

A connector extends Superhuman with new capabilities, most often by integrating with an external application or service.

The following Superhuman products support connectors today:

- **:superhuman-go: Go** — The connector gives Go tools and knowledge it can use to answer questions and complete tasks.
- **:superhuman-docs: Docs** — The connector adds new building blocks that you use directly in a doc to build something more powerful.

A single connector serves both products. If you already have a Pack built for :superhuman-docs: Docs, see the [Superhuman Go guide][migration_go] for how to make it work well in :superhuman-go: Go.

A connector is assembled from building blocks, which support different features and usage patterns in each product.

| Building block | What it does | :superhuman-go: Go | :superhuman-docs: Docs |
| --- | --- | :-: | :-: |
| [MCP][mcp] | Connect to a hosted MCP server and expose its tools | :material-check: | |
| [Skills][skills] | Guide the LLM through a specific task or type of question | :material-check: | |
| [Formulas][formulas] | Calculate a value or pull in data from an external source | :material-check: | :material-check: |
| [Actions][actions] | Create, update, or delete data in an external application | :material-check: | :material-check: |
| [Sync tables][sync_tables] | Pull in a large set of records and keep them up to date | :material-check: | :material-check: |
| [Cards][cards] | Display structured data as rich cards and mentions | | :material-check: |
| [Column formats][column_formats] | Change how values in a table column are displayed | | :material-check: |


## How do Packs work?

Each Pack is its own [serverless application][wikipedia_serverless], fully managed and run by the platform. A Pack is a different shape from a typical web application, and much of what you would normally build or operate yourself is handled for you.

| Aspect | How it works in a Pack |
| --- | --- |
| **Hosting** | Fully managed and serverless. You upload a version and the platform runs it. |
| **Language and runtime** | TypeScript, executed in a sandbox compatible with the [ES2022 standard][mdn_ecmascript]. Browser and Node globals like `window` and `fs` aren't available. |
| **Dependencies** | Install [npm libraries][libraries] when building with the CLI. Many aren't compatible with the custom runtime or network interface. |
| **User interface** | Packs don't ship their own UI. Building blocks appear through each product's existing interfaces, which affects how you [design][design] them. |
| **Data access** | A Pack only receives the parameters that the building block asked for, and can't otherwise read a user's data in Superhuman. |
| **Storage** | Packs are stateless and have no database of their own. [Sync table][sync_tables] records are stored by Superhuman, and everything else stays in the API you connect to. |
| **Authentication** | Declare the [type of authentication][authentication] your API needs, and the platform runs the sign-in flow, stores the tokens, and applies them to your requests. Your code never sees the raw credentials. Users connect an account once and it's available to them in every product. |
| **Networking** | Outbound HTTP through the built-in [fetcher][fetcher], which handles encoding and attaches credentials automatically. |
| **Caching** | HTTP responses and tool results are [cached][caching] by default, with a TTL you control. |
| **Logging** | Every execution is [logged][logging], scoped to a chat session or doc, and kept for about two weeks. |
| **Testing** | Run building blocks on your own machine with the CLI, or [test][testing] a version live before releasing it. |


## Who can use a Pack?

A Pack is private to you until you decide otherwise. You can keep it for your own use, share it with your team, or [publish it][publishing] so that anyone can install it. Publishing publicly involves a review first, after which your Pack is listed in the [Superhuman Docs Gallery][gallery_packs] and the [Superhuman Go Store][go_store], where users can discover and install it.


## How do you build a Pack?

Packs are written in TypeScript, and you can build them with your own toolchain or entirely in the browser.

Most developers work locally with the [command line tool][cli], using the editor, tooling, and version control they already have. You can run your connector on your own machine to verify it's working, then upload a new version to the Superhuman servers.

The [Pack Studio][quickstart_web] is a browser-based alternative that bundles the editor, build, and deploy steps together, with nothing to install. It's a quick way to prototype, and a Pack that starts there can be moved into a local project later.

Either way, there's a library of [sample Packs][samples] covering every major part of the SDK, and a [community][community] of Pack makers to ask when you get stuck.

[Get started with the CLI][quickstart_cli]{ .md-button .md-button--primary }
[Get started in the browser][quickstart_web]{ .md-button }



[community]: https://connect.superhuman.com/c/developers-central/making-packs/15
[quickstart_web]: ../tutorials/get-started/web.md
[quickstart_cli]: ../tutorials/get-started/cli.md
[cli]: ../development/cli.md
[samples]: ../samples/index.md
[authentication]: basics/authentication/index.md
[publishing]: ../development/publishing.md
[libraries]: ../development/libraries.md
[design]: design.md
[fetcher]: basics/fetcher.md
[caching]: advanced/caching.md
[logging]: ../development/logging.md
[testing]: ../development/testing.md
[go_store]: https://superhuman.com/store/connectors
[wikipedia_serverless]: https://en.wikipedia.org/wiki/Serverless_computing
[mdn_ecmascript]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Language_Resources
[formulas]: blocks/formulas.md
[actions]: blocks/actions.md
[column_formats]: blocks/column-formats.md
[sync_tables]: blocks/sync-tables/index.md
[skills]: blocks/skills.md
[mcp]: blocks/mcp.md
[cards]: blocks/cards.md
[migration_go]: ../support/migration/superhuman-go.md
[gallery_packs]: https://docs.superhuman.com/gallery?filter=packs
