/**
 * Types and interfaces for Model Context Protocol (MCP) integration with Packs.
 *
 * The Model Context Protocol allows packs to connect to external MCP providers
 * and invoke their tools programmatically.
 *
 * @see [MCP Specification](https://github.com/modelcontextprotocol/specification)
 */

import type {ExecutionContext} from './api_types';

/**
 * Configuration for an MCP provider.
 */
export interface McpProviderConfig {
  /** The name of the MCP provider (e.g., "Linear") */
  name: string;
  /** The base endpoint URL for the MCP server */
  endpoint: string;
  /** Authentication configuration for the MCP server */
  authentication?: McpAuthentication;
  /** The protocol version to use (defaults to "2024-11-05") */
  protocolVersion?: string;
  /** Client information to send to the MCP server */
  clientInfo?: McpClientInfo;
  /** Network domains to allow for this MCP provider */
  networkDomains?: string[];
}

/**
 * Client information for MCP requests.
 */
export interface McpClientInfo {
  name: string;
  version: string;
}

/**
 * Authentication configuration for MCP providers.
 */
export interface McpAuthentication {
  type: 'oauth2' | 'bearer' | 'none';
  /** OAuth2 configuration (when type is 'oauth2') */
  oauth2?: {
    authorizationUrl: string;
    tokenUrl: string;
    scopes?: string[];
  };
  /** Bearer token configuration (when type is 'bearer') */
  bearer?: {
    token: string;
  };
}

/**
 * An MCP session with session ID and capabilities.
 */
export interface McpSession {
  sessionId: string;
  capabilities: McpCapabilities;
}

/**
 * MCP server capabilities.
 */
export interface McpCapabilities {
  tools?: boolean;
  resources?: boolean;
  prompts?: boolean;
  roots?: boolean;
}

/**
 * MCP tool definition.
 */
export interface McpTool {
  name: string;
  description?: string;
  inputSchema: Record<string, any>;
}

/**
 * MCP tool call request.
 */
export interface McpToolCall {
  name: string;
  arguments?: Record<string, any>;
}

/**
 * MCP tool call result.
 */
export interface McpToolResult {
  content: McpContent[];
  isError?: boolean;
}

/**
 * MCP content types.
 */
export type McpContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      data: string;
      mimeType: string;
    }
  | {
      type: 'resource';
      resource: {
        uri: string;
        text?: string;
        mimeType?: string;
      };
    };

/**
 * Standard MCP JSON-RPC request structure.
 */
export interface McpRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: Record<string, any>;
}

/**
 * Standard MCP JSON-RPC response structure.
 */
export interface McpResponse<T = any> {
  jsonrpc: '2.0';
  id: number | string;
  result?: T;
  error?: McpError;
}

/**
 * MCP error structure.
 */
export interface McpError {
  code: number;
  message: string;
  data?: any;
}

/**
 * MCP client interface for making requests to MCP servers.
 */
export interface McpClient {
  /** Initialize a session with the MCP server */
  initializeSession(config: McpProviderConfig): Promise<McpSession>;

  /** List available tools from the MCP server */
  listTools(sessionId: string): Promise<McpTool[]>;

  /** Call a specific tool */
  callTool(sessionId: string, toolCall: McpToolCall): Promise<McpToolResult>;

  /** Make a raw MCP request */
  makeRequest<T>(
    config: McpProviderConfig,
    method: string,
    params?: Record<string, any>,
    sessionId?: string,
  ): Promise<McpResponse<T>>;
}

/**
 * Extended execution context that includes MCP functionality.
 */
export interface McpExecutionContext extends ExecutionContext {
  /** MCP client for making requests to MCP servers */
  readonly mcp: McpClient;
}

/**
 * Parse server-sent events (SSE) format used by some MCP servers.
 */
export interface SseEvent {
  event?: string;
  data?: string;
  id?: string;
  retry?: string;
}