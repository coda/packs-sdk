---
nav: Skills
description: Define optional instructions the LLM can load to perform specific tasks in your connector.
---

# Define skills for your connector

!!! go "Go only"

    Skills are only supported in :superhuman-go: Go.

A skill is an optional set of instructions that guides the LLM on how to perform a specific task or handle a particular type of user question. Skills aren't all loaded at once; instead, the LLM reads each skill's description and chooses to load the ones that are useful to the task at hand. You aren't required to add skills to your connector, but they can help the LLM perform more reliably and deliver a better experience to users.


## Skill definition

To define a skill you need to include metadata like a name and description, a prompt to direct the LLM, and a set of [tools][tools] it should use.

```ts
pack.addSkill({
  // Unique identifier, internal only.
  name: "SecretPassword",

  // User-visible display name (shown in the connector listing).
  displayName: "Secret password",

  // Description of the skill. Used by the LLM to decide whether to
  // load it, and is potentially user-visible.
  description: "Gives the user the secret password.",

  // A prompt that instructs the LLM how to perform the task, internal-only.
  prompt: `
    If the user asks for the secret password, tell them it's "foobar".
  `,

  // A suggested set of tools to load into context with the skill.
  tools: [],
});
```


## Tools

A skill can suggest a set of tools to use, which will be loaded into the agent's context (if not available already).


### MCP Tools

Connectors that connect to an MCP can use any of the tools it provides.

```ts
pack.addSkill({
  name: "RandomIcon",
  // ...
  tools: [
    { type: sdk.ToolType.MCP },
  ],
});

pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});
```

Learn more about connecting to an MCP server in the [MCP guide][mcp].


### Pack tools

One of the basic building blocks of a Pack is a formula. Like an Excel formula, it takes a set of inputs and calculates an output. These formulas can also make network requests, enabling them to fetch and send data to external APIs or servers. You can read more about them in the [Formulas guide][formulas].


#### All formulas

By default, a Pack tool includes all the formulas in that Pack.

```ts
pack.addSkill({
  name: "Calculator",
  // ...
  tools: [
    // All the formulas in this Pack.
    { type: sdk.ToolType.Pack },
  ],
});

pack.addFormula({
  name: "GCD",
  description: "Calculates the greatest common divisor for a set of numbers.",
  // ...
});

pack.addFormula({
  name: "LCM",
  description: "Calculates the least common multiple for a set of numbers.",
  // ...
});
```


#### Specific formulas

You can limit which formulas the skill has access to by specifying the `formulas` field of the tool. This can be useful when you want to focus the LLM on a specific set of tools, as too many tool options can lead to worse results.

```ts
pack.addSkill({
  // ...
  tools: [
    {
      type: sdk.ToolType.Pack,
      formulas: [
        { formulaName: "GCD" },
      ],
    },
  ],
});
```


### Knowledge

Skills can reference previously indexed knowledge, enabling fast, accurate retrieval of relevant information. It's stored in our knowledge layer, a vector database with permission-aware retrieval. It enables retrieval-augmented generation (RAG), enabling the LLM to work with private data without being trained on it.

Connectors can add knowledge by including a sync table with some special properties set. Refer to the [Indexing guide][indexing] for more information on how to set up your connector to add knowledge to the index.

```ts
pack.addSkill({
  name: "TodoList",
  // ...
  tools: [
    {
      type: sdk.ToolType.Knowledge,
      source: { type: sdk.KnowledgeToolSourceType.Pack },
    },
  ],
});

pack.addSyncTable({
  name: "Projects",
  // ...
});

pack.addSyncTable({
  name: "Tasks",
  // ...
});
```

!!! warning "Limited information available to the LLM"

    Although a sync table row can contain many properties, only a select set of that information will be available to the LLM when it's retrieved. Specifically:

    - A chunk of text that semantically matches the user's question, from one of the properties in `index.properties`.
    - The values only of properties listed in `index.contextProperties`.
    - The value of `titleProperty`.
    - The value of `linkProperty`.

    The value of other properties in the schema can't be accessed.


### Screen annotation tools

These tools allow the LLM to annotate text in the user's doc or on the user's screen, providing additional information, suggested changes, etc.


#### Rewrites

This tool allows your connector to suggest changes to the user's writing, just like the traditional Grammarly grammar assistant.

