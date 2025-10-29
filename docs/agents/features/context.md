---
nav: Context
description: The information provided to your agent about where it's running.
---

# Context provided to your agent

While [tools][tools] must be invoked by the LLM, context is provided automatically. All [skills][skills] are provided this context by default, with no additional configuration required.


## Screen context

The agent is given access to the text on the screen at the time the agent was invoked. The chat box includes a visual indicator to users about the context being passed, and the user has the option to remove that context for a given session.

<!-- TODO: Image -->

There are three types of text your agent may receive, with possibly more than one being passed at the same time:

**Screen information**
:   The text on the screen. The {{ custom.agent_product_name }} platform decides exactly which element of the web page are included, and it usually tries to limit it to the core content and exclude navigational elements, etc.

    ??? info "Full text not guaranteed"

        The agent will always include the text that is visible on the user's screen (and often much more), but you can't assume it's the full text of the page, doc, etc. The amount of text that is passed to your agent can be capped for performance reasons, and many apps implement “lazy loading”, only rendering the content as it comes into view.

**Editor text**
:   If the user is currently typing in an editable text field, the current value of that field. It is split into numbered paragraphs, which are referenced by the [Rewrite tool][rewrite_tool].

**Selected text**
:   If the user has selected some text with their cursor, the value of that text.

You can reference this content in your prompts using the terms above.

```ts
pack.addSkill({
  name: "HaikuGenerator",
  displayName: "Make a haiku",
  description: "Make a haiku poem from the content on screen.",
  prompt: `
    Write a haiku poem based on the screen information.
    If there is selected text, make sure those words are included.
  `,
  tools: [],
});
```

No formatting or visual elements passed to the agent, only the plain text equivalent.


## User information

The agent is provided with the full name and email address of the user that is invoking it. This can be useful for personalizing responses, filtering search results, etc.

!!! warning "Not proof of identity"

    We don't recommend using the email address as proof of the user's identity, as the LLM may not faithfully pass the value to a formula. If you need to verify the user's identity we recommend using a [supported Authentication mechanism][auth] and having the user connect their account when installing the agent.


## Chat history

An agent has access to the previous messages in the current chat session, both those sent by the user and by the agent itself. Message history from other chat sessions are not available.


## Date and time

When an agent is invoked it's provided the current date and time, up to the minute (no seconds). It's also provided the timezone of the user, so that the time can be displayed correctly.


[tools]: ./tools.md
[skills]: ./skills.md
[rewrite_tool]: ./tools.md#rewrites
[auth]: ../../guides/basics/authentication/index.md
