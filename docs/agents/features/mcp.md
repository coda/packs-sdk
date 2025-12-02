---
nav: MCP
description: Learn how to connect your agent to a hosted MCP server.
---

# Connect to an MCP server

The [Model Context Protocol (MCP)][mcp] offers a standard way to expose resources and tools to LLMs. Many apps are adopting this standard and hosting MCP servers, making it easy for AI tools to interact with their data and features.

Superhuman Go agents can connect to MCP servers, allowing them to take advantage of the tools provided. Adding an MCP server to an agent only requires a few lines code, providing an internal name for the server and it's URL.

```ts
pack.addMCPServer({
  name: 'Icons8',
  endpointUrl: 'https://mcp.icons8.com/mcp/',
});
```

!!! warning "Only one MCP server per-agent"

    An agent is limited to only connecting to a single MCP server. The platform expects each agent to only connect to a single external application, and users wishing to work across multiple applications would do so by installing multiple agents.

## Compatibility

MCP is a large and quickly evolving standard, and not all MCP servers are compatible with Superhuman Go agents.

- **Hosted servers only** - Local MCP servers (installed via `npm`, etc) are not supported.
- **Streamable HTTP transport only** - Most MCP servers use the more modern Streamable HTTP transport, but the older and now deprecated HTTP+SSE transport is not supported.

Additionally, not all MCP features are supported by the platform.

- **Tools only** - Although MCP servers can provide additional types of resources, agents can only utilize the tools.
- **No streaming support** - Agents must wait for the full response from the MCP server, and cannot take advantage of streamed responses.

## Network access

As with all network traffic, MCP requests go through the [Fetcher][fetcher] and the domains used must be declared ahead of time. While MCP servers are often hosted on a subdomain, it's a best practice to declare the root domain to allow for future expansion to other endpoints.

```{.ts hl_lines="6"}
pack.addMCPServer({
  name: "Icons8",
  endpointUrl: "https://mcp.icons8.com/mcp/",
});

pack.addNetworkDomain("icons8.com");
```

## Authentication

Requests to MCP servers use the same [authentication system][authentication] as the rest of the platform. The type of authentication must be declared in code, and any client credentials uploaded in the **Settings** screen of the Pack Studio.

```{.ts hl_lines="6-13"}
pack.addMCPServer({
  name: "Todoist",
  endpointUrl: "https://ai.todoist.net/mcp",
});

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://todoist.com/oauth/authorize",
  tokenUrl: "https://todoist.com/oauth/access_token",
  scopes: ["data:read_write"],
  scopeDelimiter: ",",
});
```

Many MCP servers do not document the type of authentication required or how to register for credentials, instead supporting open-source standards for automatic discovery ([RFC9728][rfc9728], [RFC8414][rfc8414]) and registration ([RFC7591][rfc7591]). Superhuman Go agents don't currently support these standards, and you may need to manually obtain this information. The [MCP Inspector][mcp_inspector] utility can be used to inspect and test an MCP server and can be useful for manual discovery of authentication information.

!!! tip "Same authentication as the REST API is preferred"

    If possible, configure the agent's authentication to support both the MCP server and the app's REST API (if it has one). A Pack can only include a single type of authentication, and advanced agent features may require using the app's REST API to implement them.

## User confirmation for actions

Superhuman Go agents prompt the user for confirmation before performing actions that mutate records or have side effects. An MCP tool will be considered such an action if the `readOnlyHint` annotation on the tool is any value other than `true`. See the [`ToolAnnotations`][mcp_tool_annotations] type in the MCP specification for more information.

[mcp]: https://modelcontextprotocol.io/
[rfc9728]: https://datatracker.ietf.org/doc/html/rfc9728
[rfc8414]: https://datatracker.ietf.org/doc/html/rfc8414
[rfc7591]: https://datatracker.ietf.org/doc/html/rfc7591
[fetcher]: ../../guides/basics/fetcher.md
[authentication]: ../../guides/basics/authentication/index.md
[mcp_inspector]: https://modelcontextprotocol.io/docs/tools/inspector
[mcp_tool_annotations]: https://modelcontextprotocol.io/specification/2025-11-25/schema#toolannotations
