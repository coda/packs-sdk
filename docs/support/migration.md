---
title: Migration
---

# Migrating between SDK versions

While the Packs team strives to maintain backwards compatibility between SDK versions, there may occasionally be times where you need to change your code to work with a new SDK version. This page will include instructions on how to perform the migration. A detailed list of all changes in the SDK can be found in the [Changelog][changelog].


## 0.9.0 => 0.11.0

In preparation for a public launch, we intentionally introduced a number of breaking changes to make the SDK easier to use and understand. We hope to avoid breaking changes on this scale in the future.


### Rename schema fields `id`, `primary`, and `featured`

__Affects__: Packs that define a [schema][schemas].<br>
__Action Required__: Rename only.

To better reflect their meaning, we've renamed certain fields in the schema definition. Specifically:

- `id` --> `idProperty`
- `primary` --> `displayProperty`
- `featured` --> `featuredProperties`

Only the names of these fields have changed, and it there should be no impact on the functionality of your Pack.

```{.ts hl_lines="8-10"}
let MovieSchema = coda.makeObjectSchema({
  properties: {
    title: { type: coda.ValueType.String },
    year: { type: coda.ValueType.Number },
    movieId: { type: coda.ValueType.String },
    // ...
  },
  idProperty: "movieId",
  displayProperty: "title",
  featuredProperties: ["year"],
  // ...
});
```


### Add `identityName` to dynamic sync tables

__Affects__: Packs that include a dynamic sync table.<br>
__Action Required__: Add new code.

Like regular sync tables, dynamic sync tables now require the `identityName` field to be set. This will be used along with the dynamic URL to set the identity of the table. You no longer need to set the `identity` field of the schema generated in the `getSchema` function, as it will be constructed for you automatically.

To ensure that existing dynamic sync tables in your user's docs continue to work we strongly recommend you set this value to be the same as the name of the table.

```{.ts hl_lines="4"}
pack.addDynamicSyncTable({
  name: "Tasks",
  description: "The tasks in the selected project.",
  identityName: "Tasks",
  // ...
});
```


### Rename `defaultValue` field of parameters

__Affects__: Packs that have a parameter with a [suggested value][parameters_suggested].<br>
__Action Required__: Rename only.

To better reflect it's meaning, we've renamed the `defaultValue` field of parameter definitions:

- `defaultValue` --> `suggestedValue`

Only the name of the field has changed, and it there should be no impact on the functionality of your Pack.

```{.ts hl_lines="5"}
coda.makeParameter({
  type: coda.ParameterType.Number,
  name: "days",
  description: "How many days of data to fetch.",
  suggestedValue: 30,
})
```


### Move `attribution` settings in schema

__Affects__: Packs that define a schema that includes [`attribution`][schemas_attribution] information.<br>
__Action Required__: Slight refactor.

For compatibility with other changes, we've relocated the attribution definitions within a schema.

- `identity.attribution` --> `attribution`

Only the location of the field has changed, and it there should be no impact on the functionality of your Pack.

```{.ts hl_lines="3"}
let TaskSchema = coda.makeObjectSchema({
  // ...
  attribution: [
    {
      type: coda.AttributionNodeType.Text,
      text: "Provided by Todoist",
    },
  ],
});
```


### Rename authentication option `SetEndpoint.getOptionsFormula`

__Affects__: Packs that [prompt users for an account-specific endpoint][authentication_setendpoint].<br>
__Action Required__: Rename only.

For consistency with the rest of the SDK we've renamed the `getOptionsFormula` of the [`SetEndpoint`][SetEndpoint] object:

- `getOptionsFormula` --> `getOptions`

Only the name of the field has changed, and it there should be no impact on the functionality of your Pack.

```{.ts hl_lines="7"}
pack.setUserAuthentication({
  // ...
  postSetup: [{
    type: coda.PostSetupType.SetEndpoint,
    name: 'SelectEndpoint',
    description: 'Select the site to connect to:',
    getOptions: async function (context) {
      // ...
    },
  }],
});
```


### Use new `File` parameter type for files

__Affects__: Packs that accept files as parameters using the `Image` or `ImageArray` parameter types.<br>
__Action Required__: Slight refactor.

While previously there was no supported way to pass a non-image file as a parameter to a Pack formula, some developers may have noticed that using an `Image` or `ImageArray` parameter type would mostly work. We've now added a dedicated `File` and `FileArray` parameter for this purpose, and will eventually disable the previous loophole.

```{.ts hl_lines="6"}
pack.addFormula({
  name: "FileSize",
  description: "Gets the file size of an file, in bytes.",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.File,
      name: "file",
      description: "The file to operate on.",
    }),
  ],
  // ...
});
```


### Remove `varargsParameters` from sync tables

__Affects__: Packs that have erroneously set [`varargsParameters`][parameters_vararg] on a sync table.<br>
__Action Required__: Remove code.

Sync tables currently don't support [`varargsParameters`][parameters_vararg], as they aren't shown in the side panel. While we may fix this some day, for now we've introduced a validation rule to ensure they aren't set accidentally.

If any of your sync tables have `varargsParameters` set (unlikely) you'll need to remove them. Given that they weren't used anyway this should have no effect on your Pack's functionality.


### Set `networkDomain` on authentication config (multi-domain only)

__Affects__: Packs that use multiple [network domains][fetcher_network] (uncommon).<br>
__Action Required__: Add new code.

Packs that make requests to multiple network domains must now specify which domain their authentication configuration applies to. This is done to prevent credentials from leaking from one service to another.

For affected Packs, net the [`networkDomain`][BaseAuthentication_networkdomain] field of the authentication config to the domain it should apply to.

```{.ts hl_lines="6"}
pack.addNetworkDomain("coda.io");
pack.addNetworkDomain("example.com");

pack.setUserAuthentication({
  // ...
  networkDomain: "coda.io",
});
```


### Remove manual HTTP response decompression

__Affects__: Packs that receive compressed HTTP responses and are manually decompressing them.<br>
__Action Required__: Remove code.

Some external services and APIs return their responses compressed to save network bandwidth. This is indicated by the `Content-Encoding` HTTP header, which specifies the type of compression used (typically gzip or deflate). While many other HTTP libraries automatically decompress these responses for you, the Fetcher was returning the response body still in a compressed form. This required you to install a library to manually decompress the content before you could use it.

As of this SDK version the decompression will will be done automatically for you. You'll have to remove any code that was manually decompresses the responses.


[changelog]: ../reference/changes.md
[parameters_vararg]: ../guides/basics/parameters/index.md#vararg
[fetcher_network]: ../guides/advanced/fetcher.md#network-domains
[BaseAuthentication_networkdomain]: ../reference/sdk/interfaces/BaseAuthentication.md#networkdomain
[schemas]: ../guides/advanced/schemas.md
[SetEndpoint]: ../reference/sdk/interfaces/SetEndpoint.md
[authentication_setendpoint]: ../guides/advanced/authentication.md#setendpoint
[schemas_attribution]: ../guides/advanced/schemas.md#attribution
[parameters_suggested]: ../guides/basics/parameters/index.md#suggested
[sync_tables_identity]: ../guides/blocks/sync-tables/index.md#identity
[schemas_references]: ../guides/advanced/schemas.md#references