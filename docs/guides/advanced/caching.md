---
nav: Caching
description: The various caching layers and how to configure them.
---

# Caching formula and fetcher results

For performance reasons Coda uses a variety of caching techniques to store previous results and reuse them later. This guide discusses the various caching layers and how to configure them.

!!! info "Recalculation"
    The caching discussed below comes into play once the Coda formula engine decides to execute your formula. For more information about when formulas are recalculated, see the [Recalculation][formulas_recalculation] section of the Formulas guide.


## Formula cache {: #formula}

Before Coda executes your [Pack formula][formulas], it first checks a cache of previous formula results. If a matching entry is found, it is returned instead of re-running your code. When a cached result is returned, the Pack Maker Tools logs entry will end with **returned a prior result from the cache** and the **Cache hit** field will be set to **true**.

<img src="../../../images/cache_formula_logs.png" srcset="../../../images/cache_formula_logs_2x.png 2x" class="screenshot" alt="Cached formula in the logs">

Formula result caching is enabled by default for all Pack formulas. You can adjust the caching behavior by setting the [`cacheTtlSecs`][formulas_cacheTtlSecs] field on the formula definition, which specifies for how many seconds the result should be cached. To disable caching for a formula set that value to zero.

The following types of formulas are never cached:

- [Action formulas][actions]
- [Sync formulas][sync_formula]
- Formulas that result in an error


## Fetcher cache {: #fetcher}

When making an HTTP request with the [fetcher][fetcher], the Packs runtime first checks a cache of previous responses. If a matching entry is found, it is returned instead of making a request to the server. When a cached response is returned, the Pack Maker Tools logs entry will be labeled with **(Cached)** and the **Cache hit** field will be set to **true**.

<img src="../../../images/cache_fetcher_logs.png" srcset="../../../images/cache_fetcher_logs_2x.png 2x" class="screenshot" alt="Cached fetcher requests in the logs">

By default the Packs runtime caches the HTTP responses for `GET` requests, meaning that your code may not always be getting the latest response from the server. You can adjust this behavior by setting the [`cacheTtlSecs`][fetcher_cacheTtlSecs] field in the fetch request, which specifies for how many seconds the response should be cached. To disable caching for a request set that value to zero.

Fetcher caching is disabled by default in the sync formula of a sync table. While caching makes sense for most formulas, sync tables only execute at a regular interval or when the user has explicitly started a sync, and in either case fresh results are expected.

Requests that return an error (status code that isn't in the 200's) are never cached.


### Force caching for non-`GET` requests {:#forcecache}

By default non-`GET` requests (`POST`, etc) cannot be cached, since they are usually used to change state on the server. However there are times when these HTTP methods are used in a read-only way, such as submitting a GraphQL request, when caching would be desirable. In those cases you can enable caching of non-`GET` requests using the field `forceCache`.

```{.ts hl_lines="8-9"}
let response = await context.fetcher.fetch({
  method: "POST",
  url: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
  forceCache: true,
  cacheTtlSecs: 300,
});
```


### In-progress request de-duplication

If multiple, identical `GET` requests are all made at the same time they will be de-duplicated into a single request. This means that only the first request will actually be sent to the server, and the result will be returned for all of the requests. This de-duplication happens even when caching is disabled, and it won't show up in the logs as a cached response.

This is not an issue for most APIs, but if you are using a `GET` request to return a random or unique value then you could end up with duplicates. To bypass this de-duplication behavior simply add a unique query parameter to your URL for each request. The value in `context.invocationToken` is unique for each Pack execution and can be used for this purpose.


## Disable caching

To fully disable caching for a formula you must ensure you set the `cacheTtlSecs` to zero on the formula and on any fetcher requests used by the formula.

```{.ts hl_lines="3 8"}
pack.addFormula({
  // ...
  cacheTtlSecs: 0, // Disable formula caching.
  execute: async function ([], context) {
    let response = await context.fetcher.fetch({
      method: "GET",
      url: "https://example.com",
      cacheTtlSecs: 0, // Disable fetcher caching.
    });
    // ...
  },
});
```


## Duration and scope

The default time to live (TTL) for both caches is 5 minutes, and the maximum you can set is 24 hours. Both of these values are subject to change without warning. Setting a `cacheTtlSecs` value larger than the maximum will not result in an error, but will reduced down to the maximum. This TTL is best effort, and for a variety of reasons a cache entry may be evicted earlier.

Both caches are scoped to the unique inputs (formula name and parameters, or fetcher URL and headers) as well as the connected account (if [authentication][authentication] is used). The formula cache is additionally scoped to the document it's used in and the specific version of the Pack. Building or releasing a new version of your Pack will effectively invalidate the formula cache, ensuring you get fresh results using your new code.


## Recommendations

How long to set the caching time depends a lot on the specific data and how it's being used. However there are some general guidelines you can use:

- **Random data** - Formulas that return random data (random quote, etc) should fully disable caching. This ensures that each execution provides a unique value.
- **User data** - Formulas that return user data from another service (events in a calendar, etc) should cache the results for a few minutes. Some caching is useful for performance reasons, but too much can lead to user confusion, if for instance they update their data in the service and expect to see that change in the doc.
- **Stable data** - Formulas that return stable data (population of a country, etc) should cache the results for many hours. This data is very unlikely to change within a given time period, and maximizing the use of caching ensure the best performance for users.


[formulas]: ../blocks/formulas.md
[formulas_recalculation]: ../blocks/formulas.md#recalculation
[formulas_cacheTtlSecs]: ../../reference/sdk/interfaces/core.PackFormulaDef.md#cachettlsecs
[fetcher_cacheTtlSecs]: ../../reference/sdk/interfaces/core.FetchRequest.md#cachettlsecs
[actions]: ../blocks/actions.md
[sync_formula]: ../blocks/sync-tables/index.md#formula
[authentication]: ../basics/authentication/index.md
[fetcher]: ../basics/fetcher.md
