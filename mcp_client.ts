/**
 * MCP (Model Context Protocol) client implementation for Packs.
 */

import type {ExecutionContext} from './api_types';
import type {McpClient, McpProviderConfig, McpRequest, McpResponse, McpSession, McpTool, McpToolCall, McpToolResult, SseEvent} from './mcp_types';
import {UserVisibleError} from './api';

/**
 * Default MCP protocol version.
 */
const DEFAULT_PROTOCOL_VERSION = '2024-11-05';

/**
 * Implementation of the MCP client for making requests to MCP servers.
 */
export class McpClientImpl implements McpClient {
  private _requestIdCounter = 1;
  private readonly _context: ExecutionContext;

  constructor(context: ExecutionContext) {
    this._context = context;
  }

  async initializeSession(config: McpProviderConfig): Promise<McpSession> {
    const response = await this.makeRequest<{
      protocolVersion: string;
      capabilities: any;
      serverInfo?: any;
    }>(config, 'initialize', {
      protocolVersion: config.protocolVersion || DEFAULT_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: config.clientInfo || {
        name: 'Coda Pack',
        version: '1.0.0',
      },
    });

    if (!response.result?.capabilities) {
      throw new UserVisibleError('MCP server did not return valid capabilities');
    }

    // Generate a session ID for this connection
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      sessionId,
      capabilities: response.result.capabilities,
    };
  }

  async listTools(sessionId: string): Promise<McpTool[]> {
    const response = await this.makeRequest<{tools: McpTool[]}>({} as McpProviderConfig, 'tools/list', {}, sessionId);

    if (!response.result?.tools) {
      throw new UserVisibleError('Failed to retrieve tools from MCP server');
    }

    return response.result.tools;
  }

  async callTool(sessionId: string, toolCall: McpToolCall): Promise<McpToolResult> {
    const response = await this.makeRequest<McpToolResult>(
      {} as McpProviderConfig,
      'tools/call',
      {
        name: toolCall.name,
        arguments: toolCall.arguments || {},
      },
      sessionId,
    );

    if (!response.result) {
      throw new UserVisibleError(`Failed to call tool: ${toolCall.name}`);
    }

    return response.result;
  }

  async makeRequest<T>(
    config: McpProviderConfig,
    method: string,
    params: Record<string, any> = {},
    sessionId?: string,
  ): Promise<McpResponse<T>> {
    const payload: McpRequest = {
      jsonrpc: '2.0',
      id: this._requestIdCounter++,
      method,
      params,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add session ID to headers if provided
    if (sessionId) {
      headers['X-MCP-Session-ID'] = sessionId;
    }

    // Add authentication headers
    if (config.authentication?.type === 'bearer' && config.authentication.bearer?.token) {
      headers['Authorization'] = `Bearer ${config.authentication.bearer.token}`;
    }

    try {
      const response = await this._context.fetcher.fetch({
        method: 'POST',
        url: config.endpoint,
        headers,
        body: JSON.stringify(payload),
      });

      let responseData: McpResponse<T>;

      // Handle different response formats
      if (response.headers['content-type']?.includes('text/event-stream')) {
        // Parse Server-Sent Events format
        responseData = this.parseSseResponse(response.body);
      } else {
        // Parse JSON response
        responseData = JSON.parse(response.body) as McpResponse<T>;
      }

      if (responseData.error) {
        throw new UserVisibleError(`MCP Error: ${responseData.error.message}`);
      }

      return responseData;
    } catch (error) {
      if (error instanceof UserVisibleError) {
        throw error;
      }
      throw new UserVisibleError(`MCP request failed: ${error.message}`);
    }
  }

  /**
   * Parse Server-Sent Events response format.
   */
  private parseSseResponse<T>(body: string): McpResponse<T> {
    const events: SseEvent[] = [];
    const lines = body.split('\n');
    let currentEvent: Partial<SseEvent> = {};

    for (const line of lines) {
      if (line.trim() === '') {
        if (Object.keys(currentEvent).length > 0) {
          events.push(currentEvent as SseEvent);
          currentEvent = {};
        }
        continue;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const field = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      switch (field) {
        case 'event':
          currentEvent.event = value;
          break;
        case 'data':
          currentEvent.data = value;
          break;
        case 'id':
          currentEvent.id = value;
          break;
        case 'retry':
          currentEvent.retry = value;
          break;
      }
    }

    // Add final event if exists
    if (Object.keys(currentEvent).length > 0) {
      events.push(currentEvent as SseEvent);
    }

    // Find the data event and parse as JSON
    const dataEvent = events.find(event => event.data && event.event !== 'error');
    if (dataEvent?.data) {
      try {
        return JSON.parse(dataEvent.data) as McpResponse<T>;
      } catch (error) {
        throw new UserVisibleError(`Failed to parse SSE response: ${error.message}`);
      }
    }

    throw new UserVisibleError('No valid data found in SSE response');
  }
}

/**
 * Create an MCP client instance.
 */
export function createMcpClient(context: ExecutionContext): McpClient {
  return new McpClientImpl(context);
}