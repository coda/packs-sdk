---
nav: Overview
description: Add content to the built-in vector database to use with RAG.
---

# Index content into the knowledge layer

LLMs have a limited context window — the amount of text they can consider at once. This can make it challenging to give your agent access to all the data it needs, which can be much larger. One approach is RAG (retrieval-augmented generation), in which the LLM first retrieves relevant records for the user’s query and then generates a response using them.

The {{ custom.agent_product_name }} platform provides a built-in RAG system we call the knowledge layer. You write some code in your agent to sync the records, and Grammarly will chunk them, store them in a vector database, and expose a search tool to your agent. See the [Tools guide][tools_knowledge] for more information on how to connect indexed knowledge to a skill.


## When to use it

An agent may work with many different types of records, but indexing may not be appropriate for all of them. Indexing works best for record types that have:

- Contain significant text content that the user will want to search over.
- Have user-visible URLs that the user would want to click into.

Indexing a blog post or draft email makes sense, but indexing quarterly sales numbers does not.


## Powered by sync tables

Sync tables are a Pack building block that let you pull in large lists of records from external sources. They are primarily composed of a schema that defines the data structure and a sync formula that makes requests and transforms the data. You can read more about how to create a sync table in the [Sync tables guide][sync_tables].

To set up indexing, create a sync table for each record type you want to index. You'll need to ensure the schema includes the required metadata, as described in the [Schema changes guide][indexing_schemas]. You can improve the data freshness by implementing [Incremental sync][incremental] and simplify the user set by implementing [crawling][crawling].


[sync_tables]: ../../guides/blocks/sync-tables/index.md
[tools_knowledge]: ../features/tools.md#knowledge
[indexing_schemas]: ./schema.md
[incremental]: ./incremental.md
[crawling]: ./crawling.md
[todoist_agent]: ../examples.md#-todoist
