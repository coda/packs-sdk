---
title: Using the CLI
---

# Using the command line interface

TODO

## Getting started

The easiest way to get started it to follow the tutorial [Get started on your local machine][quickstart_cli], which will walk you through the setup and basic usage of the CLI.

[View Tutorial][quickstart_cli]{ .md-button }


### Requirements

The CLI requires that you have `node` and `npm` installed. We also recommend developing with TypeScript, in which case, make sure that you have TypeScript and `ts-node` installed.


### Installing

#### Global install (quick)

The simplest way to get started with the SDK is to install it globally:

```sh
npm install --global @codahq/packs-sdk
```

You can now access the CLI in any directory by typing the command `coda`.


#### Single-project install (recommended)

It’s easier to manage dependencies and avoid version conflicts across projects if you create an npm project for your Pack and install the SDK and other dependencies locally.

Create a new project directory if you haven’t already and initialize your project:

```sh
# Initialize npm and follow prompts.
npm init

# Install the Coda Packs SDK locally in your project
npm install --save @codahq/packs-sdk
```

You can now access the CLI within this directory, using the command `npx coda`.


### Create Pack definition

Run `coda init` to initialize an empty project with the recommended file structure and install the suggested npm dependencies.


## Running code locally

Once published, your Pack functionality will be executed on Coda servers after being invoked from a Coda doc. During the development process, you can call your formulas directly from the command line, to simulate this process for rapid development. When you’re nearing the end of authoring your Pack, you can upload your Pack to Coda and run it in a real doc to verify it works as intended.


### Running formulas

The `coda` CLI utility helps you execute formulas, via the `coda execute` sub-command. You can run `coda execute --help` at any time to refresh yourself on usage. The syntax is:

```sh
coda execute path/to/pack.ts <formula> [params..]
```

So for example, if your Pack definition was in `src/pack.ts` and you wanted to call a function named MyFormula that takes one argument, you’d run:

```sh
coda execute src/pack.ts Hello "World"
```

This will execute the formula and print the output to the terminal. (A quick reminder, if your arguments have spaces or special characters in them, put them in quotation marks when specifying them on the command line.)

The `coda execute` utility will look at your Pack definition to determine the types of your parameters and will interpret your arguments accordingly. For example, if your formula takes a string and you pass `123` as an argument on the command line, it will know to interpret that as a string. But if your formula takes a number, it will interpret `123` as a number before executing the formula.

To pass array parameters to `coda execute`, use a comma separated string. For example, [1,2,3] should be passed with this format:

```sh
coda execute src/pack.ts GetAverage "1,2,3"
```


### Running Syncs

The above example shows how to execute a regular Pack formula. Executing a sync is almost identical:

```sh
coda execute path/to/pack.ts <sync name> [params..]
```

So for example, if you had a sync called Items, that took a start date as a parameter, you would execute this as:

```sh
coda execute path/to/pack.ts Items "2020-12-15"
```

This will execute your sync formula repeatedly until there are no more results, and print the output array of all result objects to the terminal. See the [Sync tables guide][sync_tables] for more information about how and why sync formulas are invoked repeatedly for paginated results.

To run a sync for a dynamic sync table, use the `--dynamicUrl` parameter to specify which URL to sync from.

```sh
coda execute path/to/pack.ts Items --dynamicUrl=https://example.com/api/table
```


### Fetching {: #fetch}

By default, `coda execute` will use a mock fetcher for any http requests that your formulas make. If you wish to actually make http requests, use the `--fetch` flag, for example:

```sh
coda execute --fetch src/pack.ts GetPrice "widgets"
```

