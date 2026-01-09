---
nav: Chat
description: Learn how to customize the chat experience for your agent.
---

# Shape your agent's chat responses

Users can chat with agents in the Superhuman Go side panel, and this is often a primary way to access their features.

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

For security reasons, only images returned by a tool will be rendered. Ensure that image URLs are annotated with either the hint type [`ImageAttachment`][hinttype_imageattachment] or [`ImageReference`][hinttype_imagereference] in the schema or formula.

```{.ts hl_lines="6"}
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

!!! info "Images scanned and served by Superhuman"

    Images annotated this way will not be served directly, but instead uploaded to Superhuman's CDN. As part of that process, they will go through a security scanner and may be rejected if they are deemed dangerous.


## Copyable blocks {:#copyable-block}

Agents often generate content for use outside Superhuman Go, such as summaries and replies. To make it easier for users to grab this content, you can instruct the agent put it into a copyable block. This block is visually indicated and includes buttons to easily copy its contents to the clipboard or insert them at the user's cursor location.

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
    Reply with a short friendly message, the poem in block quotes,
    and then one sentence follow-up asking if they would like any changes.
  `,
  tools: [],
});
```

Images are always displayed within a copyable block, so no additional instructions are required for an image.

!!! tip "Prefer screen annotations when modifying existing text"

    Copyable blocks work well when generating new content. However, if your agent is adjusting text the user has already written a better user experience can be achieved by using screen annotations. These display on top of the user's existing text and can be accepted or rejected individually. See the [Tools guide][tools] for more information.


[skills]: ./skills.md
[chatskill]: ./skills.md#default-chat-skill
[skillmodels]: ./skills.md#models
[markdown_spec]: https://spec.commonmark.org/current/
[hinttype_imageattachment]: ../../reference/sdk/core/enumerations/ValueHintType.md#imageattachment
[hinttype_imagereference]: ../../reference/sdk/core/enumerations/ValueHintType.md#imagereference
[tools]: ./tools.md#screen-annotation-tools
