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


## Common errors

### Domain doesn't resolve to a public IP

- `The given domain <domain> does not resolve to a public IP`

This error indicates that the domain you provided in an `addNetworkDomain()` call doesn't resolved to an accessible IP address. This could be due to a typo in the domain name. However there are some cases where a service assigns IP addresses to subdomains (`foo.example.com`) but not the root domain you are trying to add (`example.com`). If that is the case, either add the subdomain or [contact support][support] to have the root domain manually added to your Pack.


### Missing required developer tooling

- `Error: not found: make`
- `g++: Permission denied`

These errors can occur when installing the SDK locally, specifically during the installation of the `isolated-vm` dependency. They indicate that certain required developer tools are not present on the machine. See the [help documentation][isolated_vm_requirements] for this library for more information on how to install these missing packages on your machine.


### Invalid action

- `Unable to execute invalid action`

This error will appear at the bottom of the screen after pressing a button, and indicates that the formula used in the button isn't a valid action. In order for a formula to be used as an action within a button, it must be defined with `isAction: true`. See the [Actions guide][actions_create] for more information.


### HTTP response too large

<!-- https://golinks.io/bug/22358 -->

- `RESOURCE_EXHAUSTED: Received message larger than max`
- `INTERNAL: FetchError: content size at {URL} over limit: 4194304

This error indicates that a fetcher request got back a response that is larger than the Packs runtime allows. If you are querying an external API for records, see if you can use a limit or paging parameter to get back a smaller response. If you need to work with large files you'll need to build an application outside of Packs that processes them. If you only need a small increase in the size limit you can [contact support][support] to request an adjustment.


### Can't upload from the CLI

- `dyld: Symbol not found: _SecTrustEvaluateWithError`

The Pack CLI uses the `esbuild` library to compile your local code, and [this error][esbuild_error] is coming from that library. If you are getting this error on a Mac try updating to macOS 10.13 or later.


[mdn_console]: https://developer.mozilla.org/en-US/docs/Web/API/console
[support]: ../../support/index.md
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
[actions_create]: ../blocks/actions.md#creating-actions
[pmt]: pack-maker-tools.md
[pmt_http]: pack-maker-tools.md#http-requests
[esbuild_error]: https://github.com/evanw/esbuild/issues/2183
