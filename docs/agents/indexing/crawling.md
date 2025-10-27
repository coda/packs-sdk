---
nav: Crawling
description: Teach your agent how to crawl the data structures during indexing.
---

# Crawling related tables

Users want to access to all of their important data in the knowledge layer, ideally with as little setup as possible. If your agent can sync all of the records the user has access to by default, then no further work is required. However, if some of your sync tables can only return a subset of records in each sync, then you’ll need to provide additional metadata in your Pack that allows the knowledge layer to crawl the entire dataset.

## Example

Imagine an agent that has a Tasks table that can only sync in the tasks for a single project at a time, as specified by the user in the required `project` parameter. A user that wants to sync in all of their tasks from all of their projects wouldn't be able to, as they can only setup the agent with one value for the `project` parameter.

You can solve this by defining a crawl hierarchy that the knowledge layer can follow. If you annotate the `project` parameter as being connected to the Projects table, then the knowledge layer will first sync in the full list of projects, and then run a separate sync of the Tasks table for each project found.

## Required code changes

In order to establish the crawl hierarchy, add a `crawlStrategy` to the parameter of the child table, pointing to the parent table and column where it should source it’s values from.

```{.ts hl_lines="12-17"}
pack.addSyncTable({
  name: "Tasks",
  // ...
  formula: {
    // ...
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'project',
        description: 'The ID of the project containing the tasks.',
        // Use the project IDs come from ID column in the Projects table.
        crawlStrategy: {
          parentTable: {
            tableName: 'Projects',
            propertyKey: 'id',
          },
        },
      }),
    ],
    // ...
  },
});

const ProjectSchema = coda.makeObjectSchema({
  properties: {
    id: { type: coda.ValueType.String },
    // ...
  },
  // ...
});

pack.addSyncTable({
  name: "Projects",
  identityName: "Project",
  schema: ProjectSchema,
  // ...
  formula: {
    name: "SyncProjects",
    // ...
  },
});
```

!!! info "Table name, not identity"

    Note that for the crawl strategy you refer to a table via its `name` value, not `identityName` value (which is used for schema references, etc).

## Dynamic sync tables

Crawling is not supported for dynamic sync tables. The datasources returned by `listDynamicUrls` will be shown to the user, but they’ll have to manually select which ones to index.
