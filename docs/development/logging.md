---
description: How to view and use logs to monitor and debug your agents and connectors.
---

# Logging

Logs are the primary way to debug and troubleshoot your agents and connectors once they are running. Depending on what you're building and where it runs, there are a few different kinds of logs available.

Viewing any of these logs requires **Pack admin** or **Can test** privileges on the underlying Pack. The entries you can see are scoped to a container:

- :superhuman-go: Go - the chat session, so you'll only see entries from your own sessions
- :superhuman-docs: Docs - the document, so you'll see entries from activity in a document you have access to, even if someone else triggered it

Log entries are kept for approximately two weeks, after which they are no longer available.


## Agent logs

Agent logs show what happened during a chat session with an agent, focused primarily on the context provided to the LLM, the actions it took, and the responses it generated. Agent logs include basic information about which tools were called and the responses, but don't include the internal execution details; for those, open the [connector logs](#connector-logs) of the relevant connectors.

To access the agent logs:

1.  Open the [agent's settings screen][navigation_agent_settings]{ data-preview }.
1.  Click the **Agent logs** button.

The drawer that opens lets you view logs from your recent sessions with the agent. Expand an **Agent Execution** entry and click **Show agent runtime details** to browse the internal state of the agent.

<img src="site:images/agent_logs.png" srcset="site:images/agent_logs_2x.png 2x" class="screenshot" alt="A screenshot of the agent logs drawer.">


## Connector logs

Connector logs show the execution of the individual building blocks in a connector, for example when a formula is calculated, a button is pressed, or a sync table syncs. Each entry can include details from network requests and any messages you output with `console.log()`.

How you access the connector logs depends on which product the connector was used in.


### :superhuman-go: Go

The connector logs contain information about each time a formula in the connector was used in a tool call, either by an agent or by Go directly. To view them:

1.  Open the [connector's settings screen][navigation_connector_go]{ data-preview }
1.  Click the **Agent logs** button.

The logs are grouped by the Go session where the connector was used, with the most recent session at the top. To get the latest results, click the refresh button in the upper right of the logs panel.

<img src="site:images/connector_logs.png" srcset="site:images/connector_logs_2x.png 2x" class="screenshot" alt="A screenshot of the connector logs drawer in Go.">


### :superhuman-docs: Docs

The connector logs contain information about each time a building block was run in a doc. This includes the formula engine executing a formula, a user triggering an action, or a sync table refreshing. To view them, open the doc with the connector installed and then use one of the options below:

- Open the [Pack maker tools][navigation_connector_maker_tools]{ data-preview } panel
- Open the [Pack side panel][navigation_connector_panel]{ data-preview } and click the **View logs** button
- Hover over the broken connector formula and click the **View error details** link

The logs are grouped by invocation, with the latest entries at the top. New log entries are displayed automatically, usually a few seconds after the connector is run — there's no need to refresh the page or reopen the panel.

<img src="site:images/connector_logs_docs.png" srcset="site:images/connector_logs_docs_2x.png 2x" class="screenshot" alt="A screenshot of the connector logs in Docs.">

The panel will only show the logs from one connector at a time. To change the selected connector you can click the connector name at the top of the panel and select a new one from the dropdown.


## Ingestion logs

Connectors that use [Indexing][indexing] and include sync tables will generate additional logs for the data ingestion jobs that run periodically.

To access the ingestion logs:

1.  Open the [connector's settings screen][navigation_connector_go]{ data-preview }
1.  Click the **Ingestion logs** button.

Select a table from the **Datasource** dropdown to see the logs for that sync table. You can see the recent syncs for the table, and drill down into individual executions of the sync table and any associated logs.

<img src="site:images/agent_ingestion_logs.png" srcset="site:images/agent_ingestion_logs_2x.png 2x" class="screenshot" alt="A screenshot of the ingestion logs drawer for a connector.">


## Adding log messages

You can add your own messages to the connector logs from your code using the standard JavaScript method `console.log()`.

```ts
let response = context.fetcher.fetch({
  method: "GET",
  url: "https://api.example.com/items",
});
let items = response.body.items;
console.log("Retrieved %s items.", items.length);
```

This is useful for debugging both during development and in production. The Packs runtime only includes a subset of the [full `console` methods][mdn_console], specifically:

- `console.debug()`
- `console.error()`
- `console.info()`
- `console.log()`
- `console.trace()`
- `console.warn()`

When running your connector locally with the CLI these messages are printed to the terminal instead. See the [CLI guide][cli_logging] for more on local logging and debugging.


## Reading the logs

However you open them, connector logs share a common structure. This section explains how entries are organized and how to drill into the details of an individual run.


### Invocations

Every time your connector is run it generates an invocation, which groups together all of the other logs that come from the connector while it was executing.

<img src="site:images/pmt_overview.png" srcset="site:images/pmt_overview_2x.png 2x" class="screenshot" alt="Invocation logs">

Each invocation has a brief description, if it was successful or failed, approximately when it was run, and what version of the connector was run (if not the latest).

A new invocation is logged each time your connector is run, for example when a formula is calculated or a button is pressed. When a sync table syncs you'll see an invocation for the initial sync, and an additional invocation for each continuation of the sync.

!!! info "Duplicate invocations"
    When looking at the logs in :superhuman-docs: Docs, you may see duplicate invocations for the same formula. Some common reasons for this include:

    - Using the formula editor, which runs formulas multiple times as you type to generate a preview of the result.
    - Multiple users have the doc open at the same time (each browser will run the formula).
    - The backend running a recalculation as a part of normal operation.


### Entries

Clicking on an invocation expands it to reveal individual log entries.

<img src="site:images/pmt_entries.png" srcset="site:images/pmt_entries_2x.png 2x" class="screenshot" alt="Log entries">

The first entry will always be an **Overview** of the invocation. Additional entries are shown in reverse chronological order (latest entries at the top), and are added when your connector makes a fetcher request or [logs a message](#adding-log-messages). If your connector encounters an error the execution will stop and no further log entries will be added.


### Details

Clicking on a log entry expands it to reveal additional details.

<img src="site:images/pmt_details.png" srcset="site:images/pmt_details_2x.png 2x" class="screenshot" alt="Log entry details">

These details include information you can use directly (**Version**, etc), as well as internal details that may be useful when working with support (**Request ID**, etc). The **Overview** log entry will include a **Duration** field containing the total execution time.

Failed invocations will include some additional detail in the **Overview** entry.

<img src="site:images/pmt_details_error.png" srcset="site:images/pmt_details_error_2x.png 2x" class="screenshot" alt="Log entry details for a failed invocation">

Specifically the **Error** field will include the error message, and the **Stack trace** field will include the line number where the error happened (`code.ts:18:23` means line 18, character 23).


### HTTP requests {: #http}

Log entries for fetcher requests include an extra link at the bottom called **Show HTTP request details**. Clicking this link will open a dialog that shows the full details of the request, including the headers and bodies of the request and response.

<img src="site:images/pmt_http.png" srcset="site:images/pmt_http_2x.png 2x" class="screenshot" alt="HTTP request details dialog">

Just like in your connector's code, [some headers are redacted][fetcher_headers] as well as any user credentials.


### Searching

You can search for logs using the magnifying glass icon at the top of the panel.

<img src="site:images/pmt_search.png" srcset="site:images/pmt_search_2x.png 2x" class="screenshot" alt="Searching for log entries">

Search results are no longer grouped by invocation, but instead a flat list of entries from across all invocations. You can expand an entry and click the **View related logs** link to view all of the log entries from that invocation.


[mdn_console]: https://developer.mozilla.org/en-US/docs/Web/API/console
[cli_logging]: cli.md#debugging-locally
[fetcher_headers]: ../guides/basics/fetcher.md#headers
[indexing]: ../guides/blocks/sync-tables/indexing/index.md
[navigation_agent_settings]: ../support/navigation.md#agent
[navigation_connector_go]: ../support/navigation.md#connector-go
[navigation_connector_maker_tools]: ../support/navigation.md#connector-maker-tools
[navigation_connector_panel]: ../support/navigation.md#connector-panel
