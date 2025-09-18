# MCP (Model Context Protocol) Integration

The Coda Packs SDK provides types and API functions for integrating with Model Context Protocol (MCP) providers. The actual MCP functionality is implemented in the Coda runtime environment.

## Overview

MCP is a protocol that allows applications to connect to external tools and services in a standardized way. The Packs SDK provides the interface for:

- Configuring MCP providers with type safety
- Adding MCP support to packs through simple API calls
- Defining authentication and network requirements
- Accessing MCP tools through automatically generated formulas

**Note**: The SDK provides the interface and types - the actual MCP client implementation and formula generation happens in the Coda runtime.

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

### Generated Formulas

When you use `addMcpProvider()` or `createGenericMcpPack()`, the Coda runtime automatically generates formulas:

**Provider-specific (e.g., Linear):**
- `LinearInitSession()` - Initialize session with Linear MCP server
- `LinearListTools(sessionId)` - List available Linear tools
- `LinearCallTool(sessionId, toolName, arguments)` - Call a Linear tool

**Generic MCP:**
- `McpInitSession(endpoint, name?)` - Initialize session with any MCP server
- `McpListTools(sessionId)` - List tools from MCP server
- `McpCallTool(sessionId, toolName, arguments?)` - Call any MCP tool

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
// This automatically creates LinearInitSession(), LinearListTools(), and LinearCallTool()
coda.addMcpProvider(pack, coda.McpProviders.Linear());

// The MCP integration is now complete!
// Users can use the generated formulas:
// - LinearInitSession() to start a session
// - LinearListTools(sessionId) to see available tools
// - LinearCallTool(sessionId, toolName, arguments) to call tools
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

## Best Practices

1. **Use Built-in Providers**: Use `McpProviders.Linear()` and `McpProviders.Custom()` helpers when possible
2. **Network Domains**: Specify explicit domains rather than using wildcards
3. **Authentication**: Use OAuth2 for user-facing packs, Bearer tokens for service accounts
4. **Configuration**: Use `createMcpProviderConfig()` for custom providers
5. **Documentation**: Document the generated formulas for your pack users

## Runtime Implementation

The actual MCP functionality is implemented in the Coda runtime:

- **Session Management**: Sessions are handled by the runtime
- **Authentication**: OAuth2 and Bearer token auth is managed by Coda's auth system
- **Network Requests**: Uses Coda's secure fetcher system
- **Error Handling**: MCP errors are converted to user-friendly messages
- **Formula Generation**: Formulas are automatically created and registered

## SDK vs Runtime

**SDK Provides:**
- Type definitions for MCP protocol
- Configuration interfaces
- API function signatures
- Built-in provider configs
- TypeScript intellisense and validation

**Runtime Provides:**
- Actual MCP client implementation
- JSON-RPC 2.0 protocol handling
- Session management
- Authentication integration
- Formula execution
- Error handling and user feedback