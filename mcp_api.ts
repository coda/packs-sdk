/**
 * Public API functions for MCP integration with Packs.
 *
 * These functions provide the public interface for adding MCP support to packs.
 * The actual implementation is provided by the Coda runtime.
 */

import type {PackDefinitionBuilder} from './builder';
import type {McpProviderConfig} from './mcp_types';

/**
 * Add MCP provider support to a pack.
 *
 * This function automatically:
 * - Adds required network domains
 * - Sets up authentication if needed
 * - Creates InitSession, ListTools, and CallTool formulas
 *
 * The implementation is provided by the Coda runtime.
 *
 * @param pack The pack builder instance
 * @param config The MCP provider configuration
 * @returns The pack builder for chaining
 */
export function addMcpProvider(pack: PackDefinitionBuilder, config: McpProviderConfig): PackDefinitionBuilder {
  // Implementation is provided by the Coda runtime
  throw new Error('addMcpProvider is only available in the Coda runtime environment');
}

/**
 * Create a generic MCP pack that works with any MCP server.
 *
 * This creates generic formulas that can work with any MCP provider
 * by accepting the endpoint and configuration as parameters.
 *
 * The implementation is provided by the Coda runtime.
 *
 * @param pack The pack builder instance
 * @returns The pack builder for chaining
 */
export function createGenericMcpPack(pack: PackDefinitionBuilder): PackDefinitionBuilder {
  // Implementation is provided by the Coda runtime
  throw new Error('createGenericMcpPack is only available in the Coda runtime environment');
}

/**
 * Built-in MCP provider configurations.
 */
export const McpProviders = {
  /**
   * Create configuration for Linear MCP server.
   */
  Linear: (options: {authorizationUrl?: string; tokenUrl?: string; scopes?: string[]} = {}): McpProviderConfig => ({
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
  Custom: (name: string, endpoint: string, options: Partial<McpProviderConfig> = {}): McpProviderConfig => ({
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

/**
 * Create an MCP provider configuration.
 */
export function createMcpProviderConfig(
  name: string,
  endpoint: string,
  options: Partial<McpProviderConfig> = {},
): McpProviderConfig {
  return {
    name,
    endpoint,
    protocolVersion: '2024-11-05',
    clientInfo: {
      name: 'Coda Pack',
      version: '1.0.0',
    },
    ...options,
  };
}