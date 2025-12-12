---
nav: Style guide
description: Rules and guidelines to be followed when writing documentation for the SDK.
---

# Documentation Style Guide

This documentation aims to follow the [Google Developer Documentation Style Guide][google_style]. This style is not strictly enforced, but should be deferred to when options are being debated.


## Sample code

To ensure a consistent experience for readers, the following style rules should be followed when writing sample code. Many of these rules are enforced automatically by the linter for samples in the `documentation` directory, but small snippets of code inline in markdown files must be checked manually.

These style rules have been written to optimize the experience for novice developers and those new to JavaScript. The language has many advanced features and alternative syntaxes, but they often sacrifice readability for compactness. The decisions in this style guide will therefore differ from what's traditionally selected by engineering teams.


### Use a single SDK import

Import the entire SDK into a single variable named coda instead of using multiple, narrow imports.

```{.ts .yes}
// Yes
import * as coda from "@codahq/packs-sdk";
```

```{.ts .no}
// No
import {makeFormula} from '@codahq/packs-sdk';
import {makeParameter} from '@codahq/packs-sdk';
```

Having all usages of the SDK prefixed with coda.{something} makes it easier to distinguish what's part of the SDK and what's not. It also makes it easier to copy and paste code from other places without having to worry about adding imports.


### Use double quotes

Use double quotes whenever possible.

```{.ts .yes}
// Yes
description: "A Hello World example.",
```

```{.ts .no}
// No
description: 'A Hello World example.',
description: `A Hello World example.`,
```

Double quotes are required for JSON and often shown in example responses, and so it makes sense to standardize on them.


### Prefer string concatenation

Prefer string concatenation over template strings for simple cases.

```{.ts .yes}
// Yes
let url = "http://example.com/thing/" + thingId;
```

```{.ts .no}
// No
let url = `http://example.com/thing/${thingId}`;
```

String concatenation is often easier to read and understand, and doesn't introduce an additional string delimiter. Template strings can be used if multiple variables are being inserted.


### Use `let` for variable declaration

Prefer `let` over `const`, even in cases where the value is never re-assigned.

```{.ts .yes}
// Yes
let url = "http://example.com";
```

```{.ts .no}
// No
const url = "http://example.com";
```

The distinction between `let` and `const` isn't always clear to newer coders, and the inflexibility of `const` can lead to more errors as users are playing around with code they copy and pasted.

!!! note "Exception: File-level constants"
    File-level constants such as enums and schemas, should use const.
    ```ts
    const MaxItems = 100;
    const MySchema = coda.makeObjectSchema(...);
    ```


### Avoid the ternary operator

Use conditional blocks instead.

```{.ts .yes}
// Yes
let foo = "bar";
if (isThing) {
  foo = "baz";
}
```

```{.ts .no}
// No
let foo = isThing ? "bar" : "baz";
```

The ternary operator isn't widely known among newer coders, and the syntax is very opaque if you haven't see it before.


### Avoid the spread operator

Prefer a more concrete manipulation of objects, when feasible.

```{.ts .yes}
// Yes
let result = response.body;
result.foo = "bar";
return result;
```

```{.ts .no}
// No
return {
  ...response.body,
  foo: 'bar',
}
```

The syntax may not be familiar to newer coders, and more explicit assignments can make it clearer what's going on.


### Always set the key and value

Even when the key and value are the same, always set both explicitly.

```{.ts .yes}
// Yes
context.fetcher.fetch({
  method: "GET",
  url: url,
});
```

```{.ts .no}
// No
context.fetcher.fetch({
  method: "GET",
  url,
});
```

The shorthand notation that allows you to omit the value can be confusing to newer coders, especially when they need to adapt the code to work with different variable names.


### Avoid destructuring

Prefer to pull values out of objects and arrays more explicitly.

```{.ts .yes}
// Yes
let items = response.body.items;
let pageToken = response.body.pageToken;
```

```{.ts .no}
// No
let {items, pageToken} = response.body;
```

The destructuring syntax may not be familiar to newer coders, and it can easily be confused with creating an object or array.

!!! note "Exception: Parameters values"
    Destructuring can be used to separate out the parameters of a formula, such as in the `execute` function.
    ```ts
    execute: async function([width, height], context) {
      // ...
    }
    ```


### Always include `async` and `context` in formula execute methods

Even when a formula doesn't require them, always declare the `execute` function as `async` and add `context` parameter.

```{.ts .yes}
// Yes
execute: async ([param], context) => {
  return "Hello World!";
},
```

```{.ts .no}
// No
execute: ([param]) => {
  return "Hello World!";
},
```

This makes it easier to add in `fetcher` calls later without needing to understand asynchronous programming. While there is a slight performance impact to making a function `async` unnecessarily, and unused variables are discouraged, the benefits outweigh the costs for new users.


### Don't declare schemas inline

Even if a schema is only used in one formula, declare it separately.

```{.ts .yes}
// Yes
const MySchema = coda.makeObjectSchema({ ... });
pack.addFormula({
  // ...
  schema: MySchema,
});
```

```{.ts .no}
// No
pack.addFormula({
  // ...
  schema: coda.makeObjectSchema({ ... });
});
```

A formula definition can already be quite long, and adding a schema can make it even harder to parse. Additionally, schemas are often reused in a pack (a formula and a sync table, for instance) so it is a best practice to separate them earlier.


### Use UpperCamelCase for schema variables

Name schema constants using UpperCamelCase, like you would for a class.

```{.ts .yes}
// Yes
const MySchema = coda.makeObjectSchema({ ... });
```

```{.ts .no}
// No
const mySchema = coda.makeObjectSchema({ ... });
```

Although not technically a class, schemas are similar enough and should be treated similarly.


### Use the `function` keyword for most functions

Define functions using the `function` keyword in most cases.

```{.ts .yes}
// Yes
pack.addFormula({
  // ...
  execute: function([a, b], context) {
    // ...
  },
});
```

```{.ts .no}
// No
pack.addFormula({
  // ...
  execute: ([a, b], context) => {
    // ...
  },
});

// Also no
pack.addFormula({
  // ...
  execute([a, b], context) {
    // ...
  },
});
```

The `function` keyword makes it very clear to readers that you are defining a function. The arrow function syntax is not as obvious for newer coders, and the latter syntax is another form of object shorthand notation which is discouraged.

!!! note "Exception: Function as parameters"
    Arrow functions are allowed for anonymous functions used as parameters, like those used in `Array.filter()`, etc.
    ```ts
    let completed = items.filter(item => item.isComplete);
    ```


### Formula key order

The order of keys in the formula declaration should be:

```ts no_lint
pack.addFormula({
  name: ...,
  description: ...,
  parameters: ...,
  resultType: ...,
  // If required.
  schema: ...,
  items: ...,
  isAction: ...,
  // Anything else.
  execute: ...,
});
```


### Object schema key order

The order of keys in an object schema declaration should be:

```
const MySchema = coda.makeObjectSchema({
  properties: ...,
  displayProperty: ...,
  idProperty: ...,
  featuredProperties: ...,
  // If required.
  identity: ...,
  // Anything else.
});
```


### 80 character max line length

Limit lines to 80 characters. Horizontal space is limited in the Packs Editor side panel and in the Documentation, and lines more than 80 characters can lead to scroll or wrapping that makes it harder to read.


[google_style]: https://developers.google.com/style
