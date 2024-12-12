---
nav: Troubleshooting
description: Tools and tips for how to find and fix problems in your Pack.
---

# How to troubleshoot your code

## Logging

You can log messages using the standard JavaScript logging method, `console.log()`.

```ts
let response = context.fetcher.fetch({
  method: "GET",
  url: "https://api.example.com/items"
});
let items = response.body.items;
console.log("Retrieved %s items.", items.length);
```

When executing a Pack locally these logs will be written to the console, and when run in a doc they will be visible in the [Pack maker tools][pmt]. This can be useful for debugging during development as well as in production.

The Packs runtime only includes a subset of the [full `console` methods][mdn_console], specifically:

- `console.debug()`
- `console.error()`
- `console.info()`
- `console.log()`
- `console.trace()`
- `console.warn()`


## HTTP request logs

For Packs that make HTTP requests to external services and APIs it can be useful to see the details of the outgoing and request and incoming response. Whenever a Pack is run in a Coda doc the HTTP requests are automatically logged and can be inspected in the [Pack maker tools][pmt_http].

When executing a Pack locally using the Pack CLI, you can use Node's built-in HTTP debug logs to see the raw requests and responses. To enable this logging, set the environment variable `NODE_DEBUG=http`. This can be done for a single execution by adding it before the execute command.

```sh
NODE_DEBUG=http npx coda execute pack.ts Hello "World"
```


## Debugging

When developing using the Pack CLI you can connect a JavaScript debugger to your Pack code. This allows you to set breakpoints, examine variables, and step through your code line by line. It requires a bit more setup than simply logging values but is much more flexible.

By default the `coda execute` command runs your Pack code in a limited JavaScript VM that emulates the Packs runtime. This VM lacks the debugging capability however, so you must run your Pack with the `--vm=false` flag to execute it in Node.js directly.

For example, to use the debugger in the VS Code IDE follow these steps:

1.  Add a `debugger;` statement to your code where you want to add a breakpoint. Setting a breakpoint in the IDE itself (the red dot in the gutter to the left of the line) works in some environments, but has known issues in others.
1.  Open a **JavaScript Debug Terminal** (run **Debug: Create JavaScript Debug Terminal** from the command palette).
1.  Run the `npx coda execute` command passing in the flag `--vm=false`. For example:

    ```npx coda execute --vm=false pack.ts Hello "Eric"```


[mdn_console]: https://developer.mozilla.org/en-US/docs/Web/API/console
[pmt]: pack-maker-tools.md
[pmt_http]: pack-maker-tools.md#http-requests
