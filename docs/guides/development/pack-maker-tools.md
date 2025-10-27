---
description: Utilities for Pack makers to helper them build and troubleshoot their Packs.
---

# Pack maker tools

While the Pack Studio and Pack CLI are used to develop a Pack, the primary way to monitor and interact with a Pack once it is installed in a document is via the Pack maker tools. It is a pane along the bottom of a Coda document that provides information about the Packs installed in the doc that you have edit access to.


## How to access

There are a few different ways to open the Pack maker tools.

=== "Doc menu"
    Click the three dots icon to the right of the doc's name and select **Toggle Pack maker tools**. 
    
    !!! info "Developer mode required"
    
        This option is only visible if you have Developer Mode enabled on your Coda account. To enabled developer mode, open your [account settings][account_settings], scroll to the bottom, expand **Developer tools** and toggle on **Enable developer mode**.

    <img src="../../../images/pmt_open_doc.png" srcset="../../../images/pmt_open_doc_2x.png 2x" class="screenshot" alt="Open Pack maker tools from doc menu">

=== "Pack side panel"
    Open the side panel for a Pack ({{ custom.pack_panel_clicks }}) and click the button **View logs** at the bottom. This option is only visible for users with edit access to the Pack.

    <img src="../../../images/pmt_open_panel.png" srcset="../../../images/pmt_open_panel_2x.png 2x" class="screenshot" alt="Open Pack maker tools from Pack panel">

=== "Error message"
    Hover over the broken Pack formula and click **View error details**. This option is only visible for users with edit access to the Pack.

    <img src="../../../images/pmt_open_error.png" srcset="../../../images/pmt_open_error_2x.png 2x" class="screenshot" alt="Open Pack maker tools from a formula error">

The Pack maker tools opens in the document as a panel at the bottom of the document. You can freely resize or close this panel.

<img src="../../../images/pmt_overview.png" srcset="../../../images/pmt_overview_2x.png 2x" class="screenshot" alt="The Pack maker tools">


## Selecting the Pack

The Pack maker tools only works with one Pack at a time. To change the selected Pack you can click the Pack name at the top of the panel and select a new one from the dropdown. You'll only be able to select Packs that are installed in the document and that you have edit access to.

<img src="../../../images/pmt_select.png" srcset="../../../images/pmt_select_2x.png 2x" class="screenshot" alt="Change the selected Pack">


## Logs

The primary feature of the Pack maker tools is the ability to look at the logs for your Pack. The Pack maker tools will only show the log entries for the selected Pack within the current doc. If you need to see the log entries for your Pack within another doc, you'll first need to get access to that document.

New log entries are displayed automatically, usually a few seconds after the Pack is run. There is no need to refresh the page or open and close the Pack maker tools. Logs are kept for approximately two weeks, after which they are no longer available.


### Invocations

The logs for your Pack are grouped by invocation, in reverse chronological order (latest invocations at the top).

<img src="../../../images/pmt_overview.png" srcset="../../../images/pmt_overview_2x.png 2x" class="screenshot" alt="Invocation logs">

Each invocation has a brief description, if it was successful or failed, approximately when it was run, and what version of the Pack was run (if not the latest).

A new invocation is logged each time your Pack is run, for example when a formula is calculated or a button is pressed. When a sync table syncs you'll see an invocation for the initial sync, and additional invocation for each continuation of the sync.

!!! info "Duplicate invocations"
    When looking at the logs you may see duplicate invocations for the same formula. Some common reasons for this include:

    - Using the formula editor, which runs formulas multiple times as you type to generate a preview of the result.
    - Multiple users have the doc open at the same time (each browser will run the formula).
    - The Coda backend running a recalculation as a part of normal operation.


### Entries

Clicking on an invocation expands it to reveal individual log entries.

<img src="../../../images/pmt_entries.png" srcset="../../../images/pmt_entries_2x.png 2x" class="screenshot" alt="Log entries">

The first entry will always be an **Overview** of the invocation. Additional entries are shown in reverse chronological order (latest entries at the top), and are added when your Pack makes a fetcher request or [logs a message][troubleshooting_logging]. If you Pack encounters an error the execution will stop and no further log entries will be added.


### Details

Clicking on a log entry expands it to reveal additional details.

<img src="../../../images/pmt_details.png" srcset="../../../images/pmt_details_2x.png 2x" class="screenshot" alt="Log entry details">

These details include information you can use directly (**Pack Version**, etc), as well as internal details that may be useful when working with Coda support (**Request ID**, etc). The **Overview** log entry will include a **Duration** field containing the total execution time.

Failed invocations will include some additional detail in the **Overview** entry.

<img src="../../../images/pmt_details_error.png" srcset="../../../images/pmt_details_error_2x.png 2x" class="screenshot" alt="Log entry details for a failed invocation">

Specifically the **Error** field will include the error message, and the **Stack trace** field will include the line number where the error happened (`code.ts:18:23` means line 18, character 23).


### HTTP requests {: #http}

Log entries for fetcher requests include an extra link at the bottom called **Show HTTP request details**. Clicking this link will open a dialog that shows the full details of the request, including the headers and bodies of the request and response.

<img src="../../../images/pmt_http.png" srcset="../../../images/pmt_http_2x.png 2x" class="screenshot" alt="HTTP request details dialog">

Just like in your Pack's code, [some headers are redacted][fetcher_headers] as well as any user credentials.


### Searching

You can search for logs using the magnifying glass icon at the top of the panel.

<img src="../../../images/pmt_search.png" srcset="../../../images/pmt_search_2x.png 2x" class="screenshot" alt="Searching for log entries">

Search results are no longer grouped by invocation, but instead a flat list of entries from across all invocations. You can expand an entry and click the **View related logs** link to view all of the log entries from that invocation.


## Settings {: #settings}

The Pack maker tools also lets you adjust a few developer-specific settings for the Pack. You can access these settings by clicking the gear icon at the top of the panel.

<img src="../../../images/pmt_settings.png" srcset="../../../images/pmt_settings_2x.png 2x" class="screenshot" alt="Pack settings for the doc">

**Installed in this doc**
:   Which version of the Pack to use in the doc. This allows you to test new versions of your Pack before releasing them, or roll back to previous versions to reproduce a bug. It's recommended to use **Latest Version** while developing your Pack. However, in order to publish or convert the doc to a template, you must use **Latest Release**. Also note that you will be unable to change the version in a published doc or template.

**Auto-refresh formulas & tables**
:   If you enable this setting and have selected **Latest version** above, whenever you build a new version of your Pack all of the formulas and sync tables in the doc will be automatically refreshed. This only applies to the current session (browser tab), so you'll need to turn it back on if you refresh the page or open the doc again later.


## Additional options {: #options}

A few additional options are available under the three dots menu at the top of the panel. These are mostly quick links that let you jump between the various assets of the Pack, but also includes an option to force a refresh of the Pack's formulas and sync tables in the document.

<img src="../../../images/pmt_additional.png" srcset="../../../images/pmt_additional_2x.png 2x" class="screenshot" alt="Additional options in the Pack maker tools">


[troubleshooting_logging]: troubleshooting.md#logging
[fetcher_headers]: ../basics/fetcher.md#headers
[account_settings]: https://coda.io/account
