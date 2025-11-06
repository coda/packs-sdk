---
nav: Upgrading existing Packs
description: Information on how to update an existing Coda Pack to work with Superhuman Go.
---

# Upgrade an existing Pack to an agent

If you've already built a Pack for Coda, the good news is that it can be easily upgraded to a Superhuman Go agent. All agents are Packs under the hood, and with some minor tweaks, your existing Pack can be one too.

You don’t need to be an AI expert to do this, as we provide the LLM and hook it up to your Pack. It's done automatically, so you can install your Pack in Superhuman Go and start chatting with it right away.

<img src="../../images/agent_upgrade.png" srcset="../../images/agent_upgrade_2x.png 2x" alt="A screenshot of the action confirmation UX." class="screenshot">

In the screenshot above, you can see a user chatting with the [Weather Pack][weather_pack], which hasn’t had any code changes. The LLM knows all the formulas and actions in the Pack, calls them as needed, and displays the results in a human-friendly way.

How well your Pack works as an agent can vary, so the main task is to test it as an agent and update it as needed to ensure a great user experience.


## Recommended updates

There aren't strict requirements for your Pack to work as an agent, but there are common patterns. Below is a list of updates to consider.


### Remove doc-specific language

Packs used to only run in docs, but now agents can be run anywhere. Update your Pack to remove doc-specific language, including:

- Building block descriptions
    - "Syncs your tasks to your doc"
      {: .no}
    - "Sync your tasks"
      {: .yes}

- Parameter descriptions
    - "The time zone of your doc"
      {: .no}
    - "The current time zone"
      {: .yes}


### Add indexing to your sync tables

The data in your sync tables won’t be available to the agent unless you index them. You should set up indexing for sync tables that:

1. Have at least one free-text column (description, notes, body, etc.)
2. Have a link column

See the [Indexing guide][indexing] for more information on adding indexing features to your sync table, and the [Developing & testing guide][developing] for testing.


### Add chat skills where appropriate

A [default chat skill][default_chat_skill] is generated for every Pack, meaning you can chat with your Pack right away. It has access to all of the formulas, actions, and indexed knowledge in your Pack.

While the default chat skill can handle a wide range of user questions and prompts, it may struggle with the more nuanced tasks. In those cases, you should add additional skills to your Pack, providing a custom prompt that better guides the LLM.

See the [Skills guide][skills] for more information on how to add custom skills.


### Utilize suggestions

One of Grammarly’s most powerful features is to see what the user is writing and make suggestions on how to improve it. The same suggestion UI is available to agents.

Look for potential use cases where making a writing suggestion would be beneficial—for example, filling in a placeholder or providing additional context about a term or phrase.

See the [Screen annotation tools section][screen_tools] guide for more information.


## Adding features for agents only

During the upgrade process, you may need to adjust your Pack to work better with the LLM. You'll want to avoid breaking the experience for existing users of your Pack, and there are tactics to do so.


### Hidden formulas {: #hidden}

You can add a new formula just for the LLM to use by adding `isExperimental: true` to the definition. These won't be displayed to users in Coda docs, but will be made available to the LLM to call.

```{.ts hl_lines="6-7"}
pack.addFormula({
  name: "GetWorkspaceId",
  description: "Gets the ID of the user's workspace.",
  parameters: [],
  resultType: coda.ValueType.String,
  // Hide this in Coda docs, but allow the LLM to use it.
  isExperimental: true,
  execute: async function (args, context) {
    // ...
  },
});
```


### LLM instructions

The LLM uses the formula and parameter descriptions to understand how to use them, but sometimes the agent needs more information to call them reliably. You can provide an alternate description just for the LLM to use by setting the `instruction` field on the formula or parameter.

```{.ts hl_lines="4-9 15-19"}
pack.addFormula({
  name: "CreateContact",
  description: "Creates a new contact.",
  instructions: `
    Creates a new contact for a given customer.
    The contact should be an individual who works at the company.
    To save the contact information for the business as a whole, use the
    UpdateCustomer formula instead.
  `,
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "name",
      description: "The name of the contact.",
      instructions: `
        The name of the contact.
        If available, provide the full name (first, middle, and last).
        Don't include prefixes and suffixes (Dr., Esq., etc.).
      `,
    }),
    // ...
  ],
  resultType: coda.ValueType.String,
  execute: async function (args, context) {
    // ...
  },
});
```


## Known limitations

Currently, some Pack features don't work in agents.

- [parameter `autocomplete`][autocomplete] - The LLM can't see the possible autocomplete values for a parameter. If the list of possible values is small, include them in the parameter description.
- [`vararg` parameters][vararg] - The LLM can't set `vararg` parameters. As a workaround, add a [hidden formula](#hidden) that uses a JSON string parameter instead.
- [`ConnectionRequirement.Optional`][connection_requirement_optional] - If user auth is defined, users will need to sign in before they can use the agent at all.
- [Two-way sync][two_way_sync] - Agents can't edit records using two-way sync. As a workaround, add an [action formula][actions] that can update a record.


[indexing]: ./indexing/index.md
[developing]: ./development.md
[default_chat_skill]: ./features/skills.md#default-chat-skill
[skills]: ./features/skills.md
[screen_tools]: ./features/tools.md#screen-annotation-tools
[vararg]: ../guides/basics/parameters/index.md#vararg
[two_way_sync]: ../guides/blocks/sync-tables/two-way.md
[actions]: ../guides/blocks/actions.md
[autocomplete]: ../guides/basics/parameters/autocomplete.md
[connection_requirement_optional]: ../reference/sdk/enums/core.ConnectionRequirement.md#optional
[weather_pack]: https://coda.io/packs/weather-1015
