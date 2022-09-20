---
nav: "Continuation"
---
# Interface: Continuation

[core](../modules/core.md).Continuation

Container for arbitrary data about which page of data to retrieve in this sync invocation.

Sync formulas fetch one reasonable size "page" of data per invocation such that the formula
can be invoked quickly. The end result of a sync is the concatenation of the results from
each individual invocation.

To instruct the syncer to fetch a subsequent result page, return a `Continuation` that
describes which page of results to fetch next. The continuation will be passed verbatim
as an input to the subsequent invocation of the sync formula.

The contents of this object are entirely up to the pack author.

Examples:

```
{nextPage: 3}
```

```
{nextPageUrl: 'https://someapi.com/api/items?pageToken=asdf123'}
```

## Indexable

▪ [key: `string`]: `string` \| `number` \| { `[key: string]`: `string` \| `number`;  }
