---
title: Troubleshooting
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

When executing a Pack locally these logs will be written to the console, and when run in a doc they will be visible in the Pack maker tools. This can be useful for debugging during development as well as in production.

The Packs runtime only includes a subset of the [full `console` methods][mdn_console], specifically:

- `console.debug()`
- `console.error()`
- `console.info()`
- `console.log()`
- `console.trace()`
- `console.warn()`


## Common errors

### Domain doesn't resolve to a public IP

- `The given domain <domain> does not resolve to a public IP`

This error indicates that the domain you provided in an `addNetworkDomain()` call doesn't resolved to an accessible IP address. This could be due to a typo in the domain name. However there are some cases where a service assigns IP addresses to subdomains (`foo.example.com`) but not the root domain you are trying to add (`example.com`). If that is the case, either add the subdomain or [contact support][support] to have the root domain manually added to your Pack.


### Missing required developer tooling

- `Error: not found: make`
- `g++: Permission denied`

These errors can occur when installing the SDK locally, specifically during the installation of the `isolated-vm` dependency. They indicate that certain required developer tools are not present on the machine. See the [help documentation][isolated_vm_requirements] for this library for more information on how to install these missing packages on your machine.


[mdn_console]: https://developer.mozilla.org/en-US/docs/Web/API/console
[support]: ../../support.md
[isolated_vm_requirements]: https://github.com/laverdet/isolated-vm#requirements
