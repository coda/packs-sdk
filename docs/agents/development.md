---
nav: Developing & testing
description: Tips and techniques for building and testing agents.
---

# Developing and testing agents

This page covers some tips and techniques for building and testing agents.


## Developing locally

In the [Your first agent tutorial][your_first_agent], we recommend developing in the Pack Studio, a web-based IDE. It is the simplest way to get started. All you have to do is visit [pack.new](https://pack.new) and start writing code.

However for production work we recommend developing locally with the CLI, as it allows you to integrate with your version control system, write unit tests, etc. To learn how to set up this environment, follow the [Get started on your local machine][quickstart_cli].

The CLI can run your code locally, but it can only run an individual building block (formula, action, or sync table). It is not possible to run LLM-based functionality, like skills. For that you’ll need to upload a new version of your agent to the server and test it using {{ custom.agent_product_name }}.


## Testing in a Coda doc

If your agent contains formulas or sync tables, it can be useful to test them in a Coda doc. Testing allows you to:

- Directly control parameter values, vs letting the LLM decide
- View the raw output from formulas and sync tables
- Easily access the [Pack maker tools][pack_maker_tools] to view execution logs

You won’t be able to test your agent skills in the doc however, as those can only be used in {{ custom.agent_product_name }}.

To test your agent’s formulas and syncs in a Coda doc:

1. Visit [coda.new](https://coda.new) to create a new doc.
2. Click the **Insert** button in the upper right of the screen.
3. Search for your agent by name and then click it.
4. Click the button **Add to doc for free**.
5. Drag a building block into the page.
6. If user authentication is required, click the **+ Connect an account** button and sign in.


## Test indexing

When an agent contains sync tables, the agent installation screen will include extra elements that allow the user to configure which records to sync. If a table has parameters, you can click on it it’s row and set those parameters. Clicking **Done** will start the indexing process, which can take a few minutes to complete, depending on the size of the dataset being indexed.


### Checking status

The status of a the indexing job is visible in the settings screen for the agent. You can access the settings screen by clicking the plus button :octicons-plus-16: at the bottom of the agent bench, the sliders icon :octicons-sliders-16: in the upper right, and then the gear icon :octicons-gear-16: next to the agent.

Click on the **Sync status** tab to see if the the sync is complete, and how many records were found.

Click into a specific table to open the Data Explorer. This allows you to view which records were indexed.


!!! warning "Missing data"

    You may sometimes see the sync status listed as **Synced**, but no data shown for a given table. This can happen for a few reasons:

    - The schema is missing the metadata required for indexing. See the [Indexing Schemas guide][indexing_schemas] for more information on how to add that metadata.
    - There is a lag between when the sync is complete and what the data shows up in the Data Explorer. It can take a few minutes, so wait a bit and refresh the page later.

The table will show one row per record, with the **rawText** column showing the text from one of the indexed chunks.


### Re-indexing

Making changes to your Pack or the connection settings doesn’t immediately kick off the indexing process. Instead we recommend deleting and re-creating the connection every time you want to see the effects of a change.


## Testing un-released versions

If your Pack has previously been [released][releases], when the agent is installed it will default to the released version of your code. To test a newer, unreleased version of your code, click the gear icon next to the heading **Configure what to sync** and select **Latest version** from the dropdown.

<!-- TODO: Screenshot -->


[your_first_agent]: quickstart.md
[quickstart_cli]: ../tutorials/get-started/cli.md
[pack_maker_tools]: ../guides/development/pack-maker-tools.md
[releases]: ../guides//development/versions.md#releases
[indexing_schemas]: ./indexing/schema.md
