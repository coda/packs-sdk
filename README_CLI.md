# Coda Packs SDK

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
