/**
 * Example pack demonstrating generic MCP integration.
 *
 * This example shows how to create a pack that can work with any MCP server
 * by using the generic MCP functions.
 */

import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Basic pack metadata
pack.setName('Generic MCP Pack');
pack.setDescription('Generic pack for connecting to any MCP server');
pack.setVersion('1.0.0');

// Create generic MCP functionality
// This creates McpInitSession(), McpListTools(), and McpCallTool() formulas
coda.createGenericMcpPack(pack);

// Allow connections to any domain (be careful with this in production)
pack.addNetworkDomain('*');

// Example of a more specific formula that uses generic MCP functions
pack.addFormula({
  name: 'McpQuickCall',
  description: 'Initialize a session and call a tool in one step',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'endpoint',
      description: 'The MCP server endpoint URL',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'toolName',
      description: 'The name of the tool to call',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'arguments',
      description: 'JSON string of arguments to pass to the tool',
      optional: true,
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  async execute(args, context) {
    const [endpoint, toolName, argumentsJson] = args;

    // Create a custom MCP provider config
    const config = coda.createMcpProviderConfig('Custom MCP', endpoint);

    // Initialize session
    const sessionId = await coda.initializeMcpSession(config, context);

    // Parse arguments if provided
    let parsedArgs = {};
    if (argumentsJson) {
      try {
        parsedArgs = JSON.parse(argumentsJson);
      } catch (error) {
        throw new coda.UserVisibleError(`Invalid JSON arguments: ${error.message}`);
      }
    }

    // Call the tool
    return await coda.callMcpTool(sessionId, toolName, parsedArgs, context);
  },
});

// Example formula to explore MCP server capabilities
pack.addFormula({
  name: 'McpExplore',
  description: 'Explore an MCP server by listing its tools with descriptions',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'endpoint',
      description: 'The MCP server endpoint URL',
    }),
  ],
  resultType: coda.ValueType.Array,
  items: coda.makeObjectSchema({
    properties: {
      name: {type: coda.ValueType.String, description: 'Tool name'},
      description: {type: coda.ValueType.String, description: 'Tool description'},
      schema: {type: coda.ValueType.String, description: 'Input schema (JSON)'},
    },
    displayProperty: 'name',
  }),
  async execute(args, context) {
    const [endpoint] = args;

    // Create config and initialize session
    const config = coda.createMcpProviderConfig('Explorer', endpoint);
    const sessionId = await coda.initializeMcpSession(config, context);

    // List tools
    const tools = await coda.listMcpTools(sessionId, context);

    // Format tools for display
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description || 'No description',
      schema: JSON.stringify(tool.inputSchema, null, 2),
    }));
  },
});