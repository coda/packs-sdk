---
nav: Testing
description: Make sure your Pack is working correctly by testing it in a doc or locally.
---

# Testing your code

## In the browser

Packs built using the web editor in the Pack Studio can only be run and tested in a live doc. Since users will always use a released version of your Pack, you can continue to build and test new versions without affecting existing users. To configure a doc to always use the latest version of your Pack, regardless of what's released, follow these steps:

1. Open the doc you want to use for testing.
1. Open the Pack in the sidebar.
1. Open the **Settings** tab of the Pack.
1. Click on the **View logs** button.
1. Click the gear icon (:octicons-gear-16:) to open the **Pack maker settings** dialog.
1. In the **Installed in this doc** dropdown select **Latest Version**.

We recommend building out a dedicated doc for testing, which you can use to validate that your Pack is working as expected. Use your Pack with a variety of inputs, and compare the output to an expected value.

## On your local machine {: #local}

When developing locally using the [`coda` CLI][cli], you can leverage some utilities in the SDK to help you write unit tests and integration tests for your Pack. These utilities include:

- Helper functions to execute a specific formula or sync from your pack definition.
- Mock fetchers (using `sinon`) to simulate HTTP requests and responses.
- Validation of formula inputs and return values to help catch bugs both in your test code and your formula logic.
- Hooks to apply authentication to HTTP requests for integration tests.

You'll find testing and development utilities in `packs-sdk/dist/development`.

The primary testing utilities are `executeFormulaFromPackDef` and `executeSyncFormula`. You provide the name of a formula, a reference to your Pack definition, and a parameter list, and the utility will execute the formula for you, validate the return value, and return it to you for further assertions. These utilities provide sane default execution contexts, and in the case of a sync, will execute your sync formula repeatedly for each page of results, simulating what a real Coda sync will do.

By default, these utilities will use an execution environment that includes a mock fetcher that will not actually make HTTP requests. You can pass your own mock fetcher if you wish to configure and inspect the mock requests.

### Basic formula unit test

Here's a very simple example test, using Mocha, for a formula that doesn't make any fetcher requests:

```ts
import {assert} from 'chai';
import {describe} from 'mocha';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {it} from 'mocha';
import {pack} from '../pack';

describe('Simple Formula', () => {
  it('executes a formula', async () => {
    const result = await executeFormulaFromPackDef(pack, 'MyFormula', ['my-param']);
    assert.equal(result, 'my-return-value');
  });
});
```

### Formula unit test with mock fetcher

A more interesting example is for a Pack that does make some kind of HTTP request using the fetcher. Here we set up a mock execution context, register a fake response on it, and pass our pre-configured mock fetcher when executing our formula.

```ts
import type {MockExecutionContext} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {describe} from 'mocha';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {it} from 'mocha';
import {newJsonFetchResponse} from '@codahq/packs-sdk/dist/development';
import {newMockExecutionContext} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';
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

    const result = await executeFormulaFromPackDef(pack, 'MyFormula', ['my-param'], context);

    assert.equal(result.Name, 'Alice');
    sinon.assert.calledOnce(context.fetcher.fetch);
  });
});
```

### Sync unit test

Testing a sync is very similar to testing a regular formula. However, you want to create a `MockSyncExecutionContext` instead of a vanilla execution context, and you can test that your sync handles pagination properly by setting up mock fetcher responses that will result in your sync formula return a `Continuation` at least once.

```ts
import type {MockSyncExecutionContext} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {describe} from 'mocha';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {it} from 'mocha';
import {newJsonFetchResponse} from '@codahq/packs-sdk/dist/development';
import {newMockSyncExecutionContext} from '@codahq/packs-sdk/dist/development';
import {pack} from '../pack';
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

    const result = await executeSyncFormulaFromPackDef(pack, 'MySync', [], syncContext);

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
import {assert} from 'chai';
import {describe} from 'mocha';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {it} from 'mocha';
import {pack} from '../pack';

describe('Formula integration test', () => {
  it('executes the formula', async () => {
    const result = await executeFormulaFromPackDef(pack, 'MyFormula', ['my-param'], undefined, undefined, {
      useRealFetcher: true,
      manifestPath: require.resolve('../pack'),
    });
    assert.equal(result, 'my-return-value');
  });
});
```

The fetcher will apply authentication to these requests if you have configured authentication locally using `coda auth`. For this to work you must specify the `manifestPath` and set it to the directory where the `.coda-credentials.json` file is located (usually the same directory as the Pack definition).

### Return value validation

By default, these testing utility functions will validate return values after executing your Pack formulas. This validation checks that the values you actually return from your formula implementations match the schema you have written. This helps find bugs in your code and also helps catch subtle issues in how your values might be interpreted in the Coda application when you Pack is executed for real.

This validation can also help ensure that your test code correctly simulates responses from the API that you're integrating with. For instance, while developing our Pack, you may have been regularly exercising your formula code by running `coda execute` frequently and you're confident that your code works correctly when run against the real API. Then you go to write unit tests for you Pack and you define some fake response objects, but you forget some required fields or you specified a field as an array when it should be a comma-separated list. If your fake response result in your Pack is returning a value that doesn't match the schema you defined, the validator will catch these and notify you.

The validator will check for things like:

- Does the type of the return value match the type declared in the schema? For example, if you declared that your formula returns a number but it returns a string.
- If your formula returns an object (like all sync formulas), do all of the child properties in that object match the types declared in the schema?
- Are all properties that are declared as `required` in the schema present and non-empty?
- If the schema for a property declares a `codaType` type hint, can the value actually be interpreted as the hinted type? For example, if you declare a property as a string and give a hint type of `ValueType.DateTime`, the validator will try to parse the value as a datetime and give an error if that fails.

The validator does not perfectly represent how Coda will process your return values at runtime but is intended to help catch the most common bugs so that you can fix them before uploading your Pack to Coda.

If desired, you can disable return value validation by passing `validateResult: false` in the `ExecuteOptions` argument of these testing utilities.

[cli]: cli.md
