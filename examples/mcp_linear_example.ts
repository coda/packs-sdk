/**
 * Example pack demonstrating MCP integration with Linear.
 *
 * This example shows how to use the MCP API functions provided by the SDK.
 * The actual MCP functionality is implemented in the Coda runtime.
 *
 * Usage:
 * 1. Add MCP provider support for Linear
 * 2. Use the automatically generated formulas (LinearInitSession, LinearListTools, LinearCallTool)
 * 3. Access MCP tools through the generated formulas
 */

import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Basic pack metadata
pack.setName('Linear MCP Example');
pack.setDescription('Example pack showing MCP integration with Linear');
pack.setVersion('1.0.0');

// Add Linear MCP provider support
// This automatically creates LinearInitSession(), LinearListTools(), and LinearCallTool() formulas
// The actual implementation is provided by the Coda runtime
coda.addMcpProvider(pack, coda.McpProviders.Linear({
  scopes: ['read', 'write', 'issues:create'],
}));

// Note: The MCP integration automatically provides these formulas:
// - LinearInitSession(): Initialize a session with Linear MCP server
// - LinearListTools(sessionId): List available tools from Linear
// - LinearCallTool(sessionId, toolName, arguments): Call a specific Linear tool

// Additional custom formulas can be added that work with the MCP provider
// These would use the automatically generated MCP formulas internally