---
nav: MCP connector
description: Learn how to list an MCP server as a connector for Superhuman Go.
icon: material/connection
hide:
- toc
cSpell:words: Streamable
---

# Learn to connect an MCP server to Superhuman Go

If an app already hosts an MCP server, you can easily create a connector for it in :superhuman-go: Go. The connector describes where the server is located and how to connect to it, requiring only a few lines of code.

!!! abstract "Goal"
    Package the Todoist MCP server as a connector, and use its tools in :superhuman-go: Go.

No previous tutorial is required, but you will need a Superhuman account with:

- A [Pro plan][pricing] or higher, to install and use the connector in :superhuman-go: Go.
- [Doc Maker access][hc_doc_maker] in your :superhuman-docs: Docs workspace, to create the Pack.

There are two options for how to build the Pack in this tutorial, with a tab for each:

- **:octicons-terminal-16: CLI** — Work locally with the `packs` command line tool. Assumes you're comfortable in a terminal with `npm`.
- **:octicons-browser-16: Pack Studio** — Work entirely in the browser, with nothing to install.


## :material-magnify: Gather information about the MCP server

A connector is a thin wrapper around the MCP server, so start by pinning down what the server offers and what it requires. Before writing any code, gather three things:

- **Endpoint URL** — The URL of the server's [Streamable HTTP][mcp_transport] endpoint. Todoist publishes theirs [in their developer docs][todoist_mcp] as `https://ai.todoist.net/mcp`.
- **Authentication** — How the server identifies the user. Todoist uses OAuth2 with [dynamic client registration (DCR)][oauth2_dcr], which is common for MCP servers and means you don't have to register an application or manage client credentials yourself.
- **Tools** — The tools the server exposes. The connector passes them through as-is, so this list is effectively the feature set of your connector.

!!! tip "Manually testing a server"

    Before writing your connector code, it can be useful to manually connect to the MCP server to better understand the requirements above. The open source [MCP Inspector][mcp_inspector] is a useful tool for this.

    ```sh
    npx @modelcontextprotocol/inspector
    ```

    Enter the MCP server's information and ensure you can successfully connect. See the [compatibility section][mcp_compatibility] of the MCP guide for the full list of what is supported on this platform.


## :material-crane: Set up the project

=== ":octicons-terminal-16: CLI"

    Building with the CLI requires `node`, `npm`, and `git`.

    1.  Create a directory for the connector and initialize the project.

        ```sh
        mkdir todoist-connector
        cd todoist-connector
        npm init --yes
        npm install --save @codahq/packs-sdk
        ```

        The SDK bundles the `packs` CLI along with the libraries used to build a Pack.

    1.  Scaffold the files for a new Pack.

        ```sh
        npx packs init
        ```

        This creates a `pack.ts` with some starter code, which you'll replace in the next section.

    1.  Register an API token, which the CLI uses to talk to the platform.

        ```sh
        npx packs register
        ```

        You'll be prompted to generate a token in your browser and paste it back into the terminal. The token is saved to `.coda.json`, and only needs to be done once per directory.

    1.  Create the empty Pack that will hold the connector.

        ```sh
        npx packs create pack.ts --name "Todoist Tutorial"
        ```

        This prints the Pack Studio URL and writes the new Pack's ID to `.coda-pack.json`.

=== ":octicons-browser-16: Pack Studio"

    The Pack Studio is the code editor built into Superhuman Docs, and there's nothing to install.

    1.  [Create a new Pack][navigation_create_pack]{ data-preview }.

    1.  Choose to start from scratch rather than from one of the examples.

    1.  Click the Pack name **Untitled Pack** in the upper left and change it to "Todoist Tutorial".


## :fontawesome-solid-laptop-code: Write the code

The code is the same either way. In the CLI replace the contents of `pack.ts`, and in the Pack Studio replace the contents of the editor. Build it up one step at a time.

=== ":material-numeric-1-circle: Add the boilerplate"

    <section class="tutorial-row" markdown>
    <div markdown>

    Start with the import of the SDK and the Pack definition that everything else attaches to.

    </div>
    <div markdown>

    ```ts
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();
    ```

    </div>
    </section>


