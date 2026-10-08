import type { ArgumentsCamelCase } from 'yargs';
import type { PublicApiPackLog } from '../helpers/external-api/v1';
export interface AgentLogsArgs {
    manifestPath: string;
    tenant?: string;
    instance?: string;
    session?: string;
    limit?: number;
    tail?: boolean;
    apiToken?: string;
    apiEndpoint: string;
}
export declare function redactSecrets(text: string): string;
export declare function formatAgentLog(log: PublicApiPackLog): string;
export declare function firstSessionId(items: PublicApiPackLog[]): string | undefined;
export declare function handleAgentLogs({ manifestPath, tenant, instance, session, limit, tail, apiToken, apiEndpoint, }: ArgumentsCamelCase<AgentLogsArgs>): Promise<undefined>;
