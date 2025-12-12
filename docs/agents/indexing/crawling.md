---
nav: Crawling
description: Teach your agent how to crawl the data structures during indexing.
---

# Crawling related tables

Users want to access all their essential data in the knowledge layer, ideally with as little setup as possible. If your agent can sync all of the records the user has access to by default, then no further work is required. However, suppose some of your sync tables return only a subset of records per sync. In that case, you'll need to provide additional metadata in your Pack to enable the knowledge layer to crawl the entire dataset.

## Example

Imagine an agent with a Tasks table that can sync tasks for only a single project at a time, as specified by the user in the required `project` parameter. A user who wants to sync all of their tasks from all of their projects wouldn't be able to, as they can only set up the agent with one value for the `project` parameter.

You can solve this by defining a crawl hierarchy that the knowledge layer can follow. If you annotate the `project` parameter as connected to the Projects table, the knowledge layer will first sync the complete list of projects, then run a separate sync of the Tasks table for each project.

## Required code changes

To establish the crawl hierarchy, add the `crawlStrategy` field to the parameters of the child table that can be sourced from the parent table. Set `crawlStrategy` to point to the parent table and the specific column that contains the value.

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
        // Use the project IDs that come from the ID column in the Projects table.
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

    Note that for the crawl strategy, you refer to a table via its `name` value, not `identityName` value (which is used for schema references, etc).

## Dynamic sync tables

Crawling is not supported for dynamic sync tables. The data sources returned by `listDynamicUrls` will be shown to the user, but they'll have to select which ones to index manually.
