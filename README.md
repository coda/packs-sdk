# Coda Packs SDK

_This is the documentation for the SDK to build Packs either via our Online Pack Editor or the Command Line Interface (CLI) tool. Click here (LINK FORTHCOMING) to learn how to use the Web IDE, and [here](README_CLI.md) to learn how to use the CLI._

- [Basic Concepts](#basic-concepts)
- [Core Concepts](#core-concepts)
  - [How Packs Work](#how-packs-work)
  - [Fetching Remote Data](#fetching-remote-data)
  - [Authentication](#authentication)
    - [User (Default) Authentication vs System Authentication](#user-default-authentication-vs-system-authentication)
    - [Security](#security)
    - [Authentication Types](#authentication-types)
  - [Syncs](#syncs)
    - [Continuation Examples](#continuation-examples)
    - [Dynamic Sync Tables](#dynamic-sync-tables)
      - [Implementing a Dynamic Sync Table](#implementing-a-dynamic-sync-table)
  - [Normalization](#normalization)
  - [Type Hints](#type-hints)
  - [Key Mapping and Extraneous Properties](#key-mapping-and-extraneous-properties)
  - [Formula Namespaces](#formula-namespaces)
  - [Metadata Formulas](#metadata-formulas)
  - [Execution Environment](#execution-environment)
  - [Logging](#logging)
  - [Temporary Blob Storage](#temporary-blob-storage)
- [Reference](#reference)

## Basic Concepts

Coda Packs allow you to extend Coda by building new building blocks that can operate directly on Coda docs' canvas. You can write these extensions in JavaScript/TypeScript, using them to create functions that let you re-use a formula's complex logic across documents or even  communicate with third-party APIs, with or without user authentication.

Packs are a combination of **formulas**, **sync tables**, and **column formats**.

A **formula (including a button)** is a JavaScript function that will be exposed as a Coda formula, that you can use anywhere in a
Coda doc that you can use any normal formula. Formulas take basic Coda types as input, like strings, numbers,
dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any
of these types. Buttons are just a flavor of a formula with the flag `isButton` activated.

A **sync table** is how to bring structured data from a third-party into Coda. A sync table is a table that
you can add to a Coda doc that gets its rows from a third-party data source, that can be refreshed regularly
to pull in new or updated data. A sync table is powered by a **formula** that takes parameters that represent
sync options and returns an array of objects representing row data. A sync table also includes a **schema**
describing the structure of the returned objects.

A **column format** is a custom column type that you apply to any column in any Coda table. A column format
tells Coda to interpret the value in a cell by executing a **formula** using that value, typically looking
up data related to that value from a third-party API. For example, the Weather pack has a column format
`Current Weather`; when applied to a column, if you type a city or address into a cell in that column,
that location will be used an input to a formula that fetches the current weather at that location,
and the resulting object with weather info will be shown in the cell.

Your formulas, sync tables, and column formats are bundled together with metadata describing your pack,
into a `PackDefinition` object which forms the complete specification of your pack.


## Core Concepts

### How Packs Work

When you build a Pack, you're ultimately outputting a bundle of compiled code that Coda then runs on your
behalf when the Pack is used in a doc. This is different from our API, where we allow you to retrieve/edit data from docs but developers are responsible for running their code.

Here's how Packs work:

Create a Pack
1. **Pack Makers create and build the Pack** via the Online Pack Editor or CLI tools.
2. **Build sent to Coda's Backend**, either via a command or automatically

Use the Pack in a Doc

3. **Doc Makers/Editors install the Pack in their doc**
4. **They invoke formulas from the doc**: When any formulaic element (e.g. formula, sync table, column format, button) is invoked, the request is sent to the Coda backend
5. **Coda runs the formula**: we retrieve your Pack build and run it for you in the Packs Secure Execution Environment. The formulas are run _only with the inputs provided to it_; each call to a formula is independent as formulas are state-less. Thus, Packs cannot rely on data that changes and persists between individual calls to a formula.
6. **If applicable, external API called** by the Execution Environment. All API calls will originate from our servers to protect authentication credentials, which we store on our servers and never send to clients.
7. **Return data to doc**: the results (or errors) from the execution are sent back to the doc.


TODO: add diagram


### Fetching Remote Data

One of the main reason packs are useful is that they can fetch data from a remote server or API and return it Coda.
The Coda Packs API permits you to make http requests to third-parties via the `Fetcher` objects. This is the **only**
way to make http requests in a pack, direct use of a a different http client is not permitted.

All pack formulas including sync formulas have a `Context` object as their 2nd parameter. This context contains
a property called `fetcher` that is a `Fetcher` object, exposing a single method, `fetch`. This method allows
you to specify common information for an http request, including the http method, url, headers, and body:

```typescript
const response = await context.fetcher.fetch({method: 'GET', url: 'https://myservice.com/api'});
```

The response object contains the http status code, response body, and response headers, as you'd expect.

The fetcher will apply authentication information to each request before it is sent, if you have configured
authentication for your pack. You do not, should not, and likely cannot apply authentication headers or
url parameters directly to a fetcher request; Coda will do this for you.

The fetcher may also apply rate limits, to ensure that a given pack is not sending too many requests in a
short period of time, which may affect the service you are fetching from.

### Authentication

Packs that use third-party APIs and particularly those that fetch user-specific data will almost
always require authentication. The SDK supports many kinds of authentication, you simply declare
what kind of authentication your pack uses and some configuration data in your pack definition,
and Coda will facilitate getting authentication information from the user when they use your pack,
and the necessary authentication data will be applied to each fetcher request that you make from
your pack code.

#### User (Default) Authentication vs System Authentication

The SDK broadly divides authentication into two categories: authentication that is tied to
the user of the pack vs authentication that is managed by the system, aka the pack author.
In the pack definition the former is known as `defaultAuthentication` and the latter
`systemConnectionAuthentication`. You will typically specify one or the other in your pack definition,
or neither if your pack does not make http requests or those requests do not require authentication.

Default authentication is the most common. Specify this if each user of your pack
should log in with OAuth, or have their own API key, or whatever user-specific token
is necessary for the pack to be able to retrieve data that is specific to that user.

Use system authentication if you as the pack author will provide the necessary tokens
to successfully make http requests within your pack. An example would be if your pack returns
weather forecasts and the API involved requires an API key, but individual users need
not provide their own API key. You as the pack author will register an API key and provide
it to Coda, and Coda will apply it to all pack requests regardless of the user.

#### Security

The SDK applies authentication info to fetcher requests automatically so you as the pack
author don't need to worry about doing so and about how to do so, making authoring packs
easier. But critically the SDK does this in a way so that packs code never has access
to any authentication information at all, so that users and pack authors are protected
from inadvertent or intentional mishandling of credentials.

Your packs code will invoke `context.fetcher.fetch()` without any authentication info;
in the process of executing the fetch request, Coda will automatically append credentials
to the headers or url of the request, as appropriate, and then fulfill the request.
Packs code will never have access to the request after authentication credentials have been applied.

#### Authentication Types

- **OAuth2**: The user will be prompted to go through an OAuth2 authentication flow in
  the browser with a third-party service. The access token that the third-party service
  provides to Coda at the end of this flow will be applied to each fetcher request
  in the `Authorization` header, in the form `Authorization: Bearer <access-token>`.
  A custom token prefix other than `Bearer` may be provided by the pack author if necessary.
  The pack author provides OAuth2 configuration information including the third-party urls
  to use for the token creation flow and token exchange, the scopes needed by the pack.
  The pack author must also provide a client id and client secret for the third-party service,
  which are typically obtained when registering a new application in the third-party
  service's developer portal. During your registration with that third-party, you will need
  to provide an authorization callback URL: https://coda.io/packsAuth/oauth2
  (or https://packs.adhoc.coda.io/packsAuth/oauth2 during our private alpha).
- **HeaderBearerToken**: The user (or pack author, if using system authentication) provides an API token
  which is applied to the `Authorization` header of each fetcher request, in the form
  `Authorization: Bearer <token>`.
- **CustomHeaderToken**: The user (or pack author, if using system authentication) provides an API token,
  which is applied to a custom API header as specified by the pack author, in the form
  `<custom-header>: <custom-prefix> <token>`.
- **QueryParamToken**: The user (or pack author, if using system authentication) provides an API token,
  which is applied to the url of each fetcher request in a url parameter specified by the pack author.
  Using url params for authentication is not recommended if there are other alternatives.
- **MultiQueryParamToken**: The user (or pack author, if using system authentication) provides
  multiple tokens, which are applied to the url of each fetcher request in url parameters specified
  by the pack author. This is not common. Using url params for authentication is not recommended
  if there are other alternatives.
- **WebBasic**: The user (or pack author, if using system authentication) provides a username and
  typically a password, which are base64-encoded and applied to the `Authorization` header of each
  fetcher request, in the form `Authorization: Basic <base64encode(username:password)>`, as outlined in
  [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).
  Web basic authentication sends passwords in clear text so is not recommended if there are
  alternatives.
- **CodaApiHeaderBearerToken**: Internally the same as `HeaderBearerToken` but for cases
  where a pack is going to make requests to Coda's own API. The UI will assist the user
  in creating and configuring an API token without the user needing to do this manually.
  This is mostly for use by Coda-internal packs.
- **Various**: Indicates that the pack has various different authentication methods. When
  this is indicated, the user will be able to specify what type of authentication to use
  when they create a connection. This is mostly for use by Coda-internal packs.

`OAuth2`, `CodaApiHeaderBearerToken`, and `Various` are not available for system authentication.

### Syncs

A sync is a specific kind of **formula**, with the goal of populating a Coda table with data from a
third-party data source. A sync formula returns an array of objects, with each object representing
a row of data in the resulting table.

Syncs assume that pagination will be necessary in most cases. One invocation of a sync formula
is not meant to return all of the applicable results, but only one **page** of results of a reasonable
size. For example, if you are fetching items from an API that returns 100 items per API request,
it would be very reasonable for your sync formula to return 100 results per invocation.

The 2nd parameter to a sync formula is a `SyncContext`, which has all the fields of the `Context` object
used with regular formulas, but also includes a property called `sync`, which is a `Sync` object
containing a property called `continuation`. A `Continuation` is a simple representation that you define
of where you are in the overall sync process. Conceptually, the continuation is just a page number,
but it can represent more if you need it.

The first time your sync formula is invoked, the continuation will be undefined. Your formula then
returns its array of results for that invocation, and optionally a continuation to use the next time
the sync formula is invoked. If a continuation is not returned, the sync terminates. If a continuation is
returned, that same continuation is passed as an input in `context.sync.continuation` the next time
the formula is invoked. The formula is invoked repeatedly with each subsequent continuation until
no continuation is returned.

A `Continuation` is just a JavaScript object mapping one or more arbitrary key names to a string or number.
It's up to you what you want to include to help you keep track of where you are in the overall sync.
Typically, if you're calling an API, the continuation closely matches what the API uses for pagination.

Suppose the API you're using allows you to pass a page number in a url parameter to filter results just
to that page. You could return `{page: 2}` as your continuation. You could then look at
`context.sync.continuation.page` in your sync formula to determine which page of results you
should request in that particular invocation.

If the API you're using instead returns a complete, opaque url of the next page of results in
response metadata, you might structure your continuation like
`{nextUrl: 'https://myapi.com/results?pageToken=asdf123'}`.

#### Continuation Examples

If your sync formula returns:

```typescript
return {
  result: [...one page of results...],
  continuation: {page: 2},
};
```

Your formula will be called again immediately with `{page: 2}` as the value of `context.sync.continuation`.

If your sync formula returns:

```typescript
return {
  result: [...last page of results...],
};

// or

return {
  result: [...last page of results...],
  continuation: undefined,
};
```

your sync will be assumed to be complete and your formula will not be invoked any further.

The arrays of partial results from each sync formula invocation will be merged together and inserted into the doc.

#### Dynamic Sync Tables

Most sync tables have schemas that can be statically defined. For example, if you're writing
a sync of a user's Google Calendar events, the structure of an Event from the Google Calendar
API is well-known and you can write a schema for what your table should contain.

In certain cases, you may want to sync data whose structure is not known in advance
and may depend on the user doing the sync. For example, Coda's Jira pack allows users
to sync data from their Jira instance, but Jira lets users create arbitrary custom fields
for their Issue objects. So the schema of the Issues sync table is not known in advance;
it depends on the Jira account that the user is syncing from.

Coda supports "dynamic" sync tables for cases like these. Instead of including a static
schema in your sync table definition, you include a formula that returns a schema.
This formula can use the fetcher to make authenticated http requests to your pack's API
so that you may retrieve any necessary info from that third-party service needed
to construct an appropriate schema.

To define a dynamic schema, use the `makeDynamicSyncTable()` wrapper function.
You will provide a `getSchema` formula that returns a schema definition. You'll
also provide some supporting formulas like `getName`, to return a name in the UI
for the table, in case even the name of the entities being synced is dynamic.

There are two subtle variants of dynamic sync tables. A sync table can be dynamic simply
because the shape of the entities being synced vary based on who the current user is.
For example, in the Jira example, Jira Issues are synced by hitting the same static
Jira API url for Issues, but the schema of the issues returned will be different
depending on the configuration of the Jira instance of the calling user.

Alternatively, a sync table can be dynamic because the data source is specific
to each instance of the table. If you were building a sync table to sync data
from a Google Sheet, the data source would be the API url of a specific sheet.
In this case, the sync table will be bound to a `dynamicUrl` that defines the data
source. This url will be available to all of the formulas to implement the sync table
in the sync context, as `context.sync.dynamicUrl`. To create a sync table that uses
dynamic urls, you must implement the `listDynamicUrls` metadata formula in your
dynamic sync table definition, as described below.

##### Implementing a Dynamic Sync Table

Use the `makeDynamicSyncTable()` wrapper function. It takes an object with the following fields:

- **name**: The name for this category of sync table. The actual name of the table once added to a
  doc will be generated dynamically by your `getName` formula. This static name is just used when
  describing the contents of your pack. For example, if you had a dynamic sync table that syncs a sheet
  of data from a Google Sheets spreadsheet, the static name you specify here might be "Sheet",
  indicating that this pack has a building block for syncing data from a sheet. You would implement
  your `getName` formula to return the actual name of the sheet, however.
- **getName**: A formula that returns a string, to be used as the title of the table when added to a doc.
  Typically this formula calls an API to get a name for the parent entity that you're syncing. In the
  Google Sheets example, this would call the Google Sheets API with the id of the sheet that you're syncing
  and return the name of that sheet.
- **getSchema**: A formula that returns a schema object. Typically this formula calls an API to get info
  about the shape of the data you are syncing. In the Google Sheets example, this formula might fetch the
  first few rows of data, look at the first row of column headers to use as schema property names, and perhaps
  look at a few pieces of data in each row to try to sniff a value type for each column (string, number, date, etc).
  The return value from this formula should always be an array schema:

  ```typescript
  return makeSchema({
    type: ValueType.Array,
    items: makeObjectSchema({
      type: ValueType.Object,
      // The property name from the `properties` object below that represents the unique
      // identifier of this item. A sync table MUST have a stable unique identifier. Without
      // one, each subsequent sync will wipe away all rows and recreate them from scratch.
      id: '<id property name>',
      // The property name from the `properties` object below that should label this item
      // in the UI. All properties can be seen when hovering over a synced item in the UI,
      // but the `primary` property value is shown on the chip representing the full object.
      primary: '<display property name>',
      // Zero or more property names from the `properties` object below that should be created
      // as projected columns by default the first time a user add this table to their doc.
      // If your items have lots of properties, it may be overwhelming to create columns for all
      // of them, so Coda will only automatically create columns for the featured properties
      // specified here. A user can always reference non-featured properties in formulas or create
      // new columns for those properties at any time.
      featured: [<featured property names>],
      // An identifier for the synced items, primarily used as an implementation detail.
      identity: {
        // A label for the kind of entities that you are syncing. In the Google Sheets example
        // you might use "Row" here, as each synced entity is a row from the source sheet.
        // This label is used in a doc to identify the column in this table that contains the synced data.
        // It must not contain any spaces or special characters.
        name: '<entity name>',
        // The dynamic url bound to this table instance, if any.
        dynamicUrl: context.sync.dynamicUrl,
      },
      // The actual schema properties.
      properties: {
        property1: {type: ValueType.Number},
        property2: {type: ValueType.String},
        ...
      },
    }),
  });
  ```

- **getDisplayUrl**: A metadata formula that returns a string, a user-friendly url representing the
  entity being synced. The table UI in the doc will provide a convenience link to this url so
  the user can easily click through to the source of data in that table.
  In the Google Sheets example, this could be the url to the web-editable spreadsheet document,
  (as opposed to the API url of the sheet). The `dynamicUrl` for a sync table is typically an API url
  for whatever service you're syncing from, which is not a meaningful url for an end user.
  Typically this formula returns a browser-friendly version
  of the dynamic url.
- **listDynamicUrls**: (Optional) A metadata formula that returns an array of items of the form
  `{display: '<display label>', value: '<dynamic url>'}`. If your table is in the category of those
  that require a dynamic url as described above, you must implement this method to list the
  dynamic urls available to the current user. The actual dynamic url is returned in the `value` property
  of each item in the returned array, but you must also specify a `display` string, which is the user-friendly
  name of the entity that will be displayed to the user in the UI in a list of sync-able entities.
  In the Google Sheets example, this formula would return a list of the sheets that the user has access to;
  the `display` property would be the name of the sheet and the `value` property would be the
  Google Sheets API url for that sheet.
- **entityName**: (Optional) A label for the kind of entities that you are syncing. In the Google Sheets example
  you might use "Row" here, as each synced entity is a row from the source sheet. This label is used in a doc to identify the column in this table that contains the synced data. If you don't provide an `entityName`, the value
  of `identity.name` from your schema will be used instead, so in most cases you don't need to provide this.
- **formula**: The definition of the formula that actually performs the sync. This formula definition has the
  same structure as a static (non-dynamic) sync table formula. The implementation of your formula,
  the function given as the `execute` property, has the same form has any other pack formula, taking
  two parameters, the first being the list of parameters given by the user, and the second being
  the execution context. As with a static sync table, the execution context has a `sync` property
  that provides sync-specific context, and in particular, if you are using a dynamic sync table with a
  `dynamicUrl` that url will be available to your implementation as `context.sync.dynamicUrl`.

  ```typescript
  {
    ...
    execute: async (params, context) => {
      const request = {
        method: 'GET',
        dynamicUrl: context.sync.dynamicUrl,
      }
      const response = await context.fetcher.fetch(request);
      ...
    },
  }
  ```

Each of the above metadata formulas (`getName/getDisplayUrl/getSchema/listDynamicUrls`) should be implemented
with functions that take a single parameter, the execution context. The `dynamicUrl`, if used, is similarly
provided via `context.sync.dynamicUrl`:

```typescript
makeDynamicSyncTable({
  ...
  getName: async context => {
    const response = await context.fetcher.fetch(context.sync.dynamicUrl);
    return response.body.entityName;
  },
  ...
});
```

### Normalization

Syncs and formulas that return objects get **normalized**, which simply means that their property names get
rewritten to a standardized format. So long as you use the wrapper methods like `makeObjectFormula()` or
`makeSyncTable()`, which we require as a best practice, this will happen automatically
on your behalf so you don't need to worry about implementing normalization. However, it will affect
the return values of object formulas and syncs so it's good to be aware of what's happening in order
to understand the output when testing your formulas and avoid being surprised.

There are a few reasons that object property names are normalized. One is to remove any punctuation from
property names that would affect the Coda formula builder and cause a user to be unable to access
a field in an object due to a bad name. Another reason is to standardize all property names across
all the different packs which have different authors, so that working with pack values is consistent
for Coda users.

Normalization simply removes punctuation and rewrites strings into Pascal case. That is, property names
like `fooBar`, `foo_bar`, and `foo bar` will all be normalized to `FooBar`.

The SDK will normalize both the schema as well as the return values from object formulas. So for example, if you're working with an API that returns a User object that looks like `{id: '...', name: '...'}`, you can define the schema for the object as

```typescript
const userSchema = makeObjectSchema({
  type: ValueType.Object,
  id: 'id',
  primary: 'name',
  properties: {
    id: {type: ValueType.String},
    name: {type: ValueType.String},
  },
});
```

And your formula can return objects you get from the API that look like ``{id: '...', name: '...'}` as-is. Coda will normalize the schema so that it looks like

```typescript
{
  type: ValueType.Object,
  id: 'Id',
  primary: 'Name',
  properties: {
    Id: {type: ValueType.String, fromKey: 'id'},
    Name: {type: ValueType.String, fromKey: 'name'},
  },
}
```

And it will convert your return value into `{Id: '...', Name: '...'}` to match the schema.

When testing your code using `coda execute` or the testing helpers provided by the SDK like
`executeFormulaFromPackDef`, you'll notice that the return values are normalized as above.

### Type Hints

The SDK intentionally provides only a few value types for object properties to keep things
simple, but the Coda application is able to understand many more types of values.
The SDK allows you to optionally provide a `codaType` when declaring a property in an object
schema which tells Coda how to interpret a value that is otherwise one of the basic value types.

For example, suppose the API you're using provides a created-at timestamp as a numeric Unix time value.
You can simply declare your field as `{type: ValueType.Number, codaType: ValueHintType.DateTime}` and
Coda will parse the timestamp into a proper DateTime value on your behalf.

Or perhaps you want to return an object that has an image associated with it, and your pack
and the API it integrates with specify that image as a url. Your schema can declare that
property as `{type: ValueType.String, codaType: ValueHintType.Image}` and that url will be
downloaded to be hosted on Coda and presented as an image in the Coda UI.

TODO: Link to full reference on hint types.

### Key Mapping and Extraneous Properties

The SDK assumes that it will be common to write packs that mostly fetch and return data from
third-party API, and that massaging that data to conform to an SDK schema might be tedious,
so the SDK supports ways to pass through third-party data as-is or with minimal massaging.

The SDK will automatically remove properties that are not declared within the schema. So if
your API returns properties not useful to the end user, you can just leave them out of the
object schema and they will be automatically elided.

To make parsing an API object and massaging it to match your schema easier, you can use the
`fromKey` property of a schema property definition. This instructs the SDK to convert
properties with whatever name you specified in the `fromKey` property to the name that you
gave to that property in the schema.

So suppose that the API you're working with returns a User object that looks like
`{userId: '...', userName: '...'}` but you want your pack to return a value that has the
friendlier property names `id` and `name`. You can define your schema as

```typescript
const userSchema = makeObjectSchema({
  type: ValueType.Object,
  id: 'id',
  primary: 'name',
  properties: {
    id: {type: ValueType.String, fromKey: 'userId'},
    name: {type: ValueType.String, fromKey: 'userName'},
  },
});
```

You can then return the user object from the API as-is, and the `userId` and `userName` fields
will be remapped to `id` and `name` (and then those fields will be normalized, too).

With the use of the schema declaration (including `fromKey`), you generally can avoid writing
any custom code to remove or remap fields to make an API object conform to your desired schema.


### Metadata Formulas

While **formulas** and **sync tables** are the backbone of your pack, sometimes you will
want or need to provide **metadata formulas** to help with the usability of your pack.

For example, if your pack uses authentication, you should provide a `getConnectionName`
metadata formula, which should return a user-friendly label for the credentials the user has
provided. If the user provides your pack with an API key, you can implement a
`getConnectionName` formula that hits your API's `/whoami` endpoint to get the name of
the account that the API token belongs to and returns that name. Coda will display that
name in the UI to help the user understand which underlying account(s) they're using with
your pack.

Another common use of metadata formulas is for **parameter autocomplete**. You may
define a formula parameter that should only accept a specific set of enumerated values.
Suppose that your formula accepts a `country` parameter that should only be one of the
20 country codes that your API supports. You would probably want to include
an `autocomplete` option in your parameter definition, which would be a metadata formula
that returns those 20 valid values. The user would be able to select value from a dropdown
instead of having to type a value directly. Your autocomplete formula can either return
static values directly (in which case you can simply provide the array of items to use
and a metadata formula will be generated implicitly)
but it can also use the fetcher to request values from an API.

A metadata formula is structurally similar to a regular pack formula, in that it is
given an `ExecutionContext` and may make fetcher requests.

For parameter autocomplete metadata formulas, a `search` string is passed, indicating a
full or partial search query that the user has entered. An autocomplete formula will
be passed a `formulaContext` argument, which consists of key-value pairs representing
any other parameters the user has already selecting when configuring their formula or sync.
For example, your formula may accept parameters for both a country and a state/province.
The state/province options offered will depend on which country was selected, so your
metadata formula invocation for the state/province parameter will want to look at the
`formulaContext` to see which country has been selected.

### Execution Environment

Coda packs execute on the server side in a special isolated node environment. They do not execute in the browser
and don't have access to any browser resources or user information other than what the packs infrastructure explicitly provides.

### Logging

`ExecutionContext` provides a `Logger` interface that allows you to log messages
that you can view in your Pack's development console. This can be useful for debugging during development
as well as in production.

```typescript
const result = context.fetcher.fetch('http://my/api');
if (result.body.foo !== 42) {
  context.logger.warn('Did not receive foo as expected, got %s', result.body.foo);
}
```

The format of the `message` parameter to the `Logger` method is (documented here)[https://nodejs.org/api/util.html#util_util_format_format_args].

### Temporary Blob Storage

TODO: Write


## Reference

Visit [https://coda.github.io/packs-sdk](https://coda.github.io/packs-sdk) for detailed reference documentation.
