/**
 * Helper functions and utilities for MCP integration with Packs.
 */

import {AuthenticationType, makeObjectSchema, makeParameter, ParameterType, UserVisibleError, ValueType} from './index';
import type {ExecutionContext} from './api_types';
import type {McpProviderConfig, McpClient, McpTool, McpToolCall, McpToolResult} from './mcp_types';
import {createMcpClient} from './mcp_client';

/**
 * Schema for MCP tool objects.
 */
export const McpToolSchema = makeObjectSchema({
  properties: {
    name: {type: ValueType.String, description: 'The name of the tool'},
    description: {type: ValueType.String, description: 'Description of what the tool does'},
    inputSchema: {type: ValueType.Object, description: 'JSON schema for the tool input parameters'},
  },
  displayProperty: 'name',
});

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

/**
 * Initialize an MCP session.
 */
export async function initializeMcpSession(config: McpProviderConfig, context: ExecutionContext): Promise<string> {
  const client = createMcpClient(context);
  const session = await client.initializeSession(config);
  return session.sessionId;
}

/**
 * List available MCP tools.
 */
export async function listMcpTools(sessionId: string, context: ExecutionContext): Promise<McpTool[]> {
  const client = createMcpClient(context);
  return await client.listTools(sessionId);
}

/**
 * Call an MCP tool.
 */
export async function callMcpTool(
  sessionId: string,
  toolName: string,
  args: Record<string, any>,
  context: ExecutionContext,
): Promise<string> {
  const client = createMcpClient(context);
  const toolCall: McpToolCall = {
    name: toolName,
    arguments: args,
  };

  const result = await client.callTool(sessionId, toolCall);

  if (result.isError) {
    throw new UserVisibleError(`Tool call failed: ${result.content[0]?.text || 'Unknown error'}`);
  }

  // Combine all text content from the result
  const textContent = result.content
    .filter(content => content.type === 'text')
    .map(content => (content as any).text)
    .join('\n');

  return textContent || JSON.stringify(result.content);
}

/**
 * Create authentication configuration for OAuth2 MCP providers.
 */
export function createOAuth2McpAuth(authorizationUrl: string, tokenUrl: string, scopes?: string[]) {
  return {
    type: 'oauth2' as const,
    oauth2: {
      authorizationUrl,
      tokenUrl,
      scopes: scopes || [],
    },
  };
}

/**
 * Create authentication configuration for Bearer token MCP providers.
 */
export function createBearerTokenMcpAuth(token: string) {
  return {
    type: 'bearer' as const,
    bearer: {
      token,
    },
  };
}

/**
 * Extract domain from an MCP endpoint URL.
 */
export function extractDomainFromEndpoint(endpoint: string): string {
  try {
    const url = new URL(endpoint);
    return url.hostname;
  } catch (error) {
    throw new Error(`Invalid MCP endpoint URL: ${endpoint}`);
  }
}

/**
 * Validate MCP provider configuration.
 */
export function validateMcpProviderConfig(config: McpProviderConfig): void {
  if (!config.name || typeof config.name !== 'string') {
    throw new Error('MCP provider name is required and must be a string');
  }

  if (!config.endpoint || typeof config.endpoint !== 'string') {
    throw new Error('MCP provider endpoint is required and must be a string');
  }

  try {
    new URL(config.endpoint);
  } catch {
    throw new Error(`Invalid MCP endpoint URL: ${config.endpoint}`);
  }

  if (config.authentication?.type === 'oauth2' && !config.authentication.oauth2) {
    throw new Error('OAuth2 authentication configuration is required when type is oauth2');
  }

  if (config.authentication?.type === 'bearer' && !config.authentication.bearer?.token) {
    throw new Error('Bearer token is required when authentication type is bearer');
  }
}