=== ":material-numeric-2-circle: Add the MCP server"

    <section class="tutorial-row" markdown>
    <div markdown>

    Register the server with `addMCPServer()`, passing the endpoint URL you found earlier.

    The `name` is an internal identifier used to namespace the server's tools. It isn't shown to users, and must contain only letters, numbers, and underscores.

    A connector can only connect to a single MCP server. Users who need to work across multiple apps install multiple connectors.

    </div>
    <div markdown>

    ```{.ts hl_lines="4-7"}
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();

    pack.addMCPServer({
      name: "Todoist",
      endpointUrl: "https://ai.todoist.net/mcp",
    });
    ```

    </div>
    </section>


=== ":material-numeric-3-circle: Add the authentication"

    <section class="tutorial-row" markdown>
    <div markdown>

    Declare that the server uses OAuth2 with DCR. Because the platform registers the client and discovers the authorization and token endpoints on its own, there's nothing else to configure — no client ID, no secret, and no URLs.

    `useProofKeyForCodeExchange` enables [PKCE][oauth2_pkce], which modern OAuth2 providers generally require.

    Servers that don't support DCR need their OAuth URLs spelled out in code, and client credentials uploaded manually. See the [MCP guide][mcp_auth] for how to handle that case.

    </div>
    <div markdown>

    ```{.ts hl_lines="9-13"}
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();

    pack.addMCPServer({
      name: "Todoist",
      endpointUrl: "https://ai.todoist.net/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.OAuth2,
      useDynamicClientRegistration: true,
      useProofKeyForCodeExchange: true,
    });
    ```

    </div>
    </section>


=== ":material-numeric-4-circle: Declare the network domain"

    <section class="tutorial-row" markdown>
    <div markdown>

    MCP requests go through the [fetcher][fetcher], so the domain has to be declared in advance like any other outbound traffic.

    The server lives on the subdomain `ai.todoist.net`, but declare the root domain `todoist.net` to leave room for calling other endpoints later.

    </div>
    <div markdown>

    ```{.ts hl_lines="15"}
    import * as sdk from "@codahq/packs-sdk";
    export const pack = sdk.newPack();

    pack.addMCPServer({
      name: "Todoist",
      endpointUrl: "https://ai.todoist.net/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.OAuth2,
      useDynamicClientRegistration: true,
      useProofKeyForCodeExchange: true,
    });

    pack.addNetworkDomain("todoist.net");
    ```

    </div>
    </section>

---

!!! warning "MCP can't be tested locally"

    The CLI's `packs execute` command can be used to run a Pack locally, but it currently doesn't support MCP servers or DCR. Currently the only way to test the code is to upload it and run it in :superhuman-go: Go.


## :material-cloud-upload: Upload & release

The code needs to be uploaded and released before it can be installed, which takes two steps: creating a version from your code, and then releasing that version.

=== ":octicons-terminal-16: CLI"

    1.  Upload a version containing your code.

        ```sh
        npx packs upload pack.ts
        ```

    1.  Release that version.

        ```sh
        npx packs release pack.ts --notes "Initial version."
        ```

=== ":octicons-browser-16: Pack Studio"

    1.  Click the **Build** button in the bottom left.

        This checks your code for errors and creates a new version. It can take a few seconds to complete.

    1.  Click the **Release** button to release the version you just built.

!!! info "Making further changes"

    By default, an installed connector will use the latest release of your code. That means every code change needs a new version *and* a new release before you'll see it in :superhuman-go: Go.

    That can feel tedious when iterating early on, so you can instead switch the connector to use the latest **version**, which picks up each new build without a release. See the [versioning guide][versions_in_use] for instructions on how to change that setting.


## :superhuman-go: Try it in Go

The connector now exists on the platform, so it's time to install it and see what the tools actually do.

=== ":material-numeric-1-circle: Find the connector"

    <section class="tutorial-row" markdown>
    <div markdown>

    Open [Superhuman Go][go_home] and click **Connectors** in the side panel.

    Find **Todoist Tutorial** in the list of connectors available to you and click on it.

    </div>
    <div markdown>

    <img src="site:images/tutorial_mcp_search.png" srcset="site:images/tutorial_mcp_search_2x.png 2x" class="screenshot" alt="Searching for the connector in Go">

    </div>
    </section>


