---
nav: Default configuration
description: Declare a default configuration so your agent can be set up with one click.
---

# Declare a default configuration

When a user adds your Pack as an agent in Superhuman Go, the platform can configure the knowledge layer automatically instead of asking the user to set up each sync table by hand. Declare a default configuration to opt your Pack in to this simplified setup. Packs that don't opt in aren't enrolled automatically.

A default configuration is assembled from three signals, all controlled by you:

- **Which sync tables to include**, set per table via `indexing.default`. See [Default behavior][indexing].
- **Default filters**, such as date ranges, set per parameter via `ingestionSuggestedValue`.
- **A Pack-level opt-in**, set via `setDefaultIngestionConfiguration`.

## Default filters

In a doc you keep a sync table's date range small, but the knowledge layer can hold much more data, so a broader range is usually better. Set `ingestionSuggestedValue` to override `suggestedValue` during ingestion:

```{.ts hl_lines="6-7"}
sdk.makeParameter({
  type: sdk.ParameterType.DateArray,
  name: "dateRange",
  description: "Include events within the given time range.",
  suggestedValue: sdk.PrecannedDateRange.Last30Days,
  ingestionSuggestedValue: sdk.PrecannedDateRange.Last365Days,
});
```

During ingestion the default value is taken from `ingestionSuggestedValue`, falling back to `suggestedValue`.

## Opt in

Call `setDefaultIngestionConfiguration` to opt in. An empty configuration uses each sync table's `indexing.default` to decide the default set:

```ts
pack.setDefaultIngestionConfiguration({});
```

To restrict the default set to specific sync tables, list them. Each name must match a sync table in your Pack:

```ts
pack.setDefaultIngestionConfiguration({
  syncTables: ["Events", "Contacts"],
});
```

## Examples

A Google Calendar agent includes all of its tables by default, so an empty configuration is enough:

```ts
pack.addSyncTable({name: "Events", /* ... */});
pack.addSyncTable({name: "Contacts", /* ... */});
pack.setDefaultIngestionConfiguration({});
```

A GitHub agent excludes a table that most users don't need and curates the default set:

```ts
pack.addSyncTable({name: "Issues", /* ... */});
pack.addSyncTable({name: "PullRequests", /* ... */});
pack.addSyncTable({
  name: "Workflows",
  indexing: {default: sdk.DataIndexing.Exclude},
});
pack.setDefaultIngestionConfiguration({syncTables: ["Issues", "PullRequests"]});
```

[indexing]: ../../reference/sdk/core/enumerations/DataIndexing.md
