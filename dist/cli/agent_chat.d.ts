import type { ArgumentsCamelCase } from 'yargs';
import type { Client } from '../helpers/external-api/coda';
export interface AgentChatArgs {
    manifestPath: string;
    prompt: string;
    version?: string;
    thread?: string;
    apiToken?: string;
    apiEndpoint: string;
}
export declare function buildAgentChatUrl(apiEndpoint: string, packId: number, version: string): string;
export declare function resolveAgentVersion(client: Client, packId: number, requested?: string): Promise<string | undefined>;
export declare function isApiErrorBody(bodyText: string): boolean;
export declare function handleAgentChat({ manifestPath, prompt, version, thread, apiToken, apiEndpoint, }: ArgumentsCamelCase<AgentChatArgs>): Promise<undefined>;
