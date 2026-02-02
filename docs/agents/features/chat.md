---
nav: Chat
description: Learn how to customize the chat experience for your agent.
---

# Shape your agent's chat responses

Users can chat with agents in the Superhuman Go side panel, which is often the primary way to access their features.

<img src="site:images/agent_chat.png" srcset="site:images/agent_chat_2x.png 2x" alt="A screenshot of chatting with an agent." class="screenshot">

Chat is enabled for all agents, with no code or configuration required. You can customize how your agent responds by defining [skills][skills] for specific scenarios or overriding the [chat skill][chatskill] that all messages are initially routed through.


## Formatting

The LLM is instructed to generate chat responses in markdown format, and the chat UI supports a limited subset of the [markdown specification][markdown_spec]. Some differences worth noting are:

- All headings (h1-h6) are rendered the same size.
- Mixing HTML content is not supported (it will be escaped).
- Images are only rendered for tool-sourced URLs. See the [Images](#images) section below.
- Block quotes are rendered as a [copyable block](#copyable-block).


## Images {:#images}

Chat replies can include images, which will be automatically scaled to fit the width of the side panel.

<img src="site:images/agent_image.png" srcset="site:images/agent_image_2x.png 2x" alt="A screenshot of chat response containing an image." class="screenshot">

For security reasons, images will only be rendered if the URL is either:

- Returned by a formula and annotated as an image.
- Hosted on one of the declared network domains.
- A data URI (starts with the `data:` scheme).

See the sections below to learn more.


### Annotated formula result

When using a formula as a tool, ensure any image URLs returned are correctly annotated with either the [`ImageAttachment`][hinttype_imageattachment] or [`ImageReference`][hinttype_imagereference] hint. This is done by specifying the `codaType` of the formula or schema property.

=== "Returning an image"

    ```{.ts hl_lines="9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    pack.addFormula({
      name: "DogPhoto",
      description: "Gets a random photo of a dog.",
      parameters: [],
      resultType: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      cacheTtlSecs: 0,
      execute: async function (args, context) {
        let response = await context.fetcher.fetch({
          method: "GET",
          url: "https://dog.ceo/api/breeds/image/random",
          cacheTtlSecs: 0,
        });
        return response.body.message;
      },
    });
    ```

=== "Returning a schema"

    ```{.ts hl_lines="9"}
    import * as coda from "@codahq/packs-sdk";
    export const pack = coda.newPack();

    const PokemonSchema = coda.makeObjectSchema({
      properties: {
        name: { type: coda.ValueType.String },
        sprite: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.ImageReference,
        },
      },
      displayProperty: "name",
    });

    pack.addFormula({
      name: "Pokemon",
      description: "Gets information about a Pokemon.",
      parameters: [
        coda.makeParameter({
          type: coda.ParameterType.String,
          name: "nameOrId",
          description: "The name or ID of the Pokemon to lookup.",
        }),
      ],
      resultType: coda.ValueType.Object,
      schema: PokemonSchema,
      execute: async function (args, context) {
        let [nameOrId] = args;
        let response = await context.fetcher.fetch({
          method: "GET",
          url: `https://pokeapi.co/api/v2/pokemon/${nameOrId}`,
        });
        let data = response.body;
        return {
          ...data,
          sprite: data.sprites.front_default,
        };
      },
    });
    ```

!!! info "Images scanned and served by Superhuman"

    Images annotated this way will not be served directly; instead, they will be uploaded to Superhuman's CDN. As part of that process, they will undergo a security scan and may be rejected if deemed dangerous.


### Matching network domain {:#image-network-domain}

There are times when it isn't possible to annotate images in tool responses:

- A formula is returning image URLs embedded in either `Html` or `Markdown` text.
- An MCP tool is returning an image.

In these cases, you'll need to ensure that the domain of the image matches one of the declared [network domains][network_domains], or is a subdomain of one of them.

Some apps host images on a CDN at a separate domain; in that case, you'll need to declare multiple domains, which [requires approval][support_approvals]. If your agent uses authentication, you'll also need to specify which domains to send credentials to via the `networkDomain` field.

```{.ts hl_lines="12-14 19-20"}
import * as coda from "@codahq/packs-sdk";
export const pack = coda.newPack();

pack.addMCPServer({
  name: "GitHub",
  endpointUrl: "https://api.githubcopilot.com/mcp/",
});

// Register the domain where the MCP server is hosted.
pack.addNetworkDomain("githubcopilot.com");

// Register additional domains where images are hosted.
pack.addNetworkDomain("github.com");
pack.addNetworkDomain("githubusercontent.com");

pack.setUserAuthentication({
  type: coda.AuthenticationType.HeaderBearerToken,
  instructionsUrl: "https://github.com/settings/tokens",
  // Only send credentials to the MCP server.
  networkDomain: ["githubcopilot.com"]
});
```


### Data URI

Images that aren't hosted on the web but are embedded in the image URL can be displayed without additional configuration. These URLs start with the `data:` scheme, and typically contain the image as a base64-encoded string.

```txt title="Example Data URI"
data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgLz48L3N2Zz4=
```


## Copyable blocks {:#copyable-block}

Agents often generate content for use outside Superhuman Go, such as summaries and replies. To make it easier for users to grab this content, you can instruct the agent to place it in a copyable block. This block is visually indicated and includes buttons to easily copy its contents to the clipboard or insert them at the user's cursor location.

<img src="site:images/agent_copyable_block.png" srcset="site:images/agent_copyable_block_2x.png 2x" alt="A screenshot of chat response containing a copyable block." class="screenshot">

To display content in a copyable block, instruct the LLM to return it formatted as a block quote.

```ts
pack.addSkill({
  name: "Poem",
  displayName: "Generate a poem",
  description: "Using the text on screen, generates a poem.",
  prompt: `
    Look at the text on the user's screen.
    Use it to generate a poem.
    Reply with a short, friendly message, the poem in block quotes,
    and then one sentence follow-up asking if they would like any changes.
  `,
  tools: [],
});
```

Images are always displayed within a copyable block, so no additional instructions are required.

!!! tip "Prefer screen annotations when modifying existing text"

    Copyable blocks work well when generating new content. However, if your agent is adjusting text the user has already written a better user experience can be achieved by using screen annotations. These display on top of the user's existing text and can be accepted or rejected individually. See the [Tools guide][tools] for more information.


[skills]: ./skills.md
[chatskill]: ./skills.md#default-chat-skill
[skillmodels]: ./skills.md#models
[markdown_spec]: https://spec.commonmark.org/current/
[hinttype_imageattachment]: ../../reference/sdk/core/enumerations/ValueHintType.md#imageattachment
[hinttype_imagereference]: ../../reference/sdk/core/enumerations/ValueHintType.md#imagereference
[tools]: ./tools.md#screen-annotation-tools
[network_domains]: ../../guides/basics/fetcher.md#network-domains
[support_approvals]: ../../support/index.md#approvals
