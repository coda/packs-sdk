import type { ArgumentsCamelCase } from 'yargs';
export interface AgentInstallArgs {
    manifestPath: string;
    version?: string;
    reinstall?: boolean;
    yes?: boolean;
    apiToken?: string;
    apiEndpoint: string;
}
export declare function buildAgentInstallUrl(apiEndpoint: string, packId: number, version: string): string;
export declare function handleAgentInstall({ manifestPath, version, reinstall, yes, apiToken, apiEndpoint, }: ArgumentsCamelCase<AgentInstallArgs>): Promise<void>;
