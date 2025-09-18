/**
 * Example pack demonstrating generic MCP integration.
 *
 * This example shows how to create a pack that can work with any MCP server
 * by using the generic MCP functions provided by the SDK.
 * The actual MCP functionality is implemented in the Coda runtime.
 */

import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Basic pack metadata
pack.setName('Generic MCP Pack');
pack.setDescription('Generic pack for connecting to any MCP server');
pack.setVersion('1.0.0');

// Create generic MCP functionality
// This creates McpInitSession(), McpListTools(), and McpCallTool() formulas
// The actual implementation is provided by the Coda runtime
coda.createGenericMcpPack(pack);

// Allow connections to any domain (be careful with this in production)
pack.addNetworkDomain('*');

// Note: The generic MCP integration automatically provides these formulas:
// - McpInitSession(endpoint, name?): Initialize a session with any MCP server
// - McpListTools(sessionId): List tools from the MCP server
// - McpCallTool(sessionId, toolName, arguments?): Call a specific tool

// Additional custom formulas can be added that work with the generic MCP functionality
// These would use the automatically generated MCP formulas internally