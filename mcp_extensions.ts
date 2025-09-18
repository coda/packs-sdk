/**
 * Extensions to the Packs SDK to support MCP providers.
 *
 * These functions make it easy to add MCP provider support to a pack,
 * automatically creating the necessary formulas and configurations.
 */

import type {PackDefinitionBuilder} from './builder';
import type {McpProviderConfig} from './mcp_types';
import {
  AuthenticationType,
  makeParameter,
  ParameterType,
  UserVisibleError,
  ValueType,
} from './index';
import {
  McpToolSchema,
  callMcpTool,
  extractDomainFromEndpoint,
  initializeMcpSession,
  listMcpTools,
  validateMcpProviderConfig,
} from './mcp_helpers';

/**
 * Add MCP provider support to a pack.
 *
 * This function automatically:
 * - Adds required network domains
 * - Sets up authentication if needed
 * - Creates InitSession, ListTools, and CallTool formulas
 *
 * @param pack The pack builder instance
 * @param config The MCP provider configuration
 */
export function addMcpProvider(pack: PackDefinitionBuilder, config: McpProviderConfig): PackDefinitionBuilder {
  // Validate configuration
  validateMcpProviderConfig(config);

  // Add network domains for the MCP provider
  if (config.networkDomains) {
    for (const domain of config.networkDomains) {
      pack.addNetworkDomain(domain);
    }
  } else {
    // Extract domain from endpoint URL
    const domain = extractDomainFromEndpoint(config.endpoint);
    pack.addNetworkDomain(domain);
  }

  // Set up authentication if provided
  if (config.authentication?.type === 'oauth2' && config.authentication.oauth2) {
    pack.setUserAuthentication({
      type: AuthenticationType.OAuth2,
      authorizationUrl: config.authentication.oauth2.authorizationUrl,
      tokenUrl: config.authentication.oauth2.tokenUrl,
      scopes: config.authentication.oauth2.scopes || [],
    });
  }

  // Add MCP session initialization formula
  pack.addFormula({
    name: `${config.name}InitSession`,
    description: `Initialize a session with the ${config.name} MCP server. Returns the session ID.`,
    parameters: [],
    resultType: ValueType.String,
    async execute(_args, context) {
      return initializeMcpSession(config, context);
    },
  });

  // Add MCP tools list formula
  pack.addFormula({
    name: `${config.name}ListTools`,
    description: `Lists the tools available from the ${config.name} MCP server.`,
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'sessionId',
        description: `The MCP session ID. Generate one using ${config.name}InitSession().`,
      }),
    ],
    resultType: ValueType.Array,
    items: McpToolSchema,
    async execute(args, context) {
      const [sessionId] = args;
      return listMcpTools(sessionId, context);
    },
  });

  // Add MCP tool call formula (as an action)
  pack.addFormula({
    name: `${config.name}CallTool`,
    description: `Calls a tool from the ${config.name} MCP server and returns the result.`,
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'sessionId',
        description: 'The MCP session ID.',
      }),
      makeParameter({
        type: ParameterType.String,
        name: 'name',
        description: `The name of the tool. Must be one of the tools returned by ${config.name}ListTools().`,
      }),
      makeParameter({
        type: ParameterType.String,
        name: 'arguments',
        description: 'The arguments to pass to the tool, in JSON format.',
        optional: true,
      }),
    ],
    resultType: ValueType.String,
    isAction: true,
    async execute(args, context) {
      const [sessionId, toolName, argumentsJson] = args;

      let parsedArgs = {};
      if (argumentsJson) {
        try {
          parsedArgs = JSON.parse(argumentsJson);
        } catch (error) {
          throw new UserVisibleError(`Invalid JSON arguments: ${error.message}`);
        }
      }

      return callMcpTool(sessionId, toolName, parsedArgs, context);
    },
  });

  return pack;
}

/**
 * Create a generic MCP pack that works with any MCP server.
 *
 * This creates generic formulas that can work with any MCP provider
 * by accepting the endpoint and configuration as parameters.
 *
 * @param pack The pack builder instance
 */
export function createGenericMcpPack(pack: PackDefinitionBuilder): PackDefinitionBuilder {
  // Add generic MCP session initialization
  pack.addFormula({
    name: 'McpInitSession',
    description: 'Initialize a session with any MCP server. Returns the session ID.',
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'endpoint',
        description: 'The MCP server endpoint URL.',
      }),
      makeParameter({
        type: ParameterType.String,
        name: 'name',
        description: 'A name for this MCP provider.',
        optional: true,
      }),
    ],
    resultType: ValueType.String,
    async execute(args, context) {
      const [endpoint, name] = args;
      const config: McpProviderConfig = {
        name: name || 'Generic MCP',
        endpoint,
        protocolVersion: '2024-11-05',
        clientInfo: {
          name: 'Coda Pack',
          version: '1.0.0',
        },
      };
      return initializeMcpSession(config, context);
    },
  });

  // Add generic MCP tools list
  pack.addFormula({
    name: 'McpListTools',
    description: 'Lists the tools available from an MCP server.',
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'sessionId',
        description: 'The MCP session ID from McpInitSession().',
      }),
    ],
    resultType: ValueType.Array,
    items: McpToolSchema,
    async execute(args, context) {
      const [sessionId] = args;
      return listMcpTools(sessionId, context);
    },
  });

  // Add generic MCP tool call
  pack.addFormula({
    name: 'McpCallTool',
    description: 'Calls a tool from an MCP server and returns the result.',
    parameters: [
      makeParameter({
        type: ParameterType.String,
        name: 'sessionId',
        description: 'The MCP session ID.',
      }),
      makeParameter({
        type: ParameterType.String,
        name: 'name',
        description: 'The name of the tool to call.',
      }),
      makeParameter({
        type: ParameterType.String,
        name: 'arguments',
        description: 'The arguments to pass to the tool, in JSON format.',
        optional: true,
      }),
    ],
    resultType: ValueType.String,
    isAction: true,
    async execute(args, context) {
      const [sessionId, toolName, argumentsJson] = args;

      let parsedArgs = {};
      if (argumentsJson) {
        try {
          parsedArgs = JSON.parse(argumentsJson);
        } catch (error) {
          throw new UserVisibleError(`Invalid JSON arguments: ${error.message}`);
        }
      }

      return callMcpTool(sessionId, toolName, parsedArgs, context);
    },
  });

  return pack;
}

/**
 * Create a provider-specific MCP configuration helper for common providers.
 */
export const McpProviders = {
  /**
   * Create configuration for Linear MCP server.
   */
  Linear: (options: {authorizationUrl?: string; tokenUrl?: string; scopes?: string[]} = {}) => ({
    name: 'Linear',
    endpoint: 'https://mcp.linear.app/mcp',
    authentication: {
      type: 'oauth2' as const,
      oauth2: {
        authorizationUrl: options.authorizationUrl || 'https://linear.app/oauth/authorize',
        tokenUrl: options.tokenUrl || 'https://api.linear.app/oauth/token',
        scopes: options.scopes || ['read', 'write'],
      },
    },
    networkDomains: ['mcp.linear.app', 'linear.app', 'api.linear.app'],
  }),

  /**
   * Create configuration for a custom MCP server.
   */
  Custom: (name: string, endpoint: string, options: Partial<McpProviderConfig> = {}) => ({
    name,
    endpoint,
    protocolVersion: '2024-11-05',
    clientInfo: {
      name: 'Coda Pack',
      version: '1.0.0',
    },
    ...options,
  }),
};