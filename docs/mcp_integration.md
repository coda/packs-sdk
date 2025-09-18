# MCP (Model Context Protocol) Integration

The Coda Packs SDK now supports integration with Model Context Protocol (MCP) providers, allowing packs to connect to external MCP servers and invoke their tools programmatically.

## Overview

MCP is a protocol that allows applications to connect to external tools and services in a standardized way. With MCP support in the Packs SDK, you can:

- Connect to any MCP-compatible server
- List available tools from MCP providers
- Call MCP tools with parameters
- Handle authentication (OAuth2, Bearer tokens)
- Parse responses in JSON or Server-Sent Events format

## Quick Start

### Adding a Specific MCP Provider

```typescript
import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Add Linear MCP provider support
// This automatically creates LinearInitSession(), LinearListTools(), and LinearCallTool()
coda.addMcpProvider(pack, coda.McpProviders.Linear({
  scopes: ['read', 'write', 'issues:create'],
}));
```

### Creating a Generic MCP Pack

```typescript
import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Create generic MCP functionality that works with any MCP server
// This creates McpInitSession(), McpListTools(), and McpCallTool()
coda.createGenericMcpPack(pack);
```

## Key Functions

### `addMcpProvider(pack, config)`

Adds MCP provider support to a pack. This function:
- Configures network domains and authentication
- Creates provider-specific formulas (e.g., `LinearInitSession()`)
- Handles OAuth2 setup if needed

### `createGenericMcpPack(pack)`

Creates generic MCP formulas that work with any MCP server:
- `McpInitSession(endpoint, name?)` - Initialize session with any MCP server
- `McpListTools(sessionId)` - List tools from the server
- `McpCallTool(sessionId, name, arguments?)` - Call a specific tool

### Helper Functions

```typescript
// Initialize MCP session
const sessionId = await coda.initializeMcpSession(config, context);

// List available tools
const tools = await coda.listMcpTools(sessionId, context);

// Call a specific tool
const result = await coda.callMcpTool(sessionId, 'tool_name', {arg1: 'value'}, context);
```

## Configuration

### Basic Configuration

```typescript
const config = coda.createMcpProviderConfig('MyProvider', 'https://example.com/mcp');
```

### With OAuth2 Authentication

```typescript
const config = coda.createMcpProviderConfig('MyProvider', 'https://example.com/mcp', {
  authentication: coda.createOAuth2McpAuth(
    'https://example.com/oauth/authorize',
    'https://example.com/oauth/token',
    ['read', 'write']
  ),
});
```

### With Bearer Token Authentication

```typescript
const config = coda.createMcpProviderConfig('MyProvider', 'https://example.com/mcp', {
  authentication: coda.createBearerTokenMcpAuth('your-bearer-token'),
});
```

## Built-in Providers

### Linear

```typescript
coda.addMcpProvider(pack, coda.McpProviders.Linear({
  scopes: ['read', 'write', 'issues:create'],
}));
```

### Custom Provider

```typescript
coda.addMcpProvider(pack, coda.McpProviders.Custom('MyProvider', 'https://example.com/mcp', {
  authentication: coda.createOAuth2McpAuth(authUrl, tokenUrl, scopes),
  networkDomains: ['example.com', 'api.example.com'],
}));
```

## Complete Example

```typescript
import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

pack.setName('Linear MCP Integration');
pack.setDescription('Connect to Linear via MCP');

// Add Linear MCP provider
coda.addMcpProvider(pack, coda.McpProviders.Linear());

// Custom formula using MCP
pack.addFormula({
  name: 'CreateIssue',
  description: 'Create a Linear issue using MCP',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'title',
      description: 'Issue title',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'description',
      description: 'Issue description',
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  async execute(args, context) {
    const [title, description] = args;

    // Initialize Linear MCP session
    const sessionId = await coda.initializeMcpSession(
      coda.McpProviders.Linear(),
      context
    );

    // Create the issue
    return await coda.callMcpTool(
      sessionId,
      'create_issue',
      { title, description },
      context
    );
  },
});
```

## Types Reference

### Core Types

- `McpProviderConfig` - Configuration for an MCP provider
- `McpSession` - Session information including ID and capabilities
- `McpTool` - Tool definition with name, description, and input schema
- `McpToolResult` - Result from calling a tool
- `McpClient` - Interface for making MCP requests

### Authentication Types

- `McpAuthentication` - Authentication configuration union type
- Support for OAuth2, Bearer token, and no authentication

## Error Handling

The SDK automatically handles MCP errors and converts them to `UserVisibleError`:

```typescript
try {
  const result = await coda.callMcpTool(sessionId, 'tool_name', args, context);
  return result;
} catch (error) {
  // Error is automatically converted to UserVisibleError
  throw error;
}
```

## Best Practices

1. **Validate Configuration**: Use `validateMcpProviderConfig()` to check configs
2. **Handle Sessions**: Store session IDs appropriately for your use case
3. **Network Domains**: Specify explicit domains rather than using wildcards
4. **Authentication**: Use OAuth2 for user-facing packs, Bearer tokens for service accounts
5. **Error Handling**: MCP errors are automatically converted to user-friendly messages

## Limitations

- Sessions are not persistent across pack executions
- Authentication tokens must be managed by the pack's auth system
- Network requests are subject to Coda's fetcher limitations
- SSE responses are parsed but not streamed (full response is read first)