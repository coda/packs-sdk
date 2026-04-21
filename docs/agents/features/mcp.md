---
nav: MCP
description: Learn how to connect your agent to a hosted MCP server.
cSpell:words: Streamable
---

# Connect to an MCP server

The [Model Context Protocol (MCP)][mcp] offers a standard way to expose resources and tools to LLMs. Many apps are adopting this standard and hosting MCP servers, making it easy for AI tools to interact with their data and features.

Superhuman Go agents can connect to MCP servers to take advantage of the tools provided. Adding an MCP server to an agent requires only a few lines of code, specifying an internal name and the server's URL.

```ts
pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});
```

!!! warning "Only one MCP server per-agent"

    An agent is limited to connecting to only a single MCP server. The platform expects each agent to connect to a single external application, and users wishing to work across multiple applications would install multiple agents.


## Compatibility

MCP is a large, rapidly evolving standard, and not all MCP servers are compatible with Superhuman Go agents.

- **Hosted servers only** - Local MCP servers (installed via `npm`, etc) are not supported.
- **Streamable HTTP transport only** - Most MCP servers use the more modern Streamable HTTP transport, but the older and now deprecated HTTP+SSE transport is not supported.

Additionally, not all MCP features are supported by the platform.

- **Tools only** - Although MCP servers can provide additional types of resources, agents can only use the tools.
- **No streaming support** - Agents must wait for the complete response from the MCP server, and cannot take advantage of streamed responses.

## Network access

As with all network traffic, MCP requests go through the [Fetcher][fetcher], and the domains used must be declared in advance. While MCP servers are often hosted on a subdomain, it's a best practice to declare the root domain to allow for future expansion to other endpoints.

```{.ts hl_lines="6"}
pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});

pack.addNetworkDomain("icons8.com");
```


## Authentication

Requests to MCP servers use the same [authentication system][authentication] as the rest of the platform, supporting common patterns like static tokens or OAuth2. Your code must declare the type of auth used.

=== "OAuth2 (DCR)"

    Many MCP servers use OAuth2 with [dynamic client registration (DCR)][oauth2_dcr].

    ```ts
    pack.addMCPServer({
      name: "Example",
      endpointUrl: "https://mcp.example.com/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.OAuth2,
      useDynamicClientRegistration: true,
      useProofKeyForCodeExchange: true,
    });
    ```

=== "OAuth2 (manual)"

    For MCP servers that use OAuth2 but don't support DCR, you can manually specify the OAuth URLs in your code. You'll also need to manually register an application in their portal and upload client credentials on the **Settings** screen of the Pack Studio.

    ```ts
    pack.addMCPServer({
      name: "Example",
      endpointUrl: "https://mcp.example.com/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.OAuth2,
      authorizationUrl: "https://example.com/authorize",
      tokenUrl: "https://example.com/token",
      useProofKeyForCodeExchange: true,
    });
    ```

=== "Bearer token"

    ```ts
    pack.addMCPServer({
      name: "Example",
      endpointUrl: "https://mcp.example.com/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.HeaderBearerToken,
    });
    ```

=== "Query parameter"

    ```ts
    pack.addMCPServer({
      name: "Example",
      endpointUrl: "https://mcp.example.com/mcp",
    });

    pack.setUserAuthentication({
      type: sdk.AuthenticationType.QueryParamToken,
      paramName: "api_key",
    });
    ```

!!! tip "Same authentication as the REST API is preferred"

    When possible, configure the agent's authentication to support both the MCP server and the app's REST API (if available). A Pack can only include a single type of authentication, and advanced agent features may require using the app's REST API to implement them.


## User confirmation for actions

Superhuman Go agents prompt the user for confirmation before performing actions that mutate records or have side effects. An MCP tool will be considered such an action if the `readOnlyHint` annotation on the tool is any value other than `true`. See the [`ToolAnnotations`][mcp_tool_annotations] type in the MCP specification for more information.


[mcp]: https://modelcontextprotocol.io/
[fetcher]: ../../guides/basics/fetcher.md
[authentication]: ../../guides/basics/authentication/index.md
[oauth2_dcr]: ../../guides/basics/authentication/oauth2.md#dcr
[mcp_tool_annotations]: https://modelcontextprotocol.io/specification/2025-11-25/schema#toolannotations
