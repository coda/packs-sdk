---
nav: Troubleshooting
description: How to debug your agent and deal with standard errors.
---

# Troubleshooting problems with agents

Debugging software is never easy, but the non-deterministic nature of agents can make it even more challenging. This page includes information on how to get help when something goes wrong and common errors you may run into.


## Debug info

You can get internal information about your agent's state by appending `@debug` to your message. This will cause it to output the JSON structures containing the chat history, including messages and tool calls.

<!-- TODO: Screenshot -->

We don’t document the exact format of this output, and it’s subject to change without warning. However, you may be able to glean some information from it.


## Pack logs

Detailed logging is available for your Pack formulas and sync tables, showing `console.log()` statements and network requests.

<!-- TODO: Screenshot -->

However, this logging is currently only available when testing within a Coda doc. See the [Developing and testing guide][developing] for more information on how to test your agent there.


## Common errors

### Generic error

- `Something went wrong. Please wait a moment, then try again.`

This is a generic error message that is shown when something unexpected goes wrong. Some known causes are:

- A skill in your agent references a Pack formula that doesn't exist.


### Page too large

- `Something went wrong. WS closed because message was too big.`

This error is shown when the page opens in your browser is too large to send to the agent. You can work around it by removing the page context, selecting a subset of the text, or switching to a smaller page.


[developing]: ./development.md
