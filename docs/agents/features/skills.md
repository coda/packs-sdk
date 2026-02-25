---
nav: Skills
description: Define the tasks your agent can perform and the prompts to guide it.
---

# Define skills for your agent

A skill guides the LLM on how to perform a specific task or handle a particular type of user question. You aren't required to add skills to your agent, but they can help it perform more reliably and deliver a better experience to users.


## Basic skill

The skill definition includes metadata about the skill, a prompt to direct the LLM, and a set of [tools][tools] it can use.

```ts
pack.addSkill({
  // Unique identifier, internal only.
  name: "SecretPassword",

  // User-visible display name (shown on the agent listing).
  displayName: "Secret password",

  // Description of the skill.
  // Used for skill routing, and is potentially user-visible.
  description: "Tells the user the secret password.",

  // A prompt that instructs the LLM how to perform the task, internal-only.
  prompt: `
    If the user asks for the secret password, tell them it's "foobar".
  `,

  // An optional set of tools the LLM can leverage.
  tools: [],
});
```

The LLM will run in a loop, using the prompt for guidance and calling tools as needed, until it finishes or requires user input. We currently don't support more deterministic workflows in which LLMs choose from predefined execution paths.


## Multiple skills

Agents can define multiple skills, and Superhuman Go will select the skill that best matches the user's query. Make sure to set a good `description` for each skill, as those will be used to determine routing.

```ts
pack.addSkill({
  name: "SecretPassword",
  // ...
});

pack.addSkill({
  name: "SecretHandshake",
  displayName: "Secret handshake",
  description: "Teach the user how to perform the secret handshake.",
  prompt: `
    When the user asks about the secret handshake, tell them that it is:
    Handshake, high five, fist bump, explosion
  `,
  tools: [],
});
```

## Chat skill {: #default-chat-skill}

When you chat with an agent, it is first routed to a chat skill, which acts like a system prompt for your agent. This skill can either reply to the user directly or hand off to another skill that has been defined.

Normally, this chat skill is auto-generated for an agent. It uses a generic prompt defined by the platform and has access to all of the agent's knowledge and tools. If you want more control over the chat experience, use the `setChatSkill()` method to define the chat skill.

```ts
pack.setChatSkill({
  name: "Cow",
  displayName: "Cow",
  description: "Talk like a cow.",
  prompt: `
    End every reply with "Moo!".
  `,
  tools: [
    { type: coda.ToolType.Pack },
  ],
});
```

When defining your own chat skill, you must explicitly define the tools you want the agent to use. The default chat skill includes the following tools:

```ts
tools: [
  { type: coda.ToolType.Pack },
  {
    type: coda.ToolType.Knowledge,
    source: { type: coda.KnowledgeToolSourceType.Pack },
  },
],
```

In addition, the chat skill always has the ability to transfer to other skills that have been defined in the agent using `addSkill()`.

!!! info "Additional information added to prompt"

    The prompt defined in your chat skill will not be used exactly as-is; it will have additional content appended. This is done to provide the LLM with some details about the user, context, and other critical information needed for it to operate.


## Bench initialization skill {:#bench}

Normally the agent waits for the user to send a message before responding, but you can have your agent send the first message by setting a bench initialization skill. This skill is run the first time the user clicks on the agent's icon in the agent bench.

<video style="width:auto" loop muted autoplay alt="Recording of the agent running a skill when opened on the agent bench." class="screenshot"><source src="site:images/agent_bench_initialization.mp4" type="video/mp4"></source></video>

This can be useful when your agent is single-purpose and you want to start right away, or if you want to show some welcome text to the user to guide them.

```ts
pack.setBenchInitializationSkill({
  name: "Greeting",
  displayName: "Greeting",
  description: "Greet the user.",
  prompt: `
    Say hello to the user, referencing the time of day and a friendly nickname.
    For example: 10AM, Kramer => "Good morning K-man!"
  `,
  tools: [],
});
```

The bench initialization skill is only run once while the Superhuman Go side panel is open, even if the user clicks the icon again or starts a new chat session. Closing the side panel will clear the state of all agents, and the next time it is opened the bench initialization will fire again.


## LLM model selection {:#models}

While simple prompts may work fine with any LLM model, more complex or nuanced behavior may benefit from ensuring a specific model is used. You can select which models your skill supports by setting the `models` field.

```{.ts hl_lines="7-9"}
pack.addSkill({
  name: "Poem",
  displayName: "Write poem",
  description: "Writes a new poem.",
  prompt: `Write a funny poem.`,
  tools: [],
  models: [
    { model: coda.SkillModel.OpenAIGPT4 },
  ],
});
```

When specified, Superhuman Go will attempt to use one of the defined models when running the skill. In cases where the model has been retired or is incompatible with the customer's settings, a different model may be selected.

Additionally, you can customize the prompt for each model. This allows you to support multiple models and still use prompts optimized for each.

```ts
models: [
  {
    model: coda.SkillModel.OpenAIGPT4,
    prompt: `Write a funny poem.`,
  },
  {
    model: coda.SkillModel.OpenAIGPT5,
    prompt: `Write a _really_ funny poem. It's OK to be silly!`,
  },
],
```

The models available to select from are more like model families, grouping together a number of specific versions. You can see the full list of currently supported models in the [SkillModel][skillmodel] enum.

!!! info "Default model"

    If not specified, skills will default to the `OpenAIGPT5` model. This default will change over time, so specify the `models` field to ensure your agent behaves consistently.


## Prompt limits

Prompts in skills are currently limited to 20,000 characters, which should be sufficient for providing instructions and examples to the LLM. To add additional context consider adding a [Pack tool][tools] that loads it or indexing data into the [knowledge layer][indexing].


[tools]: ./tools.md
[indexing]: ../indexing/index.md
[skillmodel]: ../../reference/sdk/core/enumerations/SkillModel.md