Your http requests will commonly require authentication in order to succeed, which the coda execute utility supports. See the [Authentication section](#authentication) for more information on how to set this up.


## Uploading Packs

### Registering an API Key

All of the Pack upload commands work with the Coda API to upload your Pack, and hence require an API key to identify you as the user. Simply run this command, and you’ll be given a link to the Coda Account page to create an API token, which you can then paste in the terminal. You API key will be saved in a hidden local file named `.coda.json` in your current directory, to be used with future commands.

```sh
coda register
```

### Creating a new Pack

When you’ve implemented your Pack and are ready to upload it to Coda for the first time, you’ll need to create new Pack on Coda’s servers to get assigned a Pack ID. Run this command just once for each Pack you create:

```sh
coda create path/to/pack.ts
```

This will create a new empty Pack on Coda’s servers. It will print out the url of the Pack Studio page in the Coda UI, and store the newly-assigned Pack ID in a hidden file `.coda-pack.json` in the same directory as your Pack definition. (This allows you to put multiple Pack definitions in the same repo, as long as they’re in different directories.) The ID in this file will be used subsequent CLI commands for managing your Pack.

This command accepts optional flags for specifying a name and description for the Pack. You can always set or update the name and description in the Pack management UI later.

```sh
coda create path/to/pack.ts --name "My Pack" --description "My pack description."
```


### Uploading a Pack version

As you make changes to your Pack, when you’re ready to upload them to Coda so that you can try them in a real doc, use this command to upload a new version of your Pack based on your latest code.

```sh
coda upload path/to/pack.ts
```

Once uploaded, as an editor of the Pack, you’ll be able to install this specific version of your Pack in any of your docs, without affecting the live release version of your Pack that other users may be using, giving you an opportunity to test out your latest changes in your docs before making them live to users.

This command accepts an optional flag where you can provide notes about the contents of the version, helping you track changes from version to version.

```sh
coda upload path/to/pack.ts --notes "Added the formula MyNewFormula."
```

!!! info
    At this time, this command will not upload your source code, only your compiled Pack. You will not see your source code in the web editor as you would if you had used the web code editor to compose your Pack.


### Creating a release

When you’ve tested a Pack version and want to make that version live for users of your Pack, create a release. The Pack version that you release will become the version that is used by new installations of your Pack, and existing installations will gradually be upgraded to this version.

```sh
coda release path/to/pack.ts <optional-version>
```

If you don’t pass a version argument, and don't explicitly set a version in your Pack definition, you will be prompted to use the latest version. The version must always be greater than that of any of your previous releases.

Alternatively, you can easily create releases from the Pack Studio.

<!-- TODO: Un-hide this text when notes are displayed in the Pack Studio.
This command accepts an optional flag where you can provide notes about the contents of the release, helping you and users of your Pack understand what changed from release to release.

```sh
coda release path/to/pack.ts --notes "Added the formula MyNewFormula."
```
-->


## Testing your code

The SDK includes some utilities to help you write unit tests and integration tests for your Pack. These utilities include:

* Helper functions to execute a specific formula or sync from your pack definition.
* Mock fetchers (using `sinon`) to simulate HTTP requests and responses.
* Validation of formula inputs and return values to help catch bugs both in your test code and your formula logic.
* Hooks to apply authentication to http requests for integration tests.

You’ll find testing and development utilities in `packs-sdk/dist/development`.

The primary testing utilities are `executeFormulaFromPackDef` and `executeSyncFormulaFromPackDef`. You provide the name of a formula, a reference to your Pack definition, and a parameter list, and the utility will execute the formula for you, validate the return value, and return it to you for further assertions. These utilities provide sane default execution contexts, and in the case of a sync, will execute your sync formula repeatedly for each page of results, simulating what a real Coda sync will do.

By default, these utilities will use an execution environment that includes a mock fetcher that will not actually make http requests. You can pass your own mock fetcher if you wish to configure and inspect the mock requests.


### Basic formula unit test

Here’s a very simple example test, using Mocha, for a formula that doesn’t make any fetcher requests:

```ts
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';

describe('Simple Formula', () => {
  it('executes a formula', async () => {
    const result =
        await executeFormulaFromPackDef(pack, 'MyFormula', ['my-param']);
    assert.equal(result, 'my-return-value');
  });
});
```


### Formula unit test with mock fetcher

A more interesting example is for a Pack that does make some kind of HTTP request using the fetcher. Here we set up a mock execution context, register a fake response on it, and pass our pre-configured mock fetcher when executing our formula.

```ts
import {MockExecutionContext} from '@codahq/packs-sdk/dist/development';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';
import {newJsonFetchResponse} from '@codahq/packs-sdk/dist/development';
import {newMockExecutionContext} from '@codahq/packs-sdk/dist/development';
import sinon from 'sinon';

describe('Formula with Fetcher', () => {
  let context: MockExecutionContext;

  beforeEach(() => {
    context = newMockExecutionContext();
  });

  it('basic fetch', async () => {
    const fakeResponse = newJsonFetchResponse({
      id: 123,
      name: 'Alice',
    });
    context.fetcher.fetch.returns(fakeResponse);

    const result = await executeFormulaFromPackDef(
        pack, 'MyFormula', ['my-param'], context);

    assert.equal(result.Name, 'Alice');
    sinon.assert.calledOnce(context.fetcher.fetch);
  });
});
```


### Sync unit test

Testing a sync is very similar to testing a regular formula. However, you want to create a `MockSyncExecutionContext` instead of a vanilla execution context, and you can test that your sync handles pagination properly by setting up mock fetcher responses that will result in your sync formula return a `Continuation` at least once.

```ts
import {MockSyncExecutionContext} from '@codahq/packs-sdk/dist/development';
import {executeSyncFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';
import {newJsonFetchResponse} from '@codahq/packs-sdk/dist/development';
import {newMockSyncExecutionContext} from '@codahq/packs-sdk/dist/development';
import sinon from 'sinon';

describe('Sync Formula', () => {
  let syncContext: MockSyncExecutionContext;

  beforeEach(() => {
    syncContext = newMockSyncExecutionContext();
  });

  it('sync with pagination', async () => {
    const page1Response = newJsonFetchResponse({
      users: [{ id: 123, name: 'Alice' }],
      nextPageNumber: 2,
    });
    const page2Response = newJsonFetchResponse({
      users: [{ id: 456, name: 'Bob' }],
      nextPageNumber: undefined,
    });
    syncContext.fetcher.fetch
      .withArgs('/api/users')
      .returns(page1Response)
      .withArgs('/api/users?page=2')
      .returns(page2Response);

    const result =
        await executeSyncFormulaFromPackDef(pack, 'MySync', [], syncContext);

    assert.equal(result.length, 2);
    assert.equal(result[0].Id, 123);
    assert.equal(result[1].Id, 456);
    sinon.assert.calledTwice(syncContext.fetcher.fetch);
  });
});
```

### Integration test {: #integration}

If you wish to write an end-to-end integration test that actually hits the third-party API that you Pack interacts with, you can simply pass `useRealFetcher: true` when using these test utilities. The execution context will include a fetcher that will make real HTTP requests to whatever urls they are given. For example:

```ts
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';

describe('Formula integration test', () => {
  it('executes the formula', async () => {
    const result = await executeFormulaFromPackDef(
      pack,
      "MyFormula",
      ["my-param"],
      undefined,
      undefined,
      {
        useRealFetcher: true,
        manifestPath: require.resolve("../pack"),
      },
    );
    assert.equal(result, 'my-return-value');
  });
});
```

The fetcher will apply authentication to these requests if you have configured authentication locally using `coda auth`. For this to work you must specify the `manifestPath` and set it to the directory where the `.coda-credentials.json` file is located (usually the same directory as the Pack definition).


### Return value validation

By default, these testing utility functions will validate return values after executing your Pack formulas. This validation checks that the values you actually return from your formula implementations match the schema you have written. This helps find bugs in your code and also helps catch subtle issues in how your values might be interpreted in the Coda application when you Pack is executed for real.

This validation can also help ensure that your test code correctly simulates responses from the API that you’re integrating with. For instance, while developing our Pack, you may have been regularly exercising your formula code by running `coda execute --fetch` frequently and you’re confident that your code works correctly when run against the real API. Then you go to write unit tests for you Pack and you define some fake response objects, but you forget some required fields or you specified a field as an array when it should be a comma-separated list. If your fake response result in your Pack is returning a value that doesn’t match the schema you defined, the validator will catch these and notify you.

The validator will check for things like:

- Does the type of the return value match the type declared in the schema? For example, if you declared that your formula returns a number but it returns a string.
- If your formula returns an object (like all sync formulas), do all of the child properties in that object match the types declared in the schema?
- Are all properties that are declared as `required` in the schema present and non-empty?
- If the schema for a property declares a `codaType` type hint, can the value actually be interpreted as the hinted type? For example, if you declare a property as a string and give a hint type of `ValueType.DateTime`, the validator will try to parse the value as a datetime and give an error if that fails.

The validator does not perfectly represent how Coda will process your return values at runtime but is intended to help catch the most common bugs so that you can fix them before uploading your Pack to Coda.

If desired, you can disable return value validation by passing `validateResult: false` in the `ExecuteOptions` argument of these testing utilities.


## Authenticated requests {: #authentication}

The SDK will help you set up authentication in your development environment so that you can execute Pack formulas with authentication applied to them, allowing you to run your code end-to-end including making fetcher requests to third-party services.

The `coda auth` utility is used to set up authentication for a Pack. Run `coda auth --help` at any time for a refresher on how to use the utility. Mostly, it’s as simple as running

```sh
coda auth path/to/pack.ts
```

The utility will inspect your Pack definition to see what kind of authentication you have defined, and then it will prompt you to provide in the console the necessary token(s) or other parameters required by your authorization type. If you are using `OAuth2`, after you provide the necessary configuration info, it will launch an OAuth flow in your browser. The resulting credentials you provide will be stored in a file `.coda-credentials.json` in the same directory as your Pack definition.

The credentials will be automatically applied to your fetch requests when you execute a Pack from the CLI or a test. For more information, see the sections on [Using the --fetch option](##fetch) and [Integration tests](#integration).


## Suggested file structure

You are free to structure your Pack code however works best to you, but we have a suggested file structure based on our experience developing dozens of Packs internally at Coda. Your Pack will likely grow over time and it can be easier to understand and maintain with a clear file structure. We recommend splitting out your Pack, your helpers, your schemas, and your types, each into separate files.

### `pack.ts`

This is the top-level definition of your Pack.

```ts
import * as coda from "@codahq/packs-sdk";
import * as helpers from "./helpers";
import * as schemas from "./schemas";

export const pack = coda.newPack();

/**
 * An example formula definition, which calls out to a helper file
 * for implementation details.
 *
 * You can delete this if your pack only has tables and not formulas.
 */
pack.addFormula({
  // ...
});

// Add more ...
```

### `helpers.ts`

Some of the nuts and bolts and reusable bits go here.

```ts
import type * as coda from "@codahq/packs-sdk";

export async function executeMyFormula(
  context: coda.ExecutionContext,
  param: string,
) {
  // Implement your formula here.

  return "<something>";
}

export async function syncWidgets(context: coda.SyncExecutionContext) {
  // Implement your sync here.

  return {
    result: [{ widgetId: 123, widgetName: "<some name>" }],
    continuation: undefined,
  };
}
```

### `schemas.ts`

The schema definitions for your object formulas and sync tables go here. Your `pack.ts` file will import those schemas. This creates a clear separation between schema and implementation and allows you to refer back to your schemas without wading through long formula implementations.

```ts
import {ValueType} from '@codahq/packs-sdk';
import {makeObjectSchema} from '@codahq/packs-sdk';

export const PersonSchema = makeObjectSchema({
  properties: {
    email: { type: ValueType.String },
    name: { type: ValueType.String },
    dateOfBirth: {
      type: ValueType.String,
      codaType: ValueHintType.Date,
      fromKey: 'dob'
    },
  },
  primary: 'name',
  id: 'email',
});
```

### `types.ts`

Types are optional (and only applicable if you’re using TypeScript) but we find that they make Packs code much more robust, understandable, and testable. Your types file can include types for both the request and response objects for the third-party API you may be working with, as well as for your own return values (which should match your schemas). If there is an existing library or SDK for the API you’re working with, it may already have type definitions for API objects and you needn’t write them yourself.

If your Pack has code to transform or massage and API response into a custom object structure that you’ve defined, having types for both objects makes it very easy to see if you’re correctly handled all fields.

If you’re writing tests that simulate API responses, having types for those API responses makes it trivial to construct fake responses that include the appropriate fields.

```ts
/*
 * Types for third-party API objects, if any, go here, e.g.
 */

export interface FooAPIResponse {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
}

/*
 * Types for objects that your formulas return, if any, go here, e.g.
 */

export interface MyFormulaResponse {
  id: number;
  fullName: string;
  createdAt: string;
}
```


## When to use Pack Studio

Although a lot of Pack management can be done through the CLI, there are still some tasks that require you to visit the Pack Studio web interface. These include:

- Setting the authorization credentials.
- Setting rate limits.
- Editing your Pack's listing page (name, icon, etc).



[quickstart_cli]: ../../get-started/cli.md
[sync_tables]: ../blocks/sync-tables.md