=== ":material-numeric-2-circle: Install the connector"

    <section class="tutorial-row" markdown>
    <div markdown>

    Click the **Sign in** button to begin the installation process.

    </div>
    <div markdown>

    <img src="site:images/tutorial_mcp_signin.png" srcset="site:images/tutorial_mcp_signin_2x.png 2x" class="screenshot" alt="Begin the signin process.">

    </div>
    </section>


=== ":material-numeric-3-circle: Connect your account"

    <section class="tutorial-row" markdown>
    <div markdown>

    Sign in to your Todoist account and approve the connector to access your data.

    </div>
    <div markdown>

    <img src="site:images/tutorial_mcp_authorize.png" srcset="site:images/tutorial_mcp_authorize_2x.png 2x" class="screenshot" alt="Authorizing access to your Todoist account">

    </div>
    </section>


=== ":material-numeric-4-circle: Ask Go to use a tool"

    <section class="tutorial-row" markdown>
    <div markdown>

    Start a new chat and ask for something that only Todoist can answer, such as:

    ```
    List my Todoist tasks.
    ```

    It should call the appropriate tool in the MCP server and respond back with information from your account.

    </div>
    <div markdown>

    <img src="site:images/tutorial_mcp_tasks.png" srcset="site:images/tutorial_mcp_tasks_2x.png 2x" class="screenshot" alt="Go listing your tasks in Todoist.">

    </div>
    </section>


=== ":material-numeric-5-circle: Try an action"

    <section class="tutorial-row" markdown>
    <div markdown>

    Now ask for something that changes data:

    ```
    Add a task to pick up the laundry tomorrow.
    ```

    Go should ask for you to confirm the action before running it.

    A tool is treated as an action unless the server marks it with the `readOnlyHint` annotation, so most write tools get a confirmation prompt automatically. If read-only tools are also prompting for confirmation, that annotation is missing on the server.

    </div>
    <div markdown>

    <img src="site:images/tutorial_mcp_create_task.png" srcset="site:images/tutorial_mcp_create_task_2x.png 2x" class="screenshot" alt="Confirming an action before it runs">

    </div>
    </section>


!!! info "Troubleshooting with logs"

    If the connector couldn't reach the MCP server, or Go had trouble calling a tool, the [connector logs][logging_connector] have the details. They show each tool call with its arguments, the response that came back, and any errors along the way.

    To view them, open the [connector's settings screen][navigation_connector_go]{ data-preview } and click **Session logs**.


## :material-fast-forward: Next steps

Now that you have an MCP server running as a connector, here are some more resources you can explore:

- [MCP guide][mcp_guide] - The supported transports, features, and authentication options in more detail.
- [Sample code][samples_mcp] - See more examples of working MCP connectors.
- [Skills guide][skills] - How to add a prompt that tells Go when to reach for your connector's tools, and how the app's concepts map to what users ask for.
- [Publishing guide][publishing] - How to list your connector in the Superhuman Store so others can install it.


[mcp_transport]: https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#streamable-http
[todoist_mcp]: https://developer.todoist.com/mcp
[oauth2_dcr]: ../../guides/basics/authentication/oauth2.md#dcr
[oauth2_pkce]: ../../guides/basics/authentication/oauth2.md#proof-key-for-code-exchange-pkce
[mcp_inspector]: https://github.com/modelcontextprotocol/inspector
[hc_doc_maker]: https://help.coda.io/hc/en-us/articles/39556004184077-Roles-in-Coda-Doc-Makers-Admins-and-Editors
[navigation_create_pack]: ../../support/navigation.md#create-pack
[pricing]: https://superhuman.com/pricing
[mcp_compatibility]: ../../guides/blocks/mcp.md#compatibility
[mcp_auth]: ../../guides/blocks/mcp.md#authentication
[fetcher]: ../../guides/basics/fetcher.md
[go_home]: https://go.superhuman.com
[navigation_connector_go]: ../../support/navigation.md#connector-go
[versions_in_use]: ../../development/versions.md#which-version-is-in-use
[logging_connector]: ../../development/logging.md#connector-logs
[skills]: ../../guides/blocks/skills.md
[mcp_guide]: ../../guides/blocks/mcp.md
[samples_mcp]: ../../samples/topic/mcp.md
[publishing]: ../../development/publishing.md
