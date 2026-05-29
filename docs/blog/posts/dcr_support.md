---
date: 2026-04-13
slug: dcr-supported
description: The SDK now supports Dynamic Client Registration for OAuth2, making it easier to connect to MCP servers and other providers.
authors:
  - eric.koleda
categories:
  - Updates
---

# Dynamic Client Registration is now supported

The SDK now supports [Dynamic Client Registration (DCR)][oauth2_dcr] for OAuth2 authentication. With DCR, the platform automatically discovers OAuth endpoints and registers client credentials with the provider, so you no longer need to manually create an application in a developer console or upload a client ID and secret.

This is especially useful when connecting to [MCP servers][mcp], many of which support DCR out of the box. Enabling it is as simple as setting a single flag:

```{.ts hl_lines="3"}
pack.setUserAuthentication({
  type: sdk.AuthenticationType.OAuth2,
  useDynamicClientRegistration: true,
  useProofKeyForCodeExchange: true,
  scopes: ["read", "write"],
});
```

For more details, including how to combine DCR with manually specified endpoints, see the [OAuth2 authentication guide][oauth2_dcr] and the [MCP guide][mcp].


[oauth2_dcr]: ../../guides/basics/authentication/oauth2.md#dcr
[mcp]: ../../agents/features/mcp.md