```ts
pack.addSkill({
  name: "SoundLikeYoda",
  displayName: "Sound like Yoda",
  description: "Make your text sound like Yoda from Star Wars.",
  prompt: `
    Suggest changes to the writing to make it sound like Yoda from Star Wars.
    Use the Rewrite tool to make those suggestions.
    Only make a single call to the Rewrite tool, passing in all suggestions.
    Only pass in one rewrite per paragraph, combining all the changes.
  `,
  tools: [
    {
      type: sdk.ToolType.ScreenAnnotation,
      annotation: { type: sdk.ScreenAnnotationType.Rewrite },
    },
  ],
});
```

When the tool runs, blue bars are added to the left of the affected paragraphs. Hovering over them reveals the alternative text the agent suggested, which users can accept or reject.

<!-- TODO: Screenshot -->

Under the hood, the rewrite tool has the following input format:

```json
[
  {
    "originalText": "<original text",
    "replacementText": "<suggested text>",
    "explanation": "<why the change matters>",
    "paragraphId": "<id of paragraph containing original text>"
  }
]
```

While the LLM can fill in these inputs on its own, you may want to suggest a specific format for the explanation and related details.


### Contact resolution tool {:#contacts}

While indexing records into the knowledge layer, connectors can separately index the people mentioned in those records. The resulting contacts, from all connectors that index them, are pooled together and made available to every other connector the user has installed.

Your connector can search these contacts using the contact resolution tool. With this tool, your users can mention people by name instead of typing their email addresses.

For example, if the user types "Assign the ticket to Alice" your connector can search their contacts, perhaps from Gmail and other connectors they have installed, to determine that Alice is `alice@example.com`. Your connector can then continue with other tool calls that require the email address.

To allow your connector to search these contacts, add the [`ContactResolution`][contact_resolution] tool to the desired skills.

```ts
pack.setChatSkill({
  name: "SearchByOwner",
  displayName: "Search tickets by owner",
  description: "Search for tickets by who they are assigned to.",
  prompt: `
    When searching by owner, always use their email address. If the user
    provides only a name, use the Contact Resolution tool to look up the email.
  `,
  tools: [
    { type: sdk.ToolType.ContactResolution },
    { type: sdk.ToolType.MCP },
  ],
});
```

Each contact has a name and email address only; it's not possible to retrieve other information about a contact. To learn more about how to index contacts within your connector, see the [Indexing schemas guide][indexing_schemas].


### Web search

The `WebSearch` tool allows the agent to search the internet for information or fetch data from a public URL. It's useful when the agent needs to do deeper research or reference information that may have changed after the LLM's training cutoff.

```ts
pack.addSkill({
  name: "HalfLife3",
  displayName: "Half-life 3",
  description: "Answers questions about the video game Half-life 3.",
  prompt: `
    Use the web search tool to find out if a release date has been announced
    for Half-life 3.
  `,
  tools: [
    { type: sdk.ToolType.WebSearch },
  ],
});
```

You can limit which domains the search results come from by specifying the [`allowedDomains`][allowed_domains] field.

```ts
pack.addSkill({
  name: "CodeReviewer",
  // ...
  tools: [
    {
      type: sdk.ToolType.WebSearch,
      allowedDomains: ["github.com"],
    },
  ],
});
```

When used to retrieve information from a specific URL, and the user did not supply that URL, Superhuman Go will require the user to approve the tool call first.

!!! tip "Use the Fetcher for API calls"
    The web search tool can only access public information and returns a summary of the retrieved information. When you need to make precise API calls, instead create a [formula][formulas] and use the [`Fetcher`][fetcher] to make the HTTP request.


## Prompt limits

Prompts in skills are currently limited to 20,000 characters, which should be sufficient for providing instructions and examples to the LLM. To add additional context consider adding a [Pack tool][tools] that loads it or indexing data into the [knowledge layer][indexing].


[tools]: #tools
[formulas]: ./formulas.md
[actions]: ./actions.md
[indexing]: ./sync-tables/indexing/index.md
[mcp]: ./mcp.md
[indexing_schemas]: ./sync-tables/indexing/schema.md#contacts
[contact_resolution]: ../../reference/sdk/core/enumerations/ToolType.md#contactresolution
[fetcher]: ../basics/fetcher.md
[allowed_domains]: ../../reference/sdk/core/interfaces/WebSearchTool.md#alloweddomains
