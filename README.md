# Coda Packs SDK

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

```console
npm install --global https://266b5c97c3bef1359cc7094b4726e2da447538e0:x-oauth-basic@github.com/kr-project/packs-sdk#e79bbd196bf080b266f038ddd2bceb83b45e1270
```

#### Single-Project Install (Recommended)

It's easier to manage dependencies and avoid version conflicts across projects
if you create an npm project for your pack and install the SDK and other dependencies
locally.

Create a new project directory if you haven't already and initialize your project:

```console
# Initialize npm and follow prompts.
npm init
# Install the Coda Packs SDK locally in your project
npm install --save https://266b5c97c3bef1359cc7094b4726e2da447538e0:x-oauth-basic@github.com/kr-project/packs-sdk#e79bbd196bf080b266f038ddd2bceb83b45e1270
```

Update your path so you can easily use the `coda` commandline (CLI) that ships with the SDK:

```console
export PATH=./node_modules/.bin:$PATH
```

(Globally-installed npm packages link CLI scripts into your system path. Locally installed packages
live in `./node_modules/.bin` and so are more easily used by updating your path.)

### Setup Your Pack Definition

Create a file called `manifest.ts`. Use this boilerplate pack definition to get started:

```typescript
import {PackCategory} from 'packs-sdk';
import type {PackDefinition} from 'packs-sdk';
import {makeStringFormula} from 'packs-sdk';
import {makeStringParameter} from 'packs-sdk';

export const manifest: PackDefinition = {
  id: 123,
  name: 'MyPack',
  shortDescription: '',
  description: '',
  version: '0.0.1',
  exampleImages: [],
  providerId: 456,
  category: PackCategory.Fun,
  logoPath: 'logo.png',

  formulas: {
    MyPack: [
      makeStringFormula({
        name: 'Hello',
        description: 'Greet somebody by name.',
        parameters: [makeStringParameter('name', 'A name to greet.')],
        examples: [],
        execute: async ([name], context) => {
          return `Hello ${name}!`;
        },
      }),
    ],
  },
};
```

