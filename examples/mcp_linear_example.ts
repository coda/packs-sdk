/**
 * Example pack demonstrating MCP integration with Linear.
 *
 * This example shows how to:
 * 1. Add MCP provider support for Linear
 * 2. Use the automatically generated formulas
 * 3. Create custom formulas that use MCP tools
 */

import * as coda from '@codahq/packs-sdk';

export const pack = coda.newPack();

// Basic pack metadata
pack.setName('Linear MCP Example');
pack.setDescription('Example pack showing MCP integration with Linear');
pack.setVersion('1.0.0');

// Add Linear MCP provider support
// This automatically creates LinearInitSession(), LinearListTools(), and LinearCallTool() formulas
coda.addMcpProvider(pack, coda.McpProviders.Linear({
  scopes: ['read', 'write', 'issues:create'],
}));

// Example of a custom formula that uses MCP functionality
pack.addFormula({
  name: 'CreateLinearIssue',
  description: 'Create a new issue in Linear using MCP',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'title',
      description: 'The title of the issue',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'description',
      description: 'The description of the issue',
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'teamId',
      description: 'The ID of the team to create the issue for',
    }),
  ],
  resultType: coda.ValueType.String,
  isAction: true,
  async execute(args, context) {
    const [title, description, teamId] = args;

    // Initialize session with Linear MCP server
    const sessionId = await coda.initializeMcpSession(
      coda.McpProviders.Linear(),
      context
    );

    // Call the issue creation tool
    const result = await coda.callMcpTool(
      sessionId,
      'create_issue',
      {
        title,
        description,
        teamId,
      },
      context
    );

    return result;
  },
});

// Example of listing Linear teams
pack.addFormula({
  name: 'ListLinearTeams',
  description: 'List all teams in Linear using MCP',
  parameters: [],
  resultType: coda.ValueType.Array,
  items: coda.makeObjectSchema({
    properties: {
      id: {type: coda.ValueType.String},
      name: {type: coda.ValueType.String},
      description: {type: coda.ValueType.String},
    },
    displayProperty: 'name',
  }),
  async execute(_args, context) {
    // Initialize session with Linear MCP server
    const sessionId = await coda.initializeMcpSession(
      coda.McpProviders.Linear(),
      context
    );

    // Get teams using MCP tool
    const result = await coda.callMcpTool(
      sessionId,
      'list_teams',
      {},
      context
    );

    // Parse the result (assuming it returns JSON)
    try {
      const teams = JSON.parse(result);
      return teams;
    } catch {
      // If not JSON, return as single item
      return [{id: '1', name: 'Result', description: result}];
    }
  },
});