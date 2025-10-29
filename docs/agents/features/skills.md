---
nav: Skills
description: Define the tasks your agent can perform and the prompts to guide it.
---

# Define skills for your agent

A skill provides guidance to the LLM on how to perform a specific task or handle a certain type of user question. The skill definition includes metadata about the skill, a prompt to direct the LLM, and a set of [tools][tools] it can utilize.

```ts
pack.addSkill({
  // Unique identifier, internal only.
  name: "SecretPassword",

  // User-visible display name (shown on the agent listing).
  displayName: "Secret password",

  // Description of the skill.
  // Use for skill routing and potentially user visible.
  description: "Tells the user the secret password.",

  // A prompt that instructs the LLM how to perform the task, internal-only.
  prompt: `
    If the user asks for the secret password, tell them it's "foobar".
  `,

  // An optional set of tools the LLM can leverage.
  tools: [],
});
```

The LLM will run in a loop, using the prompt for guidance and calling tools as needed until it is finished or needs user input. We currently don’t support more deterministic workflows, where LLMs choose between defined execution paths.


## Multiple skills

Agents can define multiple skills, and Grammarly will select the skill that best matches the user’s query. Make sure to set a good `description` for each skill, as those will be used to determine routing.

```ts
pack.addSkill({
  name: "SecretPassword",
  // ...
});

pack.addSkill({
  name: "SecretHandshake",
  displayName: "Secret handshake",
  description: "Tess the user on how to perform the secret handshake.",
  prompt: `
    When the user asks about the secret handshake, tell them that it is:
    Hand shake, high five, fist bump, explosion
  `,
  tools: [],
});
```

## Default chat skill

When you chat with an agent, it is first routed to a default chat skill, which acts like a system prompt for your agent. This skill can either reply to the user directly or hand off to another skill that has been defined.

Normally, this default chat skill is auto-generated for an agent. It uses a generic prompt defined by the platform and has access to all of the agent’s knowledge and tools.

If you want more control over the chat experience, you can select one of your skills to be the default chat skill. Use the `setSkillEntrypoints()` method to define the `defaultChat` skill.

```ts
pack.addSkill({
  name: "Moo",
  displayName: "Moo",
  description: "Say Moo",
  prompt: `
    Always reply with "Moo!". Nothing else.
  `,
  tools: [],
});

pack.setSkillEntrypoints({
  defaultChat: { skillName: "Moo" },
});
```

!!! info "Additional information added to prompt"

    The prompt defined in your `defaultChat` skill will not be used exactly as-is, and it will have some additional content appended to it. This is done to provide the LLM with some details about the user, context, and other critical information needed for it to operate.


[tools]: ./tools.md
