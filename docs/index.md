---
nav: Home
description: Extend Superhuman with your own code, creating connectors to external data and actions.
hide:
  - navigation
  - toc
---

# Build Packs for Superhuman

A Pack is a plugin for Superhuman, allowing you to extend the user experience with your own code.

Packs are primarily used to build connectors, which allow users to bring another application's data and actions into the products where they work.

Build once, and the same Pack will work across :superhuman-go: Go and :superhuman-docs: Docs.

<section class="landing-row" markdown>

<div class="landing-item" markdown>
## Bring your MCP server to Go

Superhuman Go supports the MCP standard, so any app that hosts a server can plug straight in. MCP servers are distributed as connectors, and once installed Go can access all of the tools they provide.

Creating a connector for your MCP server is simple, often requiring as little as a dozen lines of code. When it's ready, you can publish it to the store so anyone can discover and install it.

[List your MCP][mcp_tutorial]{ .md-button .md-button--primary }
</div>

<div class="landing-item" markdown>
<video style="width:auto" loop muted autoplay alt="Using MCP tools in Superhuman Go" class="screenshot"><source src="site:images/go_mcp.mp4" type="video/mp4"></source></video>
</div>

</section>

<br>

## What you can build

<section class="box-row" markdown>

<div class="box-item" markdown>
### :material-toolbox: Build tools for any REST API

 Not every app has an MCP server, but most have a REST API. Write your own tools hosted on our servers and available in Superhuman Go just like MCP tools.

[Build a custom tool][tutorial_fetcher]{ .md-button }
</div>

<div class="box-item" markdown>
### :material-text-box-search: Answer questions from your data

Sync your records into the knowledge layer and Superhuman Go can search them, cite them, and answer from them in the middle of a conversation.

[Build a sync table][tutorial_sync]{ .md-button }
</div>

<div class="box-item" markdown>
### :material-plus-box: Extend what a doc can do

 Create custom formulas and sync tables that fit right into the Superhuman Docs experience. Users work with your app's data and actions without leaving their doc.

[Building blocks][blocks_table]{ .md-button }
</div>

</section>

<br>

## Let's see the code

A Pack is a TypeScript file containing metadata and logic. Each of these is a complete, working connector.

=== "Connect to MCP server"

    ```ts
    --8<-- "samples/packs/todoist/mcp.ts"
    ```

=== "Create custom tools"

    ```ts
    --8<-- "samples/packs/todoist/action_simple.ts"
    ```

=== "Sync records"

    ```ts
    --8<-- "samples/packs/todoist/sync_table_simple.ts"
    ```

[Browse all samples][samples]{ .md-button }

<br>

## Start building

<section class="box-row" markdown>

<div class="box-item" markdown>
### :octicons-terminal-16: Command line tool

Develop on your own machine with the editor, tooling, and version control you already use. Run your connector locally, then upload a version when you're ready.

[Get started with the CLI][quickstart_cli]{ .md-button .md-button--primary }
</div>

<div class="box-item" markdown>
### :material-application-braces-outline: Pack Studio

Write, build, and deploy from your browser with nothing to install. A quick way to prototype, and you can move to a local project later.

[Build in the browser][quickstart_web]{ .md-button }
</div>

<div class="box-item" markdown>
### :material-school-outline: Tutorials

Step-by-step lessons that go further than a quickstart, walking you through core features of the SDK and the most common use cases.

[Browse tutorials][tutorials]{ .md-button }
</div>

</section>

<br>

<section class="landing-row landing-row-reverse" markdown>

<div class="landing-item" markdown>
## :fontawesome-regular-lightbulb: See what others have built.

Connectors are listed in the [Superhuman Go Store][store] and the [Superhuman Docs Gallery][gallery], where anyone can install them. Try a few to get a feel for what yours could do.

[Browse the Store][store]{ .md-button }
</div>

<div class="landing-item" markdown>
<img src="site:images/store_connectors.png" srcset="site:images/store_connectors_2x.png 2x" class="screenshot" alt="Connectors listed in the Superhuman Go Store.">
</div>

</section>

<br>

Stuck, or want to see it done first? There's a [library of videos][videos] walking through the basics, and a [community][community] of developers happy to answer questions.


[overview]: guides/overview.md
[quickstart_cli]: tutorials/get-started/cli.md
[quickstart_web]: tutorials/get-started/web.md
[samples]: samples/index.md
[tutorials]: tutorials/index.md
[community]: https://connect.superhuman.com/c/developers-central/making-packs/15
[videos]: tutorials/videos.md
[gallery]: https://docs.superhuman.com/gallery?filter=packs
[store]: https://superhuman.com/store/connectors
[sync_tables]: guides/blocks/sync-tables/index.md
[formulas]: guides/blocks/formulas.md
[blocks_table]: guides/overview.md#connectors
[mcp]: guides/blocks/mcp.md
[tutorial_fetcher]: tutorials/build/fetcher.md
[tutorial_sync]: tutorials/build/sync-table.md
[mcp_tutorial]: tutorials/build/mcp.md
