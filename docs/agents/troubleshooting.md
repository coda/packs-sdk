---
nav: Troubleshooting
description: How to debug your agent and deal with standard errors.
---

# Troubleshooting problems with agents

Debugging software is never easy, but the non-deterministic nature of agents can make it even more challenging. This page includes information on how to get help when something goes wrong and common errors you may run into.

## Agent logs

The agent logs provide detailed information that can be used to troubleshoot an agent. These logs are only available to individuals with `Pack admin` or `Can test` privileges on the underlying Pack. You can only view the log entries from your own interactions with the agent.

To access the agent logs:

1.  Open the settings screen for the agent (`https://coda.grammarly.com/brain/agent/setup/{PACK_ID}/debug`).
1.  Click the **Agent logs** button.

The drawer that opens lets you view logs from your recent sessions with the agent.

- **Agent Execution** entries will contain logs from the LLM-based runtime, and expanding the entry and clicking the link **Show agent runtime details** will allow you to browse the internal state of the agent.
- **Agent Action** entries will contain logs from a Pack tool call, including details from network requests and `console.log()` statements. Learn more in the [Pack maker tools][pmt] guide.

<img src="../../images/agent_logs.png" srcset="../../images/agent_logs_2x.png 2x" class="screenshot" alt="A screenshot of the agent logs drawer.">

## Ingestion logs

Agents that use [Indexing][indexing] and include sync tables will generate additional logs for the data ingestion jobs that run periodically. These logs are only available to individuals with `Pack admin` or `Can test` privileges on the underlying Pack. You can only view the log entries from your own ingestion jobs.

To access the ingestion logs:

1.  Open the settings screen for the agent (`https://coda.grammarly.com/brain/agent/setup/{PACK_ID}/debug`).
1.  Click the **Ingestion logs** button.

Select a table from the **Datasource** dropdown to see the logs for that sync table. You can see the recent syncs for the table, and drill down into individual executions of the sync table and any associated logs.

<img src="../../images/agent_ingestion_logs.png" srcset="../../images/agent_ingestion_logs_2x.png 2x" class="screenshot" alt="A screenshot of the ingestion logs drawer for an agent.">

## Inline debug info

You can get internal information about your agent's state by appending `@debug` to a chat message. This will cause it to output the JSON structures containing the chat history, including messages and tool calls.

<img src="../../images/agent_debug.png" srcset="../../images/agent_debug_2x.png 2x" class="screenshot" alt="A screenshot of an agent responding with debug information.">

We don’t document the exact format of this output, and it’s subject to change without warning.

## Common errors

### Generic error

- `Something went wrong. Please wait a moment, then try again.`

This is a generic error message that is shown when something unexpected goes wrong. Some known causes are:

- A skill in your agent references a Pack formula that doesn't exist.

### Page too large

- `Something went wrong. WS closed because message was too big.`

This error is shown when the page opens in your browser is too large to send to the agent. You can work around it by removing the page context, selecting a subset of the text, or switching to a smaller page.

[developing]: ./development.md
[pmt]: ../guides/development/pack-maker-tools.md#logs
[indexing]: ./indexing/index.md