Now change the pack name and description and formula name, description, and implementation to your own,
and you now have a valid pack. See [Running Your Code](#running-your-code) to start executing
your formulas.

NOTE: This example includes a formula definition inline in the pack definition for the sake of a simple
example, but we highly recommend splitting your formula definitions and supporting code into separate
files for ease of understanding and maintenance. See [Best Practices](#best-practices) for tips
and examples of well-structured packs.

## Running Your Code

Once published, your pack functionality will be executed on Coda servers after being invoked from a Coda doc.
During the development process, you can call your formulas directly from the commandline, to simulate this
process for rapid development. When you're nearing the end of authoring your pack, you can upload your pack
to Coda and run it in a real doc to verify it works as intended.

### Running Formulas

The `coda` CLI utility helps you execute formulas, via the `coda execute` sub-command. You can run
`coda execute --help` at any time to refresh yourself on usage. The syntax is:

```console
coda execute path/to/manifest.ts <namespace>:<formula> [params..]
```

So for example, if your pack definition was in `src/manifest.ts` and you wanted to call a function
in namespace `MyPack` called `MyFormula` that takes one argument, you'd run:

```console
coda execute src/manifest.ts MyPack::MyFormula some-arg
```

This will execute the formula and print the output to the terminal. (A quick reminder, if your arguments
have spaces or special characters in them, put them in quotation marks when specifying them on the
commandline.)

The `coda execute` utility will look at your pack definition to determine the types of your parameters
and will interpret your arguments accordingly. For example, if your formula takes a string and you pass
`123` as an argument on the commandline, it will know to interpret that as a string, but if your formula
takes a number, it will interpret `123` as a number before executing the formula.

### Running Syncs

The above example shows how to execute a regular pack **formula**. Executing a **sync** is almost
identical:

```console
coda execute path/to/manifest.ts <sync name> [params..]
```

So for example, if you had a sync called `Items`, that took a start date as a parameter,
you would execute this as:

```console
coda execute path/to/manifest.ts Items 2020-12-15
```

This will execute your sync formula repeatedly until there are no more results, and print
the output array of all result objects to the terminal. See [Syncs](#syncs) for more
information about how and why sync formulas are invoked repeatedly for paginated results.

### Fetching

By default, `coda execute` will use a mock fetcher for any http requests that your formulas make.
If you wish to actually make http requests, use the `--fetch` flag, for example:

```console
coda execute --fetch src/manifest.ts MyPack::MyFormula some-arg
```

Your http requests will commonly require authentication in order to succeed, which the `coda execute` utility supports.
See the [Authentication](#authentication) section about how to set this up.

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
`systemAuthentication`. You will typically specify one or the other in your pack definition,
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
- **CustomHeaderToken**: The user provides an API token, which is applied to a custom API
  header as specified by the pack author, in the form `<custom-header>: <custom-prefix> <token>`.
- **QueryParamToken**: The user provides an API token, which is applied to the url of each
  fetcher request in a url parameter specified by the pack author. Using url params for authentication
  is not recommended if there are other alternatives.
- **MultiQueryParamToken**: The user provides multiple tokens, which are applied to the url of
  each fetcher request in url parameters specified by the pack author. This is not common.
  Using url params for authentication is not recommended if there are other alternatives.
- **WebBasic**: The user provides a username and typically a password, which are base64-encoded
  and applied to the `Authorization` header of each fetcher request, in the form
  `Authorization: Basic <base64encode(username:password)>`, as outlined in
  [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication).
  Web basic authentication sends passwords in cleartext so is not recommended if there are
  alternatives.
- **CodaApiHeaderBearerToken**: Internally the same as `HeaderBearerToken` but for cases
  where a pack is going to make requests to Coda's own API. The UI will assist the user
  in creating and configuring an API token without the user needing to do this manually.
  This is mostly for use by Coda-internal packs.

`OAuth2` and `CodaApiHeaderBearerToken` are not available for system authentication.

### Testing Authenticated Requests

The SDK will help you set up authentication in your development environment so that you can
execute pack formulas with authentication applied to them, allowing you to run your code
end-to-end including making fetcher requests to third-party services.

The `coda auth` utility is used to set up authentication for a pack. Run `coda auth --help` at
any time for a refresher on how to use the utility. Mostly, it's as simple as running

```console
coda auth path/to/manifest.ts
```

The utility will inspect your pack definition to see what kind of authentication you
have defined, and then it will prompt you to provide in the console the necessary
token(s) or other parameters required by your authorization type.
If you are using `OAuth2`, after you provide the necessary configuration info,
it will launch an OAuth flow in your browser.

The credentials you provide will be stored in a file `.coda/credentials.json`.
When you execute a pack formula using `coda execute --fetch ...`, the credentials
in this file will be applied to your fetcher requests automatically.

Similarly, if you are writing an integration test for your pack,
you can pass `useRealFetcher: true` in the `ContextOptions` argument
when calling `executeFormulaFromPackDef()` or `executeSyncFormulaFromPackDef()`,
and a real (non-mock) http fetcher will be used, and any credentials that you
have registered will be applied to those requests automatically.

The credentials file can hold credentials for multiple packs simultaneously. So if you
are authoring multiple packs in the same directory/repo, so long as those packs have
different names, you can register and use credentials for all of them.

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

#### Examples

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
You can simply declare your field as `{type: ValueType.Number, codaType: ValueType.DateTime}` and
Coda will parse the timestamp into a proper DateTime value on your behalf.

Or perhaps you want to return an object that has an image associated with it, and your pack
and the API it integrates with specify that image as a url. Your schema can declare that
property as `{type: ValueType.String, codaType: ValueType.Image}` and that url will be
downloaded to be hosted on Coda and presented as an image in the Coda UI.

TODO: Link to full reference on hint types.

### Key Mapping and Extraneous Properties

The SDK assumes that it will be common to write packs that mostly fetch and return data from
third-party API, and that massaging that data to conform to an SDK schema might be tedious,
so the SDK supports ways to pass through third-party data as-is or with minimal massaging.

The `response` property of an object formula has an optional property `excludeExtraneous` which
if true, strips all fields from your return values if they are not declared in the schema.
For example, if you're working with an API that returns a User object with a bunch of fields
you don't care about, like `createdAt` and `updatedAt`, you can just define your formula using
a schema like

```typescript
makeObjectFormula({
  ...,
  response: {
    excludeExtraneous: true,
    schema: makeObjectSchema({
      type: ValueType.Object,
      properties: {
        name: {type: ValueType.String},
      },
    }),
  },
})
```

and then you can return the full user object that you get back from the API, and all fields
other than `name` will be stripped away with your code needing to do this explicitly.

Note that `excludeExtraneous` is automatically true for sync table formulas.

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

The combination of `fromKey` and `excludeExtraneous` should generally mean that you needn't
write any custom code to remove or remap fields to make an API object conform to your desired schema.

### Execution Environment

Coda packs execute on the server side in a special isolated node environment. They do not execute in the browser
and don't have access to any browser resources or user information other than what the packs infrastructure explicitly provides.

## Testing Your Code

## Best Practices

## Assets

## Reference

### Hint Types
