import type { ArgumentsCamelCase } from 'yargs';
export interface AgentChatArgs {
    manifestPath: string;
    prompt: string;
    agentInstanceId: string;
    tenantId?: string;
    timeout?: number;
    apiToken?: string;
    apiEndpoint: string;
}
export interface AgentChatMessage {
    id: string;
    messageType: string;
    text: string;
    isComplete: boolean;
    createdAt: string;
}
export declare function buildTriggerAgentUrl(apiEndpoint: string): string;
export declare function buildAgentRunStatusUrl(apiEndpoint: string, tenantId: string, agentInstanceId: string, chatId: string, executionId: string): string;
export declare function buildAgentChatMessagesUrl(apiEndpoint: string, tenantId: string, agentInstanceId: string, chatId: string): string;
export declare function isApiErrorBody(bodyText: string): boolean;
export declare function describeRunReason(status: 'failed' | 'needs_input', reason: string | undefined): string;
export declare function joinAssistantTexts(messages: AgentChatMessage[]): string | undefined;
export declare function nextBackoffMs(failedAttempts: number): number;
export declare function handleAgentChat({ manifestPath, prompt, agentInstanceId, tenantId: tenantIdFlag, timeout, apiToken, apiEndpoint, }: ArgumentsCamelCase<AgentChatArgs>): Promise<undefined>;
