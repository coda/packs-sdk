---
title: Troubleshooting
---

# How to troubleshoot your code

## Logging

<!-- TODO: Migrate the content to this repo. -->
[See here][doc] for more information on logging.

[doc]: https://coda.io/d/Pack-Studio-Beta_dUBjm8jbi39/Building-with-the-SDK_suP0J#_lujrM

## Common errors

### `The given domain <domain> does not resolve to a public IP`

This error indicates that the domain you provided in an `addNetworkDomain()` call doesn't resolved to an accessible IP address. This could be due to a typo in the domain name. However there are some cases where a service assigns IP addresses to subdomains (`foo.example.com`) but not the root domain you are trying to add (`example.com`). If that is the case, either add the subdomain or [contact support][support] to have the root domain manually added to your Pack.


[support]: ../support.md
