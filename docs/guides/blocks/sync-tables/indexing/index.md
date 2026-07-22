---
nav: Overview
description: Add content to the built-in vector database to use with RAG.
---

# Index content into the knowledge layer

!!! info "Superhuman Go only"

    Indexing is only available for connectors installed in :superhuman-go: Go.

LLMs have a limited context window — the amount of text they can consider at once. This can make it challenging to give your connector access to all the data it needs, which can be much larger. One approach is RAG (retrieval-augmented generation), in which the LLM first retrieves relevant records for the user's query and then generates a response using them.

The platform provides a built-in RAG system we call the knowledge layer. You write some code in your connector to sync the records, and the platform will chunk them, store them in a vector database, and expose a search tool to your connector. See the [Tools guide][tools_knowledge] for more information on how to connect indexed knowledge to a skill.


## When to use it

A connector may work with many different types of records, but indexing may not be appropriate for all of them. Indexing works best for record types that:

- Contain significant text content that the user will want to search over.
- Have user-visible URLs that the user would want to click into.

Indexing a blog post or draft email makes sense, but indexing quarterly sales numbers does not.


## Setting up

Indexing is built on top of [sync tables][sync_tables]. Create a sync table for each record type you want to index, then ensure its schema includes the required metadata, as described in the [Schema changes guide][indexing_schemas]. You can improve the data freshness by implementing [Incremental sync][incremental] and simplify the user setup by implementing [crawling][crawling].


## Data freshness and size

The platform determines how often to reindex the data, attempting to find a balance between freshness and resource consumption. The default is to sync the data every 24 hours. If the connector supports [incremental sync][incremental], then an incremental sync is done every 4 hours with a full sync done every 7 days (or as needed).

There are also limits as to how much data can be indexed. By default a connector can index 10 tables and up to 100MB of data across all tables. Where the size limit is reached the sync will be terminated, therefore we recommend that the most relevant records (newest, most trafficked) are synced first.

These defaults are subject to change without warning, and in the future may vary based on the user's plan.


## Testing and monitoring

When a connector contains sync tables, the installation screen in :superhuman-go: Go includes additional elements that let the user configure which records to sync. If a table has parameters, you can click its row to set those parameters. Clicking **Done** starts the indexing process, which can take a few minutes to complete depending on the size of the dataset.

To check the status of an indexing job:

1.  Open the [connector's settings screen][navigation_connector_go]{ data-preview }
1.  Click the **Sync status** tab

This will show whether the sync is complete and how many records were found.

!!! warning "Missing data"

    You may sometimes see the sync status listed as **Synced**, but Go doesn't have access to the data. This can happen for a few reasons:

    - The schema is missing the metadata required for indexing. See the [Schema changes guide][indexing_schemas] for more information on how to add that metadata.
    - There is a lag between when the sync is complete and when the data becomes available to Go. It can take a few minutes, so wait a bit and refresh the page later.

Making changes to your Pack or connection settings doesn't immediately trigger the indexing process. Instead, we recommend deleting and recreating the connection whenever you want to see the effects of a change.


[sync_tables]: ../index.md
[tools_knowledge]: ../../../../agents/features/tools.md#knowledge
[indexing_schemas]: ./schema.md
[incremental]: ./incremental.md
[crawling]: ./crawling.md
[todoist_connector]: ../../../../agents/examples.md#-todoist
[navigation_connector_go]: ../../../../support/navigation.md#connector-go
