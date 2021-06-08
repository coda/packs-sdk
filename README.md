# Coda Packs SDK

- [Basic Concepts](#basic-concepts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [One-time Setup](#one-time-setup)
    - [Global Install (Quick)](#global-install-quick)
    - [Single-Project Install (Recommended)](#single-project-install-recommended)
  - [Setup Your Pack Definition](#setup-your-pack-definition)
- [Running Your Code](#running-your-code)
  - [Running Formulas](#running-formulas)
  - [Running Syncs](#running-syncs)
  - [Fetching](#fetching)
- [Uploading Packs](#uploading-packs)
  - [Registering an API Key](#registering-an-api-key)
  - [Creating a New Pack](#creating-a-new-pack)
  - [Uploading a Pack Version](#uploading-a-pack-version)
  - [Creating a Release](#creating-a-release)
- [Examples](#examples)
- [Core Concepts](#core-concepts)
  - [Fetching Remote Data](#fetching-remote-data)
  - [Authentication](#authentication)
    - [User (Default) Authentication vs System Authentication](#user-default-authentication-vs-system-authentication)
    - [Security](#security)
    - [Authentication Types](#authentication-types)
  - [Testing Authenticated Requests](#testing-authenticated-requests)
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
- [Testing Your Code](#testing-your-code)
  - [Basic Formula Unittest](#basic-formula-unittest)
  - [Formula Unittest With Mock Fetcher](#formula-unittest-with-mock-fetcher)
  - [Sync Unittest](#sync-unittest)
  - [Integration Test](#integration-test)
  - [Return Value Validation](#return-value-validation)
- [Best Practices](#best-practices)
  - [File Structure](#file-structure)
- [Assets](#assets)
- [Reference](#reference)

## Basic Concepts

Coda Packs allow you to extend the functionality of Coda with extensions that you write in JavaScript/TypeScript.
These extensions can communicate with third-party APIs, with or without user authentication, if desired.

Packs are a combination of **formulas**, **sync tables**, and **column formats**.

A **formula** is a JavaScript function that will be exposed as a Coda formula, that you can use anywhere in a
Coda doc that you can use any normal formula. Formulas take basic Coda types as input, like strings, numbers,
dates, booleans, and arrays of these types, and return any of these types or objects whose properties are any
of these types.

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

## Getting Started

### Prerequisites

Make sure you have **node** and **npm** installed. We also recommend developing using TypeScript,
in which case, make sure that you have TypeScript and **ts-node** installed.

### One-time Setup

#### Global Install (Quick)

The simplest way to get started with the SDK is to install it globally:

```bash
npm install --global git+ssh://github.com/coda/packs-sdk.git
```

#### Single-Project Install (Recommended)

It's easier to manage dependencies and avoid version conflicts across projects
if you create an npm project for your pack and install the SDK and other dependencies
locally.

Create a new project directory if you haven't already and initialize your project:

```bash
# Initialize npm and follow prompts.
npm init
# Install the Coda Packs SDK locally in your project
npm install --save git+ssh://github.com/coda/packs-sdk.git
```

Update your path so you can easily use the `coda` commandline (CLI) that ships with the SDK:

```bash
# Make sure to run this from the root directory of your project.
export PATH=$(pwd)/node_modules/.bin:$PATH
```

(Globally-installed npm packages link CLI scripts into your system path. Locally installed packages
live in `./node_modules/.bin` and so are more easily used by updating your path.)

### Setup Your Pack Definition

Run `coda init` to initialize an empty project with the recommended file structure
and install the suggested npm dependencies.

## Running Your Code

Once published, your pack functionality will be executed on Coda servers after being invoked from a Coda doc.
During the development process, you can call your formulas directly from the commandline, to simulate this
process for rapid development. When you're nearing the end of authoring your pack, you can upload your pack
to Coda and run it in a real doc to verify it works as intended.

### Running Formulas

The `coda` CLI utility helps you execute formulas, via the `coda execute` sub-command. You can run
`coda execute --help` at any time to refresh yourself on usage. The syntax is:

```bash
coda execute path/to/manifest.ts <formula> [params..]
```

So for example, if your pack definition was in `src/manifest.ts` and you wanted to call a function
named `MyFormula` that takes one argument, you'd run:

```bash
coda execute src/manifest.ts MyFormula some-arg
```

This will execute the formula and print the output to the terminal. (A quick reminder, if your arguments
have spaces or special characters in them, put them in quotation marks when specifying them on the
commandline.)

The `coda execute` utility will look at your pack definition to determine the types of your parameters
and will interpret your arguments accordingly. For example, if your formula takes a string and you pass
`123` as an argument on the commandline, it will know to interpret that as a string, but if your formula
takes a number, it will interpret `123` as a number before executing the formula.

To pass array parameters to `coda execute`, use a comma separated string. For example, [1,2,3] should be
passed with this format:

```bash
coda execute src/manifest.ts MyFormula "1,2,3"
```

### Running Syncs

The above example shows how to execute a regular pack **formula**. Executing a **sync** is almost
identical:

```bash
coda execute path/to/manifest.ts <sync name> [params..]
```

So for example, if you had a sync called `Items`, that took a start date as a parameter,
you would execute this as:

```bash
coda execute path/to/manifest.ts Items 2020-12-15
```

This will execute your sync formula repeatedly until there are no more results, and print
the output array of all result objects to the terminal. See [Syncs](#syncs) for more
information about how and why sync formulas are invoked repeatedly for paginated results.

If your sync table is a dynamic sync table with a variable source URL, use the `--dynamicUrl`
parameter to specify which table your sync will use. This will likely be an API-specific URL,
not a user-friendly URL that could be used in a browser.

```bash
coda execute path/to/manifest Items --dynamicUrl=https://items.com/api/table
```

### Fetching

By default, `coda execute` will use a mock fetcher for any http requests that your formulas make.
If you wish to actually make http requests, use the `--fetch` flag, for example:

```bash
coda execute --fetch src/manifest.ts MyFormula some-arg
```

Your http requests will commonly require authentication in order to succeed, which the `coda execute` utility supports.
See the [Authentication](#authentication) section about how to set this up.

## Uploading Packs

**NOTE: Pack uploads are currently unlaunched and are still in testing. The following commands will not work yet.**

Note: if you are a beta tester using these commands with an alternative Coda environment,
each of these commands accepts an optional `--codaApiEndpoint` where you must specify
the url of that environment, e.g. `--codaApiEndpoint=https://<env>.coda.io`

### Registering an API Key

All of the pack upload commands work with the Coda API to upload your pack, and hence
require an API key to identify you as the user. Simply run this command, and you'll be
given a link to the Coda Account page to create an API token, which you can then
paste in the terminal. You API key will be saved in a hidden local file `.coda.json`
in your current directory, to be used with future commands.

```bash
coda register
```

### Creating a New Pack

When you've implemented your pack and are ready to upload it to Coda for the first time,
you'll need to create new pack on Coda's servers to get assigned a pack id. Run this
command just once for each pack you create:

```bash
coda create path/to/manifest.ts
```

This will create a new empty pack on Coda's servers. It will print out the url of the
pack management page in the Coda UI, and store the newly-assigned pack id in a hidden file
`.coda-pack.json` in the same directory as your manifest file. (This allows you to put
multiple pack definitions in the same repo, as long as they're in **different directories**.)
The id in this file will be used subsequent CLI commands for managing your pack.

This command accepts optional flags for specifying a name and description for the pack.
You can always set or update the name and description in the pack management UI later.

```bash
coda create path/to/manifest.ts --name "My Pack" --description "My pack description."
```

### Uploading a Pack Version

As you make changes to your pack, when you're ready to upload them to Coda so that
you can try them in a real doc, use this command to upload a new version of your
pack based on your latest code.

```bash
coda upload path/to/manifest.ts
```

This will build and upload your compiled pack implementation. You must update the `version` in your manifest
to be greater than your previous upload.

Once uploaded, as an editor of the pack, you'll be able to install this specific version
of your pack in any of your docs, without affecting the live release version of your pack
that other users may be using, giving you an opportunity to test out your latest changes
in your docs before making them live to users.

This command accepts an optional flag where you can provide notes about the contents of the version, helping you track changes from version to version.

```bash
coda upload path/to/manifest.ts --notes "Added the formula MyNewFormula."
```

**NOTE: At this time, this command will not upload your _source code_, only your compiled pack.** You will not see your source code
in the web editor as you would if you had used the web code editor to compose your pack.

### Creating a Release

When you've tested a pack version and want to make that version live for users of your
pack, create a release. The pack version that you release will become the version that
is used by new installations of your pack, and existing installations will gradually
be upgraded to this version.

```bash
coda release path/to/manifest.ts <optional-version>
```

If you don't explicitly specify a version, the version specified in your manifest.ts
file will be used. But you are free to specify another pack version here if you wish
to release a specific version rather than the latest.

The version must always be greater than that of any of your previous releases.

Alternatively, you can easily create releases from the pack management UI.

This command accepts an optional flag where you can provide notes about the contents of the release, helping you and users of your pack understand what changed from release to release.

```bash
coda release path/to/manifest.ts --notes "Added the formula MyNewFormula."
```

## Examples

See our examples repo https://github.com/coda/packs-examples for several examples of complete
pack definitions of various levels of complexity.

## Core Concepts

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
  service's developer portal.
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
  Web basic authentication sends passwords in cleartext so is not recommended if there are
  alternatives.
- **CodaApiHeaderBearerToken**: Internally the same as `HeaderBearerToken` but for cases
  where a pack is going to make requests to Coda's own API. The UI will assist the user
  in creating and configuring an API token without the user needing to do this manually.
  This is mostly for use by Coda-internal packs.
- **Various**: Indicates that the pack has various different authentication methods. When
  this is indicated, the user will be able to specify what type of authentication to use
  when they create a connection. This is mostly for use by Coda-internal packs.

`OAuth2`, `CodaApiHeaderBearerToken`, and `Various` are not available for system authentication.

### Testing Authenticated Requests

The SDK will help you set up authentication in your development environment so that you can
execute pack formulas with authentication applied to them, allowing you to run your code
end-to-end including making fetcher requests to third-party services.

The `coda auth` utility is used to set up authentication for a pack. Run `coda auth --help` at
any time for a refresher on how to use the utility. Mostly, it's as simple as running

```bash
coda auth path/to/manifest.ts
```

The utility will inspect your pack definition to see what kind of authentication you
have defined, and then it will prompt you to provide in the console the necessary
token(s) or other parameters required by your authorization type.
If you are using `OAuth2`, after you provide the necessary configuration info,
it will launch an OAuth flow in your browser.

The credentials you provide will be stored in a file `.coda-credentials.json`
in the same directory as your manifest.(If you move your manifest file, you'll want
to move the credentials file along with it!)
When you execute a pack formula using `coda execute --fetch path/to/manifest.ts ...`, the credentials
in this file will be applied to your fetcher requests automatically.

Similarly, if you are writing an integration test for your pack,
you can pass `useRealFetcher: true` and `manifestDir: '<manifest-dir>'` in the `ContextOptions` argument
when calling `executeFormulaFromPackDef()` or `executeSyncFormulaFromPackDef()`,
and a real (non-mock) http fetcher will be used, and any credentials that you
have registered will be applied to those requests automatically.
The `manifestDir` option is required if your integration test requires authentication so that
the SDK knows where to find the credentials file for this pack; normally you can just pass
`manifestPath: require.resolve('../manifest')`, where you can replace `'../manifest'` with whatever
the relative import path from your test to your manifest is.

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
  and return the name of that sheet. As with all metadata formulas, you will wrap your formula implementation
  with `makeMetadataFormula()`.
- **getSchema**: A formula that returns a schema object. Typically this formula calls an API to get info
  about the shape of the data you are syncing. In the Google Sheets example, this formula might fetch the
  first few rows of data, look at the first row of column headers to use as schema property names, and perhaps
  look at a few pieces of data in each row to try to sniff a value type for each column (string, number, date, etc).
  As with all metadata formulas, you will wrap your formula implementation with `makeMetadataFormula()`.
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
  of the dynamic url. As with all metadata formulas, you will wrap your formula implementation with `makeMetadataFormula()`.
- **listDynamicUrls**: (Optional) A metadata formula that returns an array of items of the form
  `{display: '<display label>', value: '<dynamic url>'}`. If your table is in the category of those
  that require a dynamic url as described above, you must implement this method to list the
  dynamic urls available to the current user. The actual dynamic url is returned in the `value` property
  of each item in the returned array, but you must also specify a `display` string, which is the user-friendly
  name of the entity that will be displayed to the user in the UI in a list of syncable entities.
  In the Google Sheets example, this formula would return a list of the sheets that the user has access to;
  the `display` property would be the name of the sheet and the `value` property would be the
  Google Sheets API url for that sheet. As with all metadata formulas, you will wrap your formula
  implementation with `makeMetadataFormula()`.
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
  getName: makeMetadataFormula(async context => {
    const response = await context.fetcher.fetch(context.sync.dynamicUrl);
    return response.body.entityName;
  }),
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
a field in an object due to a bad name. Another reason is to standarize all property names across
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
object scehma and they will be automatically elided.

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

### Formula Namespaces

When defining the formulas included in your pack, you must place them in a **namespace**.
When users invoke your formula in the Coda UI (or you invoke them when testing your pack)
the formula will be prefixed by its namespace.

The namespace exists so that formulas can be nicely grouped together by the pack they
originated from, to make it easier to work with docs that have lots of formulas and
avoid collisions when multiple unrelated packs may define formulas with the same name.
Generally, the name of your namespace can just be the name of your pack (without any
spaces or punctuation).

So if you're writing a pack that integrates with Slack, you'd probably want to choose `Slack`
as your formula namespace. If you wrote a formula that sends a Slack message, you would
invoke that formula in a doc using `Slack::SendMessage(...)`. When users are writing formulas in their
docs, they can type `slack` and autocomplete will show them all of the formulas in the `Slack`
namespace. If the user also used the Gmail pack and that pack also defined a `SendMessage`
formula, it would be easy for the user to differentiate between the two because they
have separate and clear namespaces: `Slack::SendMessage` vs `Gmail::SendMessage`.

(You'll note that you needn't use a namespace with `coda execute` because the CLI can
infer the namespace from the manifest file you specify in that command.)

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
static values directly (in which chase the `makeSimpleAutocompleteMetadataFormula` helper
should make this trivial to write) but it can also use the fetcher to request values
from an API.

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

## Testing Your Code

The SDK includes some utilities to help you write unittests and integration tests for your pack.
These utilities include:

- Helper functions to execute a specific formula or sync from your pack definition.
- Mock fetchers (using `sinon`) to simulate http requests and responses.
- Validation of formula inputs and return values to help catch bugs both in your test code
  and your formula logic.
- Hooks to apply authentication to http requests for integration tests.

You'll find testing and development utilities in `packs-sdk/dist/development`.

The primary testing utilities are `executeFormulaFromPackDef` and `executeSyncFormulaFromPackDef`.
You provide the name of a formula, a reference to your pack definition, and a parameter list,
and the utility will execute the formula for you, validate the return value, and return it to you
for further assertions. These utilities provide sane default execution contexts, and in the case of
a sync, will execute your sync formula repeatedly for each page of results, simulating what a
real Coda sync will do.

By default, these utilities will use an execution environment that includes a mock fetcher
that will not actually make http requests. You can pass your own mock fetcher if you wish
to configure and inspect the mock requests.

### Basic Formula Unittest

Here's a very simple example test, using Mocha, for a formula that doesn't make any
fetcher requests:

```typescript
import {executeFormulaFromPackDef} from 'coda-packs-sdk/dist/development';
import {manifest} from '../manifest';

describe('Simple Formula', () => {
  it('executes a formula', async () => {
    const result = await executeFormulaFromPackDef(manifest, 'MyFormula', ['my-param']);
    assert.equal(result, 'my-return-value');
  });
});
```

### Formula Unittest With Mock Fetcher

A more interesting example is for a pack that does make some kind of http request using the fetcher.
Here we set up a mock execution context, register a fake response on it, and pass our pre-configured
mock fetcher when executing our formula.

```typescript
import {MockExecutionContext} from 'coda-packs-sdk/dist/development';
import {executeFormulaFromPackDef} from 'coda-packs-sdk/dist/development';
import {manifest} from '../manifest';
import {newJsonFetchResponse} from 'coda-packs-sdk/dist/development';
import {newMockExecutionContext} from 'coda-packs-sdk/dist/development';
import sinon from 'sinon';

describe('Formula with Fetcher', () => {
  let context: MockExecutionContext;

  beforeEach(() => {
    context = newMockExecutionContext();
  });

  it('basic fetch', async () => {
    const fakeResponse = {
      id: 123,
      name: 'Alice',
    };
    context.fetcher.fetch.returns(newJsonFetchResponse(fakeResponse));

    const result = await executeFormulaFromPackDef(manifest, 'MyFormula', ['my-param'], context);

    assert.equal(result.Name, 'Alice');
    sinon.assert.calledOnce(context.fetcher.fetch);
  });
});
```

### Sync Unittest

Testing a sync is very similar to testing a regular formula. However, you want to create
a `MockSyncExecutionContext` instead of a vanilla execution context, and you can test that
your sync handles pagination properly by setting up mock fetcher responses that will result
in your sync formula return a `Continuation` at least once.

```typescript
import {MockSyncExecutionContext} from 'coda-packs-sdk/dist/development';
import {executeSyncFormulaFromPackDef} from 'coda-packs-sdk/dist/development';
import {manifest} from '../manifest';
import {newJsonFetchResponse} from 'coda-packs-sdk/dist/development';
import {newMockSyncExecutionContext} from 'coda-packs-sdk/dist/development';
import sinon from 'sinon';

describe('Sync Formula', () => {
  let syncContext: MockSyncExecutionContext;

  beforeEach(() => {
    syncContext = newMockSyncExecutionContext();
  });

  it('sync with pagination', async () => {
    const page1Response = newJsonFetchResponse({
      users: [{id: 123, name: 'Alice'}],
      nextPageNumber: 2,
    });
    const page2Response = newJsonFetchResponse({
      users: [{id: 456, name: 'Bob'}],
      nextPageNumber: undefined,
    });
    syncContext.fetcher.fetch
      .withArgs('/api/users')
      .returns(page1Response)
      .withArgs('/api/users?page=2')
      .returns(page2Response);

    const result = await executeSyncFormulaFromPackDef(manifest, 'MySync', [], syncContext);

    assert.equal(result.length, 2);
    assert.equal(result[0].Id, 123);
    assert.equal(result[1].Id, 456);
    sinon.assert.calledTwice(syncContext.fetcher.fetch);
  });
});
```

### Integration Test

If you wish to write an end-to-end integration test that actually hits the third-party API
that you pack interacts with, you can simply pass `useRealFetcher: true` when using these
test utilities. The execution context will include a fetcher that will make real http
requests to whatever urls they are given, and will apply authentication to these requests
if you have configured authentication locally using `coda auth`. For example:

```typescript
const result = await executeFormulaFromPackDef(manifest, 'MyFormula', ['my-param'], undefined, undefined, {
  useRealFetcher: true,
});
```

### Return Value Validation

By default, these testing utility functions will validate return values after executing your pack
functions. This validation checks that the values you actually return from your formula implementations
match the schema you have written. This helps find bugs in your code and also helps catch subtle
issues in how your values might be interpreted in the Coda application when you pack is executed
for real.

This validation can also help ensure that your test code correctly simulates responses from
the API that you're integrating with. For instance, while developing our pack, you may have
been regularly exercising your formula code by running `coda execute --fetch` frequently
and you're confident that your code works correctly when run against the real API. Then you
go to write unittests for you pack and you define some fake response objects, but you forget
some required fields or you specified a field as an array when it should be a comma-separated list.
If your fake response result in your pack returning a value that doesn't match the schema you,
the validator will catch these and notify you and you can fix your test code.

The validator will check for things like:

- Does the type of the return value match the type declared in the schema? For example, if you
  declared that your formula returns a number but it returns a string.
- If your formula returns an object (like all sync formulas), do all of the child properties
  in that object match the types declared in the schema?
- Are all properties that are declared as `required` in the schema present and non-empty?
- If the schema for a property declares a `codaType` type hint, can the value actually be
  interpreted as the hinted type? For example, if you declare a property as a string and give
  a hint type of `ValueType.DateTime`, the validator will try to parse the value as a datetime
  and give an error if that fails.

The validator does not perfectly represent how Coda will process your return values
at runtime but is intended to help catch the most common bugs so that you can fix them
before uploading your pack to Coda.

If desired, you can disable return value validation by passing `validateResult: false` in the
`ExecuteOptions` argument of these testing utilities.

## Best Practices

You are free to structure your pack code however works best to you, but we have a few
suggested best practices after having developed dozens of packs internally at Coda.

### File Structure

Your pack will likely grow over time and it can be easier to understand and maintain
with a clear file structure. We recommend splitting out your manifest, your formulas,
your schemas, and your types, each into separate files.

**manifest.ts**

This is the top-level definition of your pack. It's easiest to refer to if it's in
file by itself containing nothing but the definition itself, importing the nuts
and bolts of your pack from other files.

```typescript
import {PackDefinition} from 'coda-packs-sdk';
import {formulas} from './formulas';
import {syncTables} from './formulas';

export const manifest: PackDefinition = {
  name: 'MyPack',
  description: 'My description',
  version: '2.3.1',
  defaultAuthentication: {
    ...
  },
  ...,
  formulas,
  syncTables,
};
```

**formulas.ts**

Most of your pack implementation goes here.

```typescript
import type {Format} from 'coda-packs-sdk';
import type {SyncTable} from 'coda-packs-sdk';
import type {TypedStandardFormula} from 'coda-packs-sdk';

export const formulas: TypedStandardFormula[] = [
  // Formula defintions go here, e.g.
  // makeStringFormula({ ... }),
];

export const syncTables: SyncTable[] = [
  // Sync table definitions go here, e.g.
  // makeSyncTable({...}),
];

export const formats: Format[] = [
  // Column formats go here, e.g.
  // {name: 'MyFormat', formulaNamespace: 'MyPack', formulaName: 'MyFormula'}
];
```

**schemas.ts**

The schema definitions for your object formulas and sync tables go here.
Your `formulas.ts` file will import those schemas. This creates a clear separation
between schema and implementation and allows you to refer back to your schemas
without wading through long formula implementations.

```typescript
import {ValueType} from 'coda-packs-sdk';
import {makeObjectSchema} from 'coda-packs-sdk';

export const personSchema = makeObjectSchema({
  type: ValueType.Object,
  id: 'email',
  primary: 'name',
  properties: {
    email: {type: ValueType.String},
    name: {type: ValueType.String},
    dateOfBirth: {type: ValueType.String, codaType: ValueHintType.Date, fromKey: 'dob'},
  },
});
```

**types.ts**

Types are optional (and only applicable if you're using TypeScript) but we find that they
make packs code much more robust, understandable, and testable. Your types file
can include types for both the request and response objects for the third-party API
you may be working with, as well as for your own return values (which should match your schemas).
If there is an existing library or SDK for the API you're working with, it may already have
type definitions for API objects and you needn't write them yourself.

If your pack has code to transform or massage and API response into a custom object
structure that you've defined, having types for both objects makes it very easy to
see if you're correctly handled all fields.

If you're writing tests that simulate API responses, having types for those API responses
makes it trivial to construct fake responses that include the appropriate fields.

```typescript
/*
 * Types for third-party API objects, if any, go here, e.g.
 */

interface FooAPIResponse {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

/*
 * Types for objects that your formulas return, if any, go here, e.g.
 */

interface MyFormulaResponse {
  id: number;
  fullName: string;
  createdAt: string;
}
```

## Assets

Assets like your pack's logo should be uploaded via the Pack management UI.

## Reference

Run `make view-docs` to generate detailed reference documentation from the source code
and open it in your browser.

This will eventually be published on a documentation website.
