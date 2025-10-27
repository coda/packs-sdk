---
description: Improve the speed and efficiency of syncing data during indexing.
---

# Incremental sync

Rather than sync the full result set every time, sync tables can be updated to support an incremental sync, where each sync only returns new or updated records. APIs enable incremental syncs in various ways, most often requiring you to pass a timestamp or opaque sync token from the last sync to the next one.

To add support for incremental sync in your Pack, you’ll need to:

1. Return a `completion` object at the end of the final sync execution, which contains the metadata needed to perform the next incremental sync.
2. Update your `execute` method to detect a `previousCompletion` in the context, and if found, use it to perform an incremental sync.

The example below demonstrates the pattern, using a hypothetical API that supports filtering records using a `modifiedSince` parameter.

```{.ts hl_lines="7-9 16-20 29-35"}
pack.addSyncTable({
  // ...
  formula: {
    // ...
    execute: async function (args, context) {
      let pageToken = context.continuation?.pageToken;
      // Get the last synced date, if available.
      let lastSynced =
        context.previousCompletion?.incrementalContinuation?.lastSynced;
      let page;
      if (pageToken) {
        // Continue current sync.
        page = doSync(context, {
          pageToken: pageToken,
        });
      } else if (lastSynced) {
        // Start incremental sync.
        page = doSync(context, {
          modifiedSince: lastSynced,
        });
      } else {
        // Start full sync.
        page = doSync(context);
      }
      let result = { result: page.rows };
      if (page.nextPageToken) {
        // More pages to fetch in this sync, so include a continuation.
        result.continuation = { pageToken: page.nextPageToken };
      } else {
        // All done with this sync, but store the current timestamp to use for the
        // next incremental sync.
        let now = new Date();
        result.completion = {
          incrementalContinuation: { lastSynced: now.toISOString() },
        };
      }
      return result;
    },
  },
});
```


## Incompatible parameters

For some APIs only a limited set of filters are compatible with incremental sync. If you need to hide an optional parameter when the table is used in the data layer, you can set the field `supportsIncrementalSync` to false.

```{.ts hl_lines="6"}
coda.makeParameter({
  type: coda.ParameterType.String,
  name: "status",
  description: "The status of the task.",
  optional: true,
  supportsIncrementalSync: false,
})
```


## Periodic full syncs

Not all APIs provide perfect fidelity in their incremental sync, so to ensure accurate information the data layer will periodically perform a full sync instead of an incremental one. No changes are required to your Pack, as the sync engine will simply omit the `incrementalContinuation` when running your sync table.

Full syncs are currently scheduled to run once a week, but this is subject to change.


## Deleted records

During an incremental sync, you may determine that some records have been deleted. To communicate that, return the IDs (the value of the `idProperty`) of the deleted items in the `deletedItemIds` field of the result object.

```{.ts hl_lines="6 14"}
let items = [];
let deletedIds = [];
let updates = await getUpdates(context);
for (let update of updates) {
  if (update.action == 'deleted') {
    deletedIds.push(update.item.id);
  } else {
    // Created or updated.
    items.push(update.item);
  }
}
return {
  result: items,
  deletedItemIds: deletedIds,
};
```


## Partial updates not supported

When doing an incremental sync, the API may give you information about which fields changed and their new values. Unfortunately there is currently no way to pass only that limited set of information as a result, and you’ll need to fetch the full state of the item and return it.


## Handling errors

For many APIs the tokens used for incremental sync can expire, requiring a full sync to generate a new one. If you encounter an unrecoverable error like this during an incremental sync return a completion object with `hasIncompleteResults: true`. This will instruct the sync engine to run a full sync of that table to ensure that the latest data is available and future incremental syncs can be run.

```{.ts hl_lines="11-13"}
let page;
try {
  page = doSync(context, {
    modifiedSince: lastSynced,
  });
} catch (e) {
  if (StatusCodeError.isStatusCodeError(e) && e.statusCode === 410) {
    // The sync token expired, a full sync is needed.
    return {
      result: [],
      completion: {
        hasIncompleteResults: true,
      },
    };
  }
  throw e;
}
```
